// src/types/run.ts
import type * as z from 'zod';
import type { BaseMessage } from '@langchain/core/messages';
import type { StructuredTool } from '@langchain/core/tools';
import type * as e from '@/common/enum';
import type * as g from '@/types/graph';
import type * as t from '@/types/tools';
import type * as l from '@/types/llm';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ZodObjectAny = z.ZodObject<any, any, any, any>;

export type StandardGraphConfig = {
  runId?: string;
  type?: 'standard';
  provider?: e.Providers;
  instructions?: string;
  llmConfig: l.LLMConfig;
  tools?: t.GenericTool[];
  toolMap?: t.ToolMap;
  additional_instructions?: string;
  clientOptions?: Record<string, unknown>;
};

export interface AgentStateChannels {
  messages: BaseMessage[];
  next: string;
  [key: string]: unknown;
  instructions?: string;
  additional_instructions?: string;
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

export type RunConfig = {
  graphConfig: StandardGraphConfig | CollaborativeGraphConfig | TaskManagerGraphConfig;
  customHandlers?: Record<string, g.EventHandler>;
  returnContent?: boolean;
  runId?: string;
};
