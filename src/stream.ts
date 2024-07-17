// src/stream.ts
import type * as t from '@/types/graph';

export class HandlerRegistry {
  private handlers: Map<string, t.EventHandler> = new Map();

  register(eventType: string, handler: t.EventHandler): void {
    this.handlers.set(eventType, handler);
  }

  getHandler(eventType: string): t.EventHandler | undefined {
    return this.handlers.get(eventType);
  }
}

export class DefaultLLMStreamHandler implements t.EventHandler {
  handle(event: string, data: t.StreamEventData): void {
    const chunk = data?.chunk;
    const  isMessageChunk = !!(chunk && 'message' in chunk);
    const msg = isMessageChunk && chunk?.message;
    if (msg && msg.tool_call_chunks && msg.tool_call_chunks.length > 0) {
      console.log(msg.tool_call_chunks);
    } else if (msg) {
      const content = msg.content || '';
      if (typeof content === 'string') {
        process.stdout.write(content);
      }
    }
  }
}

export class ChatModelStreamHandler implements t.EventHandler {
  handle(event: string, data: t.StreamEventData): void {
    const chunk = data?.chunk;
    const  isContentChunk = !!(chunk && 'content' in chunk);
    const content = isContentChunk && chunk?.content;

    if (!content || !isContentChunk) {
      return;
    }

    if (chunk.tool_call_chunks && chunk.tool_call_chunks.length > 0) {
      console.log(chunk.tool_call_chunks);
    }
    if (typeof content === 'string') {
      process.stdout.write(content);
    }
  }
}
