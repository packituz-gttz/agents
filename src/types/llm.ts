import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import type { AnthropicInput } from "@langchain/anthropic";
import type { OpenAIInput } from "@langchain/openai";

export type LLMProvider = 'openai' | 'anthropic';

export type CallOptions = OpenAIInput | AnthropicInput;

export type LLMConfig = {
  provider: LLMProvider;
} & Partial<CallOptions>;

export type ChatModel = typeof ChatAnthropic | typeof ChatOpenAI;