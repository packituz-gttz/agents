import dotenv from 'dotenv';
import { Processor } from './processor';
import type * as t from './types/graph';

dotenv.config();

async function testStreaming() {
  let conversationHistory: string[][] = [];

  const customHandlers = {
    "on_llm_start": {
      handle: (event: string, data: t.StreamEventData) => {
        console.log(event);
        console.dir(data, { depth: null });
      }
    },
    "on_llm_end": {
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
    "on_tool_end": {
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

  conversationHistory.push(["user", "Make a search for the weather in new york today, which is 7/7/24"]);

  console.log("Test 2: Weather query");
  inputs = { 
    messages: [
      ...conversationHistory,
      
    ]
  };
  await processor.processStream(inputs, config);
  console.log("\n");
  console.dir(conversationHistory, { depth: null });
}

testStreaming();
