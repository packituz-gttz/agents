import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatMistralAI } from "@langchain/mistralai";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { RunnableConfig } from "@langchain/core/runnables";
import { END, START, StateGraph } from "@langchain/langgraph";
import { AIMessage, BaseMessage } from "@langchain/core/messages";
import type { StructuredTool } from "@langchain/core/tools";
import type * as t from '@/types';
import {
  HandlerRegistry,
  ChatModelStreamHandler,
  DefaultLLMStreamHandler,
} from '@/stream';
import { GraphEvents, Providers } from '@/common';

const llmProviders: Record<Providers, t.ChatModelConstructor> = {
  [Providers.OPENAI]: ChatOpenAI,
  [Providers.MISTRALAI]: ChatMistralAI,
  [Providers.ANTHROPIC]: ChatAnthropic,
};

export class Processor {
  private graph: t.Graph;
  private handlerRegistry: HandlerRegistry;

  constructor(config: {
    tools?: StructuredTool[];
    customHandlers?: Record<string, t.EventHandler>;
    llmConfig: t.LLMConfig;
  }) {
    this.handlerRegistry = new HandlerRegistry();
    this.handlerRegistry.register(GraphEvents.LLM_STREAM, new DefaultLLMStreamHandler());
    this.handlerRegistry.register(GraphEvents.CHAT_MODEL_STREAM, new ChatModelStreamHandler());

    if (config.customHandlers) {
      for (const [eventType, handler] of Object.entries(config.customHandlers)) {
        this.handlerRegistry.register(eventType, handler);
      }
    }

    this.graph = this.createGraph(config.llmConfig, config.tools);
  }

  private createGraph(llmConfig: t.LLMConfig, tools: StructuredTool[] = []): t.Graph {
    const graphState: t.GraphState = {
      messages: {
        value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
        default: () => [],
      },
    };

    const toolNode = new ToolNode<{ messages: BaseMessage[] }>(tools);
    const { provider, ...clientOptions } = llmConfig;

    const ChatModelClass = this.getChatModelClass(provider);
    const model = new ChatModelClass(clientOptions);
    const boundModel = model.bindTools(tools);

    const routeMessage = (state: t.IState) => {
      const { messages } = state;
      const lastMessage = messages[messages.length - 1] as AIMessage;
      if (!lastMessage?.tool_calls?.length) {
        return END;
      }
      return "tools";
    };

    const callModel = async (
      state: t.IState,
      config?: RunnableConfig,
    ) => {
      const { messages } = state;
      const responseMessage = await boundModel.invoke(messages, config);
      return { messages: [responseMessage] };
    };

    const workflow: t.Workflow = new StateGraph<t.IState>({
      channels: graphState,
    })
      .addNode("agent", callModel)
      .addNode("tools", toolNode)
      .addEdge(START, "agent")
      .addConditionalEdges("agent", routeMessage)
      .addEdge("tools", "agent");

    return workflow.compile();
  }

  private getChatModelClass(provider: Providers): t.ChatModelConstructor {
    const ChatModelClass = llmProviders[provider];
    if (!ChatModelClass) {
      throw new Error(`Unsupported LLM provider: ${provider}`);
    }

    return ChatModelClass;
  }

  async processStream<RunInput>(
    inputs: RunInput,
    config: Partial<RunnableConfig> & { version: "v1" | "v2" },
  ) {
    const stream = this.graph.streamEvents(inputs, config);
    for await (const event of stream) {
      const handler = this.handlerRegistry.getHandler(event.event);
      if (handler) {
        handler.handle(event.event, event.data);
      }
    }
  }
}
