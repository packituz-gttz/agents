import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatVertexAI } from "@langchain/google-vertexai";
import type { ChatVertexAIInput } from "@langchain/google-vertexai";
import type { ChatMistralAIInput } from "@langchain/mistralai";
import type { AnthropicInput } from "@langchain/anthropic";
import type { OpenAIInput } from "@langchain/openai";
import { Providers } from '@/common';

export type CallOptions = OpenAIInput | AnthropicInput | ChatMistralAIInput | ChatVertexAIInput;

export type ClientOptions = Partial<CallOptions>;

export type ChatModel = typeof ChatAnthropic | typeof ChatOpenAI | typeof ChatMistralAI | typeof ChatVertexAI;

export type LLMConfig = {
  provider: Providers;
} & ClientOptions;

export type ChatModelConstructor = new (config: ClientOptions) => ChatOpenAI | ChatAnthropic | ChatMistralAI | ChatVertexAI;