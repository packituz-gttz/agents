/**
 * Enum representing the various event types emitted during the execution of runnables.
 * These events provide real-time information about the progress and state of different components.
 *
 * @enum {string}
 */
export enum GraphEvents {
  /* Custom Events */
  /** Delta */
  THREAD_MESSAGE_DELTA = 'on_thread_message_delta',
  TOOL_CALL_DELTA = 'on_tool_call_delta',
  /* Official Events */

  /** Custom event, emitted by system */
  ON_CUSTOM_EVENT = 'on_custom_event',
  /** Emitted when a chat model starts processing. */
  CHAT_MODEL_START = 'on_chat_model_start',

  /** Emitted when a chat model streams a chunk of its response. */
  CHAT_MODEL_STREAM = 'on_chat_model_stream',

  /** Emitted when a chat model completes its processing. */
  CHAT_MODEL_END = 'on_chat_model_end',

  /** Emitted when a language model starts processing. */
  LLM_START = 'on_llm_start',

  /** Emitted when a language model streams a chunk of its response. */
  LLM_STREAM = 'on_llm_stream',

  /** Emitted when a language model completes its processing. */
  LLM_END = 'on_llm_end',

  /** Emitted when a chain starts processing. */
  CHAIN_START = 'on_chain_start',

  /** Emitted when a chain streams a chunk of its output. */
  CHAIN_STREAM = 'on_chain_stream',

  /** Emitted when a chain completes its processing. */
  CHAIN_END = 'on_chain_end',

  /** Emitted when a tool starts its operation. */
  TOOL_START = 'on_tool_start',

  /** Emitted when a tool completes its operation. */
  TOOL_END = 'on_tool_end',

  /** Emitted when a retriever starts its operation. */
  RETRIEVER_START = 'on_retriever_start',

  /** Emitted when a retriever completes its operation. */
  RETRIEVER_END = 'on_retriever_end',

  /** Emitted when a prompt starts processing. */
  PROMPT_START = 'on_prompt_start',

  /** Emitted when a prompt completes its processing. */
  PROMPT_END = 'on_prompt_end'
}

export enum Providers {
  OPENAI = 'openai',
  BEDROCK = 'bedrock',
  VERTEXAI = 'vertexai',
  AWS = 'amazon_bedrock',
  ANTHROPIC = 'anthropic',
  MISTRALAI = 'mistralai',
}

export enum GraphNodeKeys {
  TOOLS = 'tools',
  AGENT = 'agent',
}

export enum GraphNodeActions {
  TOOL_NODE = 'tool_node',
  CALL_MODEL = 'call_model',
  ROUTE_MESSAGE = 'route_message',
}

export enum CommonEvents {
  LANGGRAPH = 'LangGraph',
}

export declare enum StepTypes {
  TOOL_CALLS = 'tool_calls',
  MESSAGE_CREATION = 'message_creation'
}