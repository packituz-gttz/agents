// src/stream.ts
// import { dispatchCustomEvent } from '@langchain/core/callbacks/dispatch';
import type * as t from '@/types/graph';
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

export class ChatModelStreamHandler implements t.EventHandler {
  handle(event: string, data: t.StreamEventData, metadata?: Record<string, unknown>): void {
    const chunk = data?.chunk;
    const isContentChunk = !!(chunk && 'content' in chunk);
    const content = isContentChunk && chunk?.content;
    if (metadata) { console.log(metadata); }

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
