import { ChatOpenAI } from "@langchain/openai";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { RunnableConfig } from "@langchain/core/runnables";
import { END, START, StateGraph } from "@langchain/langgraph";
import { AIMessage, BaseMessage } from "@langchain/core/messages";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import type * as t from '@/types/graph';
import { HandlerRegistry, DefaultLLMStreamHandler } from '@/stream';

export class Processor {
  private graph: t.Graph;
  private handlerRegistry: HandlerRegistry;

  constructor(config?: { customHandlers?: Record<string, t.EventHandler> }) {
    this.handlerRegistry = new HandlerRegistry();
    this.handlerRegistry.register("on_llm_stream", new DefaultLLMStreamHandler());

    if (config?.customHandlers) {
      for (const [eventType, handler] of Object.entries(config.customHandlers)) {
        this.handlerRegistry.register(eventType, handler);
      }
    }

    this.graph = this.createGraph();
  }

  private createGraph(): t.Graph {
    const graphState: t.GraphState = {
      messages: {
        value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
        default: () => [],
      },
    };

    const tools = [new TavilySearchResults({})];
    const toolNode = new ToolNode<{ messages: BaseMessage[] }>(tools);
    const model = new ChatOpenAI({ model: "gpt-4" });
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

  async processStream<RunInput>(
    inputs: RunInput,
    config: Partial<RunnableConfig> & { version: "v1" | "v2" },
  ) {
    for await (const event of this.graph.streamEvents(inputs, config)) {
      const handler = this.handlerRegistry.getHandler(event.event);
      if (handler) {
        handler.handle(event.event, event.data);
      }
    }
  }
}
