// src/types/llm.ts
import { ChatOpenAI } from '@langchain/openai';
import { ChatOllama } from '@langchain/ollama';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatMistralAI } from '@langchain/mistralai';
import { ChatBedrockConverse } from '@langchain/aws';
import { ChatVertexAI } from '@langchain/google-vertexai';
import { BedrockChat } from '@langchain/community/chat_models/bedrock/web';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import type { Runnable } from '@langchain/core/runnables';
import type { StructuredTool } from '@langchain/core/tools';
import type { BindToolsInput } from '@langchain/core/language_models/chat_models';
import type { BedrockChatFields } from '@langchain/community/chat_models/bedrock/web';
import type { ChatOpenAIFields } from '@langchain/openai';
import type { OpenAI as OpenAIClient } from 'openai';
import type { GoogleGenerativeAIChatInput } from '@langchain/google-genai';
import type { ChatVertexAIInput } from '@langchain/google-vertexai';
import type { ChatBedrockConverseInput } from '@langchain/aws';
import type { ChatMistralAIInput } from '@langchain/mistralai';
import type { AnthropicInput } from '@langchain/anthropic';
import type { ChatOllamaInput } from '@langchain/ollama';
import { Providers } from '@/common';

export type ChatOpenAIToolType = BindToolsInput | OpenAIClient.ChatCompletionTool;
export type CommonToolType = StructuredTool | ChatOpenAIToolType;

export type OpenAIClientOptions = ChatOpenAIFields;
export type OllamaClientOptions = ChatOllamaInput;
export type AnthropicClientOptions = AnthropicInput;
export type MistralAIClientOptions = ChatMistralAIInput;
export type VertexAIClientOptions = ChatVertexAIInput;
export type BedrockClientOptions = BedrockChatFields;
export type BedrockConverseClientOptions = ChatBedrockConverseInput;
export type GoogleClientOptions = GoogleGenerativeAIChatInput;

export type ClientOptions = OpenAIClientOptions | OllamaClientOptions | AnthropicClientOptions | MistralAIClientOptions | VertexAIClientOptions | BedrockClientOptions | BedrockConverseClientOptions | GoogleClientOptions;

export type LLMConfig = {
  provider: Providers;
} & ClientOptions;

export type ProviderOptionsMap = {
  [Providers.OPENAI]: OpenAIClientOptions;
  [Providers.OLLAMA]: OllamaClientOptions;
  [Providers.ANTHROPIC]: AnthropicClientOptions;
  [Providers.MISTRALAI]: MistralAIClientOptions;
  [Providers.VERTEXAI]: VertexAIClientOptions;
  [Providers.BEDROCK_LEGACY]: BedrockClientOptions;
  [Providers.BEDROCK]: BedrockConverseClientOptions;
  [Providers.GOOGLE]: GoogleClientOptions;
};

export type ChatModelMap = {
  [Providers.OPENAI]: ChatOpenAI;
  [Providers.OLLAMA]: ChatOllama;
  [Providers.ANTHROPIC]: ChatAnthropic;
  [Providers.MISTRALAI]: ChatMistralAI;
  [Providers.VERTEXAI]: ChatVertexAI;
  [Providers.BEDROCK_LEGACY]: BedrockChat;
  [Providers.BEDROCK]: ChatBedrockConverse;
  [Providers.GOOGLE]: ChatGoogleGenerativeAI;
};

export type ChatModelConstructorMap = {
  [P in Providers]: new (config: ProviderOptionsMap[P]) => ChatModelMap[P];
};

export type ChatModelInstance = ChatModelMap[Providers];

export type ModelWithTools = ChatModelInstance & {
  bindTools(tools: CommonToolType[]): Runnable;
}