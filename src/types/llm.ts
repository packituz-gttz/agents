// src/types/llm.ts
import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatMistralAI } from '@langchain/mistralai';
import { ChatBedrockConverse } from '@langchain/aws';
import { ChatVertexAI } from '@langchain/google-vertexai';
import { BedrockChat, BedrockChatFields } from '@langchain/community/chat_models/bedrock/web';
import type { ChatVertexAIInput } from '@langchain/google-vertexai';
import type { ChatBedrockConverseInput } from '@langchain/aws';
import type { ChatMistralAIInput } from '@langchain/mistralai';
import type { AnthropicInput } from '@langchain/anthropic';
import type { OpenAIInput } from '@langchain/openai';
import { Providers } from '@/common';

export type OpenAIClientOptions = Partial<OpenAIInput>;
export type AnthropicClientOptions = Partial<AnthropicInput>;
export type MistralAIClientOptions = Partial<ChatMistralAIInput>;
export type VertexAIClientOptions = Partial<ChatVertexAIInput>;
export type BedrockClientOptions = Partial<BedrockChatFields>;
export type BedrockConverseClientOptions = Partial<ChatBedrockConverseInput>;

export type ClientOptions =
  | OpenAIClientOptions
  | AnthropicClientOptions
  | MistralAIClientOptions
  | VertexAIClientOptions
  | BedrockClientOptions
  | BedrockConverseClientOptions;

export type ChatModel = typeof ChatAnthropic | typeof ChatOpenAI | typeof ChatMistralAI | typeof ChatVertexAI | typeof BedrockChat | typeof ChatBedrockConverse;

export type LLMConfig = {
  provider: Providers;
} & ClientOptions;

export type ChatModelInstance = ChatOpenAI | ChatAnthropic | ChatMistralAI | ChatVertexAI | BedrockChat | ChatBedrockConverse;

export type ChatModelConstructor = new (config: any) => ChatModelInstance;
