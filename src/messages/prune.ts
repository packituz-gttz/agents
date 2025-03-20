import type { BaseMessage, UsageMetadata } from '@langchain/core/messages';
import type { ThinkingContentText } from '@/types/stream';
import type { TokenCounter } from '@/types/run';
import { ContentTypes } from '@/common';
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
export function calculateTotalTokens(usage: Partial<UsageMetadata>): UsageMetadata {
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
export function getMessagesWithinTokenLimit({
  messages: _messages,
  maxContextTokens,
  indexTokenCountMap,
  startOnMessageType,
  thinkingEnabled,
  /** We may need to use this when recalculating */
  tokenCounter,
}: {
  messages: BaseMessage[];
  maxContextTokens: number;
  indexTokenCountMap: Record<string, number>;
  tokenCounter: TokenCounter;
  startOnMessageType?: string;
  thinkingEnabled?: boolean;
}): {
  context: BaseMessage[];
  remainingContextTokens: number;
  messagesToRefine: BaseMessage[];
} {
  // Every reply is primed with <|start|>assistant<|message|>, so we
  // start with 3 tokens for the label after all messages have been counted.
  let currentTokenCount = 3;
  const instructions = _messages?.[0]?.getType() === 'system' ? _messages[0] : undefined;
  const instructionsTokenCount = instructions != null ? indexTokenCountMap[0] : 0;
  const initialContextTokens = maxContextTokens - instructionsTokenCount;
  let remainingContextTokens = initialContextTokens;

  const messages = [..._messages];
  /**
   * IMPORTANT: this context array gets reversed at the end, since the latest messages get pushed first.
   * 
   * This may be confusing to read, but it is done to ensure the context is in the correct order for the model.
   * */
  let context: BaseMessage[] = [];

  let thinkingStartIndex = -1;
  let thinkingEndIndex = -1;
  let thinkingBlock: ThinkingContentText | undefined;

  if (currentTokenCount < remainingContextTokens) {
    let currentIndex = messages.length;
    while (messages.length > 0 && currentTokenCount < remainingContextTokens && currentIndex > 1) {
      currentIndex--;
      if (messages.length === 1 && instructions) {
        break;
      }
      const poppedMessage = messages.pop();
      if (!poppedMessage) continue;
      if (thinkingEnabled && currentIndex === (messages.length - 1) && (poppedMessage.getType() === 'ai') || (poppedMessage.getType() === 'tool')) {
        thinkingEndIndex = currentIndex;
      }
      if (thinkingEndIndex > -1 && !thinkingBlock  && thinkingStartIndex < 0 && poppedMessage.getType() === 'ai' && Array.isArray(poppedMessage.content)) {
        thinkingBlock = (poppedMessage.content.find((content) => content.type === ContentTypes.THINKING)) as ThinkingContentText;
        thinkingStartIndex = thinkingBlock != null ? currentIndex : -1;
      }
      if (thinkingEndIndex > -1 && thinkingStartIndex === -1 && thinkingEndIndex !== currentIndex && poppedMessage.getType() === 'human') {
        thinkingStartIndex = currentIndex + 1;
      }
      
      const tokenCount = indexTokenCountMap[currentIndex] || 0;

      if ((currentTokenCount + tokenCount) <= remainingContextTokens) {
        context.push(poppedMessage);
        currentTokenCount += tokenCount;
      } else {
        messages.push(poppedMessage);
        break;
      }
    }
    
    if (startOnMessageType && context.length > 0) {
      const requiredTypeIndex = context.findIndex(msg => msg.getType() === startOnMessageType);
      
      if (requiredTypeIndex > 0) {
        context = context.slice(requiredTypeIndex);
      }
    }
  }

  if (instructions && _messages.length > 0) {
    context.push(_messages[0] as BaseMessage);
    messages.shift();
  }

  const prunedMemory = messages;
  remainingContextTokens -= currentTokenCount;
  // 


  /**
  * Edge cases:
    * We need to ensure a thinking sequence starts and ends with an assistant message.
    * We have a thinking sequence (denoted by valid `thinkingEndIndex`), but no `thinkingStartIndex`
      * Need to find the "last" assistant message in `context` array, starting from the end (so the first we encounter starting from the end)
    * We have no thinking block (none encountered in the passed `_messages` array)
      * Need to "create" thinking block one based off the first human message encountered in `prunedMemory` array, starting from the start of the array.
    * We have a thinking sequence but no "last" assistant message is found in `context` array from the earlier case
      * Need to create one, including the thinking block in its content array that we found or create.
    * It's possible our `thinkingStartIndex` falls outside the `context` array, so we need to check for that.
      *  If so, we need to add the thinking block to the "last" assistant message in `context` array, starting from the end (so the first we encounter starting from the end)
    * More context on thinking block requirements:
    *  The thinking block requirement is not strictly about the "first assistant message" in the context, but rather about the latest sequence of assistant/tool messages.

    In other words, if we have a sequence of messages like:

      1. Assistant message (with tool use)
      2. Tool message
      3. Human message
      4. Assistant message (with tool use)
      5. Tool message
      6. Assistant message (with tool use)
      7. Tool message
      8. Assistant message (with thinking block)

      Then we need to ensure that one of the assistant messages in this latest sequence (messages 4-8)
      has a thinking block. It doesn't have to be the very first assistant message in the context
      but it should be one of the assistant messages in the latest sequence of interactions.

      Note, at this point, the context array would like this if all those example messages fit into the current context token window:
      - 8 (Assistant message with thinking block), 7 (Tool), 6 (etc.), 5, 4, 3, 2, 1

   * More context on GENERAL pruning requirements (thinking or not):
      We should preserve AI <--> tool message correspondences when pruning, i.e.:

          const assistantMessageWithToolCall = // message.tool_calls
          const toolResponseMessage = new ToolMessage({
            content: [
              {
                type: "text",
                text: "{\"success\":true,\"message\":\"File content\"}",
              },
            ],
            tool_call_id: "tool123",
            name: "text_editor_mcp_textEditor",
          });
          const assistantMessageWithThinking = new AIMessage({
            content: [
              {
                type: "thinking",
                thinking: "This is a thinking block",
              },
              {
                type: "text",
                text: "Response with thinking",
              },
            ],
          });
          const messages = [
            new SystemMessage("System instruction"),
            new HumanMessage("Hello"),
            assistantMessageWithToolCall,
            toolResponseMessage,
            new HumanMessage("Next message"),
            assistantMessageWithThinking,
          ];

          // Note the correspondence of IDs between the assistant message and the tool message.
          // An AI message can correspond with X tool messages following it. 

          // if only the following messages fit in the context:
          const messages = [
            toolResponseMessage,
            new HumanMessage("Next message"),
            assistantMessageWithThinking,
          ];

          // then it must become:
          const messages = [
            new HumanMessage("Next message"),
            assistantMessageWithThinking,
          ];

   LASTLY, we need to recalculate the remainingContextTokens, since we may have added a new message
   to the context or re-ordered things, making sure our manipulation of the context array is correct and remains within the context array.
   In order to add thinking block when required, we should prioritize its insertion over the token count of subsequent content blocks and/or whole messages

   * 
   */
  return {
    remainingContextTokens,
    context: context.reverse(),
    messagesToRefine: prunedMemory,
  };
}

export function checkValidNumber(value: unknown): value is number {
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
