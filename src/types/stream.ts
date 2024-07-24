// src/types/stream.ts
import type { ToolCall, ToolCallChunk } from '@langchain/core/messages/tool';
import type { MessageContentComplex } from '@langchain/core/messages';
import { StepTypes } from '@/common/enum';

/** Event names are of the format: on_[runnable_type]_(start|stream|end).

Runnable types are one of:

llm - used by non chat models
chat_model - used by chat models
prompt -- e.g., ChatPromptTemplate
tool -- LangChain tools
chain - most Runnables are of this type
Further, the events are categorized as one of:

start - when the runnable starts
stream - when the runnable is streaming
end - when the runnable ends
start, stream and end are associated with slightly different data payload.

Please see the documentation for EventData for more details. */
export type EventName = string;

export type RunStep = {
  // id: string;
  // object: 'thread.run.step'; // Updated from 'run.step' # missing
  // created_at: number;
  // run_id: string;
  // assistant_id: string;
  // thread_id: string;
  type: StepTypes;
  // status: 'in_progress' | 'completed' | 'failed' | 'cancelled'; // Add other possible status values if needed
  // cancelled_at: number | null;
  // completed_at: number | null;
  // expires_at: number;
  // failed_at: number | null;
  // last_error: string | null;
  id: string; // #new
  index?: number; // #new
  stepDetails: StepDetails; // Updated to use StepDetails type
  usage: null | {
    // Define usage structure if it's ever non-null
    // prompt_tokens: number; // #new
    // completion_tokens: number; // #new
    // total_tokens: number; // #new
  };
};

/**
 * Represents a run step delta i.e. any changed fields on a run step during
 * streaming.
 */
export interface RunStepDeltaEvent {
  /**
   * The identifier of the run step, which can be referenced in API endpoints.
   */
  id: string;
  /**
   * The delta containing the fields that have changed on the run step.
   */
  delta: ToolCallDelta;
}

export type StepDetails =
  | MessageCreationDetails
  | ToolCallsDetails;

type MessageCreationDetails = {
  type: StepTypes.MESSAGE_CREATION;
  message_creation: {
    message_id: string;
  };
};

type ToolCallsDetails = {
  type: StepTypes.TOOL_CALLS;
  tool_calls: AgentToolCall[]; // #new
};

export type ToolCallDelta = {
  type: StepTypes.TOOL_CALLS;
  tool_calls: ToolCallChunk[]; // #new
};

export type AgentToolCall = {
  id: string; // #new
  type: 'function'; // #new
  function: {
    name: string; // #new
    arguments: string | object; // JSON string // #new
  };
} | ToolCall;

export interface ExtendedMessageContent {
  type?: string;
  text?: string;
  input?: string;
  index?: number;
  id?: string;
  name?: string;
}

/**
 * Represents a message delta i.e. any changed fields on a message during
 * streaming.
 */
export interface MessageDeltaEvent {
  /**
   * The identifier of the message, which can be referenced in API endpoints.
   */
  id: string;

  /**
   * The delta containing the fields that have changed on the Message.
   */
  delta: MessageDelta;
}

/**
 * The delta containing the fields that have changed on the Message.
 */
export interface MessageDelta {
  /**
   * The content of the message in array of text and/or images.
   */
  content?: MessageContentComplex[];
}

export type ContentType = 'text' | 'image_url' | string;
