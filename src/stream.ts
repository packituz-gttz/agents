// src/stream.ts
import { nanoid } from 'nanoid';
import type { AIMessageChunk } from '@langchain/core/messages';
import type { ToolCall } from '@langchain/core/messages/tool';
import type * as t from '@/types';
import type { Graph } from '@/graphs';
import { StepTypes } from '@/common';

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

const getMessageId = (stepKey: string, graph: Graph<t.BaseGraphState>): string | undefined => {
  const messageId = graph.messageIdsBySI.get(stepKey);
  if (messageId) {
    console.log(`Message ID exists for ${stepKey}`);
    return;
  }

  const prelimMessageId = graph.prelimMessageIdsBySI.get(stepKey);
  if (prelimMessageId) {
    graph.prelimMessageIdsBySI.delete(stepKey);
    graph.messageIdsBySI.set(stepKey, prelimMessageId);
    return prelimMessageId;
  }

  const message_id = `msg_${nanoid()}`;
  graph.messageIdsBySI.set(stepKey, message_id);
  return message_id;
};

export class ChatModelStreamHandler implements t.EventHandler {
  handle(event: string, data: t.StreamEventData, metadata?: Record<string, unknown>, graph?: Graph): void {
    if (!graph) {
      throw new Error('Graph not found');
    }

    const { chunk } = (data as {
      chunk?: AIMessageChunk;
    }) ?? {};
    const content = chunk?.content;

    if (!graph.config) {
      throw new Error('Config not found in graph');
    }

    if (!chunk) {
      console.warn(`No chunk found in ${event} event`);
      return;
    }

    const hasToolCalls = chunk?.tool_calls && chunk.tool_calls.length > 0;
    const hasToolCallChunks = chunk?.tool_call_chunks && chunk.tool_call_chunks.length > 0;

    if (hasToolCalls && chunk.tool_calls?.every((tc) => tc.id)) {
      console.dir(chunk.tool_calls, { depth: null });
      const tool_calls: ToolCall[] = [];
      for (const tool_call of chunk.tool_calls) {
        if (!tool_call.id) {
          continue;
        }
        if (graph.toolCallIds.has(tool_call.id)) {
          continue;
        }

        tool_calls.push(tool_call);
        graph.toolCallIds.add(tool_call.id);
      }

      const stepKey = graph.getStepKey(metadata);
      const stepId = graph.generateStepId(stepKey);
      graph.dispatchRunStep(stepId, {
        type: StepTypes.TOOL_CALLS,
        tool_calls,
      });
    }

    const isEmptyContent = !content || (!content?.length);
    const isEmptyChunk = isEmptyContent && !hasToolCallChunks;
    if (isEmptyChunk && chunk.id && chunk.id?.startsWith('msg')) {
      if (graph.messageIdsBySI.has(chunk.id)) {
        return;
      } else if (graph.prelimMessageIdsBySI.has(chunk.id)) {
        return;
      }

      const stepKey = graph.getStepKey(metadata);
      graph.prelimMessageIdsBySI.set(stepKey, chunk.id);
      return;
    } else if (isEmptyChunk) {
      return;
    }

    const stepKey = graph.getStepKey(metadata);

    if (hasToolCallChunks) {
      console.dir(chunk.tool_call_chunks, { depth: null });
      // TODO: get index and transmit deltas
    }
    if (hasToolCallChunks && chunk.tool_call_chunks?.every((chunk) => chunk.id && chunk.index)) {
      console.dir(chunk.tool_call_chunks, { depth: null });
      // TODO: get index and transmit deltas
    }

    if (isEmptyContent) {
      return;
    }

    const message_id = getMessageId(stepKey, graph);
    if (message_id) {
      const stepId = graph.generateStepId(stepKey);
      graph.dispatchRunStep(stepId, {
        type: StepTypes.MESSAGE_CREATION,
        message_creation: {
          message_id,
        },
      });
    }

    if (typeof content === 'string') {
      process.stdout.write(content);
    } else if (content?.length) {
      console.dir(content, { depth: null });
    }
  }
}