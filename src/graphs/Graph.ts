// src/graphs/Graph.ts
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
import { HandlerRegistry } from '@/stream';

const { AGENT, TOOLS } = GraphNodeKeys;
type GraphNode = GraphNodeKeys | typeof START;

const resetIfNotEmpty = <T>(value: T, resetValue: T): T => {
  if (Array.isArray(value)) {
    return value.length > 0 ? resetValue : value;
  }
  if (value instanceof Set || value instanceof Map) {
    return value.size > 0 ? resetValue : value;
  }
  return value !== undefined ? resetValue : value;
};

export abstract class Graph<
  T extends t.BaseGraphState = t.BaseGraphState,
  TNodeName extends string = string,
> {
  abstract resetValues(): void;
  abstract createGraphState(): t.GraphStateChannels<T>;
  abstract initializeTools(): ToolNode<T>;
  abstract initializeModel(): Runnable;
  abstract dispatchRunStep(stepKey: string, stepDetails: t.StepDetails): void;

  abstract createCallModel(): (state: T, config?: RunnableConfig) => Promise<Partial<T>>;
  abstract createWorkflow(): t.CompiledWorkflow<T, Partial<T>, TNodeName>;
  stepKeys: Map<string, string> = new Map();
  /** "SI" stands for StepIndex */
  messageIdsBySI: Map<string, string> = new Map();
  /** "SI" stands for StepIndex */
  prelimMessageIdsBySI: Map<string, string> = new Map();
  toolCallIds: Set<string> = new Set();
  // contentDataMap: Map<string, unknown[]> = new Map();
  config: RunnableConfig | undefined;
  contentData: unknown[] = [];
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

  resetValues(): void {
    this.config = resetIfNotEmpty(this.config, undefined);
    this.contentData = resetIfNotEmpty(this.contentData, []);
    this.stepKeys = resetIfNotEmpty(this.stepKeys, new Map());
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

  dispatchRunStep(stepKey: string, stepDetails: t.StepDetails): void {
    if (!this.config) {
      throw new Error('No config provided');
    }
    const runStep: t.RunStep = {
      stepKey,
      type: stepDetails.type,
      index: this.contentData.length,
      stepDetails,
      usage: null,
    };
    this.contentData.push(runStep);
    dispatchCustomEvent(GraphEvents.ON_RUN_STEP, runStep, this.config);
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
