// src/types/tools.ts
import type { RunnableToolLike } from '@langchain/core/runnables';
import type { StructuredToolInterface } from '@langchain/core/tools';
import type { ToolCall } from '@langchain/core/messages/tool';

/** Replacement type for `import type { ToolCall } from '@langchain/core/messages/tool'` in order to have stringified args typed */
export type CustomToolCall = {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: string | Record<string, any>;
  id?: string;
  type?: 'tool_call';
}

export type GenericTool = StructuredToolInterface | RunnableToolLike;
export type ToolMap = Map<string, GenericTool>;
export type ToolRefs = {
  tools: GenericTool[];
  toolMap?: ToolMap;
};

export type ToolRefGenerator = (tool_calls: ToolCall[]) => ToolRefs;

export type ToolNodeOptions = {
  name?: string;
  tags?: string[];
  handleToolErrors?: boolean;
  loadRuntimeTools?: ToolRefGenerator;
};

export type ToolNodeConstructorParams = ToolRefs & ToolNodeOptions;