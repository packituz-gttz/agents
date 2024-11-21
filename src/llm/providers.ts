// src/llm/providers.ts
import { ChatOpenAI } from '@langchain/openai';
import { ChatOllama } from '@langchain/ollama';
import { ChatBedrockConverse } from '@langchain/aws';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatMistralAI } from '@langchain/mistralai';
import { ChatVertexAI } from '@langchain/google-vertexai';
import { BedrockChat } from '@langchain/community/chat_models/bedrock/web';
import type { ChatModelConstructorMap, ProviderOptionsMap, ChatModelMap } from '@/types';
import { Providers } from '@/common';
// import { CustomAnthropic } from '@/llm/anthropic/llm';

export const llmProviders: Partial<ChatModelConstructorMap> = {
  [Providers.OPENAI]: ChatOpenAI,
  [Providers.OLLAMA]: ChatOllama,
  [Providers.VERTEXAI]: ChatVertexAI,
  [Providers.BEDROCK_LEGACY]: BedrockChat,
  [Providers.MISTRALAI]: ChatMistralAI,
  [Providers.BEDROCK]: ChatBedrockConverse,
  // [Providers.ANTHROPIC]: CustomAnthropic,
  [Providers.ANTHROPIC]: ChatAnthropic,
};

export const manualToolStreamProviders = new Set<Providers | string>([Providers.ANTHROPIC, Providers.BEDROCK, Providers.OLLAMA]);

export const getChatModelClass = <P extends Providers>(
  provider: P
): new (config: ProviderOptionsMap[P]) => ChatModelMap[P] => {
  const ChatModelClass = llmProviders[provider];
  if (!ChatModelClass) {
    throw new Error(`Unsupported LLM provider: ${provider}`);
  }

  return ChatModelClass;
};