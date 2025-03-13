import { HumanMessage, AIMessage, SystemMessage, ToolMessage } from '@langchain/core/messages';
import { formatAgentMessages } from './format';
import { ContentTypes } from '@/common';

describe('formatAgentMessages', () => {
  it('should format simple user and AI messages', () => {
    const payload = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' },
    ];
    const result = formatAgentMessages(payload);
    expect(result.messages).toHaveLength(2);
    expect(result.messages[0]).toBeInstanceOf(HumanMessage);
    expect(result.messages[1]).toBeInstanceOf(AIMessage);
  });

  it('should handle system messages', () => {
    const payload = [{ role: 'system', content: 'You are a helpful assistant.' }];
    const result = formatAgentMessages(payload);
    expect(result.messages).toHaveLength(1);
    expect(result.messages[0]).toBeInstanceOf(SystemMessage);
  });

  it('should format messages with content arrays', () => {
    const payload = [
      {
        role: 'user',
        content: [{ type: ContentTypes.TEXT, [ContentTypes.TEXT]: 'Hello' }],
      },
    ];
    const result = formatAgentMessages(payload);
    expect(result.messages).toHaveLength(1);
    expect(result.messages[0]).toBeInstanceOf(HumanMessage);
  });

  it('should handle tool calls and create ToolMessages', () => {
    const payload = [
      {
        role: 'assistant',
        content: [
          {
            type: ContentTypes.TEXT,
            [ContentTypes.TEXT]: 'Let me check that for you.',
            tool_call_ids: ['123'],
          },
          {
            type: ContentTypes.TOOL_CALL,
            tool_call: {
              id: '123',
              name: 'search',
              args: '{"query":"weather"}',
              output: 'The weather is sunny.',
            },
          },
        ],
      },
    ];
    const result = formatAgentMessages(payload);
    expect(result.messages).toHaveLength(2);
    expect(result.messages[0]).toBeInstanceOf(AIMessage);
    expect(result.messages[1]).toBeInstanceOf(ToolMessage);
    expect((result.messages[0] as AIMessage).tool_calls).toHaveLength(1);
    expect((result.messages[1] as ToolMessage).tool_call_id).toBe('123');
  });

  it('should handle multiple content parts in assistant messages', () => {
    const payload = [
      {
        role: 'assistant',
        content: [
          { type: ContentTypes.TEXT, [ContentTypes.TEXT]: 'Part 1' },
          { type: ContentTypes.TEXT, [ContentTypes.TEXT]: 'Part 2' },
        ],
      },
    ];
    const result = formatAgentMessages(payload);
    expect(result.messages).toHaveLength(1);
    expect(result.messages[0]).toBeInstanceOf(AIMessage);
    expect(result.messages[0].content).toHaveLength(2);
  });

  it('should throw an error for invalid tool call structure', () => {
    const payload = [
      {
        role: 'assistant',
        content: [
          {
            type: ContentTypes.TOOL_CALL,
            tool_call: {
              id: '123',
              name: 'search',
              args: '{"query":"weather"}',
              output: 'The weather is sunny.',
            },
          },
        ],
      },
    ];
    expect(() => formatAgentMessages(payload)).toThrow('Invalid tool call structure');
  });

  it('should handle tool calls with non-JSON args', () => {
    const payload = [
      {
        role: 'assistant',
        content: [
          { type: ContentTypes.TEXT, [ContentTypes.TEXT]: 'Checking...', tool_call_ids: ['123'] },
          {
            type: ContentTypes.TOOL_CALL,
            tool_call: {
              id: '123',
              name: 'search',
              args: 'non-json-string',
              output: 'Result',
            },
          },
        ],
      },
    ];
    const result = formatAgentMessages(payload);
    expect(result.messages).toHaveLength(2);
    expect((result.messages[0] as AIMessage).tool_calls?.[0].args).toStrictEqual({ input: 'non-json-string' });
  });

  it('should handle complex tool calls with multiple steps', () => {
    const payload = [
      {
        role: 'assistant',
        content: [
          {
            type: ContentTypes.TEXT,
            [ContentTypes.TEXT]: 'I\'ll search for that information.',
            tool_call_ids: ['search_1'],
          },
          {
            type: ContentTypes.TOOL_CALL,
            tool_call: {
              id: 'search_1',
              name: 'search',
              args: '{"query":"weather in New York"}',
              output: 'The weather in New York is currently sunny with a temperature of 75°F.',
            },
          },
          {
            type: ContentTypes.TEXT,
            [ContentTypes.TEXT]: 'Now, I\'ll convert the temperature.',
            tool_call_ids: ['convert_1'],
          },
          {
            type: ContentTypes.TOOL_CALL,
            tool_call: {
              id: 'convert_1',
              name: 'convert_temperature',
              args: '{"temperature": 75, "from": "F", "to": "C"}',
              output: '23.89°C',
            },
          },
          { type: ContentTypes.TEXT, [ContentTypes.TEXT]: 'Here\'s your answer.' },
        ],
      },
    ];

    const result = formatAgentMessages(payload);

    expect(result.messages).toHaveLength(5);
    expect(result.messages[0]).toBeInstanceOf(AIMessage);
    expect(result.messages[1]).toBeInstanceOf(ToolMessage);
    expect(result.messages[2]).toBeInstanceOf(AIMessage);
    expect(result.messages[3]).toBeInstanceOf(ToolMessage);
    expect(result.messages[4]).toBeInstanceOf(AIMessage);

    // Check first AIMessage
    expect(result.messages[0].content).toBe('I\'ll search for that information.');
    expect((result.messages[0] as AIMessage).tool_calls).toHaveLength(1);
    expect((result.messages[0] as AIMessage).tool_calls?.[0]).toEqual({
      id: 'search_1',
      name: 'search',
      args: { query: 'weather in New York' },
    });

    // Check first ToolMessage
    expect((result.messages[1] as ToolMessage).tool_call_id).toBe('search_1');
    expect(result.messages[1].name).toBe('search');
    expect(result.messages[1].content).toBe(
      'The weather in New York is currently sunny with a temperature of 75°F.',
    );

    // Check second AIMessage
    expect(result.messages[2].content).toBe('Now, I\'ll convert the temperature.');
    expect((result.messages[2] as AIMessage).tool_calls).toHaveLength(1);
    expect((result.messages[2] as AIMessage).tool_calls?.[0]).toEqual({
      id: 'convert_1',
      name: 'convert_temperature',
      args: { temperature: 75, from: 'F', to: 'C' },
    });

    // Check second ToolMessage
    expect((result.messages[3] as ToolMessage).tool_call_id).toBe('convert_1');
    expect(result.messages[3].name).toBe('convert_temperature');
    expect(result.messages[3].content).toBe('23.89°C');

    // Check final AIMessage
    expect(result.messages[4].content).toStrictEqual([
      { [ContentTypes.TEXT]: 'Here\'s your answer.', type: ContentTypes.TEXT },
    ]);
  });

  it.skip('should not produce two consecutive assistant messages and format content correctly', () => {
    const payload = [
      { role: 'user', content: 'Hello' },
      {
        role: 'assistant',
        content: [{ type: ContentTypes.TEXT, [ContentTypes.TEXT]: 'Hi there!' }],
      },
      {
        role: 'assistant',
        content: [{ type: ContentTypes.TEXT, [ContentTypes.TEXT]: 'How can I help you?' }],
      },
      { role: 'user', content: 'What\'s the weather?' },
      {
        role: 'assistant',
        content: [
          {
            type: ContentTypes.TEXT,
            [ContentTypes.TEXT]: 'Let me check that for you.',
            tool_call_ids: ['weather_1'],
          },
          {
            type: ContentTypes.TOOL_CALL,
            tool_call: {
              id: 'weather_1',
              name: 'check_weather',
              args: '{"location":"New York"}',
              output: 'Sunny, 75°F',
            },
          },
        ],
      },
      {
        role: 'assistant',
        content: [
          { type: ContentTypes.TEXT, [ContentTypes.TEXT]: 'Here\'s the weather information.' },
        ],
      },
    ];

    const result = formatAgentMessages(payload);

    // Check correct message count and types
    expect(result.messages).toHaveLength(6);
    expect(result.messages[0]).toBeInstanceOf(HumanMessage);
    expect(result.messages[1]).toBeInstanceOf(AIMessage);
    expect(result.messages[2]).toBeInstanceOf(HumanMessage);
    expect(result.messages[3]).toBeInstanceOf(AIMessage);
    expect(result.messages[4]).toBeInstanceOf(ToolMessage);
    expect(result.messages[5]).toBeInstanceOf(AIMessage);

    // Check content of messages
    expect(result.messages[0].content).toStrictEqual([
      { [ContentTypes.TEXT]: 'Hello', type: ContentTypes.TEXT },
    ]);
    expect(result.messages[1].content).toStrictEqual([
      { [ContentTypes.TEXT]: 'Hi there!', type: ContentTypes.TEXT },
      { [ContentTypes.TEXT]: 'How can I help you?', type: ContentTypes.TEXT },
    ]);
    expect(result.messages[2].content).toStrictEqual([
      { [ContentTypes.TEXT]: 'What\'s the weather?', type: ContentTypes.TEXT },
    ]);
    expect(result.messages[3].content).toBe('Let me check that for you.');
    expect(result.messages[4].content).toBe('Sunny, 75°F');
    expect(result.messages[5].content).toStrictEqual([
      { [ContentTypes.TEXT]: 'Here\'s the weather information.', type: ContentTypes.TEXT },
    ]);

    // Check that there are no consecutive AIMessages
    const messageTypes = result.messages.map((message) => message.constructor);
    for (let i = 0; i < messageTypes.length - 1; i++) {
      expect(messageTypes[i] === AIMessage && messageTypes[i + 1] === AIMessage).toBe(false);
    }

    // Additional check to ensure the consecutive assistant messages were combined
    expect(result.messages[1].content).toHaveLength(2);
  });

  it('should skip THINK type content parts', () => {
    const payload = [
      {
        role: 'assistant',
        content: [
          { type: ContentTypes.TEXT, [ContentTypes.TEXT]: 'Initial response' },
          { type: ContentTypes.THINK, [ContentTypes.THINK]: 'Reasoning about the problem...' },
          { type: ContentTypes.TEXT, [ContentTypes.TEXT]: 'Final answer' },
        ],
      },
    ];

    const result = formatAgentMessages(payload);

    expect(result.messages).toHaveLength(1);
    expect(result.messages[0]).toBeInstanceOf(AIMessage);
    expect(result.messages[0].content).toEqual('Initial response\nFinal answer');
  });

  it('should join TEXT content as string when THINK content type is present', () => {
    const payload = [
      {
        role: 'assistant',
        content: [
          { type: ContentTypes.THINK, [ContentTypes.THINK]: 'Analyzing the problem...' },
          { type: ContentTypes.TEXT, [ContentTypes.TEXT]: 'First part of response' },
          { type: ContentTypes.TEXT, [ContentTypes.TEXT]: 'Second part of response' },
          { type: ContentTypes.TEXT, [ContentTypes.TEXT]: 'Final part of response' },
        ],
      },
    ];

    const result = formatAgentMessages(payload);

    expect(result.messages).toHaveLength(1);
    expect(result.messages[0]).toBeInstanceOf(AIMessage);
    expect(typeof result.messages[0].content).toBe('string');
    expect(result.messages[0].content).toBe(
      'First part of response\nSecond part of response\nFinal part of response',
    );
    expect(result.messages[0].content).not.toContain('Analyzing the problem...');
  });

  it('should exclude ERROR type content parts', () => {
    const payload = [
      {
        role: 'assistant',
        content: [
          { type: ContentTypes.TEXT, [ContentTypes.TEXT]: 'Hello there' },
          {
            type: ContentTypes.ERROR,
            [ContentTypes.ERROR]:
              'An error occurred while processing the request: Something went wrong',
          },
          { type: ContentTypes.TEXT, [ContentTypes.TEXT]: 'Final answer' },
        ],
      },
    ];

    const result = formatAgentMessages(payload);

    expect(result.messages).toHaveLength(1);
    expect(result.messages[0]).toBeInstanceOf(AIMessage);
    expect(result.messages[0].content).toEqual([
      { type: ContentTypes.TEXT, [ContentTypes.TEXT]: 'Hello there' },
      { type: ContentTypes.TEXT, [ContentTypes.TEXT]: 'Final answer' },
    ]);

    const hasErrorContent = Array.isArray(result.messages[0].content) && result.messages[0].content.some(
      (item) =>
        item.type === ContentTypes.ERROR || JSON.stringify(item).includes('An error occurred'),
    );
    expect(hasErrorContent).toBe(false);
  });
  it('should handle indexTokenCountMap and return updated map', () => {
    const payload = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' },
    ];
    
    const indexTokenCountMap = {
      0: 5,  // 5 tokens for "Hello"
      1: 10, // 10 tokens for "Hi there!"
    };
    
    const result = formatAgentMessages(payload, indexTokenCountMap);
    
    expect(result.messages).toHaveLength(2);
    expect(result.indexTokenCountMap).toBeDefined();
    expect(result.indexTokenCountMap?.[0]).toBe(5);
    expect(result.indexTokenCountMap?.[1]).toBe(10);
  });

  it('should handle complex message transformations with indexTokenCountMap', () => {
    const payload = [
      { role: 'user', content: 'What\'s the weather?' },
      {
        role: 'assistant',
        content: [
          {
            type: ContentTypes.TEXT,
            [ContentTypes.TEXT]: 'Let me check that for you.',
            tool_call_ids: ['weather_1'],
          },
          {
            type: ContentTypes.TOOL_CALL,
            tool_call: {
              id: 'weather_1',
              name: 'check_weather',
              args: '{"location":"New York"}',
              output: 'Sunny, 75°F',
            },
          },
        ],
      },
    ];
    
    const indexTokenCountMap = {
      0: 10,  // 10 tokens for "What's the weather?"
      1: 50,  // 50 tokens for the assistant message with tool call
    };
    
    const result = formatAgentMessages(payload, indexTokenCountMap);
    
    // The original message at index 1 should be split into two messages
    expect(result.messages).toHaveLength(3);
    expect(result.indexTokenCountMap).toBeDefined();
    expect(result.indexTokenCountMap?.[0]).toBe(10);  // User message stays the same
    
    // The assistant message tokens should be distributed across the resulting messages
    const totalAssistantTokens = Object.values(result.indexTokenCountMap || {})
      .reduce((sum, count) => sum + count, 0) - 10; // Subtract user message tokens
    
    expect(totalAssistantTokens).toBe(50); // Should match the original token count
  });
});
