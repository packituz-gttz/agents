import dotenv from 'dotenv';
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import type * as t from '@/types/graph';
import { Processor, LLMConfig } from '@/processor';
import { GraphEvents } from '@/common/enum';

dotenv.config();

async function testStreaming() {
  let conversationHistory: string[][] = [];

  const customHandlers = {
    [GraphEvents.LLM_START]: {
      handle: (event: string, data: t.StreamEventData) => {
        console.dir(data, { depth: null });
      }
    },
    [GraphEvents.LLM_END]: {
      handle: (event: string, data: t.StreamEventData) => {
        console.dir(data, { depth: null });

        const response = data.output.generations[0][0].message.content;
        
        if (response.trim() !== '') {
          conversationHistory.push(["assistant", response]);
          console.log("Updated conversation history:", conversationHistory);
        }
      }
    },
    [GraphEvents.CHAT_MODEL_END]: {
      handle: (event: string, data: t.StreamEventData) => {
        const response = data?.output?.content;
        
        if (Array.isArray(response)) {
          console.dir(response, { depth: null });
        } else if (typeof response === 'string' && response.trim() !== '') {
          conversationHistory.push(["assistant", response]);
          console.log("Updated conversation history:", conversationHistory);
        }
      }
    },
    [GraphEvents.TOOL_END]: {
      handle: (event: string, data: t.StreamEventData) => {
        console.dir(data, { depth: null });
      }
    },
  };

  // const llmConfig: LLMConfig = {
  //   provider: 'openai',
  //   model: 'gpt-4',
  //   temperature: 0.7,
  //   // Add any other OpenAI-specific options here
  // };

  // Uncomment the following block to use Anthropic instead
  const llmConfig: LLMConfig = {
    provider: 'anthropic',
    model: 'claude-3-haiku-20240307',
    streaming: true,
    // Add any other Anthropic-specific options here
  };

  const processor = new Processor({ 
    tools: [new TavilySearchResults({})],
    customHandlers,
    llmConfig,
  });
  
  let config = { 
    configurable: { thread_id: "conversation-num-1" },
    streamMode: "values",
    version: "v2" as const,
  };

  console.log("Test 1: Initial greeting");

  conversationHistory.push(["user", "Hi I'm Jo."]);
  let inputs = { messages: conversationHistory };
  await processor.processStream(inputs, config);
  console.log("\n");

  console.log("Test 2: Weather query");
  conversationHistory.push(["user", "Make a search for the weather in new york today, which is 7/7/24. Make sure to always refer to me by name."]);
  inputs = { messages: conversationHistory };
  await processor.processStream(inputs, config);
  console.log("\n");
}

testStreaming();
