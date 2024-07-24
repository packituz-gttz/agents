// src/types/processor.ts
import type { BaseMessage } from '@langchain/core/messages';
import type { StructuredTool } from '@langchain/core/tools';
import type * as g from '@/types/graph';
import type * as l from '@/types/llm';

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
