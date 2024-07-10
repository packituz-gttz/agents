// src/stream.ts
import type { ChatGenerationChunk } from "@langchain/core/outputs";
import type { AIMessageChunk } from "@langchain/core/messages";
import type * as t from '@/types/graph';

export class HandlerRegistry {
  private handlers: Map<string, t.EventHandler> = new Map();

  register(eventType: string, handler: t.EventHandler) {
    this.handlers.set(eventType, handler);
  }

  getHandler(eventType: string): t.EventHandler | undefined {
    return this.handlers.get(eventType);
  }
}

export class DefaultLLMStreamHandler implements t.EventHandler {
  handle(event: string, data: t.StreamEventData) {
    const chunk: ChatGenerationChunk = data?.chunk;
    const msg = chunk.message as AIMessageChunk;
    if (msg.tool_call_chunks && msg.tool_call_chunks.length > 0) {
      console.log(msg.tool_call_chunks);
    } else {
      const content = msg.content || '';
      if (typeof content === 'string') {
        process.stdout.write(content);
      }
    }
  }
}
export class ChatModelStreamHandler implements t.EventHandler {
  handle(event: string, data: t.StreamEventData) {
    const chunk = data?.chunk;
    const content = chunk.content;
    if (chunk.tool_call_chunks && chunk.tool_call_chunks.length > 0) {
      console.log(chunk.tool_call_chunks);
    } 
      process.stdout.write(content);
  }
}
