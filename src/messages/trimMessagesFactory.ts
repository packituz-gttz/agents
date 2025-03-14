import { BaseMessage } from "@langchain/core/messages";
import type { UsageMetadata } from '@langchain/core/messages';
import { trimMessages, TrimMessagesFields } from "./transformers";
/**
 * Options for creating a trim messages function
 */
export interface TrimMessagesFactoryOptions {
  /** Options for the trimMessages function */
  trimOptions: TrimMessagesFields;
}

/**
 * Parameters for the trimMessagesWithMap function
 */
export interface TrimMessagesParams {
  /** Array of messages to trim */
  messages: BaseMessage[];
  /** Optional usage metadata from the AI provider */
  usageMetadata?: Partial<UsageMetadata>;
  /** Optional start index for a new "turn" of messages */
  turnStartIndex?: number;
}

/**
 * Result of the trimMessagesWithMap function
 */
export interface TrimMessagesResult {
  /** Trimmed messages */
  messages: BaseMessage[];
  /** Map of message indices to token counts */
  indexTokenCountMap: Record<number, number>;
}

/**
 * Factory function that creates a trimMessages function that maintains an indexTokenCountMap
 * during a run. This allows for efficient token counting by avoiding recounting tokens
 * for messages that have already been processed.
 * 
 * @param {TrimMessagesFactoryOptions} options - Configuration options for the trimMessages function
 * @returns {Function} A function that trims messages while maintaining a token count map
 * 
 * @example
 * ```typescript
 * // Create a trimmer function with specific options
 * const trimmer = createTrimMessagesFunction({
 *   trimOptions: {
 *     maxTokens: 4000,
 *     tokenCounter: myTokenCounter,
 *     strategy: "last",
 *     includeSystem: true
 *   }
 * });
 * 
 * // Use the trimmer with an array of messages
 * const { messages: trimmedMessages1 } = await trimmer({ messages: initialMessages });
 * 
 * // Later call with additional messages and usage metadata
 * const { messages: trimmedMessages2 } = await trimmer({
 *   messages: [...initialMessages, ...newMessages],
 *   usageMetadata: { input_tokens: 1500, output_tokens: 300 }
 * });
 * ```
 */
export function createTrimMessagesFunction({ trimOptions }: TrimMessagesFactoryOptions) {
  // Initialize the token count map and keep track of the last processed message array
  const indexTokenCountMap: Record<number, number> = {};
  let lastProcessedMessages: BaseMessage[] = [];
  let lastTurnStartIndex = 0;
  
  /**
   * Trims messages while maintaining a token count map for efficiency
   * 
   * @param {TrimMessagesParams} params - Parameters for trimming messages
   * @returns {Promise<TrimMessagesResult>} Object containing trimmed messages and the current token count map
   */
  return async function trimMessagesWithMap({
    messages,
    usageMetadata,
    turnStartIndex
  }: TrimMessagesParams): Promise<TrimMessagesResult> {
    // If turnStartIndex is provided, update the last turn start index
    if (turnStartIndex !== undefined) {
      lastTurnStartIndex = turnStartIndex;
    }
    
    // If usage metadata is provided, use it to update the token counts
    if (usageMetadata && usageMetadata.input_tokens) {
      // Identify the range of messages in the current "turn"
      const turnMessages = messages.slice(lastTurnStartIndex);
      const turnIndices = Array.from(
        { length: turnMessages.length },
        (_, i) => i + lastTurnStartIndex
      );
      
      // Calculate the total estimated tokens for the turn messages
      let estimatedTotalTokens = 0;
      const messagesToEstimate: BaseMessage[] = [];
      const indicesToEstimate: number[] = [];
      
      for (let i = 0; i < turnIndices.length; i++) {
        const idx = turnIndices[i];
        // If we already have a token count for this message, use it
        if (indexTokenCountMap[idx] !== undefined) {
          estimatedTotalTokens += indexTokenCountMap[idx];
        } else {
          // Otherwise, we'll need to estimate it
          messagesToEstimate.push(turnMessages[i]);
          indicesToEstimate.push(idx);
        }
      }
      
      // If we need to estimate token counts for some messages
      if (messagesToEstimate.length > 0) {
        // Get the original token counter
        const originalTokenCounter = trimOptions.tokenCounter;
        
        // Estimate token counts for each message
        const estimatedTokenCounts: number[] = [];
        
        for (const msg of messagesToEstimate) {
          let tokenCount: number;
          
          if (typeof originalTokenCounter === 'function') {
            tokenCount = await originalTokenCounter([msg]);
          } else if ('getNumTokens' in originalTokenCounter) {
            tokenCount = await originalTokenCounter.getNumTokens(msg.content);
          } else {
            throw new Error("Unsupported token counter type");
          }
          
          estimatedTokenCounts.push(tokenCount);
          estimatedTotalTokens += tokenCount;
        }
        
        // Calculate the actual total tokens from the usage metadata
        const actualTotalTokens = usageMetadata.input_tokens;
        
        // If our estimates don't match the actual tokens, adjust them proportionally
        if (estimatedTotalTokens > 0 && actualTotalTokens !== estimatedTotalTokens) {
          const ratio = actualTotalTokens / estimatedTotalTokens;
          
          // Adjust the estimated token counts
          for (let i = 0; i < indicesToEstimate.length; i++) {
            const adjustedCount = Math.round(estimatedTokenCounts[i] * ratio);
            indexTokenCountMap[indicesToEstimate[i]] = adjustedCount;
          }
        } else {
          // If the totals match or we couldn't estimate, just use the estimates
          for (let i = 0; i < indicesToEstimate.length; i++) {
            indexTokenCountMap[indicesToEstimate[i]] = estimatedTokenCounts[i];
          }
        }
      }
    } else {
      // No usage metadata provided, use the original strategy
      
      // Determine which messages are new by comparing with the last processed messages
      const newMessages: BaseMessage[] = [];
      const newIndices: number[] = [];
      
      // If this is the first call or we have more messages than before
      if (lastProcessedMessages.length === 0) {
        // First call, all messages are new
        for (let i = 0; i < messages.length; i++) {
          newMessages.push(messages[i]);
          newIndices.push(i);
        }
      } else if (messages.length > lastProcessedMessages.length) {
        // We have new messages, only count those
        for (let i = lastProcessedMessages.length; i < messages.length; i++) {
          newMessages.push(messages[i]);
          newIndices.push(i);
        }
      }
      
      // Create a copy of the token counter to use for new messages
      const originalTokenCounter = trimOptions.tokenCounter;
      
      // Count tokens for new messages
      for (let i = 0; i < newMessages.length; i++) {
        const messageIndex = newIndices[i];
        let messageTokenCount: number;
        
        if (typeof originalTokenCounter === 'function') {
          // Count this single message by passing it as a one-element array
          messageTokenCount = await originalTokenCounter([newMessages[i]]);
        } else if ('getNumTokens' in originalTokenCounter) {
          // Use the language model's getNumTokens method
          messageTokenCount = await originalTokenCounter.getNumTokens(newMessages[i].content);
        } else {
          throw new Error("Unsupported token counter type");
        }
        
        // Store the token count for this message
        indexTokenCountMap[messageIndex] = messageTokenCount;
      }
    }
    
    // Update the last processed messages
    lastProcessedMessages = [...messages];
    
    // Create a token counter that uses the map
    const enhancedTokenCounter = async (msgsToCount: BaseMessage[]): Promise<number> => {
      let totalTokens = 0;
      
      // Use the cached token counts
      for (let i = 0; i < msgsToCount.length; i++) {
        if (indexTokenCountMap[i] !== undefined) {
          totalTokens += indexTokenCountMap[i];
        } else {
          // This shouldn't happen if we've counted all messages
          console.warn(`Missing token count for message at index ${i}`);
          
          // Count it now as a fallback
          let messageTokenCount: number;
          const originalTokenCounter = trimOptions.tokenCounter;
          
          if (typeof originalTokenCounter === 'function') {
            messageTokenCount = await originalTokenCounter([msgsToCount[i]]);
          } else if ('getNumTokens' in originalTokenCounter) {
            messageTokenCount = await originalTokenCounter.getNumTokens(msgsToCount[i].content);
          } else {
            throw new Error("Unsupported token counter type");
          }
          
          indexTokenCountMap[i] = messageTokenCount;
          totalTokens += messageTokenCount;
        }
      }
      
      return totalTokens;
    };
    
    // Create modified trim options with our enhanced token counter
    const modifiedTrimOptions: TrimMessagesFields = {
      ...trimOptions,
      tokenCounter: enhancedTokenCounter
    };
    
    // Trim the messages using the original function
    const trimmedMessages = await trimMessages(messages, modifiedTrimOptions);
    
    // Return both the trimmed messages and the updated token count map
    return {
      messages: trimmedMessages,
      indexTokenCountMap
    };
  };
}

/**
 * Helper function to identify the start index of a new "turn" in a conversation
 * A turn typically starts with a human message and includes the subsequent AI and tool messages
 * 
 * @param {BaseMessage[]} messages - Array of messages to analyze
 * @param {number} startFrom - Index to start searching from (default: 0)
 * @returns {number} The index where the new turn starts
 */
export function findTurnStartIndex(messages: BaseMessage[], startFrom = 0): number {
  if (messages.length === 0) {
    return startFrom;
  }
  
  // When no startFrom is provided (or it's 0), and we're not explicitly looking for the first turn,
  // we want to find the last human message (most recent turn)
  if (startFrom === 0 && arguments.length === 1) {
    // Find the last human message (from the end)
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].getType() === 'human') {
        return i;
      }
    }
  } else {
    // If startFrom is explicitly provided, find the first human message from that point
    for (let i = startFrom; i < messages.length; i++) {
      if (messages[i].getType() === 'human') {
        return i;
      }
    }
  }
  
  // If no human message is found, return the startFrom index
  return startFrom;
}
