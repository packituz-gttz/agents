/* eslint-disable no-console */
// src/scripts/cli.ts
import { config } from 'dotenv';
import { HumanMessage, BaseMessage } from '@langchain/core/messages';
import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
import type * as t from '@/types';
import {
  ChatModelStreamHandler,
  DefaultLLMStreamHandler,
} from '@/stream';

import { getArgs } from '@/scripts/args';
import { Processor } from '@/processor';
import { GraphEvents, Providers } from '@/common';

const llmConfigs: Record<string, t.LLMConfig> = {
  openai: {
    provider: Providers.OPENAI,
    model: 'gpt-4o',
    temperature: 0.7,
  },
  anthropic: {
    provider: Providers.ANTHROPIC,
    model: 'claude-3-5-sonnet-20240620',
  },
  mistralai: {
    provider: Providers.MISTRALAI,
    model: 'mistral-large-latest',
  },
  vertexai: {
    provider: Providers.VERTEXAI,
    modelName: 'gemini-1.5-flash-001',
    streaming: true,
  },
  aws: {
    provider: Providers.AWS,
    model: 'anthropic.claude-3-sonnet-20240229-v1:0',
    region: process.env.BEDROCK_AWS_REGION,
    credentials: {
      accessKeyId: process.env.BEDROCK_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.BEDROCK_AWS_SECRET_ACCESS_KEY!,
    },
  },
};

export function getLLMConfig(provider: string): t.LLMConfig {
  const config = llmConfigs[provider];
  if (!config) {
    throw new Error(`Unsupported provider: ${provider}`);
  }
  return config;
}

config();

async function testStandardStreaming(): Promise<void> {
  const { userName, location, provider, currentDate } = await getArgs();
  const conversationHistory: BaseMessage[] = [];

  const customHandlers = {
    [GraphEvents.LLM_STREAM]: new DefaultLLMStreamHandler(),
    [GraphEvents.CHAT_MODEL_STREAM]: new ChatModelStreamHandler(),
    [GraphEvents.LLM_START]: {
      handle: (_event: string, data: t.StreamEventData): void => {
        console.dir(data, { depth: null });
      }
    },
    [GraphEvents.LLM_END]: {
      handle: (_event: string, data: t.StreamEventData): void => {
        console.dir(data, { depth: null });
      }
    },
    [GraphEvents.CHAT_MODEL_END]: {
      handle: (_event: string, _data: t.StreamEventData): void => {
        // Intentionally left empty
      }
    },
    [GraphEvents.TOOL_END]: {
      handle: (_event: string, data: t.StreamEventData): void => {
        console.dir(data, { depth: null });
      }
    },
  };

  const llmConfig = getLLMConfig(provider);

  const processor = await Processor.create<t.IState>({
    graphConfig: {
      type: 'standard',
      llmConfig,
      tools: [new TavilySearchResults()],
    },
    customHandlers,
  });

  const config = {
    configurable: { thread_id: 'conversation-num-1' },
    streamMode: 'values',
    version: 'v2' as const,
  };

  console.log(' Test 1: Initial greeting');

  conversationHistory.push(new HumanMessage(`Hi I'm ${userName}.`));
  let inputs = {
    messages: conversationHistory,
    instructions: 'You are a friendly AI assistant. Always address the user by their name.',
    additional_instructions: `The user's name is ${userName} and they are located in ${location}.`
  };
  const finalMessage = await processor.processStream(inputs, config);
  if (finalMessage) {
    conversationHistory.push(finalMessage);
  }

  console.log(' Test 2: Weather query');

  const userMessage = `
  Make a search for the weather in ${location} today, which is ${currentDate}.
  Make sure to always refer to me by name.
  After giving me a thorough summary, tell me a joke about the weather forecast we went over.
  `;

  conversationHistory.push(new HumanMessage(userMessage));

  inputs = {
    messages: conversationHistory,
    instructions: 'You are a friendly AI assistant with expertise in weather forecasting. Always address the user by their name.',
    additional_instructions: `The user's name is ${userName} and they are located in ${location}. Today's date is ${currentDate}.`
  };
  const finalMessage2 = await processor.processStream(inputs, config);
  if (finalMessage2) {
    conversationHistory.push(finalMessage2);
    console.dir(conversationHistory, { depth: null });
  }
}

testStandardStreaming().catch(console.error);
