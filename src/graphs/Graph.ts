// src/graphs/Graph.ts
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { RunnableConfig } from "@langchain/core/runnables";
import type { StructuredTool } from "@langchain/core/tools";
import { END, START, StateGraph } from "@langchain/langgraph";
import { AIMessage, BaseMessage, AIMessageChunk, ToolMessage } from "@langchain/core/messages";
import type * as t from '@/types';
import { getConverseOverrideMessage } from '@/messages';
import { getChatModelClass } from '@/llm/providers';
import { Providers } from '@/common';

type ToolNodeState = {
  messages: BaseMessage[];
  [key: string]: any;
};

export abstract class Graph<
  T extends ToolNodeState = { messages: BaseMessage[] },
  TNodeName extends string = string
> {
  abstract createGraphState(): t.GraphState;
  abstract initializeTools(tools: StructuredTool[]): ToolNode<T>;
  abstract initializeModel(provider: Providers, clientOptions: Record<string, unknown>, tools: StructuredTool[]): any;
  abstract createCallModel(boundModel: any): (state: T, config?: RunnableConfig) => Promise<Partial<T>>;
  abstract createWorkflow(
    graphState: t.GraphState,
    callModel: any,
    toolNode: any
  ): t.CompiledWorkflow<T, Partial<T>, TNodeName>;
}

export class StandardGraph extends Graph<
  { messages: BaseMessage[] },
  "agent" | "tools" | typeof START
> {
  createGraphState(): t.GraphState {
    return {
      messages: {
        value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
        default: () => [],
      },
    };
  }

  initializeTools(tools: StructuredTool[]): ToolNode<{ messages: BaseMessage[] }> {
    return new ToolNode<{ messages: BaseMessage[] }>(tools);
  }

  initializeModel(provider: Providers, clientOptions: Record<string, unknown>, tools: StructuredTool[]) {
    const ChatModelClass = getChatModelClass(provider);
    const model = new ChatModelClass(clientOptions);
    return model.bindTools(tools);
  }

  createCallModel(boundModel: any) {
    return async (state: t.IState, config?: RunnableConfig) => {
      const { messages } = state;
      const responseMessage = await boundModel.invoke(messages, config);
      return { messages: [responseMessage] };
    };
  }

  createWorkflow(
    graphState: t.GraphState,
    callModel: any,
    toolNode: any
  ): t.CompiledWorkflow<{ messages: BaseMessage[] }, Partial<{ messages: BaseMessage[] }>, "agent" | "tools" | typeof START> {
    const routeMessage = (state: { messages: BaseMessage[] }) => {
      const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
      if (!lastMessage?.tool_calls?.length) {
        return END;
      }
      return "tools";
    };

    const workflow = new StateGraph<{ messages: BaseMessage[] }, Partial<{ messages: BaseMessage[] }>, "agent" | "tools" | typeof START>({
      channels: graphState,
    })
      .addNode("agent", callModel)
      .addNode("tools", toolNode)
      .addEdge(START, "agent")
      .addConditionalEdges("agent", routeMessage)
      .addEdge("tools", "agent");

    return workflow.compile();
  }

  private handleAWSMessages(x: BaseMessage[], y: BaseMessage[]): BaseMessage[] {
    const [lastMessageX, secondLastMessageX] = x.slice(0, -2);
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
}
