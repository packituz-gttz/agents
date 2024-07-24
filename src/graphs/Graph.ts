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
import { modifyDeltaProperties, formatAnthropicMessage } from '@/messages';
import { Providers, GraphEvents, GraphNodeKeys } from '@/common';
import { getChatModelClass } from '@/llm/providers';
import { resetIfNotEmpty, joinKeys } from '@/utils';
import { HandlerRegistry } from '@/stream';

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
  abstract generateStepId(stepKey: string): string;
  abstract getKeyList(metadata: Record<string, unknown> | undefined): (string | number | undefined)[];
  abstract getStepKey(metadata: Record<string, unknown> | undefined): string;
  abstract checkKeyList(keyList: (string | number | undefined)[]): boolean;
  abstract getStepId(stepKey: string, index: number): string
  abstract dispatchRunStep(stepKey: string, stepDetails: t.StepDetails): void;
  abstract dispatchRunStepDelta(id: string, delta: t.ToolCallDelta): void;
  abstract dispatchMessageDelta(id: string, delta: t.MessageDelta): void;

  abstract createCallModel(): (state: T, config?: RunnableConfig) => Promise<Partial<T>>;
  abstract createWorkflow(): t.CompiledWorkflow<T, Partial<T>, TNodeName>;
  /** "SI" stands for StepIndex */
  messageIdsBySI: Map<string, string> = new Map();
  /** "SI" stands for StepIndex */
  prelimMessageIdsBySI: Map<string, string> = new Map();
  toolCallIds: Set<string> = new Set();
  // contentDataMap: Map<string, unknown[]> = new Map();
  config: RunnableConfig | undefined;
  contentData: t.RunStep[] = [];
  stepKeyIds: Map<string, string[]> = new Map<string, string[]>();
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

  getStepKey(metadata: Record<string, unknown> | undefined): string {
    if (!metadata) return '';

    const keyList = this.getKeyList(metadata);
    if (this.checkKeyList(keyList)) {
      throw new Error('Missing metadata');
    }

    return joinKeys(keyList);
  }

  getStepId(stepKey: string, index: number): string {
    const stepIds = this.stepKeyIds.get(stepKey);
    if (!stepIds) {
      throw new Error(`No step IDs found for stepKey ${stepKey}`);
    }

    return stepIds[index];
  }

  generateStepId(stepKey: string): string {
    const stepIds = this.stepKeyIds.get(stepKey);
    let newStepId: string | undefined;
    if (stepIds) {
      newStepId = `step_${nanoid()}`;
      stepIds.push(newStepId);
      this.stepKeyIds.set(stepKey, stepIds);
    } else {
      newStepId = `step_${nanoid()}`;
      this.stepKeyIds.set(stepKey, [newStepId]);
    }

    return newStepId;
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

  resetValues(): void {
    this.config = resetIfNotEmpty(this.config, undefined);
    this.contentData = resetIfNotEmpty(this.contentData, []);
    this.stepKeyIds = resetIfNotEmpty(this.stepKeyIds, new Map());
    this.toolCallIds = resetIfNotEmpty(this.toolCallIds, new Set());
    this.messageIdsBySI = resetIfNotEmpty(this.messageIdsBySI, new Map());
    this.prelimMessageIdsBySI = resetIfNotEmpty(this.prelimMessageIdsBySI, new Map());
  }

  createGraphState(): t.GraphStateChannels<t.BaseGraphState> {
    return {
      messages: {
        value: (x: BaseMessage[], y: BaseMessage[]): BaseMessage[] => x.concat(y),
        default: () => [],
      },
      // instructions: {
      //   value: (x: string | undefined, y: string | undefined) => y || x,
      //   default: () => undefined,
      // },
      // additional_instructions: {
      //   value: (x: string | undefined, y: string | undefined) => y || x,
      //   default: () => undefined,
      // },
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

  getFinalMessage(): AIMessageChunk | undefined {
    return this.finalMessage;
  }

  dispatchRunStep(id: string, stepDetails: t.StepDetails): void {
    if (!this.config) {
      throw new Error('No config provided');
    }
    // Check if a run step with this stepKey already exists
    const existingStepIndex = this.contentData.findIndex((step: t.RunStep) => step.id === id);
    if (existingStepIndex !== -1) {
      // eslint-disable-next-line no-console
      console.warn(`\n
        ==============================================================

        Run step with id ${id} already exists. Updating existing step.

        ==============================================================
        \n`);
      (this.contentData[existingStepIndex] as t.RunStep).stepDetails = stepDetails;
      return;
    }
    const runStep: t.RunStep = {
      id,
      type: stepDetails.type,
      index: this.contentData.length,
      stepDetails,
      usage: null,
    };
    this.contentData.push(runStep);
    dispatchCustomEvent(GraphEvents.ON_RUN_STEP, runStep, this.config);
  }

  dispatchRunStepDelta(id: string, delta: t.ToolCallDelta): void {
    if (!this.config) {
      throw new Error('No config provided');
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

  // private handleAWSMessages(x: BaseMessage[], y: BaseMessage[]): BaseMessage[] {
  //   const [lastMessageX, secondLastMessageX] = x.slice(-2);
  //   const lastMessageY = y[y.length - 1];

  //   if (
  //     lastMessageX instanceof AIMessageChunk &&
  //     lastMessageY instanceof ToolMessage &&
  //     Array.isArray(secondLastMessageX) &&
  //     secondLastMessageX[0] === 'user'
  //   ) {
  //     const overrideMessage = getConverseOverrideMessage({
  //       userMessage: secondLastMessageX,
  //       lastMessageX,
  //       lastMessageY,
  //     });

  //     const initialMessages = x.slice(0, -4);
  //     return [...initialMessages, overrideMessage];
  //   }

  //   return x.concat(y);
  // }

  // private convertToolMessagesForAnthropic(messages: BaseMessage[]): BaseMessage[] {
  //   const lastMessage = messages[messages.length - 1];
  //   if (!lastMessage) {
  //     return messages;
  //   }

  //   let toolResultIndex = -1;
  //   const convertedMessages: BaseMessage[] = [];
  //   for (let i = 0; i < messages.length; i++) {
  //     const message = messages[i];
  //     if (message instanceof ToolMessage && message.tool_call_id) {
  //       // Append tool result to the current human message

  //       const currentHumanMessage = convertedMessages[toolResultIndex];

  //       const toolResult = {
  //         type: 'tool_result',
  //         tool_call_id: message.tool_call_id,
  //         name: message.name,
  //         content: message.content
  //       };

  //       if (currentHumanMessage) {
  //         currentHumanMessage.content.push(toolResult);
  //       } else {
  //         convertedMessages.push({
  //           role: 'user',
  //           content: [toolResult]
  //         });
  //       }

  //       toolResultIndex = i;
  //     } else {
  //       // For other message types (like AIMessage or SystemMessage), just add them as is
  //       convertedMessages.push(message);
  //     }
  //   }

  //   if (convertedMessages[toolResultIndex]) {
  //     convertedMessages[toolResultIndex] = new ToolMessage({
  //       tool_call_id: convertedMessages[toolResultIndex].content[0].tool_call_id,
  //       name: convertedMessages[toolResultIndex].content[0].name,
  //       content: convertedMessages[toolResultIndex].content
  //     });
  //   }

  //   return convertedMessages;
  // }
}
