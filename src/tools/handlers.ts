/* eslint-disable no-console */
// src/tools/handlers.ts
import { nanoid } from 'nanoid';
import type { ToolCall, ToolCallChunk } from '@langchain/core/messages/tool';
import type { Graph } from '@/graphs';
import type * as t from '@/types';
import { StepTypes, ContentTypes, ToolCallTypes } from '@/common';
import { getMessageId } from '@/messages';

export function handleToolCallChunks({
  graph,
  stepKey,
  toolCallChunks,
}: {
  graph: Graph;
  stepKey: string;
  toolCallChunks: ToolCallChunk[];
}): void {
  let prevStepId: string;
  let prevRunStep: t.RunStep | undefined;
  try {
    prevStepId = graph.getStepIdByKey(stepKey, graph.contentData.length - 1);
    prevRunStep = graph.getRunStep(prevStepId);
  } catch {
    /** Edge Case: If no previous step exists, create a new message creation step */
    const message_id = getMessageId(stepKey, graph, true) ?? '';
    prevStepId = graph.dispatchRunStep(stepKey, {
      type: StepTypes.MESSAGE_CREATION,
      message_creation: {
        message_id,
      },
    });
    prevRunStep = graph.getRunStep(prevStepId);
  }

  const _stepId = graph.getStepIdByKey(stepKey, prevRunStep?.index);

  /** Edge Case: Tool Call Run Step or `tool_call_ids` never dispatched */
  const tool_calls: ToolCall[] | undefined =
    prevStepId && prevRunStep && prevRunStep.type === StepTypes.MESSAGE_CREATION
      ? []
      : undefined;

  /** Edge Case: `id` and `name` fields cannot be empty strings */
  for (const toolCallChunk of toolCallChunks) {
    if (toolCallChunk.name === '') {
      toolCallChunk.name = undefined;
    }
    if (toolCallChunk.id === '') {
      toolCallChunk.id = undefined;
    } else if (
      tool_calls != null &&
      toolCallChunk.id != null &&
      toolCallChunk.name != null
    ) {
      tool_calls.push({
        args: {},
        id: toolCallChunk.id,
        name: toolCallChunk.name,
        type: ToolCallTypes.TOOL_CALL,
      });
    }
  }

  let stepId: string = _stepId;
  const alreadyDispatched =
    prevRunStep?.type === StepTypes.MESSAGE_CREATION &&
    graph.messageStepHasToolCalls.has(prevStepId);
  if (!alreadyDispatched && tool_calls?.length === toolCallChunks.length) {
    graph.dispatchMessageDelta(prevStepId, {
      content: [
        {
          type: ContentTypes.TEXT,
          text: '',
          tool_call_ids: tool_calls.map((tc) => tc.id ?? ''),
        },
      ],
    });
    graph.messageStepHasToolCalls.set(prevStepId, true);
    stepId = graph.dispatchRunStep(stepKey, {
      type: StepTypes.TOOL_CALLS,
      tool_calls,
    });
  }
  graph.dispatchRunStepDelta(stepId, {
    type: StepTypes.TOOL_CALLS,
    tool_calls: toolCallChunks,
  });
}

export const handleToolCalls = (
  toolCalls?: ToolCall[],
  metadata?: Record<string, unknown>,
  graph?: Graph
): void => {
  if (!graph || !metadata) {
    console.warn(`Graph or metadata not found in ${event} event`);
    return;
  }

  if (!toolCalls) {
    return;
  }

  if (toolCalls.length === 0) {
    return;
  }

  const stepKey = graph.getStepKey(metadata);

  for (const tool_call of toolCalls) {
    const toolCallId = tool_call.id ?? `toolu_${nanoid()}`;
    tool_call.id = toolCallId;
    if (!toolCallId || graph.toolCallStepIds.has(toolCallId)) {
      continue;
    }

    let prevStepId = '';
    let prevRunStep: t.RunStep | undefined;
    try {
      prevStepId = graph.getStepIdByKey(stepKey, graph.contentData.length - 1);
      prevRunStep = graph.getRunStep(prevStepId);
    } catch {
      // no previous step
    }

    const dispatchToolCallIds = (lastMessageStepId: string): void => {
      graph.dispatchMessageDelta(lastMessageStepId, {
        content: [
          {
            type: 'text',
            text: '',
            tool_call_ids: [toolCallId],
          },
        ],
      });
    };
    /* If the previous step exists and is a message creation */
    if (
      prevStepId &&
      prevRunStep &&
      prevRunStep.type === StepTypes.MESSAGE_CREATION
    ) {
      dispatchToolCallIds(prevStepId);
      graph.messageStepHasToolCalls.set(prevStepId, true);
      /* If the previous step doesn't exist or is not a message creation */
    } else if (
      !prevRunStep ||
      prevRunStep.type !== StepTypes.MESSAGE_CREATION
    ) {
      const messageId = getMessageId(stepKey, graph, true) ?? '';
      const stepId = graph.dispatchRunStep(stepKey, {
        type: StepTypes.MESSAGE_CREATION,
        message_creation: {
          message_id: messageId,
        },
      });
      dispatchToolCallIds(stepId);
      graph.messageStepHasToolCalls.set(prevStepId, true);
    }

    graph.dispatchRunStep(stepKey, {
      type: StepTypes.TOOL_CALLS,
      tool_calls: [tool_call],
    });
  }
};
