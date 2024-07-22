// src/stream.ts
// import { dispatchCustomEvent } from '@langchain/core/callbacks/dispatch';
import type { AIMessageChunk, MessageContent } from '@langchain/core/messages';
import type * as t from '@/types/graph';
import type { Graph } from '@/graphs';
// import { GraphEvents } from '@/common';

export class HandlerRegistry {
  private handlers: Map<string, t.EventHandler> = new Map();

  register(eventType: string, handler: t.EventHandler): void {
    this.handlers.set(eventType, handler);
  }

  getHandler(eventType: string): t.EventHandler | undefined {
    return this.handlers.get(eventType);
  }
}

export class TestLLMStreamHandler implements t.EventHandler {
  handle(event: string, data: t.StreamEventData): void {
    const chunk = data?.chunk;
    const  isMessageChunk = !!(chunk && 'message' in chunk);
    const msg = isMessageChunk && chunk?.message;
    if (msg && msg.tool_call_chunks && msg.tool_call_chunks.length > 0) {
      console.log(msg.tool_call_chunks);
    } else if (msg && msg.content) {
      if (typeof msg.content === 'string') {
        process.stdout.write(msg.content);
      }
    }
  }
}

export class TestChatStreamHandler implements t.EventHandler {
  handle(event: string, data: t.StreamEventData): void {
    const chunk = data?.chunk;
    const isContentChunk = !!(chunk && 'content' in chunk);
    const content = isContentChunk && chunk?.content;

    if (!content || !isContentChunk) {
      return;
    }

    if (chunk.tool_call_chunks && chunk.tool_call_chunks.length > 0) {
      console.dir(chunk.tool_call_chunks, { depth: null });
    }

    if (typeof content === 'string') {
      process.stdout.write(content);
    } else {
      console.dir(content, { depth: null });
    }
  }
}

export class LLMStreamHandler implements t.EventHandler {
  handle(event: string, data: t.StreamEventData, metadata?: Record<string, unknown>): void {
    const chunk = data?.chunk;
    const  isMessageChunk = !!(chunk && 'message' in chunk);
    const msg = isMessageChunk && chunk?.message;
    if (metadata) { console.log(metadata); }
    if (msg && msg.tool_call_chunks && msg.tool_call_chunks.length > 0) {
      console.log(msg.tool_call_chunks);
    } else if (msg && msg.content) {
      if (typeof msg.content === 'string') {
        // const text_delta = msg.content;
        // dispatchCustomEvent(GraphEvents.CHAT_MODEL_STREAM, { chunk }, config);
        process.stdout.write(msg.content);
      }
    }
  }
}

const generateStepKey = ({
  node,
  step,
  graph,
  content,
}: {
  node: string | unknown;
  step: string | unknown;
  graph: Graph;
  content: string | MessageContent; // Update the type of 'content' to include 'index' property
}): string[] => {
  let stepIndex = 0;
  if (Array.isArray(content)) {
    stepIndex = (content[content.length - 1] as MessageContent & {
      index?: number;
    })?.index ?? 0;
  }
  const stepKey = `${node}-${step}-${stepIndex}`;
  if (graph.stepKeys.has(stepKey)) {
    const index = graph.stepKeys.get(stepKey);
    return [stepKey, index ?? '0'];
  }
  const currentIndex = (stepIndex + graph.contentData.length).toString();
  return [stepKey, currentIndex];
};

export class ChatModelStreamHandler implements t.EventHandler {
  handle(event: string, data: t.StreamEventData, metadata?: Record<string, unknown>, graph?: Graph): void {
    if (!graph) {
      throw new Error('Graph not found');
    }

    const chunk = data?.chunk as AIMessageChunk;
    const content = chunk?.content;
    const { langgraph_node: node, langgraph_step: step, langgraph_task_idx } = metadata ?? {};
    console.log({ node, step, langgraph_task_idx });

    const hasToolCalls = chunk?.tool_calls && chunk.tool_calls.length > 0;
    const hasToolCallChunks = chunk?.tool_call_chunks && chunk.tool_call_chunks.length > 0;

    if (hasToolCalls && chunk.tool_calls?.every((tc) => tc.id)) {
      console.dir(chunk.tool_calls, { depth: null });
      for (const tool_call of chunk.tool_calls) {
        if (!tool_call.id) {
          continue;
        }
        if (graph.contentIds.has(tool_call.id)) {
          continue;
        }
        const [stepKey, index] = generateStepKey({ node, step, graph, content });
        graph.contentData.push(Object.assign(tool_call, { index }));
        graph.contentIds.set(tool_call.id, index);
        graph.stepKeys.set(stepKey, index);
      }
    }

    if ((!content || (!content?.length)) && !hasToolCallChunks) {
      return;
    }

    if (hasToolCallChunks) {
      console.dir(chunk.tool_call_chunks, { depth: null });
      // TODO: get index and transmit deltas
      // const index = generateStepKey({ node, step, graph, content })[1];
    }

    const [stepKey, index] = generateStepKey({ node, step, graph, content });
    if (content && typeof content === 'string') {
      process.stdout.write(content);
    } else if (content && content?.length) {
      console.dir(content, { depth: null });
    }
  }
}