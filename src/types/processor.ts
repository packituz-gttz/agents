// src/types/processor.ts
import type { StructuredTool } from '@langchain/core/tools';
import type { BaseMessage } from '@langchain/core/messages';
import type { ToolCall } from '@langchain/core/messages/tool';
import type * as g from '@/types/graph';
import type * as l from '@/types/llm';
import { StepTypes } from '@/common/enum';

export type StandardGraphConfig = {
  type: 'standard';
  tools?: StructuredTool[];
  llmConfig: l.LLMConfig;
};

export interface AgentStateChannels {
  messages: BaseMessage[];
  next: string;
  instructions?: string;
  additional_instructions?: string;
  [key: string]: unknown;
}

export interface Member {
  name: string;
  systemPrompt: string;
  tools: StructuredTool[];
  llmConfig: l.LLMConfig;
}

export type CollaborativeGraphConfig = {
  type: 'collaborative';
  members: Member[];
  supervisorConfig: { systemPrompt?: string; llmConfig: l.LLMConfig };
};

export type TaskManagerGraphConfig = {
  type: 'taskmanager';
  members: Member[];
  supervisorConfig: { systemPrompt?: string; llmConfig: l.LLMConfig };
};

export type ProcessorConfig = {
  graphConfig: StandardGraphConfig | CollaborativeGraphConfig | TaskManagerGraphConfig;
  customHandlers?: Record<string, g.EventHandler>;
};

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
  run_id: string;
  assistant_id: string;
  thread_id: string;
  type: StepTypes;
  // status: 'in_progress' | 'completed' | 'failed' | 'cancelled'; // Add other possible status values if needed
  // cancelled_at: number | null;
  // completed_at: number | null;
  // expires_at: number;
  // failed_at: number | null;
  // last_error: string | null;
  step_details: StepDetails; // Updated to use StepDetails type
  usage: null | {
    // Define usage structure if it's ever non-null
    // prompt_tokens: number; // #new
    // completion_tokens: number; // #new
    // total_tokens: number; // #new
  };
};

type StepDetails =
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
  id?: string;
  name?: string;
}
