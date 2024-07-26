// src/graphs/Graph.ts
import { nanoid } from 'nanoid';
import { concat } from '@langchain/core/utils/stream';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { END, START, StateGraph  } from '@langchain/langgraph';
import { Runnable, RunnableConfig } from '@langchain/core/runnables';
import { dispatchCustomEvent } from '@langchain/core/callbacks/dispatch';
import type { StructuredTool } from '@langchain/core/tools';
import type * as t from '@/types';
import { AIMessage, AIMessageChunk, BaseMessage, ToolMessage, SystemMessage } from '@langchain/core/messages';
import { Providers, GraphEvents, GraphNodeKeys, StepTypes } from '@/common';
import { modifyDeltaProperties, formatAnthropicMessage } from '@/messages';
import { getChatModelClass } from '@/llm/providers';
import { resetIfNotEmpty, joinKeys } from '@/utils';
import { HandlerRegistry } from '@/events';

const { AGENT, TOOLS } = GraphNodeKeys;
type GraphNode = GraphNodeKeys | typeof START;

export abstract class Graph<
  T extends t.BaseGraphState = t.BaseGraphState,
  TNodeName extends string = string,
> {
  abstract resetValues(): void;
  abstract createGraphState(): t.GraphStateChannels<T>;
  abstract initializeTools(): ToolNode<T>;
  abstract initializeModel(): Runnable;
  abstract getFinalMessage(): AIMessageChunk | undefined;
  abstract generateStepId(stepKey: string): [string, number];
  abstract getKeyList(metadata: Record<string, unknown> | undefined): (string | number | undefined)[];
  abstract getStepKey(metadata: Record<string, unknown> | undefined): string;
  abstract checkKeyList(keyList: (string | number | undefined)[]): boolean;
  abstract getStepIdByKey(stepKey: string, index?: number): string
  abstract getRunStep(stepId: string): t.RunStep | undefined;
  abstract dispatchRunStep(stepKey: string, stepDetails: t.StepDetails): void;
  abstract dispatchRunStepDelta(id: string, delta: t.ToolCallDelta): void;
  abstract dispatchMessageDelta(id: string, delta: t.MessageDelta): void;

  abstract createCallModel(): (state: T, config?: RunnableConfig) => Promise<Partial<T>>;
  abstract createWorkflow(): t.CompiledWorkflow<T, Partial<T>, TNodeName>;
  messageIdsByStepKey: Map<string, string> = new Map();
  prelimMessageIdsByStepKey: Map<string, string> = new Map();
  config: RunnableConfig | undefined;
  contentData: t.RunStep[] = [];
  stepKeyIds: Map<string, string[]> = new Map<string, string[]>();
  contentIndexMap: Map<string, number> = new Map();
  toolCallStepIds: Map<string, string> = new Map();
}

export class StandardGraph extends Graph<
  t.BaseGraphState,
  GraphNode
> {
  private finalMessage: AIMessageChunk | undefined;
  private graphState: t.GraphStateChannels<t.BaseGraphState>;
  private tools: StructuredTool[];
  private provider: Providers;
  private clientOptions: Record<string, unknown>;
  private boundModel: Runnable;
  handlerRegistry: HandlerRegistry | undefined;

  constructor(provider: Providers, clientOptions: Record<string, unknown>, tools: StructuredTool[]) {
    super();
    this.provider = provider;
    this.clientOptions = clientOptions;
    this.tools = tools;
    this.graphState = this.createGraphState();
    this.boundModel = this.initializeModel();
  }

  /* Init */

  resetValues(): void {
    this.config = resetIfNotEmpty(this.config, undefined);
    this.contentData = resetIfNotEmpty(this.contentData, []);
    this.stepKeyIds = resetIfNotEmpty(this.stepKeyIds, new Map());
    this.toolCallStepIds = resetIfNotEmpty(this.toolCallStepIds, new Map());
    this.contentIndexMap = resetIfNotEmpty(this.contentIndexMap, new Map());
    // this.finalMessage = resetIfNotEmpty(this.finalMessage, undefined);
    this.messageIdsByStepKey = resetIfNotEmpty(this.messageIdsByStepKey, new Map());
    this.prelimMessageIdsByStepKey = resetIfNotEmpty(this.prelimMessageIdsByStepKey, new Map());
  }

  /* Run Step Processing */

  getRunStep(stepId: string): t.RunStep | undefined {
    const index = this.contentIndexMap.get(stepId);
    if (index !== undefined) {
      return this.contentData[index];
    }
    return undefined;
  }

  getStepKey(metadata: Record<string, unknown> | undefined): string {
    if (!metadata) return '';

    const keyList = this.getKeyList(metadata);
    if (this.checkKeyList(keyList)) {
      throw new Error('Missing metadata');
    }

    return joinKeys(keyList);
  }

  getStepIdByKey(stepKey: string, index?: number): string {
    const stepIds = this.stepKeyIds.get(stepKey);
    if (!stepIds) {
      throw new Error(`No step IDs found for stepKey ${stepKey}`);
    }

    if (index === undefined) {
      return stepIds[stepIds.length - 1];
    }

    return stepIds[index];
  }

  generateStepId(stepKey: string): [string, number] {
    const stepIds = this.stepKeyIds.get(stepKey);
    let newStepId: string | undefined;
    let stepIndex = 0;
    if (stepIds) {
      stepIndex = stepIds.length;
      newStepId = `step_${nanoid()}`;
      stepIds.push(newStepId);
      this.stepKeyIds.set(stepKey, stepIds);
    } else {
      newStepId = `step_${nanoid()}`;
      this.stepKeyIds.set(stepKey, [newStepId]);
    }

    return [newStepId, stepIndex];
  }

  getKeyList(metadata: Record<string, unknown> | undefined): (string | number | undefined)[] {
    if (!metadata) return [];

    return [
      metadata.thread_id as string,
      metadata.langgraph_node as string,
      metadata.langgraph_step as number,
      metadata.langgraph_task_idx as number,
    ];
  }

  checkKeyList(keyList: (string | number | undefined)[]): boolean {
    return keyList.some((key) => key === undefined);
  }

  /* Misc.*/

  getFinalMessage(): AIMessageChunk | undefined {
    return this.finalMessage;
  }

  /* Graph */

  createGraphState(): t.GraphStateChannels<t.BaseGraphState> {
    return {
      messages: {
        value: (x: BaseMessage[], y: BaseMessage[]): BaseMessage[] => x.concat(y),
        default: () => [],
      },
    };
  }

  initializeTools(): ToolNode<t.BaseGraphState> {
    return new ToolNode<t.BaseGraphState>(this.tools);
  }

  initializeModel(): Runnable {
    const ChatModelClass = getChatModelClass(this.provider);
    const model = new ChatModelClass(this.clientOptions);
    return model.bindTools(this.tools);
  }

  createCallModel() {
    return async (state: t.BaseGraphState, config?: RunnableConfig): Promise<Partial<t.BaseGraphState>> => {
      const { provider, instructions, additional_instructions } = (config?.configurable as t.GraphConfig) ?? {} ;
      if (!config || !provider) {
        throw new Error(`No ${config ? 'provider' : 'config'} provided`);
      }
      this.config = config;
      const { messages } = state;

      let finalInstructions = instructions;
      if (additional_instructions) {
        finalInstructions = finalInstructions ? `${finalInstructions}\n\n${additional_instructions}` : additional_instructions;
      }

      if (finalInstructions && messages[0]?.content !== finalInstructions) {
        messages.unshift(new SystemMessage(finalInstructions));
      }

      const finalMessages = messages;
      const lastMessageX = finalMessages[finalMessages.length - 2];
      const lastMessageY = finalMessages[finalMessages.length - 1];

      if (provider === Providers.ANTHROPIC
        && lastMessageX instanceof AIMessageChunk
        && lastMessageY instanceof ToolMessage
      ) {
        finalMessages[finalMessages.length - 2] = formatAnthropicMessage(lastMessageX as AIMessageChunk);
      } else if (provider === Providers.AWS
        && lastMessageX instanceof AIMessageChunk
        && lastMessageY instanceof ToolMessage
        && typeof lastMessageX.content === 'string'
      ) {
        finalMessages[finalMessages.length - 2].content = '';
      }

      if (provider === Providers.ANTHROPIC) {
        const stream = await this.boundModel.stream(finalMessages, config);
        let finalChunk: AIMessageChunk | undefined;
        for await (const chunk of stream) {
          dispatchCustomEvent(GraphEvents.CHAT_MODEL_STREAM, { chunk }, config);
          if (!finalChunk) {
            finalChunk = chunk;
          } else {
            finalChunk = concat(finalChunk, chunk);
          }
        }

        finalChunk = modifyDeltaProperties(finalChunk);
        this.finalMessage = finalChunk;
        return { messages: [this.finalMessage as AIMessageChunk] };
      }

      this.finalMessage = await this.boundModel.invoke(finalMessages, config);
      return { messages: [this.finalMessage as AIMessageChunk] };
    };
  }

  createWorkflow(): t.CompiledWorkflow<t.BaseGraphState, Partial<t.BaseGraphState>, GraphNode> {
    const routeMessage = (state: t.BaseGraphState): string => {
      const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
      if (!lastMessage?.tool_calls?.length) {
        return END;
      }
      return TOOLS;
    };

    const workflow = new StateGraph<t.BaseGraphState, Partial<t.BaseGraphState>, GraphNode>({
      channels: this.graphState,
    })
      .addNode(AGENT, this.createCallModel())
      .addNode(TOOLS, this.initializeTools())
      .addEdge(START, AGENT)
      .addConditionalEdges(AGENT, routeMessage)
      .addEdge(TOOLS, AGENT);

    return workflow.compile();
  }

  /* Dispatchers */

  dispatchRunStep(stepKey: string, stepDetails: t.StepDetails): void {
    if (!this.config) {
      throw new Error('No config provided');
    }

    const [stepId, stepIndex] = this.generateStepId(stepKey);
    if (stepDetails.type === StepTypes.TOOL_CALLS && stepDetails.tool_calls) {
      for (const tool_call of stepDetails.tool_calls) {
        if (!tool_call.id || this.toolCallStepIds.has(tool_call.id)) {
          continue;
        }
        this.toolCallStepIds.set(tool_call.id, stepId);
      }
    }

    const runStep = {
      stepIndex,
      id: stepId,
      type: stepDetails.type,
      index: this.contentData.length,
      stepDetails,
      usage: null,
    };

    this.contentData.push(runStep);
    this.contentIndexMap.set(stepId, runStep.index);
    dispatchCustomEvent(GraphEvents.ON_RUN_STEP, runStep, this.config);
  }

  dispatchRunStepDelta(id: string, delta: t.ToolCallDelta): void {
    if (!this.config) {
      throw new Error('No config provided');
    } else if (!id) {
      throw new Error('No step ID found');
    }
    const runStepDelta: t.RunStepDeltaEvent = {
      id,
      delta,
    };
    dispatchCustomEvent(GraphEvents.ON_RUN_STEP_DELTA, runStepDelta, this.config);
  }

  dispatchMessageDelta(id: string, delta: t.MessageDelta): void {
    if (!this.config) {
      throw new Error('No config provided');
    }
    const messageDelta: t.MessageDeltaEvent = {
      id,
      delta,
    };
    dispatchCustomEvent(GraphEvents.ON_MESSAGE_DELTA, messageDelta, this.config);
  }
}
