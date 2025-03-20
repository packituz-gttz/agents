import { AIMessage } from '@langchain/core/messages';
import type { BaseMessage, UsageMetadata } from '@langchain/core/messages';
import type { TokenCounter } from '@/types/run';
export type PruneMessagesFactoryParams = {
  maxTokens: number;
  startIndex: number;
  tokenCounter: TokenCounter;
  indexTokenCountMap: Record<string, number>;
  thinkingEnabled?: boolean;
};
export type PruneMessagesParams = {
  messages: BaseMessage[];
  usageMetadata?: Partial<UsageMetadata>;
  startOnMessageType?: ReturnType<BaseMessage['getType']>;
}

/**
 * Calculates the total tokens from a single usage object
 * 
 * @param usage The usage metadata object containing token information
 * @returns An object containing the total input and output tokens
 */
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

/**
 * Processes an array of messages and returns a context of messages that fit within a specified token limit.
 * It iterates over the messages from newest to oldest, adding them to the context until the token limit is reached.
 * 
 * @param options Configuration options for processing messages
 * @returns Object containing the message context, remaining tokens, messages not included, and summary index
 */
function getMessagesWithinTokenLimit({
  messages: _messages,
  maxContextTokens,
  indexTokenCountMap,
  startOnMessageType,
  thinkingEnabled,
  tokenCounter,
}: {
  messages: BaseMessage[];
  maxContextTokens: number;
  indexTokenCountMap: Record<string, number>;
  startOnMessageType?: string;
  thinkingEnabled?: boolean;
  tokenCounter?: TokenCounter;
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
  let context: BaseMessage[] = [];

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
    
  // Handle startOnMessageType requirement
  if (startOnMessageType && context.length > 0) {
    const requiredTypeIndex = context.findIndex(msg => msg.getType() === startOnMessageType);
    
    if (requiredTypeIndex > 0) {
      context = context.slice(requiredTypeIndex);
    }
  }
  
  // Handle thinking mode requirement for Anthropic
  if (thinkingEnabled && context.length > 0 && tokenCounter) {
    // Process only if we have an assistant message in the context
    const firstAssistantIndex = context.findIndex(msg => msg.getType() === 'ai');
    if (firstAssistantIndex >= 0) {
      const firstAssistantMsg = context[firstAssistantIndex];
      
      // Check if the first assistant message already has a thinking block
      const hasThinkingBlock = Array.isArray(firstAssistantMsg.content) && 
        firstAssistantMsg.content.some(item => 
          item && typeof item === 'object' && item.type === 'thinking');
      
      // Only proceed if we need to add thinking blocks
      if (!hasThinkingBlock) {
        // Collect thinking blocks from pruned assistant messages
        const thinkingBlocks: any[] = [];
        
        // Look through pruned messages for thinking blocks
        for (const msg of messages) {
          if (msg.getType() === 'ai' && Array.isArray(msg.content)) {
            for (const item of msg.content) {
              if (item && typeof item === 'object' && item.type === 'thinking') {
                thinkingBlocks.push(item);
                // We only need one thinking block
                break;
              }
            }
            if (thinkingBlocks.length > 0) break; // Stop after finding one thinking block
          }
        }
        
        // If we found thinking blocks, add them to the first assistant message
        if (thinkingBlocks.length > 0) {
          // Calculate token count of original message
          const originalTokenCount = tokenCounter(firstAssistantMsg);
          
          // Create a new content array with thinking blocks at the beginning
          let newContent: any[];
          
          if (Array.isArray(firstAssistantMsg.content)) {
            // Keep the original content (excluding any existing thinking blocks)
            const originalContent = firstAssistantMsg.content.filter(item => 
              !(item && typeof item === 'object' && item.type === 'thinking'));
            
            newContent = [...thinkingBlocks, ...originalContent];
          } else if (typeof firstAssistantMsg.content === 'string') {
            newContent = [
              ...thinkingBlocks,
              { type: 'text', text: firstAssistantMsg.content }
            ];
          } else {
            newContent = thinkingBlocks;
          }
          
          // Create a new message with the updated content
          const newMessage = new AIMessage({
            content: newContent,
            additional_kwargs: firstAssistantMsg.additional_kwargs,
            response_metadata: firstAssistantMsg.response_metadata,
          });
          
          // Calculate token count of new message
          const newTokenCount = tokenCounter(newMessage);
          
          // Adjust current token count
          currentTokenCount += (newTokenCount - originalTokenCount);
          
          // Replace the first assistant message
          context[firstAssistantIndex] = newMessage;
          
          // If we've exceeded the token limit, we need to prune more messages
          if (currentTokenCount > remainingContextTokens) {
            // Remove messages from the end of the context until we're under the token limit
            // But make sure to keep the first assistant message with thinking block
            let i = context.length - 1;
            while (i > firstAssistantIndex && currentTokenCount > remainingContextTokens) {
              const msgToRemove = context[i];
              const msgTokenCount = tokenCounter(msgToRemove);
              context.splice(i, 1);
              currentTokenCount -= msgTokenCount;
              i--;
            }
            
            // Update remainingContextTokens to reflect the new token count
            remainingContextTokens = maxContextTokens - currentTokenCount;
          }
        }
      }
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

export function createPruneMessages(factoryParams: PruneMessagesFactoryParams) {
  const indexTokenCountMap = { ...factoryParams.indexTokenCountMap };
  let lastTurnStartIndex = factoryParams.startIndex;
  let totalTokens = (Object.values(indexTokenCountMap)).reduce((a, b) => a + b, 0);
  
  return function pruneMessages(params: PruneMessagesParams): {
    context: BaseMessage[];
    indexTokenCountMap: Record<string, number>;
  } {
    let currentUsage: UsageMetadata | undefined;
    if (params.usageMetadata && (
      checkValidNumber(params.usageMetadata.input_tokens)
      || (
        checkValidNumber(params.usageMetadata.input_token_details)
        && (
          checkValidNumber(params.usageMetadata.input_token_details.cache_creation)
          || checkValidNumber(params.usageMetadata.input_token_details.cache_read)
        )
      )
    ) && checkValidNumber(params.usageMetadata.output_tokens)) {
      currentUsage = calculateTotalTokens(params.usageMetadata);
      totalTokens = currentUsage.total_tokens;
    }

    for (let i = lastTurnStartIndex; i < params.messages.length; i++) {
      const message = params.messages[i];
      if (i === lastTurnStartIndex && indexTokenCountMap[i] === undefined && currentUsage) {
        indexTokenCountMap[i] = currentUsage.output_tokens;
      } else if (indexTokenCountMap[i] === undefined) {
        indexTokenCountMap[i] = factoryParams.tokenCounter(message);
        totalTokens += indexTokenCountMap[i];
      }
    }

    // If `currentUsage` is defined, we need to distribute the current total tokensto our `indexTokenCountMap`,
    // for all message index keys before `lastTurnStartIndex`, as it has the most accurate count for those messages.
    // We must distribute it in a weighted manner, so that the total token count is equal to `currentUsage.total_tokens`,
    // relative the manually counted tokens in `indexTokenCountMap`.
    if (currentUsage) {
      const totalIndexTokens = Object.values(indexTokenCountMap).reduce((a, b) => a + b, 0);
      const ratio = currentUsage.total_tokens / totalIndexTokens;
      for (const key in indexTokenCountMap) {
        indexTokenCountMap[key] = Math.round(indexTokenCountMap[key] * ratio);
      }
    }

    lastTurnStartIndex = params.messages.length;
    if (totalTokens <= factoryParams.maxTokens) {
      return { context: params.messages, indexTokenCountMap };
    }

    // Pass the tokenCounter to getMessagesWithinTokenLimit for token recalculation
    const { context } = getMessagesWithinTokenLimit({
      maxContextTokens: factoryParams.maxTokens,
      messages: params.messages,
      indexTokenCountMap,
      startOnMessageType: params.startOnMessageType,
      thinkingEnabled: factoryParams.thinkingEnabled,
      tokenCounter: factoryParams.tokenCounter,
    });

    return { context, indexTokenCountMap };
  }
}
