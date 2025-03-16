import { ToolMessage, BaseMessage } from '@langchain/core/messages';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { MessageContentImageUrl } from '@langchain/core/messages';
import type { ToolCall } from '@langchain/core/messages/tool';
import type { MessageContentComplex, ToolCallPart } from '@/types';
import { Providers, ContentTypes } from '@/common';

interface VisionMessageParams {
  message: {
    role: string;
    content: string;
    name?: string;
    [key: string]: any;
  };
  image_urls: MessageContentImageUrl[];
  endpoint?: Providers;
}

/**
 * Formats a message to OpenAI Vision API payload format.
 *
 * @param {VisionMessageParams} params - The parameters for formatting.
 * @returns {Object} - The formatted message.
 */
export const formatVisionMessage = ({ message, image_urls, endpoint }: VisionMessageParams): {
  role: string;
  content: MessageContentComplex[];
  name?: string;
  [key: string]: any;
} => {
  // Create a new object to avoid mutating the input
  const result: {
    role: string;
    content: MessageContentComplex[];
    name?: string;
    [key: string]: any;
  } = {
    ...message,
    content: [] as MessageContentComplex[]
  };
  
  if (endpoint === Providers.ANTHROPIC) {
    result.content = [
      ...image_urls, 
      { type: ContentTypes.TEXT, text: message.content }
    ] as MessageContentComplex[];
    return result;
  }

  result.content = [
    { type: ContentTypes.TEXT, text: message.content }, 
    ...image_urls
  ] as MessageContentComplex[];

  return result;
};

interface MessageInput {
  role?: string;
  _name?: string;
  sender?: string;
  text?: string;
  content?: string | MessageContentComplex[];
  image_urls?: MessageContentImageUrl[];
  lc_id?: string[];
  [key: string]: any;
}

interface FormatMessageParams {
  message: MessageInput;
  userName?: string;
  assistantName?: string;
  endpoint?: Providers;
  langChain?: boolean;
}

interface FormattedMessage {
  role: string;
  content: string | MessageContentComplex[];
  name?: string;
  [key: string]: any;
}

/**
 * Formats a message to OpenAI payload format based on the provided options.
 *
 * @param {FormatMessageParams} params - The parameters for formatting.
 * @returns {FormattedMessage | HumanMessage | AIMessage | SystemMessage} - The formatted message.
 */
export const formatMessage = ({ 
  message, 
  userName, 
  assistantName, 
  endpoint, 
  langChain = false 
}: FormatMessageParams): FormattedMessage | HumanMessage | AIMessage | SystemMessage => {
  let { role: _role, _name, sender, text, content: _content, lc_id } = message;
  if (lc_id && lc_id[2] && !langChain) {
    const roleMapping: Record<string, string> = {
      SystemMessage: 'system',
      HumanMessage: 'user',
      AIMessage: 'assistant',
    };
    _role = roleMapping[lc_id[2]] || _role;
  }
  const role = _role ?? (sender && sender?.toLowerCase() === 'user' ? 'user' : 'assistant');
  const content = _content ?? text ?? '';
  const formattedMessage: FormattedMessage = {
    role,
    content,
  };

  const { image_urls } = message;
  if (Array.isArray(image_urls) && image_urls.length > 0 && role === 'user') {
    return formatVisionMessage({
      message: {
        ...formattedMessage,
        content: typeof formattedMessage.content === 'string' ? formattedMessage.content : ''
      },
      image_urls,
      endpoint,
    });
  }

  if (_name) {
    formattedMessage.name = _name;
  }

  if (userName && formattedMessage.role === 'user') {
    formattedMessage.name = userName;
  }

  if (assistantName && formattedMessage.role === 'assistant') {
    formattedMessage.name = assistantName;
  }

  if (formattedMessage.name) {
    // Conform to API regex: ^[a-zA-Z0-9_-]{1,64}$
    // https://community.openai.com/t/the-format-of-the-name-field-in-the-documentation-is-incorrect/175684/2
    formattedMessage.name = formattedMessage.name.replace(/[^a-zA-Z0-9_-]/g, '_');

    if (formattedMessage.name.length > 64) {
      formattedMessage.name = formattedMessage.name.substring(0, 64);
    }
  }

  if (!langChain) {
    return formattedMessage;
  }

  if (role === 'user') {
    return new HumanMessage(formattedMessage);
  } else if (role === 'assistant') {
    return new AIMessage(formattedMessage);
  } else {
    return new SystemMessage(formattedMessage);
  }
};

/**
 * Formats an array of messages for LangChain.
 *
 * @param {Array<MessageInput>} messages - The array of messages to format.
 * @param {Omit<FormatMessageParams, 'message' | 'langChain'>} formatOptions - The options for formatting each message.
 * @returns {Array<HumanMessage | AIMessage | SystemMessage>} - The array of formatted LangChain messages.
 */
export const formatLangChainMessages = (
  messages: Array<MessageInput>, 
  formatOptions: Omit<FormatMessageParams, 'message' | 'langChain'>
): Array<HumanMessage | AIMessage | SystemMessage> => {
  return messages.map((msg) => {
    const formatted = formatMessage({ ...formatOptions, message: msg, langChain: true });
    return formatted as HumanMessage | AIMessage | SystemMessage;
  });
};

interface LangChainMessage {
  lc_kwargs?: {
    additional_kwargs?: Record<string, any>;
    [key: string]: any;
  };
  kwargs?: {
    additional_kwargs?: Record<string, any>;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Formats a LangChain message object by merging properties from `lc_kwargs` or `kwargs` and `additional_kwargs`.
 *
 * @param {LangChainMessage} message - The message object to format.
 * @returns {Record<string, any>} The formatted LangChain message.
 */
export const formatFromLangChain = (message: LangChainMessage): Record<string, any> => {
  const kwargs = message.lc_kwargs ?? message.kwargs ?? {};
  const { additional_kwargs = {}, ...message_kwargs } = kwargs;
  return {
    ...message_kwargs,
    ...additional_kwargs,
  };
};

interface TMessage {
  role?: string;
  content?: MessageContentComplex[];
  [key: string]: any;
}

/**
 * Formats an array of messages for LangChain, handling tool calls and creating ToolMessage instances.
 *
 * @param {Array<Partial<TMessage>>} payload - The array of messages to format.
 * @param {Record<number, number>} [indexTokenCountMap] - Optional map of message indices to token counts.
 * @returns {Object} - Object containing formatted messages and updated indexTokenCountMap if provided.
 */
export const formatAgentMessages = (
  payload: Array<Partial<TMessage>>, 
  indexTokenCountMap?: Record<number, number>
): {
  messages: Array<HumanMessage | AIMessage | SystemMessage | ToolMessage>;
  indexTokenCountMap?: Record<number, number>;
} => {
  const messages: Array<HumanMessage | AIMessage | SystemMessage | ToolMessage> = [];
  // If indexTokenCountMap is provided, create a new map to track the updated indices
  const updatedIndexTokenCountMap: Record<number, number> = {};
  // Keep track of the mapping from original payload indices to result indices
  const indexMapping: Record<number, number[]> = {};

  for (let i = 0; i < payload.length; i++) {
    const message = payload[i];
    // Q: Store the current length of messages to track where this payload message starts in the result?
    // const startIndex = messages.length;
    if (typeof message.content === 'string') {
      message.content = [{ type: ContentTypes.TEXT, [ContentTypes.TEXT]: message.content }];
    }
    if (message.role !== 'assistant') {
      messages.push(formatMessage({ 
        message: message as MessageInput, 
        langChain: true 
      }) as HumanMessage | AIMessage | SystemMessage);
      
      // Update the index mapping for this message
      indexMapping[i] = [messages.length - 1];
      continue;
    }

    // For assistant messages, track the starting index before processing
    const startMessageIndex = messages.length;

    let currentContent: MessageContentComplex[] = [];
    let lastAIMessage: AIMessage | null = null;

    let hasReasoning = false;
    if (Array.isArray(message.content)) {
      for (const part of message.content) {
        if (part.type === ContentTypes.TEXT && part.tool_call_ids) {
          /*
          If there's pending content, it needs to be aggregated as a single string to prepare for tool calls.
          For Anthropic models, the "tool_calls" field on a message is only respected if content is a string.
          */
          if (currentContent.length > 0) {
            let content = currentContent.reduce((acc, curr) => {
              if (curr.type === ContentTypes.TEXT) {
                return `${acc}${curr[ContentTypes.TEXT] || ''}\n`;
              }
              return acc;
            }, '');
            content = `${content}\n${part[ContentTypes.TEXT] ?? part.text ?? ''}`.trim();
            lastAIMessage = new AIMessage({ content });
            messages.push(lastAIMessage);
            currentContent = [];
            continue;
          }

          // Create a new AIMessage with this text and prepare for tool calls
          lastAIMessage = new AIMessage({
            content: part.text || '',
          });

          messages.push(lastAIMessage);
        } else if (part.type === ContentTypes.TOOL_CALL) {
          if (!lastAIMessage) {
            throw new Error('Invalid tool call structure: No preceding AIMessage with tool_call_ids');
          }

          // Note: `tool_calls` list is defined when constructed by `AIMessage` class, and outputs should be excluded from it
          const { output, args: _args, ..._tool_call } = (part.tool_call as ToolCallPart);
          const tool_call: ToolCallPart = _tool_call;
          // TODO: investigate; args as dictionary may need to be providers-or-tool-specific
          let args: any = _args;
          try {
            if (typeof _args === 'string') {
              args = JSON.parse(_args);
            }
          } catch (e) {
            if (typeof _args === 'string') {
              args = { input: _args };
            }
          }

          tool_call.args = args;
          if (!lastAIMessage.tool_calls) {
            lastAIMessage.tool_calls = [];
          }
          lastAIMessage.tool_calls.push(tool_call as ToolCall);

          // Add the corresponding ToolMessage
          messages.push(
            new ToolMessage({
              tool_call_id: tool_call.id ?? '',
              name: tool_call.name,
              content: output || '',
            }),
          );
        } else if (part.type === ContentTypes.THINK) {
          hasReasoning = true;
          continue;
        } else if (part.type === ContentTypes.ERROR || part.type === ContentTypes.AGENT_UPDATE) {
          continue;
        } else {
          currentContent.push(part);
        }
      }
    }

    if (hasReasoning && currentContent.length > 0) {
      const content = currentContent
        .reduce((acc, curr) => {
          if (curr.type === ContentTypes.TEXT) {
            return `${acc}${curr[ContentTypes.TEXT] || ''}\n`;
          }
          return acc;
        }, '')
        .trim();
      
      if (content) {
        messages.push(new AIMessage({ content }));
      }
    } else if (currentContent.length > 0) {
      messages.push(new AIMessage({ content: currentContent }));
    }
    
    // Update the index mapping for this assistant message
    // Store all indices that were created from this original message
    const endMessageIndex = messages.length;
    const resultIndices = [];
    for (let j = startMessageIndex; j < endMessageIndex; j++) {
      resultIndices.push(j);
    }
    indexMapping[i] = resultIndices;
  }

  // Update the token count map if it was provided
  if (indexTokenCountMap) {
    for (let originalIndex = 0; originalIndex < payload.length; originalIndex++) {
      const resultIndices = indexMapping[originalIndex] || [];
      const tokenCount = indexTokenCountMap[originalIndex];
      
      if (tokenCount !== undefined) {
        if (resultIndices.length === 1) {
          // Simple 1:1 mapping
          updatedIndexTokenCountMap[resultIndices[0]] = tokenCount;
        } else if (resultIndices.length > 1) {
          // If one message was split into multiple, distribute the token count
          // This is a simplification - in reality, you might want a more sophisticated distribution
          const countPerMessage = Math.floor(tokenCount / resultIndices.length);
          resultIndices.forEach((resultIndex, idx) => {
            if (idx === resultIndices.length - 1) {
              // Give any remainder to the last message
              updatedIndexTokenCountMap[resultIndex] = tokenCount - (countPerMessage * (resultIndices.length - 1));
            } else {
              updatedIndexTokenCountMap[resultIndex] = countPerMessage;
            }
          });
        }
      }
    }
  }

  return {
    messages,
    indexTokenCountMap: indexTokenCountMap ? updatedIndexTokenCountMap : undefined
  };
};

/**
 * Formats an array of messages for LangChain, making sure all content fields are strings
 * @param {Array<HumanMessage | AIMessage | SystemMessage | ToolMessage>} payload - The array of messages to format.
 * @returns {Array<HumanMessage | AIMessage | SystemMessage | ToolMessage>} - The array of formatted LangChain messages, including ToolMessages for tool calls.
 */
export const formatContentStrings = (payload: Array<BaseMessage>): Array<BaseMessage> => {
  // Create a copy of the payload to avoid modifying the original
  const result = [...payload];

  for (const message of result) {
    if (typeof message.content === 'string') {
      continue;
    }

    if (!Array.isArray(message.content)) {
      continue;
    }

    // Reduce text types to a single string, ignore all other types
    const content = message.content.reduce((acc, curr) => {
      if (curr.type === ContentTypes.TEXT) {
        return `${acc}${curr[ContentTypes.TEXT] || ''}\n`;
      }
      return acc;
    }, '');

    message.content = content.trim();
  }

  return result;
};

/**
 * Adds a value at key 0 for system messages and shifts all key indices by one in an indexTokenCountMap.
 * This is useful when adding a system message at the beginning of a conversation.
 * 
 * @param indexTokenCountMap - The original map of message indices to token counts
 * @param instructionsTokenCount - The token count for the system message to add at index 0
 * @returns A new map with the system message at index 0 and all other indices shifted by 1
 */
export function shiftIndexTokenCountMap(
  indexTokenCountMap: Record<number, number>,
  instructionsTokenCount: number
): Record<number, number> {
  // Create a new map to avoid modifying the original
  const shiftedMap: Record<number, number> = {};
  
  // Add the system message token count at index 0
  shiftedMap[0] = instructionsTokenCount;
  
  // Shift all existing indices by 1
  for (const [indexStr, tokenCount] of Object.entries(indexTokenCountMap)) {
    const index = Number(indexStr);
    shiftedMap[index + 1] = tokenCount;
  }
  
  return shiftedMap;
}
