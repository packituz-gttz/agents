import dotenv from 'dotenv';
import { Processor } from '@/processor';
import type * as t from '@/types/graph';
import { GraphEvents } from '@/common/enum';

dotenv.config();

async function testStreaming() {
  let conversationHistory: string[][] = [];

  const customHandlers = {
    [GraphEvents.LLM_START]: {
      handle: (event: string, data: t.StreamEventData) => {
        console.log(event);
        console.dir(data, { depth: null });
      }
    },
    [GraphEvents.LLM_END]: {
      handle: (event: string, data: t.StreamEventData) => {
        console.log(event);
        console.dir(data, { depth: null });

        const response = data.output.generations[0][0].message.content;
        
        if (response.trim() !== '') {
          conversationHistory.push(["assistant", response]);
          console.log("Updated conversation history:", conversationHistory);
        }
      }
    },
    [GraphEvents.TOOL_END]: {
      handle: (event: string, data: t.StreamEventData) => {
        console.log(event);
        console.dir(data, { depth: null });
      }
    },
  };

  const processor = new Processor({ customHandlers });
  
  let config = { 
    configurable: { thread_id: "conversation-num-1" },
    streamMode: "values",
    version: "v1" as const,
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
