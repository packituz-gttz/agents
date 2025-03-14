import { AIMessage, HumanMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";
import type { UsageMetadata } from '@langchain/core/messages';
import { createTrimMessagesFunction, findTurnStartIndex } from "./trimMessagesFactory";

describe("createTrimMessagesFunction with usage metadata", () => {
  // Mock token counter that simply counts characters as tokens for testing
  const mockTokenCounter = (messages: any[]): number => {
    return messages.reduce((sum, msg) => {
      const content = typeof msg.content === "string" 
        ? msg.content 
        : JSON.stringify(msg.content);
      return sum + content.length;
    }, 0);
  };

  it("should use usage metadata to adjust token counts", async () => {
    const trimmer = createTrimMessagesFunction({
      trimOptions: {
        maxTokens: 500,
        tokenCounter: mockTokenCounter,
        strategy: "last"
      }
    });

    // Initial messages
    const initialMessages = [
      new SystemMessage("System prompt"),
      new HumanMessage("First user message")
    ];

    // First call without usage metadata
    const firstResult = await trimmer({ messages: initialMessages });
    expect(firstResult.messages.length).toBe(2);
    expect(Object.keys(firstResult.indexTokenCountMap).length).toBe(2);

    // Calculate the estimated token counts
    const systemTokens = firstResult.indexTokenCountMap[0];
    const humanTokens = firstResult.indexTokenCountMap[1];
    const estimatedTotal = systemTokens + humanTokens;

    // Add AI response and tool message
    const secondMessages = [
      ...initialMessages,
      new AIMessage("AI response to the first message"),
      new ToolMessage({
        tool_call_id: "tool_1",
        content: "Tool response"
      })
    ];

    // Create usage metadata with a different token count than our estimate
    const input_tokens = Math.round(estimatedTotal * 1.2); // 20% higher than our estimate
    const output_tokens = 50;
    const usageMetadata: UsageMetadata = {
      input_tokens,
      output_tokens,
      total_tokens: input_tokens + output_tokens,
    };

    // Second call with usage metadata
    const secondResult = await trimmer({
      messages: secondMessages,
      usageMetadata,
      turnStartIndex: 1 // Start from the human message
    });

    // Verify that the token counts were adjusted
    expect(secondResult.indexTokenCountMap[0]).toBe(firstResult.indexTokenCountMap[0]); // System message unchanged
    
    // The human message and subsequent messages should have token counts
    expect(secondResult.indexTokenCountMap[1]).toBeDefined(); // Human message
    expect(secondResult.indexTokenCountMap[2]).toBeDefined(); // AI message
    expect(secondResult.indexTokenCountMap[3]).toBeDefined(); // Tool message

    // The total should match the usage metadata
    const totalTokens = Object.values(secondResult.indexTokenCountMap).reduce((sum, count) => sum + count, 0);
    expect(totalTokens).toBeGreaterThan(estimatedTotal);
  });

  it("should fall back to original strategy when no usage metadata is provided", async () => {
    const trimmer = createTrimMessagesFunction({
      trimOptions: {
        maxTokens: 500,
        tokenCounter: mockTokenCounter,
        strategy: "last"
      }
    });

    // Initial messages
    const initialMessages = [
      new SystemMessage("System prompt"),
      new HumanMessage("First user message")
    ];

    // First call
    const firstResult = await trimmer({ messages: initialMessages });
    expect(firstResult.messages.length).toBe(2);

    // Add more messages
    const moreMessages = [
      ...initialMessages,
      new AIMessage("First AI response"),
      new HumanMessage("Second user message")
    ];

    // Second call without usage metadata
    const secondResult = await trimmer({ messages: moreMessages });
    expect(secondResult.messages.length).toBe(4);
    expect(Object.keys(secondResult.indexTokenCountMap).length).toBe(4);

    // The token counts for the first two messages should be the same
    expect(secondResult.indexTokenCountMap[0]).toBe(firstResult.indexTokenCountMap[0]);
    expect(secondResult.indexTokenCountMap[1]).toBe(firstResult.indexTokenCountMap[1]);
  });

  it("should correctly find the turn start index", () => {
    const messages = [
      new SystemMessage("System prompt"),
      new HumanMessage("First user message"),
      new AIMessage("First AI response"),
      new ToolMessage({
        tool_call_id: "tool_1",
        content: "Tool response"
      }),
      new HumanMessage("Second user message"),
      new AIMessage("Second AI response")
    ];

    // Find the start of the last turn
    const turnStartIndex = findTurnStartIndex(messages);
    expect(turnStartIndex).toBe(4); // Index of "Second user message"

    // Find the start of the first turn
    const firstTurnStartIndex = findTurnStartIndex(messages, 0);
    expect(firstTurnStartIndex).toBe(1); // Index of "First user message"
  });

  it("should handle multiple turns with usage metadata", async () => {
    const trimmer = createTrimMessagesFunction({
      trimOptions: {
        maxTokens: 500,
        tokenCounter: mockTokenCounter,
        strategy: "last"
      }
    });

    // First turn
    const firstTurnMessages = [
      new SystemMessage("System prompt"),
      new HumanMessage("First user message"),
      new AIMessage("First AI response")
    ];

    // First call with usage metadata
    const input_tokens = 100;
    const output_tokens = 50;
    const firstUsage: UsageMetadata = {
      input_tokens,
      output_tokens,
      total_tokens: input_tokens + output_tokens
    };

    const firstResult = await trimmer({
      messages: firstTurnMessages,
      usageMetadata: firstUsage,
      turnStartIndex: 1 // Start from the human message
    });

    // Second turn
    const secondTurnMessages = [
      ...firstTurnMessages,
      new HumanMessage("Second user message"),
      new AIMessage("Second AI response"),
      new ToolMessage({
        tool_call_id: "tool_1",
        content: "Tool response"
      })
    ];

    // Second call with usage metadata
    const input_tokens2 = 150;
    const output_tokens2 = 70;
    const secondUsage: UsageMetadata = {
      input_tokens: input_tokens2,
      output_tokens: output_tokens2,
      total_tokens: input_tokens2 + output_tokens2
    };

    const secondResult = await trimmer({
      messages: secondTurnMessages,
      usageMetadata: secondUsage,
      turnStartIndex: 3 // Start from the second human message
    });

    // Verify that all messages have token counts
    expect(Object.keys(secondResult.indexTokenCountMap).length).toBe(6);

    // The token counts for the first turn should be unchanged
    for (let i = 0; i < 3; i++) {
      expect(secondResult.indexTokenCountMap[i]).toBe(firstResult.indexTokenCountMap[i]);
    }

    // The total tokens for the second turn should match the second usage
    const secondTurnTokens = secondResult.indexTokenCountMap[3] +
                            secondResult.indexTokenCountMap[4] +
                            secondResult.indexTokenCountMap[5];
    
    // Allow for small rounding differences
    expect(Math.abs(secondTurnTokens - (secondUsage.input_tokens || 0))).toBeLessThan(3);
  });
});
