// src/graphs/Graph.ts
import { nanoid } from 'nanoid';
import { concat } from '@langchain/core/utils/stream';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { START, StateGraph  } from '@langchain/langgraph';
import { Runnable, RunnableConfig } from '@langchain/core/runnables';
import { dispatchCustomEvent } from '@langchain/core/callbacks/dispatch';
import { AIMessageChunk, ToolMessage, SystemMessage } from '@langchain/core/messages';
import type { BaseMessage } from '@langchain/core/messages';
import type { StructuredTool } from '@langchain/core/tools';
import type * as t from '@/types';
import { Providers, GraphEvents, GraphNodeKeys, StepTypes, Callback } from '@/common';
import { ToolNode as CustomToolNode, toolsCondition } from '@/tools/ToolNode';
import { modifyDeltaProperties, formatAnthropicMessage, processMessages } from '@/messages';
import { getChatModelClass } from '@/llm/providers';
import { resetIfNotEmpty, joinKeys } from '@/utils';
import { HandlerRegistry } from '@/events';

const { AGENT, TOOLS } = GraphNodeKeys;
export type GraphNode = GraphNodeKeys | typeof START;
export type ClientCallback<T extends unknown[]> = (graph: StandardGraph, ...args: T) => void;
export type ClientCallbacks = {
  [Callback.TOOL_ERROR]?: ClientCallback<[Error, string]>;
  [Callback.TOOL_START]?: ClientCallback<unknown[]>;
  [Callback.TOOL_END]?: ClientCallback<unknown[]>;
}
export type SystemCallbacks = {
  [K in keyof ClientCallbacks]: ClientCallbacks[K] extends ClientCallback<infer Args>
    ? (...args: Args) => void
    : never;
};

export abstract class Graph<
  T extends t.BaseGraphState = t.BaseGraphState,
  TNodeName extends string = string,
> {
  abstract resetValues(): void;
  abstract createGraphState(): t.GraphStateChannels<T>;
  abstract initializeTools(): CustomToolNode<T> | ToolNode<T>;
  abstract initializeModel(): Runnable;
  abstract getRunMessages(): BaseMessage[] | undefined;
  abstract getContentParts(): t.MessageContentComplex[] | undefined;
  abstract generateStepId(stepKey: string): [string, number];
  abstract getKeyList(metadata: Record<string, unknown> | undefined): (string | number | undefined)[];
  abstract getStepKey(metadata: Record<string, unknown> | undefined): string;
  abstract checkKeyList(keyList: (string | number | undefined)[]): boolean;
  abstract getStepIdByKey(stepKey: string, index?: number): string
  abstract getRunStep(stepId: string): t.RunStep | undefined;
  abstract dispatchRunStep(stepKey: string, stepDetails: t.StepDetails): void;
  abstract dispatchRunStepDelta(id: string, delta: t.ToolCallDelta): void;
  abstract dispatchMessageDelta(id: string, delta: t.MessageDelta): void;
  abstract handleToolCallCompleted(data: t.ToolEndData): void;

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
  private graphState: t.GraphStateChannels<t.BaseGraphState>;
  private clientOptions: Record<string, unknown>;
  private boundModel: Runnable;
  handlerRegistry: HandlerRegistry | undefined;
  systemMessage: SystemMessage | undefined;
  messages: BaseMessage[] = [];
  runId: string | undefined;
  tools?: t.GenericTool[];
  toolMap?: t.ToolMap;
  startIndex: number = 0;
  provider: Providers;

  constructor({
    runId,
    tools,
    toolMap,
    provider,
    clientOptions,
    instructions,
    additional_instructions,
  } : {
    runId?: string;
    provider: Providers;
    tools?: t.GenericTool[];
    toolMap?: t.ToolMap;
    clientOptions: Record<string, unknown>;
    instructions?: string;
    additional_instructions?: string;
  }) {
    super();
    this.runId = runId;
    this.tools = tools;
    this.toolMap = toolMap;
    this.provider = provider;
    this.clientOptions = clientOptions;
    this.graphState = this.createGraphState();
    this.boundModel = this.initializeModel();

    let finalInstructions = instructions;
    if (additional_instructions) {
      finalInstructions = finalInstructions ? `${finalInstructions}\n\n${additional_instructions}` : additional_instructions;
    }

    if (finalInstructions) {
      this.systemMessage = new SystemMessage(finalInstructions);
    }
  }

  /* Init */

  resetValues(): void {
    this.messages = [];
    this.config = resetIfNotEmpty(this.config, undefined);
    this.contentData = resetIfNotEmpty(this.contentData, []);
    this.stepKeyIds = resetIfNotEmpty(this.stepKeyIds, new Map());
    this.toolCallStepIds = resetIfNotEmpty(this.toolCallStepIds, new Map());
    this.contentIndexMap = resetIfNotEmpty(this.contentIndexMap, new Map());
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

  getRunMessages(): BaseMessage[] | undefined {
    return this.messages.slice(this.startIndex);
  }

  getContentParts(): t.MessageContentComplex[] | undefined {
    return processMessages(this.messages.slice(this.startIndex));
  }

  /* Graph */

  createGraphState(): t.GraphStateChannels<t.BaseGraphState> {
    return {
      messages: {
        value: (x: BaseMessage[], y: BaseMessage[]): BaseMessage[] => {
          if (!x.length) {
            if (this.systemMessage) {
              x.push(this.systemMessage);
            }

            this.startIndex = x.length + y.length;
          }
          const current = x.concat(y);
          this.messages = current;
          return current;
        },
        default: () => [],
      },
    };
  }

  initializeTools(): CustomToolNode<t.BaseGraphState> | ToolNode<t.BaseGraphState> {
    // return new ToolNode<t.BaseGraphState>(this.tools);
    return new CustomToolNode<t.BaseGraphState>({
      tools: this.tools || [],
      toolMap: this.toolMap,
    });
  }

  initializeModel(): Runnable {
    const ChatModelClass = getChatModelClass(this.provider);
    const model = new ChatModelClass(this.clientOptions);
    if (!this.tools) {
      return model;
    }
    return model.bindTools(this.tools as StructuredTool[]);
  }

  createCallModel() {
    return async (state: t.BaseGraphState, config?: RunnableConfig): Promise<Partial<t.BaseGraphState>> => {
      const { provider } = (config?.configurable as t.GraphConfig) ?? {} ;
      if (!config || !provider) {
        throw new Error(`No ${config ? 'provider' : 'config'} provided`);
      }
      this.config = config;
      const { messages } = state;

      const finalMessages = messages;
      const lastMessageX = finalMessages[finalMessages.length - 2];
      const lastMessageY = finalMessages[finalMessages.length - 1];

      if (
        provider === Providers.ANTHROPIC
        && lastMessageX instanceof AIMessageChunk
        && lastMessageY instanceof ToolMessage
      ) {
        finalMessages[finalMessages.length - 2] = formatAnthropicMessage(lastMessageX as AIMessageChunk);
      } else if (
        provider === Providers.AWS
        && lastMessageX instanceof AIMessageChunk
        && lastMessageY instanceof ToolMessage
        && typeof lastMessageX.content === 'string'
      ) {
        finalMessages[finalMessages.length - 2].content = '';
      }

      if (this.tools?.length && (provider === Providers.ANTHROPIC || provider === Providers.AWS)) {
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
        return { messages: [finalChunk as AIMessageChunk] };
      }

      const finalMessage = await this.boundModel.invoke(finalMessages, config);
      return { messages: [finalMessage as AIMessageChunk] };
    };
  }

  createWorkflow(): t.CompiledWorkflow<t.BaseGraphState, Partial<t.BaseGraphState>, GraphNode> {
    const routeMessage = (state: t.BaseGraphState, config?: RunnableConfig): string => {
      this.config = config;
      // const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
      // if (!lastMessage?.tool_calls?.length) {
      //   return END;
      // }
      // return TOOLS;
      return toolsCondition(state);
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

    const runStep: t.RunStep = {
      stepIndex,
      id: stepId,
      type: stepDetails.type,
      index: this.contentData.length,
      stepDetails,
      usage: null,
    };

    if (this.runId) {
      runStep.runId = this.runId;
    }

    this.contentData.push(runStep);
    this.contentIndexMap.set(stepId, runStep.index);
    dispatchCustomEvent(GraphEvents.ON_RUN_STEP, runStep, this.config);
  }

  handleToolCallCompleted(data: t.ToolEndData, metadata?:  Record<string, unknown>): void {
    if (!this.config) {
      throw new Error('No config provided');
    }

    const { input, output } = data;
    const { tool_call_id } = output;
    const stepId = this.toolCallStepIds.get(tool_call_id);
    if (!stepId) {
      throw new Error(`No stepId found for tool_call_id ${tool_call_id}`);
    }
    const runStep = this.getRunStep(stepId);
    if (!runStep) {
      throw new Error(`No run step found for stepId ${stepId}`);
    }

    if (!data?.output) {
      // console.warn('No output found in tool_end event');
      // console.dir(data, { depth: null });
      return;
    }

    const args = typeof input === 'string' ? input : input.input;
    const tool_call = {
      args: typeof args === 'string' ? args : JSON.stringify(args),
      name: output.name ?? '',
      id: output.tool_call_id,
      output: typeof output.content === 'string'
        ? output.content
        : JSON.stringify(output.content),
      progress: 1,
    };

    this.handlerRegistry?.getHandler(GraphEvents.ON_RUN_STEP_COMPLETED)?.handle(
      GraphEvents.ON_RUN_STEP_COMPLETED,
      { result: {
        id: stepId,
        index: runStep.index,
        type: 'tool_call',
        tool_call
      } as t.ToolCompleteEvent,
      },
      metadata,
      this,
    );
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
