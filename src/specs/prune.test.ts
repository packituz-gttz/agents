// src/specs/prune.test.ts
import { config } from 'dotenv';
config();
import { HumanMessage, AIMessage, SystemMessage, BaseMessage } from '@langchain/core/messages';
import type { RunnableConfig } from '@langchain/core/runnables';
import type { UsageMetadata } from '@langchain/core/messages';
import type * as t from '@/types';
import { GraphEvents, Providers } from '@/common';
import { getLLMConfig } from '@/utils/llmConfig';
import { Run } from '@/run';
import { createPruneMessages } from '@/messages/prune';

// Create a simple token counter for testing
const createTestTokenCounter = (): t.TokenCounter => {
  // This simple token counter just counts characters as tokens for predictable testing
  return (message: BaseMessage): number => {
    // Use type assertion to help TypeScript understand the type
    const content = message.content as string | Array<any> | undefined;
    
    // Handle string content
    if (typeof content === 'string') {
      return content.length;
    }
    
    // Handle array content
    if (Array.isArray(content)) {
      let totalLength = 0;
      
      for (const item of content) {
        if (typeof item === 'string') {
          totalLength += item.length;
        } else if (item && typeof item === 'object') {
          if ('text' in item && typeof item.text === 'string') {
            totalLength += item.text.length;
          }
        }
      }
      
      return totalLength;
    }
    
    // Default case - if content is null, undefined, or any other type
    return 0;
  };
};

// Since the internal functions in prune.ts are not exported, we'll reimplement them here for testing
// This is based on the implementation in src/messages/prune.ts
function calculateTotalTokens(usage: Partial<UsageMetadata>): UsageMetadata {
  const baseInputTokens = Number(usage.input_tokens) || 0;
  const cacheCreation = Number(usage.input_token_details?.cache_creation) || 0;
  const cacheRead = Number(usage.input_token_details?.cache_read) || 0;
  
  const totalInputTokens = baseInputTokens + cacheCreation + cacheRead;
  const totalOutputTokens = Number(usage.output_tokens) || 0;

  return {
    input_tokens: totalInputTokens,
    output_tokens: totalOutputTokens,
    total_tokens: totalInputTokens + totalOutputTokens
  };
}

function getMessagesWithinTokenLimit({
  messages: _messages,
  maxContextTokens,
  indexTokenCountMap,
  startOnMessageType,
}: {
  messages: BaseMessage[];
  maxContextTokens: number;
  indexTokenCountMap: Record<string, number>;
  startOnMessageType?: string;
}): {
  context: BaseMessage[];
  remainingContextTokens: number;
  messagesToRefine: BaseMessage[];
  summaryIndex: number;
} {
  // Every reply is primed with <|start|>assistant<|message|>, so we
  // start with 3 tokens for the label after all messages have been counted.
  let summaryIndex = -1;
  let currentTokenCount = 3;
  const instructions = _messages?.[0]?.getType() === 'system' ? _messages[0] : undefined;
  const instructionsTokenCount = instructions != null ? indexTokenCountMap[0] : 0;
  let remainingContextTokens = maxContextTokens - instructionsTokenCount;
  const messages = [..._messages];
  const context: BaseMessage[] = [];

  if (currentTokenCount < remainingContextTokens) {
    let currentIndex = messages.length;
    while (messages.length > 0 && currentTokenCount < remainingContextTokens && currentIndex > 1) {
      currentIndex--;
      if (messages.length === 1 && instructions) {
        break;
      }
      const poppedMessage = messages.pop();
      if (!poppedMessage) continue;
      
      const tokenCount = indexTokenCountMap[currentIndex] || 0;

      if ((currentTokenCount + tokenCount) <= remainingContextTokens) {
        context.push(poppedMessage);
        currentTokenCount += tokenCount;
      } else {
        messages.push(poppedMessage);
        break;
      }
    }
    
    // If startOnMessageType is specified, discard messages until we find one of the required type
    if (startOnMessageType && context.length > 0) {
      const requiredTypeIndex = context.findIndex(msg => msg.getType() === startOnMessageType);
      
      if (requiredTypeIndex > 0) {
        // If we found a message of the required type, discard all messages before it
        const remainingMessages = context.slice(requiredTypeIndex);
        context.length = 0; // Clear the array
        context.push(...remainingMessages);
      }
    }
  }

  if (instructions && _messages.length > 0) {
    context.push(_messages[0] as BaseMessage);
    messages.shift();
  }

  const prunedMemory = messages;
  summaryIndex = prunedMemory.length - 1;
  remainingContextTokens -= currentTokenCount;

  return {
    summaryIndex,
    remainingContextTokens,
    context: context.reverse(),
    messagesToRefine: prunedMemory,
  };
}

function checkValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && value > 0;
}

describe('Prune Messages Tests', () => {
  jest.setTimeout(30000);
  
  describe('calculateTotalTokens', () => {
    it('should calculate total tokens correctly with all fields present', () => {
      const usage: Partial<UsageMetadata> = {
        input_tokens: 100,
        output_tokens: 50,
        input_token_details: {
          cache_creation: 10,
          cache_read: 5
        }
      };
      
      const result = calculateTotalTokens(usage);
      
      expect(result.input_tokens).toBe(115); // 100 + 10 + 5
      expect(result.output_tokens).toBe(50);
      expect(result.total_tokens).toBe(165); // 115 + 50
    });
    
    it('should handle missing fields gracefully', () => {
      const usage: Partial<UsageMetadata> = {
        input_tokens: 100,
        output_tokens: 50
      };
      
      const result = calculateTotalTokens(usage);
      
      expect(result.input_tokens).toBe(100);
      expect(result.output_tokens).toBe(50);
      expect(result.total_tokens).toBe(150);
    });
    
    it('should handle empty usage object', () => {
      const usage: Partial<UsageMetadata> = {};
      
      const result = calculateTotalTokens(usage);
      
      expect(result.input_tokens).toBe(0);
      expect(result.output_tokens).toBe(0);
      expect(result.total_tokens).toBe(0);
    });
  });
  
  describe('getMessagesWithinTokenLimit', () => {
    it('should include all messages when under token limit', () => {
      const messages = [
        new SystemMessage('System instruction'),
        new HumanMessage('Hello'),
        new AIMessage('Hi there')
      ];
      
      const indexTokenCountMap = {
        0: 17, // "System instruction"
        1: 5,  // "Hello"
        2: 8   // "Hi there"
      };
      
      const result = getMessagesWithinTokenLimit({
        messages,
        maxContextTokens: 100,
        indexTokenCountMap
      });
      
      expect(result.context.length).toBe(3);
      expect(result.context[0]).toBe(messages[0]); // System message
      expect(result.context[0].getType()).toBe('system'); // System message
      expect(result.remainingContextTokens).toBe(100 - 17 - 5 - 8 - 3); // -3 for the assistant label tokens
      expect(result.messagesToRefine.length).toBe(0);
    });
    
    it('should prune oldest messages when over token limit', () => {
      const messages = [
        new SystemMessage('System instruction'),
        new HumanMessage('Message 1'),
        new AIMessage('Response 1'),
        new HumanMessage('Message 2'),
        new AIMessage('Response 2')
      ];
      
      const indexTokenCountMap = {
        0: 17, // "System instruction"
        1: 9,  // "Message 1"
        2: 10, // "Response 1"
        3: 9,  // "Message 2"
        4: 10  // "Response 2"
      };
      
      // Set a limit that can only fit the system message and the last two messages
      const result = getMessagesWithinTokenLimit({
        messages,
        maxContextTokens: 40,
        indexTokenCountMap
      });
      
      // Should include system message and the last two messages
      expect(result.context.length).toBe(3);
      expect(result.context[0]).toBe(messages[0]); // System message
      expect(result.context[0].getType()).toBe('system'); // System message
      expect(result.context[1]).toBe(messages[3]); // Message 2
      expect(result.context[2]).toBe(messages[4]); // Response 2
      
      // Should have the first two messages in messagesToRefine
      expect(result.messagesToRefine.length).toBe(2);
      expect(result.messagesToRefine[0]).toBe(messages[1]); // Message 1
      expect(result.messagesToRefine[1]).toBe(messages[2]); // Response 1
    });
    
    it('should always include system message even when at token limit', () => {
      const messages = [
        new SystemMessage('System instruction'),
        new HumanMessage('Hello'),
        new AIMessage('Hi there')
      ];
      
      const indexTokenCountMap = {
        0: 17, // "System instruction"
        1: 5,  // "Hello"
        2: 8   // "Hi there"
      };
      
      // Set a limit that can only fit the system message
      const result = getMessagesWithinTokenLimit({
        messages,
        maxContextTokens: 20,
        indexTokenCountMap
      });
      
      expect(result.context.length).toBe(1);
      expect(result.context[0]).toBe(messages[0]); // System message
      
      expect(result.messagesToRefine.length).toBe(2);
    });

    it('should start context with a specific message type when startOnMessageType is specified', () => {
      const messages = [
        new SystemMessage('System instruction'),
        new AIMessage('AI message 1'),
        new HumanMessage('Human message 1'),
        new AIMessage('AI message 2'),
        new HumanMessage('Human message 2')
      ];
      
      const indexTokenCountMap = {
        0: 17, // "System instruction"
        1: 12, // "AI message 1"
        2: 15, // "Human message 1"
        3: 12, // "AI message 2"
        4: 15  // "Human message 2"
      };
      
      // Set a limit that can fit all messages
      const result = getMessagesWithinTokenLimit({
        messages,
        maxContextTokens: 100,
        indexTokenCountMap,
        startOnMessageType: 'human'
      });
      
      // All messages should be included since we're under the token limit
      expect(result.context.length).toBe(5);
      expect(result.context[0]).toBe(messages[0]); // System message
      expect(result.context[1]).toBe(messages[1]); // AI message 1
      expect(result.context[2]).toBe(messages[2]); // Human message 1
      expect(result.context[3]).toBe(messages[3]); // AI message 2
      expect(result.context[4]).toBe(messages[4]); // Human message 2
      
      // All messages should be included since we're under the token limit
      expect(result.messagesToRefine.length).toBe(0);
    });

    it('should keep all messages if no message of required type is found', () => {
      const messages = [
        new SystemMessage('System instruction'),
        new AIMessage('AI message 1'),
        new AIMessage('AI message 2')
      ];
      
      const indexTokenCountMap = {
        0: 17, // "System instruction"
        1: 12, // "AI message 1"
        2: 12  // "AI message 2"
      };
      
      // Set a limit that can fit all messages
      const result = getMessagesWithinTokenLimit({
        messages,
        maxContextTokens: 100,
        indexTokenCountMap,
        startOnMessageType: 'human'
      });
      
      // Should include all messages since no human messages exist to start from
      expect(result.context.length).toBe(3);
      expect(result.context[0]).toBe(messages[0]); // System message
      expect(result.context[1]).toBe(messages[1]); // AI message 1
      expect(result.context[2]).toBe(messages[2]); // AI message 2
      
      expect(result.messagesToRefine.length).toBe(0);
    });
  });
  
  describe('checkValidNumber', () => {
    it('should return true for valid positive numbers', () => {
      expect(checkValidNumber(5)).toBe(true);
      expect(checkValidNumber(1.5)).toBe(true);
      expect(checkValidNumber(Number.MAX_SAFE_INTEGER)).toBe(true);
    });
    
    it('should return false for zero, negative numbers, and NaN', () => {
      expect(checkValidNumber(0)).toBe(false);
      expect(checkValidNumber(-5)).toBe(false);
      expect(checkValidNumber(NaN)).toBe(false);
    });
    
    it('should return false for non-number types', () => {
      expect(checkValidNumber('5')).toBe(false);
      expect(checkValidNumber(null)).toBe(false);
      expect(checkValidNumber(undefined)).toBe(false);
      expect(checkValidNumber({})).toBe(false);
      expect(checkValidNumber([])).toBe(false);
    });
  });
  
  describe('createPruneMessages', () => {
    it('should return all messages when under token limit', () => {
      const tokenCounter = createTestTokenCounter();
      const messages = [
        new SystemMessage('System instruction'),
        new HumanMessage('Hello'),
        new AIMessage('Hi there')
      ];
      
      const indexTokenCountMap = {
        0: tokenCounter(messages[0]),
        1: tokenCounter(messages[1]),
        2: tokenCounter(messages[2])
      };
      
      const pruneMessages = createPruneMessages({
        maxTokens: 100,
        startIndex: 0,
        tokenCounter,
        indexTokenCountMap
      });
      
      const result = pruneMessages({ messages });
      
      expect(result.context.length).toBe(3);
      expect(result.context).toEqual(messages);
    });
    
    it('should prune messages when over token limit', () => {
      const tokenCounter = createTestTokenCounter();
      const messages = [
        new SystemMessage('System instruction'),
        new HumanMessage('Message 1'),
        new AIMessage('Response 1'),
        new HumanMessage('Message 2'),
        new AIMessage('Response 2')
      ];
      
      const indexTokenCountMap = {
        0: tokenCounter(messages[0]),
        1: tokenCounter(messages[1]),
        2: tokenCounter(messages[2]),
        3: tokenCounter(messages[3]),
        4: tokenCounter(messages[4])
      };
      
      // Set a limit that can only fit the system message and the last two messages
      const pruneMessages = createPruneMessages({
        maxTokens: 40,
        startIndex: 0,
        tokenCounter,
        indexTokenCountMap
      });
      
      const result = pruneMessages({ messages });
      
      // Should include system message and the last two messages
      expect(result.context.length).toBe(3);
      expect(result.context[0]).toBe(messages[0]); // System message
      expect(result.context[1]).toBe(messages[3]); // Message 2
      expect(result.context[2]).toBe(messages[4]); // Response 2
    });

    it('should respect startOnMessageType parameter', () => {
      const tokenCounter = createTestTokenCounter();
      const messages = [
        new SystemMessage('System instruction'),
        new AIMessage('AI message 1'),
        new HumanMessage('Human message 1'),
        new AIMessage('AI message 2'),
        new HumanMessage('Human message 2')
      ];
      
      const indexTokenCountMap = {
        0: tokenCounter(messages[0]),
        1: tokenCounter(messages[1]),
        2: tokenCounter(messages[2]),
        3: tokenCounter(messages[3]),
        4: tokenCounter(messages[4])
      };
      
      // Set a limit that can fit all messages
      const pruneMessages = createPruneMessages({
        maxTokens: 100,
        startIndex: 0,
        tokenCounter,
        indexTokenCountMap: { ...indexTokenCountMap }
      });
      
      const result = pruneMessages({ 
        messages,
        startOnMessageType: 'human'
      });
      
      // All messages should be included since we're under the token limit
      expect(result.context.length).toBe(5);
      expect(result.context[0]).toBe(messages[0]); // System message
      expect(result.context[1]).toBe(messages[1]); // AI message 1
      expect(result.context[2]).toBe(messages[2]); // Human message 1
      expect(result.context[3]).toBe(messages[3]); // AI message 2
      expect(result.context[4]).toBe(messages[4]); // Human message 2
    });
    
    it('should update token counts when usage metadata is provided', () => {
      const tokenCounter = createTestTokenCounter();
      const messages = [
        new SystemMessage('System instruction'),
        new HumanMessage('Hello'),
        new AIMessage('Hi there')
      ];
      
      const indexTokenCountMap = {
        0: tokenCounter(messages[0]),
        1: tokenCounter(messages[1]),
        2: tokenCounter(messages[2])
      };
      
      const pruneMessages = createPruneMessages({
        maxTokens: 100,
        startIndex: 0,
        tokenCounter,
        indexTokenCountMap: { ...indexTokenCountMap }
      });
      
      // Provide usage metadata that indicates different token counts
      const usageMetadata: Partial<UsageMetadata> = {
        input_tokens: 50,
        output_tokens: 25,
        total_tokens: 75
      };
      
      const result = pruneMessages({ 
        messages,
        usageMetadata
      });
      
      // The function should have updated the indexTokenCountMap based on the usage metadata
      expect(result.indexTokenCountMap).not.toEqual(indexTokenCountMap);
      
      // The total of all values in indexTokenCountMap should equal the total_tokens from usageMetadata
      const totalTokens = Object.values(result.indexTokenCountMap).reduce((a, b) => a + b, 0);
      expect(totalTokens).toBe(75);
    });
  });
  
  describe('Integration with Run', () => {
    it('should initialize Run with custom token counter and process messages', async () => {
      const provider = Providers.OPENAI;
      const llmConfig = getLLMConfig(provider);
      const tokenCounter = createTestTokenCounter();
      
      const run = await Run.create<t.IState>({
        runId: 'test-prune-run',
        graphConfig: {
          type: 'standard',
          llmConfig,
          instructions: 'You are a helpful assistant.',
        },
        returnContent: true,
      });
      
      // Override the model to use a fake LLM
      run.Graph?.overrideTestModel(['This is a test response'], 1);
      
      const messages = [
        new HumanMessage('Hello, how are you?')
      ];
      
      const indexTokenCountMap = {
        0: tokenCounter(messages[0])
      };
      
      const config: Partial<RunnableConfig> & { version: 'v1' | 'v2'; streamMode: string } = {
        configurable: {
          thread_id: 'test-thread',
        },
        streamMode: 'values',
        version: 'v2' as const,
      };
      
      await run.processStream(
        { messages },
        config,
        {
          maxContextTokens: 1000,
          indexTokenCountMap,
          tokenCounter,
        }
      );
      
      const finalMessages = run.getRunMessages();
      expect(finalMessages).toBeDefined();
      expect(finalMessages?.length).toBeGreaterThan(0);
    });
  });
});
