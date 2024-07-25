// src/stream.ts
import { nanoid } from 'nanoid';
import type { AIMessageChunk } from '@langchain/core/messages';
import type { ToolCall } from '@langchain/core/messages/tool';
import type { Graph } from '@/graphs';
import type * as t from '@/types';
import { StepTypes } from '@/common';

const getMessageId = (stepKey: string, graph: Graph<t.BaseGraphState>): string | undefined => {
  const messageId = graph.messageIdsByStepKey.get(stepKey);
  if (messageId) {
    return;
  }

  const prelimMessageId = graph.prelimMessageIdsByStepKey.get(stepKey);
  if (prelimMessageId) {
    graph.prelimMessageIdsByStepKey.delete(stepKey);
    graph.messageIdsByStepKey.set(stepKey, prelimMessageId);
    return prelimMessageId;
  }

  const message_id = `msg_${nanoid()}`;
  graph.messageIdsByStepKey.set(stepKey, message_id);
  return message_id;
};

export class ChatModelStreamHandler implements t.EventHandler {
  handle(event: string, data: t.StreamEventData, metadata?: Record<string, unknown>, graph?: Graph): void {
    if (!graph) {
      throw new Error('Graph not found');
    }

    const chunk = data.chunk as AIMessageChunk;
    const content = chunk?.content;

    if (!graph.config) {
      throw new Error('Config not found in graph');
    }

    if (!chunk) {
      console.warn(`No chunk found in ${event} event`);
      return;
    }

    const hasToolCalls = chunk.tool_calls && chunk.tool_calls.length > 0;
    const hasToolCallChunks = chunk.tool_call_chunks && chunk.tool_call_chunks.length > 0;

    if (hasToolCalls && chunk.tool_calls?.every((tc) => tc.id)) {
      const tool_calls: ToolCall[] = [];
      for (const tool_call of chunk.tool_calls) {
        if (!tool_call.id || graph.toolCallIds.has(tool_call.id)) {
          continue;
        }

        tool_calls.push(tool_call);
        graph.toolCallIds.add(tool_call.id);
      }

      const stepKey = graph.getStepKey(metadata);
      graph.dispatchRunStep(stepKey, {
        type: StepTypes.TOOL_CALLS,
        tool_calls,
      });
    }

    const isEmptyContent = !content || !content.length;
    const isEmptyChunk = isEmptyContent && !hasToolCallChunks;
    if (isEmptyChunk && chunk.id && chunk.id?.startsWith('msg')) {
      if (graph.messageIdsByStepKey.has(chunk.id)) {
        return;
      } else if (graph.prelimMessageIdsByStepKey.has(chunk.id)) {
        return;
      }

      const stepKey = graph.getStepKey(metadata);
      graph.prelimMessageIdsByStepKey.set(stepKey, chunk.id);
      return;
    } else if (isEmptyChunk) {
      return;
    }

    const stepKey = graph.getStepKey(metadata);

    if (hasToolCallChunks && chunk.tool_call_chunks?.length && typeof chunk.tool_call_chunks[0]?.index === 'number') {
      const stepId = graph.getStepId(stepKey, chunk.tool_call_chunks[0].index);
      graph.dispatchRunStepDelta(stepId, {
        type: StepTypes.TOOL_CALLS,
        tool_calls: chunk.tool_call_chunks,
      });
    }

    if (isEmptyContent) {
      return;
    }

    const message_id = getMessageId(stepKey, graph);
    if (message_id) {
      graph.dispatchRunStep(stepKey, {
        type: StepTypes.MESSAGE_CREATION,
        message_creation: {
          message_id,
        },
      });
    }

    const stepId = graph.getStepId(stepKey);
    /* Note: tool call chunks may have non-empty content that matches the current tool chunk generation */
    if (hasToolCallChunks && typeof content === 'string' && chunk.tool_call_chunks?.some((tc) => tc.args === content)) {
      return;
    } else if (
      Array.isArray(content) && content.length
      && typeof (content[0] as t.ExtendedMessageContent)?.index === 'number'
      && chunk.tool_call_chunks?.length
      && chunk.tool_call_chunks[0]?.index === (content[0] as t.ExtendedMessageContent).index
    ) {
      return;
    } else if (
      hasToolCallChunks
      && chunk.tool_call_chunks?.some((tc) => tc.args === (content[0] as t.ExtendedMessageContent)?.input)
    ) {
      return;
    } else if (typeof content === 'string') {
      graph.dispatchMessageDelta(stepId, {
        content: [{
          type: 'text',
          text: content,
        }],
      });
    } else if (content?.length && content.every((c) => c.type?.startsWith('text'))) {
      graph.dispatchMessageDelta(stepId, {
        content,
      });
    }
  }
}