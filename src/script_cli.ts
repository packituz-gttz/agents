// src/script_cli.ts
import yargs from 'yargs';
import dotenv from 'dotenv';
import { hideBin } from 'yargs/helpers';
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import type * as t from '@/types';
import {
  ChatModelStreamHandler,
  DefaultLLMStreamHandler,
} from '@/stream';
import { GraphEvents, Providers } from '@/common';
import { Processor } from '@/processor';

dotenv.config();

const argv = yargs(hideBin(process.argv))
  .option('name', {
    alias: 'n',
    type: 'string',
    description: 'User name',
    default: 'Jo'
  })
  .option('location', {
    alias: 'l',
    type: 'string',
    description: 'User location',
    default: 'New York'
  })
  .option('provider', {
    alias: 'p',
    type: 'string',
    description: 'LLM provider',
    choices: ['openai', 'anthropic', 'mistralai', 'vertexai', 'aws'],
    default: 'openai'
  })
  .help()
  .alias('help', 'h')
  .argv;

const args = await argv;
const userName = args.name as string;
const location = args.location as string;
const provider = args.provider as string;
const currentDate = new Date().toLocaleString();

function getLLMConfig(provider: string): t.LLMConfig {
  switch (provider) {
    case 'openai':
      return {
        provider: Providers.OPENAI,
        model: 'gpt-4o',
        temperature: 0.7,
      };
    case 'anthropic':
      return {
        provider: Providers.ANTHROPIC,
        model: 'claude-3-5-sonnet-20240620',
      };
    case 'mistralai':
      return {
        provider: Providers.MISTRALAI,
        model: 'mistral-large-latest',
      };
    case 'vertexai':
      return {
        provider: Providers.VERTEXAI,
        modelName: 'gemini-1.5-flash-001',
        streaming: true,
      };
    case 'aws':
      return {
        provider: Providers.AWS,
        model: 'anthropic.claude-3-sonnet-20240229-v1:0',
        region: process.env.BEDROCK_AWS_REGION,
        credentials: {
          accessKeyId: process.env.BEDROCK_AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.BEDROCK_AWS_SECRET_ACCESS_KEY!,
        },
      };
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

async function testStandardStreaming() {
  let conversationHistory: BaseMessage[] = [];

  const customHandlers = {
    [GraphEvents.LLM_STREAM]: new DefaultLLMStreamHandler(),
    [GraphEvents.CHAT_MODEL_STREAM]: new ChatModelStreamHandler(),
    [GraphEvents.LLM_START]: {
      handle: (event: string, data: t.StreamEventData) => {
        console.dir(data, { depth: null });
      }
    },
    [GraphEvents.LLM_END]: {
      handle: (event: string, data: t.StreamEventData) => {
        console.dir(data, { depth: null });
      }
    },
    [GraphEvents.CHAT_MODEL_END]: {
      handle: (event: string, data: t.StreamEventData) => {
      }
    },
    [GraphEvents.TOOL_END]: {
      handle: (event: string, data: t.StreamEventData) => {
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
  
  let config = { 
    configurable: { thread_id: "conversation-num-1" },
    streamMode: "values",
    version: "v2" as const,
  };

  console.log("\nTest 1: Initial greeting");

  conversationHistory.push(new HumanMessage(`Hi I'm ${userName}.`));
  let inputs = { 
    messages: conversationHistory,
    instructions: "You are a friendly AI assistant. Always address the user by their name.",
    additional_instructions: `The user's name is ${userName} and they are located in ${location}.`
  };
  const finalMessage = await processor.processStream(inputs, config);
  if (finalMessage) {
    conversationHistory.push(finalMessage);
  }

  console.log("\nTest 2: Weather query");

  const userMessage = `
  Make a search for the weather in ${location} today, which is ${currentDate}.
  Make sure to always refer to me by name.
  After giving me a thorough summary, tell me a joke about the weather forecast we went over.
  `;

  conversationHistory.push(new HumanMessage(userMessage));

  inputs = { 
    messages: conversationHistory,
    instructions: "You are a friendly AI assistant with expertise in weather forecasting. Always address the user by their name.",
    additional_instructions: `The user's name is ${userName} and they are located in ${location}. Today's date is ${currentDate}.`
  };
  const finalMessage2 = await processor.processStream(inputs, config);
  if (finalMessage2) {
    conversationHistory.push(finalMessage2);
    console.dir(conversationHistory, { depth: null });
  }
}

testStandardStreaming();
