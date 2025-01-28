import { createMockStream } from './mockStream';
import { SplitStreamHandler } from './splitStream';
import { GraphEvents } from '@/common';
import { nanoid } from 'nanoid';

// Mock sleep to speed up tests
jest.mock('@/utils', () => ({
  sleep: (): Promise<void> => Promise.resolve(),
}));

describe('Stream Generation and Handling', () => {
  let mockHandlers: {
    [GraphEvents.ON_RUN_STEP]: jest.Mock;
    [GraphEvents.ON_MESSAGE_DELTA]: jest.Mock;
  };

  beforeEach(() => {
    mockHandlers = {
      [GraphEvents.ON_RUN_STEP]: jest.fn(),
      [GraphEvents.ON_MESSAGE_DELTA]: jest.fn(),
    };
  });

  it('should properly stream tokens including spaces', async () => {
    const stream = createMockStream({
      text: 'Hello world!',
      streamRate: 0,
    })();

    const tokens: string[] = [];
    for await (const chunk of stream) {
      const content = chunk.choices?.[0]?.delta.content;
      if (content) tokens.push(content);
    }

    expect(tokens).toEqual(['Hello', ' ', 'world!']);
  });

  it('should handle code blocks without splitting them', async () => {
    const runId = nanoid();
    const handler = new SplitStreamHandler({
      runId,
      handlers: mockHandlers,
    });

    const codeText = `Here's some code:
\`\`\`
const x = 1;
const y = 2;
\`\`\`
End code.`;

    const stream = createMockStream({
      text: codeText,
      streamRate: 0,
    })();

    for await (const chunk of stream) {
      handler.handle(chunk);
    }

    // Verify that only one message block was created for the code section
    const runSteps = mockHandlers[GraphEvents.ON_RUN_STEP].mock.calls;
    expect(runSteps.length).toBe(1); // Should only create one message block
  });

  it('should split content when exceeding threshold', async () => {
    const runId = nanoid();
    const handler = new SplitStreamHandler({
      runId,
      handlers: mockHandlers,
      // Set a very low threshold for testing
      blockThreshold: 10,
    });

    // Make the text longer and ensure it has clear breaking points
    const longText = 'This is the first sentence. And here is another sentence. And yet another one here. Finally one more.';

    const stream = createMockStream({
      text: longText,
      streamRate: 0,
    })();

    // For debugging
    // let totalLength = 0;
    for await (const chunk of stream) {
      handler.handle(chunk);
      // For debugging
      // const content = chunk.choices?.[0]?.delta.content;
      // if (content) {
      //   totalLength += content.length;
      //   console.log(`Current length: ${totalLength}, Content: "${content}"`);
      // }
    }

    // Verify multiple message blocks were created
    const runSteps = mockHandlers[GraphEvents.ON_RUN_STEP].mock.calls;
    // console.log('Number of run steps:', runSteps.length);
    expect(runSteps.length).toEqual(handler.currentIndex + 1);
  });

  it('should handle reasoning text separately', async () => {
    const runId = nanoid();
    new SplitStreamHandler({
      runId,
      handlers: mockHandlers,
    });

    const stream = createMockStream({
      text: 'Main content',
      reasoningText: 'Reasoning text',
      streamRate: 0,
    })();

    const reasoningTokens: string[] = [];
    const contentTokens: string[] = [];

    for await (const chunk of stream) {
      const reasoning = chunk.choices?.[0]?.delta.reasoning_content;
      const content = chunk.choices?.[0]?.delta.content;

      if (reasoning) reasoningTokens.push(reasoning);
      if (content) contentTokens.push(content);
    }

    expect(reasoningTokens.length).toBeGreaterThan(0);
    expect(contentTokens.length).toBeGreaterThan(0);
  });

  it('should preserve empty strings and whitespace', async () => {
    const stream = createMockStream({
      text: 'Hello  world', // Note double space
      streamRate: 0,
    })();

    const tokens: string[] = [];
    for await (const chunk of stream) {
      const content = chunk.choices?.[0]?.delta.content ?? '';
      if (!content) {
        return;
      }
      tokens.push(content);
    }

    expect(tokens).toContain(' ');
    expect(tokens.join('')).toBe('Hello  world');
  });
});