import { BaseMessage } from "@langchain/core/messages";
import { trimMessages, TrimMessagesFields } from "./transformers";

/**
 * Factory function that creates a trimMessages function that maintains an indexTokenCountMap
 * during a run. This allows for efficient token counting by avoiding recounting tokens
 * for messages that have already been processed.
 * 
 * @param {Object} options - Configuration options for the trimMessages function
 * @param {TrimMessagesFields} options.trimOptions - Options for the trimMessages function
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
 * // First call with initial messages
 * const { messages: trimmedMessages1 } = await trimmer(initialMessages);
 * 
 * // Later call with additional messages
 * const { messages: trimmedMessages2 } = await trimmer([...initialMessages, ...newMessages]);
 * ```
 */
export function createTrimMessagesFunction({ trimOptions }: { 
  trimOptions: TrimMessagesFields 
}) {
  // Initialize the token count map and keep track of the last processed message array
  const indexTokenCountMap: Record<number, number> = {};
  let lastProcessedMessages: BaseMessage[] = [];
  
  /**
   * Trims messages while maintaining a token count map for efficiency
   * 
   * @param {BaseMessage[]} messages - Array of messages to trim
   * @returns {Promise<Object>} Object containing trimmed messages and the current token count map
   */
  return async function trimMessagesWithMap(messages: BaseMessage[]): Promise<{
    messages: BaseMessage[];
    indexTokenCountMap: Record<number, number>;
  }> {
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
    
    // Update the last processed messages
    lastProcessedMessages = [...messages];
    
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
