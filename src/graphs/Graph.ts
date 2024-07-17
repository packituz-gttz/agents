import { concat } from '@langchain/core/utils/stream';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { RunnableConfig } from '@langchain/core/runnables';
import type { StructuredTool } from '@langchain/core/tools';
import type * as t from '@/types';
import { END, START, StateGraph } from '@langchain/langgraph';
import { AIMessage, BaseMessage, AIMessageChunk, ToolMessage, SystemMessage, HumanMessage } from '@langchain/core/messages';
import { getConverseOverrideMessage, modifyDeltaProperties, formatAnthropicMessage } from '@/messages';
import { getChatModelClass } from '@/llm/providers';
import { Providers, GraphEvents } from '@/common';

export abstract class Graph<
  T extends t.ToolNodeState = { messages: BaseMessage[] },
  TNodeName extends string = string
> {
  abstract createGraphState(): t.GraphState;
  abstract initializeTools(): ToolNode<T>;
  abstract initializeModel(): any;
  abstract createCallModel(): (state: T, config?: RunnableConfig) => Promise<Partial<T>>;
  abstract createWorkflow(): t.CompiledWorkflow<T, Partial<T>, TNodeName>;
}

export class StandardGraph extends Graph<
  { messages: BaseMessage[] },
  'agent' | 'tools' | typeof START
> {
    private finalChunk: AIMessageChunk | undefined;
    private graphState: t.GraphState;
    private tools: StructuredTool[];
    private provider: Providers;
    private clientOptions: Record<string, unknown>;
    private boundModel: any;
    handlerRegistry: any;

    constructor(provider: Providers, clientOptions: Record<string, unknown>, tools: StructuredTool[]) {
        super();
        this.provider = provider;
        this.clientOptions = clientOptions;
        this.tools = tools;
        this.graphState = this.createGraphState();
        this.boundModel = this.initializeModel();
    }

    createGraphState(): t.GraphState {
        return {
            messages: {
                value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
                default: () => [],
            },
            instructions: {
                value: (x: string | undefined, y: string | undefined) => y || x,
                default: () => undefined,
            },
            additional_instructions: {
                value: (x: string | undefined, y: string | undefined) => y || x,
                default: () => undefined,
            },
        };
    }

    initializeTools(): ToolNode<{ messages: BaseMessage[] }> {
        return new ToolNode<{ messages: BaseMessage[] }>(this.tools);
    }

    initializeModel() {
        const ChatModelClass = getChatModelClass(this.provider);
        const model = new ChatModelClass(this.clientOptions);
        return model.bindTools(this.tools);
    }

    createCallModel() {
        return async (state: { messages: BaseMessage[] }, config?: RunnableConfig): Promise<Partial<{ messages: BaseMessage[] }>> => {
            const { messages } = state;
            const instructions = (state as t.IState).instructions;
            const additional_instructions = (state as t.IState).additional_instructions;

            let finalInstructions = instructions;
            if (additional_instructions) {
                finalInstructions = finalInstructions ? `${finalInstructions}\n\n${additional_instructions}` : additional_instructions;
            }

            if (finalInstructions && messages[0]?.content !== finalInstructions) {
                messages.unshift(new SystemMessage(finalInstructions));
            }

            const finalMessages = messages;
            if (this.provider === Providers.ANTHROPIC
        && finalMessages[finalMessages.length - 1] instanceof ToolMessage
        && finalMessages[finalMessages.length - 2] instanceof AIMessageChunk
            ) {
                finalMessages[finalMessages.length - 2] = formatAnthropicMessage(finalMessages[finalMessages.length - 2] as AIMessageChunk);
            }

            const stream = await this.boundModel.stream(finalMessages, config);
            let finalChunk: AIMessageChunk | undefined;
            for await (const chunk of stream) {
                if (!finalChunk) {
                    finalChunk = chunk;
                } else {
                    finalChunk = concat(finalChunk, chunk);
                }
            }

            finalChunk = modifyDeltaProperties(finalChunk);
            this.finalChunk = finalChunk;
            return { messages: finalChunk ? [finalChunk] : [] };
        };
    }

    createWorkflow(): t.CompiledWorkflow<{ messages: BaseMessage[] }, Partial<{ messages: BaseMessage[] }>, 'agent' | 'tools' | typeof START> {
        const routeMessage = (state: { messages: BaseMessage[] }) => {
            const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
            if (!lastMessage?.tool_calls?.length) {
                return END;
            }
            return 'tools';
        };

        const workflow = new StateGraph<{ messages: BaseMessage[] }, Partial<{ messages: BaseMessage[] }>, 'agent' | 'tools' | typeof START>({
            channels: this.graphState,
        })
            .addNode('agent', this.createCallModel())
            .addNode('tools', this.initializeTools())
            .addEdge(START, 'agent')
            .addConditionalEdges('agent', routeMessage)
            .addEdge('tools', 'agent');

        return workflow.compile();
    }

    getFinalChunk(): AIMessageChunk | undefined {
        return this.finalChunk;
    }

    private handleAWSMessages(x: BaseMessage[], y: BaseMessage[]): BaseMessage[] {
        const [lastMessageX, secondLastMessageX] = x.slice(-2);
        const lastMessageY = y[y.length - 1];

        if (
            lastMessageX instanceof AIMessageChunk &&
      lastMessageY instanceof ToolMessage &&
      Array.isArray(secondLastMessageX) &&
      secondLastMessageX[0] === 'user'
        ) {
            const overrideMessage = getConverseOverrideMessage({
                userMessage: secondLastMessageX,
                lastMessageX,
                lastMessageY,
            });

            const initialMessages = x.slice(0, -4);
            return [...initialMessages, overrideMessage];
        }

        return x.concat(y);
    }

    private convertToolMessagesForAnthropic(messages: BaseMessage[]): BaseMessage[] {
        const lastMessage = messages[messages.length - 1];
        if (!lastMessage) {
            return messages;
        }

        let toolResultIndex = -1;
        const convertedMessages: BaseMessage[] = [];
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            if (message instanceof ToolMessage && message.tool_call_id) {
                // Append tool result to the current human message

                const currentHumanMessage = convertedMessages[toolResultIndex];

                const toolResult = {
                    type: 'tool_result',
                    tool_call_id: message.tool_call_id,
                    name: message.name,
                    content: message.content
                };

                if (currentHumanMessage) {
                    currentHumanMessage.content.push(toolResult);
                } else {
                    convertedMessages.push({
                        role: 'user',
                        content: [toolResult]
                    });
                }

                toolResultIndex = i;
            } else {
                // For other message types (like AIMessage or SystemMessage), just add them as is
                convertedMessages.push(message);
            }
        }

        if (convertedMessages[toolResultIndex]) {
            convertedMessages[toolResultIndex] = new ToolMessage({
                tool_call_id: convertedMessages[toolResultIndex].content[0].tool_call_id,
                name: convertedMessages[toolResultIndex].content[0].name,
                content: convertedMessages[toolResultIndex].content
            });
        }

        return convertedMessages;
    }
}
