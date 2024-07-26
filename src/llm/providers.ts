// src/llm/providers.ts
import { ChatOpenAI } from '@langchain/openai';
import { ChatBedrockConverse } from '@langchain/aws';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatMistralAI } from '@langchain/mistralai';
import { ChatVertexAI } from '@langchain/google-vertexai';
import { BedrockChat } from '@langchain/community/chat_models/bedrock/web';
import type * as t from '@/types';
import { Providers } from '@/common';

export const llmProviders: Record<Providers, t.ChatModelConstructor> = {
  [Providers.OPENAI]: ChatOpenAI,
  [Providers.VERTEXAI]: ChatVertexAI,
  [Providers.BEDROCK]: BedrockChat as unknown as t.ChatModelConstructor,
  [Providers.MISTRALAI]: ChatMistralAI,
  [Providers.AWS]: ChatBedrockConverse as unknown as t.ChatModelConstructor,
  [Providers.ANTHROPIC]: ChatAnthropic,
};

export const getChatModelClass = (provider: Providers): t.ChatModelConstructor => {
  const ChatModelClass = llmProviders[provider];
  if (!ChatModelClass) {
    throw new Error(`Unsupported LLM provider: ${provider}`);
  }

  return ChatModelClass;
};
