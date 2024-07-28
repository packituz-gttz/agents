/* eslint-disable no-console */
// src/events.ts
import type { AIMessage, ToolMessage } from '@langchain/core/messages';
import type { Graph } from '@/graphs';
import type * as t from '@/types';

export class HandlerRegistry {
  private handlers: Map<string, t.EventHandler> = new Map();

  register(eventType: string, handler: t.EventHandler): void {
    this.handlers.set(eventType, handler);
  }

  getHandler(eventType: string): t.EventHandler | undefined {
    return this.handlers.get(eventType);
  }
}

export class ModelEndHandler implements t.EventHandler {
  handle(event: string, data: t.StreamEventData, metadata?: Record<string, unknown>, graph?: Graph): void {
    if (!graph || !metadata) {
      console.warn(`Graph or metadata not found in ${event} event`);
      return;
    }

    // const messageType = (data?.output as BaseMessage | undefined)?._getType();
    // console.log('messageType', messageType);
    const usage = (data?.output as AIMessage)?.usage_metadata;

    // const stepKey = graph.getStepKey(metadata);
    // const stepId = graph.getStepIdByKey(stepKey);
    // const step = graph.getRunStep(stepId);

    console.log(`====== ${event.toUpperCase()} ======`);
    console.dir({
      usage,
    }, { depth: null });
  }
}

export class ToolEndHandler implements t.EventHandler {
  handle(event: string, data: t.StreamEventData, metadata?: Record<string, unknown>, graph?: Graph): void {
    if (!graph || !metadata) {
      console.warn(`Graph or metadata not found in ${event} event`);
      return;
    }

    const { input, output } = data as { input: string, output: ToolMessage};
    if (!output) {
      console.warn('No output found in tool_end event');
      return;
    }

    // todo: dispatch run step completed event
    const result = {
      args: input,
      name: output.name ?? '',
      id: output.tool_call_id,
      type: 'tool_call' as const,
      output: typeof output.content === 'string'
        ? output.content
        : JSON.stringify(output.content),
    };
    graph.toolCallResults.set(output.tool_call_id, result);

    console.dir({
      output,
      result,
    }, { depth: null });
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