import { AIMessage, BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { createTrimMessagesFunction } from "./trimMessagesFactory";

describe("createTrimMessagesFunction", () => {
  // Mock token counter that simply counts characters as tokens for testing
  const mockTokenCounter = (messages: any[]): number => {
    return messages.reduce((sum, msg) => {
      const content = typeof msg.content === "string" 
        ? msg.content 
        : JSON.stringify(msg.content);
      return sum + content.length;
    }, 0);
  };

  it("should create a function that trims messages", async () => {
    const trimmer = createTrimMessagesFunction({
      trimOptions: {
        maxTokens: 50,
        tokenCounter: mockTokenCounter,
        strategy: "last"
      }
    });

    const messages = [
      new SystemMessage("System prompt with some instructions"),
      new HumanMessage("First user message"),
      new AIMessage("First AI response"),
      new HumanMessage("Second user message"),
      new AIMessage("Second AI response that is quite long and should be trimmed")
    ];

    const result = await trimmer({ messages });
    
    expect(result.messages.length).toBeLessThan(messages.length);
    expect(result.indexTokenCountMap).toBeDefined();
    expect(Object.keys(result.indexTokenCountMap).length).toBeGreaterThan(0);
  });

  it("should maintain token counts across multiple calls", async () => {
    const trimmer = createTrimMessagesFunction({
      trimOptions: {
        maxTokens: 100,
        tokenCounter: mockTokenCounter,
        strategy: "last",
        includeSystem: true
      }
    });

    // Initial set of messages
    const initialMessages = [
      new SystemMessage("System prompt"),
      new HumanMessage("First user message"),
      new AIMessage("First AI response")
    ];

    // First call should count all messages
    const firstResult = await trimmer({ messages: initialMessages });
    expect(firstResult.messages.length).toBe(3);
    expect(Object.keys(firstResult.indexTokenCountMap).length).toBe(3);

    // Add a new message
    const updatedMessages = [
      ...initialMessages,
      new HumanMessage("Second user message")
    ];

    // Second call should only count the new message
    const secondResult = await trimmer({ messages: updatedMessages });
    expect(secondResult.messages.length).toBe(4);
    expect(Object.keys(secondResult.indexTokenCountMap).length).toBe(4);

    // The token counts for the first three messages should be the same
    for (let i = 0; i < 3; i++) {
      expect(secondResult.indexTokenCountMap[i]).toBe(firstResult.indexTokenCountMap[i]);
    }
    
    // The new message should have a token count
    expect(secondResult.indexTokenCountMap[3]).toBeDefined();
  });

  it("should handle different trimming strategies", async () => {
    // Test with "first" strategy
    const firstTrimmer = createTrimMessagesFunction({
      trimOptions: {
        maxTokens: 50,
        tokenCounter: mockTokenCounter,
        strategy: "first"
      }
    });

    const messages = [
      new SystemMessage("System prompt with some instructions"),
      new HumanMessage("First user message"),
      new AIMessage("First AI response"),
      new HumanMessage("Second user message"),
      new AIMessage("Second AI response that is quite long and should be trimmed")
    ];

    const firstResult = await firstTrimmer({ messages });
    expect(firstResult.messages.length).toBeLessThan(messages.length);
    
    // Test with "last" strategy
    const lastTrimmer = createTrimMessagesFunction({
      trimOptions: {
        maxTokens: 50,
        tokenCounter: mockTokenCounter,
        strategy: "last",
        includeSystem: true
      }
    });

    const lastResult = await lastTrimmer({ messages });
    expect(lastResult.messages.length).toBeLessThan(messages.length);
    
    // The system message should be included in the "last" strategy result
    const hasSystemMessage = lastResult.messages.some(
      msg => msg instanceof SystemMessage
    );
    expect(hasSystemMessage).toBe(true);
  });

  it("should handle accumulating messages efficiently", async () => {
    // Create a spy token counter to track how many times it's called
    const tokenCounterCalls: number[] = [];
    const spyTokenCounter = (messages: any[]): number => {
      tokenCounterCalls.push(messages.length);
      return messages.reduce((sum, msg) => {
        const content = typeof msg.content === "string" 
          ? msg.content 
          : JSON.stringify(msg.content);
        return sum + content.length;
      }, 0);
    };

    const trimmer = createTrimMessagesFunction({
      trimOptions: {
        maxTokens: 200,
        tokenCounter: spyTokenCounter,
        strategy: "last",
        includeSystem: true
      }
    });

    // Start with a few messages
    let currentMessages = [
      new SystemMessage("System prompt"),
      new HumanMessage("First user message"),
      new AIMessage("First AI response")
    ];

    // First call
    const firstResult = await trimmer({ messages: currentMessages });
    
    // Add more messages one by one and verify token counting efficiency
    for (let i = 0; i < 5; i++) {
      // Add a new message pair
      currentMessages = [
        ...currentMessages,
        new HumanMessage(`User message ${i + 2}`),
        new AIMessage(`AI response ${i + 2}`)
      ];
      
      // Get trimmed messages
      const result = await trimmer({ messages: currentMessages });
      
      // Verify that all messages have token counts
      expect(Object.keys(result.indexTokenCountMap).length).toBe(currentMessages.length);
      
      // The token counts for existing messages should remain the same
      for (let j = 0; j < currentMessages.length - 2; j++) {
        if (j < Object.keys(firstResult.indexTokenCountMap).length) {
          expect(result.indexTokenCountMap[j]).toBe(firstResult.indexTokenCountMap[j]);
        }
      }
    }

    // Verify that the token counter was called with single messages for new messages
    // The first call should count 3 messages (initial batch)
    // Then each subsequent call should count only 1 message at a time (the new message)
    expect(tokenCounterCalls[0]).toBe(1); // First message
    expect(tokenCounterCalls[1]).toBe(1); // Second message
    expect(tokenCounterCalls[2]).toBe(1); // Third message
    // After initial batch, each new message should be counted individually
    for (let i = 3; i < tokenCounterCalls.length; i++) {
      expect(tokenCounterCalls[i]).toBe(1);
    }
  });

  it("should handle function-based token counter that returns a promise", async () => {
    // Track calls to the token counter
    const tokenCounterCalls: Array<BaseMessage[]> = [];
    
    // Mock token counter that returns a promise
    const asyncTokenCounter = async (messages: BaseMessage[]): Promise<number> => {
      tokenCounterCalls.push([...messages]);
      return Promise.resolve(messages.reduce((sum, msg) => {
        const content = typeof msg.content === "string" 
          ? msg.content 
          : JSON.stringify(msg.content);
        return sum + content.length;
      }, 0));
    };

    const trimmer = createTrimMessagesFunction({
      trimOptions: {
        maxTokens: 40, // Smaller token limit to ensure trimming occurs
        tokenCounter: asyncTokenCounter,
        strategy: "last"
      }
    });

    const messages = [
      new SystemMessage("System prompt with instructions"),
      new HumanMessage("First user message that is longer"),
      new AIMessage("First AI response with details"),
      new HumanMessage("Second user message with question"),
      new AIMessage("Second AI response with answer")
    ];

    const result = await trimmer({ messages });
    expect(result.messages.length).toBeLessThan(messages.length);
    expect(Object.keys(result.indexTokenCountMap).length).toBeGreaterThan(0);
    
    // Verify that each message was counted individually
    expect(tokenCounterCalls.length).toBe(messages.length);
    tokenCounterCalls.forEach(call => {
      expect(call.length).toBe(1); // Each call should have exactly one message
    });
  });
  
  it("should correctly handle growing message arrays", async () => {
    // Create a map to track which messages are processed
    const processedMessages = new Map<number, string>();
    
    const tokenCounter = (messages: BaseMessage[]): number => {
      // We should only get one message at a time
      expect(messages.length).toBe(1);
      
      const msg = messages[0];
      const content = typeof msg.content === "string" 
        ? msg.content 
        : JSON.stringify(msg.content);
      
      // Find the index of this message in the current array
      const msgContent = msg.content.toString();
      
      // Log for debugging
      console.log(`Processing message: ${msgContent}`);
      
      // Store the message content with its index
      processedMessages.set(processedMessages.size, msgContent);
      
      return content.length;
    };
    
    const trimmer = createTrimMessagesFunction({
      trimOptions: {
        maxTokens: 500, // Large enough to include all messages
        tokenCounter,
        strategy: "last"
      }
    });
    
    // Initial messages
    const initialMessages = [
      new SystemMessage("System prompt"),
      new HumanMessage("First user message")
    ];
    
    // Clear the map before first call
    processedMessages.clear();
    
    console.log("First call with 2 messages");
    await trimmer({ messages: initialMessages });
    expect(processedMessages.size).toBe(2);
    
    // Add more messages
    const moreMessages = [
      ...initialMessages,
      new AIMessage("First AI response"),
      new HumanMessage("Second user message")
    ];
    
    // Clear the map before second call
    processedMessages.clear();
    
    console.log("Second call with 4 messages");
    await trimmer({ messages: moreMessages });
    // Only the new messages should be processed
    expect(processedMessages.size).toBe(2);
    
    // Check if the processed messages are the new ones
    const secondCallMessages = Array.from(processedMessages.values());
    expect(secondCallMessages).toContain("First AI response");
    expect(secondCallMessages).toContain("Second user message");
    
    // Add even more messages
    const evenMoreMessages = [
      ...moreMessages,
      new AIMessage("Second AI response"),
      new HumanMessage("Third user message"),
      new AIMessage("Third AI response")
    ];
    
    // Clear the map before third call
    processedMessages.clear();
    
    console.log("Third call with 7 messages");
    const finalResult = await trimmer({ messages: evenMoreMessages });
    // Only the new messages should be processed
    expect(processedMessages.size).toBe(3);
    
    // Check if the processed messages are the new ones
    const thirdCallMessages = Array.from(processedMessages.values());
    expect(thirdCallMessages).toContain("Second AI response");
    expect(thirdCallMessages).toContain("Third user message");
    expect(thirdCallMessages).toContain("Third AI response");
    
    // Verify all messages are in the token count map
    expect(Object.keys(finalResult.indexTokenCountMap).length).toBe(7);
    
    // Verify the token counts are accurate
    for (let i = 0; i < evenMoreMessages.length; i++) {
      const msg = evenMoreMessages[i];
      const content = typeof msg.content === "string" 
        ? msg.content 
        : JSON.stringify(msg.content);
      expect(finalResult.indexTokenCountMap[i]).toBe(content.length);
    }
  });
});
