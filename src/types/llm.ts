import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatMistralAI } from "@langchain/mistralai";
import type { ChatMistralAIInput } from "@langchain/mistralai";
import type { AnthropicInput } from "@langchain/anthropic";
import type { OpenAIInput } from "@langchain/openai";
import { Providers } from '@/common';

export type CallOptions = OpenAIInput | AnthropicInput | ChatMistralAIInput;

export type ClientOptions = Partial<CallOptions>;

export type ChatModel = typeof ChatAnthropic | typeof ChatOpenAI | typeof ChatMistralAI;

export type LLMConfig = {
  provider: Providers;
} & ClientOptions;

export type ChatModelConstructor = new (config: ClientOptions) => ChatOpenAI | ChatAnthropic | ChatMistralAI;