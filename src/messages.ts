// src/messages.ts
import { AIMessageChunk, HumanMessage, ToolMessage, AIMessage } from '@langchain/core/messages';
import { ToolCall } from '@langchain/core/tools';

export function getConverseOverrideMessage({
  userMessage,
  lastMessageX,
  lastMessageY
}: {
  userMessage: string[];
  lastMessageX: AIMessageChunk;
  lastMessageY: ToolMessage;
}): HumanMessage {
  const content = `
User: ${userMessage[1]}

---
# YOU HAVE ALREADY RESPONDED TO THE LATEST USER MESSAGE:

# Observations:
- ${lastMessageX.content}

# Tool Calls:
- ${lastMessageX?.tool_calls?.join('\n- ')}

# Tool Responses:
- ${lastMessageY.content}
`;

  return new HumanMessage(content);
}

export function modifyDeltaProperties(obj?: AIMessageChunk): AIMessageChunk | undefined {
  if (!obj || typeof obj !== 'object') return obj;

  const modifyContent = (content: any[]): any[] => {
    return content.map(item => {
      if (item && typeof item === 'object' && 'type' in item) {
        let newType = item.type;
        if (newType.endsWith('_delta')) {
          newType = newType.replace('_delta', '');
        }
        const allowedTypes = ['image_url', 'text', 'tool_use', 'tool_result'];
        if (!allowedTypes.includes(newType)) {
          newType = 'text';
        }
        return { ...item, type: newType };
      }
      return item;
    });
  };

  if (Array.isArray(obj.content)) {
    obj.content = modifyContent(obj.content);
  }
  if (obj.lc_kwargs && Array.isArray(obj.lc_kwargs.content)) {
    obj.lc_kwargs.content = modifyContent(obj.lc_kwargs.content);
  }
  return obj;
}

interface ExtendedMessageContent {
  type?: string;
  text?: string;
  input?: string;
  id?: string;
  name?: string;
}

export function formatAnthropicMessage(message: AIMessageChunk): AIMessage {
  if (!message.tool_calls || message.tool_calls.length === 0) {
    return new AIMessage(message.content);
  }

  const toolCallMap = new Map(message.tool_calls.map(tc => [tc.id, tc]));
  let formattedContent: string | ExtendedMessageContent[];

  if (Array.isArray(message.content)) {
    formattedContent = message.content.reduce<ExtendedMessageContent[]>((acc, item) => {
      if (typeof item === 'object' && item !== null) {
        const extendedItem = item as ExtendedMessageContent;
        if (extendedItem.type === 'text' && extendedItem.text) {
          acc.push({ type: 'text', text: extendedItem.text });
        } else if (extendedItem.type === 'tool_use' && extendedItem.id) {
          const toolCall = toolCallMap.get(extendedItem.id);
          if (toolCall) {
            acc.push({
              type: 'tool_use',
              id: extendedItem.id,
              name: toolCall.name,
              input: toolCall.args
            });
          }
        } else if ('input' in extendedItem && extendedItem.input) {
          try {
            const parsedInput = JSON.parse(extendedItem.input);
            const toolCall = message.tool_calls.find(tc => tc.args.input === parsedInput.input);
            if (toolCall) {
              acc.push({
                type: 'tool_use',
                id: toolCall.id,
                name: toolCall.name,
                input: toolCall.args
              });
            }
          } catch (e) {
            if (extendedItem.input.trim()) {
              acc.push({ type: 'text', text: extendedItem.input });
            }
          }
        }
      } else if (typeof item === 'string' && item.trim()) {
        acc.push({ type: 'text', text: item });
      }
      return acc;
    }, []);
  } else if (typeof message.content === 'string' && message.content.trim()) {
    formattedContent = message.content;
  } else {
    formattedContent = [];
  }

  const formattedToolCalls: ToolCall[] = message.tool_calls.map(toolCall => ({
    id: toolCall.id ?? '',
    type: 'function',
    function: {
      name: toolCall.name,
      arguments: toolCall.args
    }
  }));

  return new AIMessage({
    content: formattedContent,
    tool_calls: formattedToolCalls,
    additional_kwargs: {
      ...message.additional_kwargs,
    }
  });
}
