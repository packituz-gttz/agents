// src/stream.ts
import { nanoid } from 'nanoid';
import type { AIMessageChunk } from '@langchain/core/messages';
import type { ToolCall } from '@langchain/core/messages/tool';
import type { Graph } from '@/graphs';
import type * as t from '@/types';
import { StepTypes, ContentTypes, GraphEvents, ToolCallTypes } from '@/common';

function getNonEmptyValue(possibleValues: string[]): string | undefined {
  for (const value of possibleValues) {
    if (value && value.trim() !== '') {
      return value;
    }
  }
  return undefined;
}

const getMessageId = (stepKey: string, graph: Graph<t.BaseGraphState>): string | undefined => {
  const messageId = graph.messageIdsByStepKey.get(stepKey);
  if (messageId != null && messageId) {
    return;
  }

  const prelimMessageId = graph.prelimMessageIdsByStepKey.get(stepKey);
  if (prelimMessageId != null && prelimMessageId) {
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
    const content = chunk.content;

    if (!graph.config) {
      throw new Error('Config not found in graph');
    }

    if (!chunk) {
      console.warn(`No chunk found in ${event} event`);
      return;
    }

    const hasToolCalls = (chunk.tool_calls && chunk.tool_calls.length > 0) ?? false;
    const hasToolCallChunks = (chunk.tool_call_chunks && chunk.tool_call_chunks.length > 0) ?? false;

    if (hasToolCalls && chunk.tool_calls?.every((tc) => tc.id)) {
      const tool_calls: ToolCall[] = [];
      for (const tool_call of chunk.tool_calls) {
        if (!tool_call.id || graph.toolCallStepIds.has(tool_call.id)) {
          continue;
        }

        tool_calls.push(tool_call);
      }

      const stepKey = graph.getStepKey(metadata);
      graph.dispatchRunStep(stepKey, {
        type: StepTypes.TOOL_CALLS,
        tool_calls,
      });
    }

    const isEmptyContent = !content || !content.length;
    const isEmptyChunk = isEmptyContent && !hasToolCallChunks;
    if (isEmptyChunk && chunk.id && chunk.id.startsWith('msg')) {
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
      const stepId = graph.getStepIdByKey(stepKey, chunk.tool_call_chunks[0].index);
      graph.dispatchRunStepDelta(stepId, {
        type: StepTypes.TOOL_CALLS,
        tool_calls: chunk.tool_call_chunks,
      });
    }

    if (isEmptyContent) {
      return;
    }

    const message_id = getMessageId(stepKey, graph) ?? '';
    if (message_id) {
      graph.dispatchRunStep(stepKey, {
        type: StepTypes.MESSAGE_CREATION,
        message_creation: {
          message_id,
        },
      });
    }

    const stepId = graph.getStepIdByKey(stepKey);
    const runStep = graph.getRunStep(stepId);
    if (!runStep) {
      // eslint-disable-next-line no-console
      console.warn(`\n
==============================================================


Run step for ${stepId} does not exist, cannot dispatch delta event.

event: ${event}
stepId: ${stepId}
stepKey: ${stepKey}
message_id: ${message_id}
hasToolCalls: ${hasToolCalls}
hasToolCallChunks: ${hasToolCallChunks}

==============================================================
\n`);
      return;
    }

    /* Note: tool call chunks may have non-empty content that matches the current tool chunk generation */
    if (typeof content === 'string' && runStep.type === StepTypes.TOOL_CALLS) {
      return;
    } else if (hasToolCallChunks && (chunk.tool_call_chunks?.some((tc) => tc.args === content) ?? false)) {
      return;
    } else if (typeof content === 'string') {
      graph.dispatchMessageDelta(stepId, {
        content: [{
          type: 'text',
          text: content,
        }],
      });
    } else if (content.every((c) => c.type?.startsWith('text'))) {
      graph.dispatchMessageDelta(stepId, {
        content,
      });
    }
  }
}

export type ContentAggregatorResult = {
  contentParts: Array<t.MessageContentComplex | undefined>;
  aggregateContent: ({ event, data }: {
    event: GraphEvents;
    data: t.RunStep | t.MessageDeltaEvent | t.RunStepDeltaEvent | {
        result: t.ToolEndEvent;
    };
}) => void
};

export function createContentAggregator(): ContentAggregatorResult {
  const contentParts: Array<t.MessageContentComplex | undefined> = [];
  const stepMap = new Map<string, t.RunStep>();
  const toolCallIdMap = new Map<string, string>();

  const updateContent = (
    index: number,
    contentPart: t.MessageContentComplex,
    finalUpdate = false,
  ): void => {
    const partType = contentPart.type ?? '';
    if (!partType) {
      console.warn('No content type found in content part');
      return;
    }

    if (!contentParts[index]) {
      contentParts[index] = { type: partType };
    }

    if (
      partType.startsWith(ContentTypes.TEXT) &&
      ContentTypes.TEXT in contentPart &&
      typeof contentPart.text === 'string'
    ) {
      const currentContent = contentParts[index] as { type: ContentTypes.TEXT; text: string };
      contentParts[index] = {
        type: ContentTypes.TEXT,
        text: (currentContent.text || '') + contentPart.text,
      };
    } else if (partType === ContentTypes.IMAGE_URL && 'image_url' in contentPart) {
      const currentContent = contentParts[index] as { type: 'image_url'; image_url: string };
      contentParts[index] = {
        ...currentContent,
      };
    } else if (partType === ContentTypes.TOOL_CALL && 'tool_call' in contentPart) {
      const existingContent = contentParts[index] as Omit<t.ToolCallContent, 'tool_call'> & { tool_call?: ToolCall } | undefined;

      const args = finalUpdate
        ? contentPart.tool_call.args
        : (existingContent?.tool_call?.args || '') + (contentPart.tool_call.args ?? '');

      const id = getNonEmptyValue([contentPart.tool_call.id, existingContent?.tool_call?.id]) ?? '';
      const name =
        getNonEmptyValue([contentPart.tool_call.name, existingContent?.tool_call?.name]) ?? '';

      const newToolCall: ToolCall & t.PartMetadata = {
        id,
        name,
        args,
        type: ToolCallTypes.TOOL_CALL,
      };

      if (finalUpdate) {
        newToolCall.progress = 1;
        newToolCall.output = contentPart.tool_call.output;
      }

      contentParts[index] = {
        type: ContentTypes.TOOL_CALL,
        tool_call: newToolCall,
      };
    }
  };

  const aggregateContent = ({ event, data }: {
    event: GraphEvents;
    data: t.RunStep | t.MessageDeltaEvent | t.RunStepDeltaEvent | { result: t.ToolEndEvent };
  }): void => {

    if (event === GraphEvents.ON_RUN_STEP) {
      const runStep = data as t.RunStep;
      stepMap.set(runStep.id, runStep);

      // Store tool call IDs if present
      if (runStep.stepDetails.type === StepTypes.TOOL_CALLS) {
        runStep.stepDetails.tool_calls.forEach((toolCall) => {
          const toolCallId = toolCall.id ?? '';
          if ('id' in toolCall && toolCallId) {
            toolCallIdMap.set(runStep.id, toolCallId);
          }
        });
      }
    } else if (event === GraphEvents.ON_MESSAGE_DELTA) {
      const messageDelta = data as t.MessageDeltaEvent;
      const runStep = stepMap.get(messageDelta.id);
      if (!runStep) {
        console.warn('No run step or runId found for message delta event');
        return;
      }

      if (messageDelta.delta.content) {
        const contentPart = Array.isArray(messageDelta.delta.content)
          ? messageDelta.delta.content[0]
          : messageDelta.delta.content;

        updateContent(runStep.index, contentPart);
      }
    } else if (event === GraphEvents.ON_RUN_STEP_DELTA) {
      const runStepDelta = data as t.RunStepDeltaEvent;
      const runStep = stepMap.get(runStepDelta.id);
      if (!runStep) {
        console.warn('No run step or runId found for run step delta event');
        return;
      }

      if (
        runStepDelta.delta.type === StepTypes.TOOL_CALLS &&
        runStepDelta.delta.tool_calls
      ) {

        runStepDelta.delta.tool_calls.forEach((toolCallDelta) => {
          const toolCallId = toolCallIdMap.get(runStepDelta.id) ?? '';

          const contentPart: t.MessageContentComplex = {
            type: ContentTypes.TOOL_CALL,
            tool_call: {
              name: toolCallDelta.name ?? '',
              args: toolCallDelta.args ?? '',
              id: toolCallId,
            },
          };

          updateContent(runStep.index, contentPart);
        });
      }
    } else if (event === GraphEvents.ON_RUN_STEP_COMPLETED) {
      const { result } = data as unknown as { result: t.ToolEndEvent };

      const { id: stepId } = result;

      const runStep = stepMap.get(stepId);
      if (!runStep) {
        console.warn('No run step or runId found for completed tool call event');
        return;
      }

      const contentPart: t.MessageContentComplex = {
        type: ContentTypes.TOOL_CALL,
        tool_call: result.tool_call,
      };

      updateContent(runStep.index, contentPart, true);
    }
  };

  return { contentParts, aggregateContent };
}
