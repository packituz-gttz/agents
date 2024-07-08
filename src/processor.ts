import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { RunnableConfig } from "@langchain/core/runnables";
import { END, START, StateGraph } from "@langchain/langgraph";
import { AIMessage, BaseMessage } from "@langchain/core/messages";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import type { AnthropicInput } from "@langchain/anthropic";
import type { OpenAIInput } from "@langchain/openai";
import type * as t from '@/types/graph';
import { HandlerRegistry, DefaultLLMStreamHandler, ChatModelStreamHandler } from '@/stream';
import { GraphEvents } from '@/common/enum';

export type LLMProvider = 'openai' | 'anthropic';

type CallOptions = OpenAIInput | AnthropicInput;

export type LLMConfig = {
  provider: LLMProvider;
} & Partial<CallOptions>;

type ChatModel = typeof ChatAnthropic | typeof ChatOpenAI;

const llmProviders: Map<LLMProvider, ChatModel> = new Map<LLMProvider, ChatModel>([
  ['openai', ChatOpenAI],
  ['anthropic', ChatAnthropic],
]);

export class Processor {
  private graph: t.Graph;
  private handlerRegistry: HandlerRegistry;

  constructor(config: { 
    customHandlers?: Record<string, t.EventHandler>;
    llmConfig: LLMConfig;
  }) {
    this.handlerRegistry = new HandlerRegistry();
    this.handlerRegistry.register(GraphEvents.LLM_STREAM, new DefaultLLMStreamHandler());
    this.handlerRegistry.register(GraphEvents.CHAT_MODEL_STREAM, new ChatModelStreamHandler());

    if (config.customHandlers) {
      for (const [eventType, handler] of Object.entries(config.customHandlers)) {
        this.handlerRegistry.register(eventType, handler);
      }
    }

    this.graph = this.createGraph(config.llmConfig);
  }

  private createGraph(llmConfig: LLMConfig): t.Graph {
    const graphState: t.GraphState = {
      messages: {
        value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
        default: () => [],
      },
    };

    const tools = [new TavilySearchResults({})];
    const toolNode = new ToolNode<{ messages: BaseMessage[] }>(tools);

    const { provider, ...clientOptions } = llmConfig;

    const constructor = this.getLLMConstructor(provider);
    const model = new constructor(clientOptions);
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

  private getLLMConstructor(provider: LLMProvider): ChatModel {
    const LLMConstructor = llmProviders.get(provider);
    if (!LLMConstructor) {
      throw new Error(`Unsupported LLM provider: ${provider}`);
    }

    return LLMConstructor;
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
