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
    
    // Add system message if it exists
    if (instructions && _messages.length > 0) {
      context.push(_messages[0] as BaseMessage);
      messages.shift();
    }
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

    // If `currentUsage` is defined, we need to distribute the current total tokens to our `indexTokenCountMap`,
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

    // Get the standard pruned context first
    const result = getMessagesWithinTokenLimit({
      maxContextTokens: factoryParams.maxTokens,
      messages: params.messages,
      indexTokenCountMap,
      startOnMessageType: params.startOnMessageType,
    });
    
    // For thinking mode, we need to handle special cases
    if (factoryParams.thinkingEnabled && result.context.length > 0) {
      // Check if the latest message is an assistant message
      const latestMessageIsAssistant = params.messages.length > 0 && 
        params.messages[params.messages.length - 1].getType() === 'ai';
      
      // Get system message if it exists
      const systemMessage = result.context.find(msg => msg.getType() === 'system');
      
      // Find assistant messages with thinking blocks
      let assistantWithThinking: BaseMessage | undefined;
      for (const msg of result.context) {
        if (msg.getType() === 'ai' && Array.isArray(msg.content)) {
          const hasThinking = msg.content.some(item => 
            item && typeof item === 'object' && item.type === 'thinking');
          
          if (hasThinking) {
            assistantWithThinking = msg;
            break;
          }
        }
      }
      
      // Always try to add thinking blocks to the first assistant message
      // Find the first assistant message in the context
      const firstAssistantIndex = result.context.findIndex(msg => msg.getType() === 'ai');
      
      if (firstAssistantIndex !== -1) {
        const firstAssistantMsg = result.context[firstAssistantIndex];
        
        // Check if it already has a thinking block
        const hasThinking = Array.isArray(firstAssistantMsg.content) && 
          firstAssistantMsg.content.some(item => 
            item && typeof item === 'object' && item.type === 'thinking');
        
        if (!hasThinking) {
          // Look for thinking blocks in the original messages
          let thinkingBlock: any = undefined;
          for (const msg of params.messages) {
            if (msg.getType() === 'ai' && Array.isArray(msg.content)) {
              const block = msg.content.find(item => 
                item && typeof item === 'object' && item.type === 'thinking');
              
              if (block) {
                thinkingBlock = block;
                break;
              }
            }
          }
          
          if (thinkingBlock) {
            // Create a new content array with thinking block
            let newContent: any[];
            
            if (Array.isArray(firstAssistantMsg.content)) {
              newContent = [thinkingBlock, ...firstAssistantMsg.content];
            } else if (typeof firstAssistantMsg.content === 'string') {
              newContent = [
                thinkingBlock,
                { type: 'text', text: firstAssistantMsg.content }
              ];
            } else {
              newContent = [thinkingBlock];
            }
            
            // Create a new message with the updated content
            const newAssistantMsg = new AIMessage({
              content: newContent,
              additional_kwargs: firstAssistantMsg.additional_kwargs,
              response_metadata: firstAssistantMsg.response_metadata,
            });
            
            // Replace the first assistant message
            result.context[firstAssistantIndex] = newAssistantMsg;
            assistantWithThinking = newAssistantMsg;
          }
        }
      }
      
      // If we have an assistant message with thinking, ensure it appears at the beginning
      if (assistantWithThinking) {
        // Create a new context array with the correct order
        const newContext: BaseMessage[] = [];
        
        // Add system message first if it exists
        if (systemMessage) {
          newContext.push(systemMessage);
        }
        
        // Add assistant message with thinking next
        newContext.push(assistantWithThinking);
        
        // Add all other messages except system and assistant with thinking
        for (const msg of result.context) {
          if (msg !== systemMessage && msg !== assistantWithThinking) {
            newContext.push(msg);
          }
        }
        
        // Replace the context array
        result.context = newContext;
      }
      
      return { context: result.context, indexTokenCountMap };
    }
    
    // If thinking mode is not enabled, just return the standard result
    return { context: result.context || [], indexTokenCountMap };
  }
}
