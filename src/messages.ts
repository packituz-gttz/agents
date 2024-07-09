import { AIMessageChunk, BaseMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";

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
}