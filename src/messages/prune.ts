import { AIMessage, BaseMessage, UsageMetadata } from '@langchain/core/messages';
import type { ThinkingContentText, MessageContentComplex } from '@/types/stream';
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
  startType?: ReturnType<BaseMessage['getType']>;
}

function isIndexInContext(arrayA: any[], arrayB: any[], targetIndex: number): boolean {
  const startingIndexInA = arrayA.length - arrayB.length;
  return targetIndex >= startingIndexInA;
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
  startType: _startType,
  thinkingEnabled,
  /** We may need to use this when recalculating */
  tokenCounter,
}: {
  messages: BaseMessage[];
  maxContextTokens: number;
  indexTokenCountMap: Record<string, number>;
  tokenCounter: TokenCounter;
  startType?: string;
  thinkingEnabled?: boolean;
}): {
  context: BaseMessage[];
  remainingContextTokens: number;
  messagesToRefine: BaseMessage[];
} {
  // Every reply is primed with <|start|>assistant<|message|>, so we
  // start with 3 tokens for the label after all messages have been counted.
  let currentTokenCount = 3;
  const instructions = _messages[0]?.getType() === 'system' ? _messages[0] : undefined;
  const instructionsTokenCount = instructions != null ? indexTokenCountMap[0] : 0;
  const initialContextTokens = maxContextTokens - instructionsTokenCount;
  let remainingContextTokens = initialContextTokens;
  let startType = _startType;

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
      const messageType = poppedMessage.getType();
      if (thinkingEnabled && currentIndex === (_messages.length - 1) && (messageType === 'ai') || (messageType === 'tool')) {
        thinkingEndIndex = currentIndex;
      }
      if (thinkingEndIndex > -1 && !thinkingBlock  && thinkingStartIndex < 0 && messageType === 'ai' && Array.isArray(poppedMessage.content)) {
        thinkingBlock = (poppedMessage.content.find((content) => content.type === ContentTypes.THINKING)) as ThinkingContentText;
        thinkingStartIndex = thinkingBlock != null ? currentIndex : -1;
      }
      /** False start, the latest message was not part of a multi-assistant/tool sequence of messages */
      if (
        thinkingEndIndex > -1
        && currentIndex === (thinkingEndIndex - 1)
        && (messageType !== 'ai' && messageType !== 'tool')
      ) {
        thinkingEndIndex = -1;
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

    if (thinkingEndIndex > -1 && context[context.length - 1].getType() === 'tool') {
      startType = 'ai';
    }

    if (startType && context.length > 0) {
      const requiredTypeIndex = context.findIndex(msg => msg.getType() === startType);

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
  const result = {
    remainingContextTokens,
    context: [] as BaseMessage[],
    messagesToRefine: prunedMemory,
  };

  if (prunedMemory.length === 0 || thinkingEndIndex < 0 || (thinkingStartIndex > -1 && isIndexInContext(_messages, context, thinkingStartIndex))) {
    // we reverse at this step to ensure the context is in the correct order for the model, and we need to work backwards
    result.context = context.reverse();
    return result;
  }

  if (thinkingEndIndex > -1 && thinkingStartIndex < 0) {
    throw new Error('The payload is malformed. There is a thinking sequence but no "AI" messages with thinking blocks.');
  }

  if (!thinkingBlock) {
    throw new Error('The payload is malformed. There is a thinking sequence but no thinking block found.');
  }

  // Since we have a thinking sequence, we need to find the last assistant message
  // in the latest AI/tool sequence to add the thinking block that falls outside of the current context
  // Latest messages are ordered first.
  let assistantIndex = -1;
  for (let i = 0; i < context.length; i++) {
    const currentMessage = context[i];
    const type = currentMessage.getType();
    if (type === 'ai') {
      assistantIndex = i;
    }
    if (assistantIndex > -1 && (type === 'human' || type === 'system')) {
      break;
    }
  }

  if (assistantIndex === -1) {
    throw new Error('The payload is malformed. There is a thinking sequence but no "AI" messages to append thinking blocks to.');
  }

  thinkingStartIndex = _messages.length - 1 - assistantIndex;
  const thinkingTokenCount = tokenCounter(new AIMessage({ content: [thinkingBlock] }));
  const newRemainingCount = remainingContextTokens - thinkingTokenCount;

  const content: MessageContentComplex[] = Array.isArray(context[assistantIndex].content)
    ? context[assistantIndex].content as MessageContentComplex[]
    : [{
      type: ContentTypes.TEXT,
      text: context[assistantIndex].content,
    }];
  content.unshift(thinkingBlock);
  context[assistantIndex].content = content;
  if (newRemainingCount > 0) {
    result.context = context.reverse();
    return result;
  }

  const thinkingMessage = context[assistantIndex];
  // now we need to an additional round of pruning but making the thinking block fit
  const newThinkingMessageTokenCount = indexTokenCountMap[thinkingStartIndex] + thinkingTokenCount;
  remainingContextTokens = initialContextTokens - newThinkingMessageTokenCount;
  currentTokenCount = 3;
  let newContext: BaseMessage[] = [];
  const secondRoundMessages = [..._messages];
  let currentIndex = secondRoundMessages.length;
  while (secondRoundMessages.length > 0 && currentTokenCount < remainingContextTokens && currentIndex > thinkingStartIndex) {
    currentIndex--;
    const poppedMessage = secondRoundMessages.pop();
    if (!poppedMessage) continue;
    const tokenCount = indexTokenCountMap[currentIndex] || 0;
    if ((currentTokenCount + tokenCount) <= remainingContextTokens) {
      newContext.push(poppedMessage);
      currentTokenCount += tokenCount;
    } else {
      messages.push(poppedMessage);
      break;
    }
  }

  if (newContext[newContext.length - 1].getType() === 'tool') {
    startType = 'ai';
  }

  if (startType && newContext.length > 0) {
    const requiredTypeIndex = newContext.findIndex(msg => msg.getType() === startType);
    if (requiredTypeIndex > 0) {
      newContext = newContext.slice(requiredTypeIndex);
    }
  }

  newContext.push(thinkingMessage);

  if (instructions && _messages.length > 0) {
    newContext.push(_messages[0] as BaseMessage);
    secondRoundMessages.shift();
  }

  result.context = newContext.reverse();
  return result;
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
      startType: params.startType,
      thinkingEnabled: factoryParams.thinkingEnabled,
      tokenCounter: factoryParams.tokenCounter,
    });

    return { context, indexTokenCountMap };
  };
}
