// src/messages.ts
import { AIMessageChunk, HumanMessage, ToolMessage, AIMessage, MessageContentComplex } from '@langchain/core/messages';

export const getConverseOverrideMessage = ({
  userMessage,
  lastMessageX,
  lastMessageY,
} : {
  userMessage: string[],
  lastMessageX: AIMessageChunk,
  lastMessageY: ToolMessage,
}) => {

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

  return new HumanMessage({ content });
};

export function modifyDeltaProperties(obj?: AIMessageChunk) {
  if (obj && typeof obj === 'object') {
    const modifyContent = (content: any[]) => {
      return content.map(item => {
        if (item && typeof item === 'object' && item.type) {
          let newType = item.type;

          // Remove _delta suffix if present
          if (newType.endsWith('_delta')) {
            newType = newType.replace('_delta', '');
          }

          // Check if the type is not one of the allowed types
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
  }
  return obj;
}

export function formatAnthropicMessage(message: AIMessageChunk): any {
  if (!message.tool_calls || message.tool_calls.length === 0) {
    return message;
  }

  const toolCallMap = new Map(message.tool_calls.map(tc => [tc.id, tc]));

  let formattedContent: MessageContentComplex;

  if (Array.isArray(message.content)) {
    formattedContent = message.content.reduce((acc, item) => {
      if (Array.isArray(acc) && item.type === 'text' && item.text) {
        acc.push({ type: 'text', text: item.text });
      } else if (Array.isArray(acc) && item.type === 'tool_use') {
        const toolCall = toolCallMap.get(item.id);
        if (toolCall) {
          acc.push({
            type: 'tool_use',
            id: item.id,
            name: toolCall.name,
            input: toolCall.args // Use the args from the tool call
          });
        }
      } else if (Array.isArray(acc) && item.input && message.tool_calls) {
        try {
          const parsedInput = JSON.parse(item.input);
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
          if (item.input && item.input.trim()) {
            acc.push({ type: 'text', text: item.input });
          }
        }
      } else if (typeof item === 'string' && item.trim()) {
        acc.push({ type: 'text', text: item });
      }
      return acc;
    }, []);
  } else if (typeof message.content === 'string' && message.content.trim()) {
    formattedContent = [{ type: 'text', text: message.content }];
  } else {
    formattedContent = [];
  }

  const formattedToolCalls = message.tool_calls.map(toolCall => ({
    id: toolCall.id,
    type: 'function',
    function: {
      name: toolCall.name,
      arguments: JSON.stringify(toolCall.args)
    }
  }));

  return new AIMessage({
    content: formattedContent,
    additional_kwargs: {
      ...message.additional_kwargs,
      tool_calls: formattedToolCalls
    }
  });
}
