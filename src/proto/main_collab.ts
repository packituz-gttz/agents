// src/collaborative_main.ts
import dotenv from 'dotenv';
import { HumanMessage } from "@langchain/core/messages";
import type * as t from '@/types';
import { CollaborativeProcessor } from '@/collab';
import { GraphEvents } from '@/common';

dotenv.config();

async function testCollaborativeStreaming() {
  const customHandlers = {
    [GraphEvents.LLM_START]: {
      handle: (event: string, data: t.StreamEventData) => {
        console.log("LLM Start:", event);
        console.dir(data, { depth: null });
      }
    },
    [GraphEvents.LLM_END]: {
      handle: (event: string, data: t.StreamEventData) => {
        console.log("LLM End:", event);
        console.dir(data, { depth: null });
      }
    },
    [GraphEvents.CHAT_MODEL_END]: {
      handle: (event: string, data: t.StreamEventData) => {
        console.log("Chat Model End:", event);
        console.dir(data, { depth: null });
      }
    },
    [GraphEvents.TOOL_END]: {
      handle: (event: string, data: t.StreamEventData) => {
        console.log("Tool End:", event);
        console.dir(data, { depth: null });
      }
    },
  };

  const collaborativeProcessor = new CollaborativeProcessor(customHandlers);
  await collaborativeProcessor.initialize(); // Add this line

  const config = { 
    configurable: { thread_id: "collaborative-conversation-1" },
    streamMode: "values",
    version: "v2" as const,
  };

  console.log("\nCollaborative Test: Create a chart");

  const input = {
    messages: [new HumanMessage("Create a chart showing the population growth of the top 5 most populous countries over the last 50 years.")],
  };

  await collaborativeProcessor.processStream(input, config);
}

async function main() {
  await testCollaborativeStreaming();
}

main().catch(console.error);