import { nanoid } from 'nanoid';
import type * as t from '@/types';
import { ContentTypes, GraphEvents, StepTypes } from '@/common';

type StreamHandlers = Partial<{
  [GraphEvents.ON_RUN_STEP]: ({ event, data}: { event: GraphEvents, data: t.RunStep }) => void;
  [GraphEvents.ON_MESSAGE_DELTA]: ({ event, data}: { event: GraphEvents, data: t.MessageDeltaEvent }) => void;
  [GraphEvents.ON_REASONING_DELTA]: ({ event, data}: { event: GraphEvents, data: t.ReasoningDeltaEvent }) => void;
}>

export const SEPARATORS = ['.', '?', '!', '۔', '。', '‥', ';', '¡', '¿', '\n', '```'];

export class SplitStreamHandler {
  private inCodeBlock = false;
  currentStepId?: string;
  currentMessageId?: string;
  currentType?: 'text' | 'think';
  currentLength = 0;
  reasoningKey: 'reasoning_content' | 'reasoning' = 'reasoning_content';
  currentIndex = -1;
  blockThreshold = 4500;
  runId: string;
  handlers?: StreamHandlers;
  constructor({
    runId,
    handlers,
    reasoningKey,
    blockThreshold,
  }: {
      runId: string,
      handlers: StreamHandlers
      blockThreshold?: number,
      reasoningKey?: 'reasoning_content' | 'reasoning',
    }) {
    this.runId = runId;
    this.handlers = handlers;
    if (reasoningKey) {
      this.reasoningKey = reasoningKey;
    }
    if (blockThreshold != null) {
      this.blockThreshold = blockThreshold;
    }
  }
  getMessageId = (): string | undefined => {
    const messageId = this.currentMessageId;
    if (messageId != null && messageId) {
      return messageId;
    }
    return undefined;
  };
  createMessageStep = (type?: 'text' | 'think'): [string, string] => {
    if (type && this.currentType !== type) {
      this.currentType = type;
    }
    this.currentLength = 0;
    this.currentIndex += 1;
    this.currentStepId = `step_${nanoid()}`;
    this.currentMessageId = `msg_${nanoid()}`;
    return [this.currentStepId, this.currentMessageId];
  };
  dispatchRunStep = (stepId: string, stepDetails: t.StepDetails): void => {
    const runStep: t.RunStep = {
      id: stepId,
      runId: this.runId,
      type: stepDetails.type,
      index: this.currentIndex,
      stepDetails,
      // usage: null,
    };
    this.handlers?.[GraphEvents.ON_RUN_STEP]?.({ event: GraphEvents.ON_RUN_STEP, data: runStep });
  };
  dispatchMessageDelta = (stepId: string, delta: t.MessageDelta): void => {
    const messageDelta: t.MessageDeltaEvent = {
      id: stepId,
      delta,
    };
    this.handlers?.[GraphEvents.ON_MESSAGE_DELTA]?.({ event: GraphEvents.ON_MESSAGE_DELTA, data: messageDelta });
  };
  handle(chunk?: t.CustomChunk): void {
    if (!chunk) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const content = chunk.choices?.[0]?.delta?.content ?? '';
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const reasoning_content = chunk.choices?.[0]?.delta?.[this.reasoningKey] ?? '';
    const isEmptyContent = typeof content === 'undefined' || !content.length || typeof content === 'string' && !content;
    const isEmptyReasoning = typeof reasoning_content === 'undefined' || !reasoning_content.length || typeof reasoning_content === 'string' && !reasoning_content;

    if (isEmptyContent && isEmptyReasoning) {
      return;
    }

    if (content.includes('```')) {
      this.inCodeBlock = !this.inCodeBlock;
    }

    this.currentLength += content.length;
    const message_id = this.getMessageId() ?? '';

    if (!message_id) {
      const [stepId, message_id] = this.createMessageStep();
      this.dispatchRunStep(stepId, {
        type: StepTypes.MESSAGE_CREATION,
        message_creation: {
          message_id,
        },
      });
    }

    const stepId = this.currentStepId ?? '';
    if (!stepId) {
      return;
    }

    this.dispatchMessageDelta(stepId, {
      content: [{
        type: ContentTypes.TEXT,
        text: content,
      }],
    });

    if (this.inCodeBlock) {
      return;
    }

    if (this.currentLength > this.blockThreshold && SEPARATORS.some(sep => content.includes(sep))) {
      const [newStepId, newMessageId] = this.createMessageStep();
      this.dispatchRunStep(newStepId, {
        type: StepTypes.MESSAGE_CREATION,
        message_creation: {
          message_id: newMessageId,
        },
      });
    }
  }
}