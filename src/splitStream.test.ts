import { nanoid } from 'nanoid';
import { MessageContentText } from '@langchain/core/messages';
import type * as t from '@/types';
import { GraphEvents , StepTypes, ContentTypes } from '@/common';
import { createContentAggregator } from './stream';
import { SplitStreamHandler } from './splitStream';
import { createMockStream } from './mockStream';

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
      const content = chunk.choices?.[0]?.delta.content ?? '';
      if (content) tokens.push(content);
    }

    expect(tokens).toEqual(['Hello', ' ', 'world!']);
  });

  it('should handle code blocks without splitting them', async () => {
    const runId = nanoid();
    const handler = new SplitStreamHandler({
      runId,
      blockThreshold: 10,
      handlers: mockHandlers,
    });

    const codeText = `Code:
\`\`\`
const x = 1;
const y = 2;
const z = 2;
const a = 2;
const b = 2;
const c = 2;
const d = 2;
const e = 2;
const f = 2;
const g = 2;
const h = 2;
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
    expect(runSteps.length).toBe(2); // Should only create one message block
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
      const reasoning = chunk.choices?.[0]?.delta.reasoning_content ?? '';
      const content = chunk.choices?.[0]?.delta.content ?? '';

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

describe('ContentAggregator with SplitStreamHandler', () => {
  it('should aggregate content from multiple message blocks', async () => {
    const runId = nanoid();
    const { contentParts, aggregateContent } = createContentAggregator();

    const handler = new SplitStreamHandler({
      runId,
      handlers: {
        [GraphEvents.ON_RUN_STEP]: aggregateContent,
        [GraphEvents.ON_MESSAGE_DELTA]: aggregateContent,
      },
      blockThreshold: 10,
    });

    const text = 'First sentence. Second sentence. Third sentence.';
    const stream = createMockStream({ text, streamRate: 0 })();

    for await (const chunk of stream) {
      handler.handle(chunk);
    }

    expect(contentParts.length).toBeGreaterThan(1);
    contentParts.forEach(part => {
      expect(part?.type).toBe(ContentTypes.TEXT);
      if (part?.type === ContentTypes.TEXT) {
        expect(typeof part.text).toBe('string');
        expect(part.text.length).toBeGreaterThan(0);
      }
    });

    const fullText = contentParts
      .filter(part => part?.type === ContentTypes.TEXT)
      .map(part => (part?.type === ContentTypes.TEXT ? part.text : ''))
      .join('');
    expect(fullText).toBe(text);
  });

  it('should maintain content order across splits', async () => {
    const runId = nanoid();
    const { contentParts, aggregateContent } = createContentAggregator();

    const handler = new SplitStreamHandler({
      runId,
      handlers: {
        [GraphEvents.ON_RUN_STEP]: aggregateContent,
        [GraphEvents.ON_MESSAGE_DELTA]: aggregateContent,
      },
      blockThreshold: 15,
    });

    const text = 'First part. Second part. Third part.';
    const stream = createMockStream({ text, streamRate: 0 })();

    for await (const chunk of stream) {
      handler.handle(chunk);
    }

    const texts = contentParts
      .filter(part => part?.type === ContentTypes.TEXT)
      .map(part => (part?.type === ContentTypes.TEXT ? part.text : ''));

    expect(texts[0]).toContain('First');
    expect(texts[texts.length - 1]).toContain('Third');
  });

  it('should handle code blocks as single content parts', async () => {
    const runId = nanoid();
    const { contentParts, aggregateContent } = createContentAggregator();

    const handler = new SplitStreamHandler({
      runId,
      handlers: {
        [GraphEvents.ON_RUN_STEP]: aggregateContent,
        [GraphEvents.ON_MESSAGE_DELTA]: aggregateContent,
      },
      blockThreshold: 10,
    });

    const text = `Before code.
\`\`\`python
def test():
    return True
\`\`\`
After code.`;

    const stream = createMockStream({ text, streamRate: 0 })();

    for await (const chunk of stream) {
      handler.handle(chunk);
    }

    const codeBlockPart = contentParts.find(part =>
      part?.type === ContentTypes.TEXT &&
      part.text.includes('```python')
    );

    expect(codeBlockPart).toBeDefined();
    if (codeBlockPart?.type === ContentTypes.TEXT) {
      expect(codeBlockPart.text).toContain('def test()');
      expect(codeBlockPart.text).toContain('return True');
    }
  });

  it('should properly map steps to their content', async () => {
    const runId = nanoid();
    const { contentParts, aggregateContent, stepMap } = createContentAggregator();

    const handler = new SplitStreamHandler({
      runId,
      handlers: {
        [GraphEvents.ON_RUN_STEP]: aggregateContent,
        [GraphEvents.ON_MESSAGE_DELTA]: aggregateContent,
      },
      blockThreshold: 5,
    });

    const text = 'Hi. Ok. Yes.';
    const stream = createMockStream({ text, streamRate: 0 })();

    for await (const chunk of stream) {
      handler.handle(chunk);
    }

    Array.from(stepMap.entries()).forEach(([_stepId, step]) => {
      expect(step?.type).toBe(StepTypes.MESSAGE_CREATION);
      const currentIndex = step?.index ?? -1;
      const stepContent = contentParts[currentIndex];
      if (!stepContent && currentIndex > 0) {
        const prevStepContent = contentParts[currentIndex - 1];
        expect((prevStepContent as MessageContentText | undefined)?.text).toEqual(text);
      } else if (stepContent?.type === ContentTypes.TEXT) {
        expect(stepContent.text.length).toBeGreaterThan(0);
      }
    });

    contentParts.forEach((part, index) => {
      const hasMatchingStep = Array.from(stepMap.values()).some(
        step => step?.index === index
      );
      expect(hasMatchingStep).toBe(true);
    });
  });

  it('should aggregate content across multiple splits while preserving order', async () => {
    const runId = nanoid();
    const { contentParts, aggregateContent } = createContentAggregator();

    const handler = new SplitStreamHandler({
      runId,
      handlers: {
        [GraphEvents.ON_RUN_STEP]: aggregateContent,
        [GraphEvents.ON_MESSAGE_DELTA]: aggregateContent,
      },
      blockThreshold: 10,
    });

    const text = 'A. B. C. D. E. F.';
    const stream = createMockStream({ text, streamRate: 0 })();

    for await (const chunk of stream) {
      handler.handle(chunk);
    }

    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    let letterIndex = 0;

    contentParts.forEach(part => {
      if (part?.type === ContentTypes.TEXT) {
        while (letterIndex < letters.length &&
               part.text.includes(letters[letterIndex]) === true) {
          letterIndex++;
        }
      }
    });

    expect(letterIndex).toBe(letters.length);
  });
});

describe('SplitStreamHandler with Reasoning Tokens', () => {
  it('should apply same splitting rules to both content types', async () => {
    const runId = nanoid();
    const mockHandlers: t.SplitStreamHandlers = {
      [GraphEvents.ON_RUN_STEP]: jest.fn(),
      [GraphEvents.ON_MESSAGE_DELTA]: jest.fn(),
      [GraphEvents.ON_REASONING_DELTA]: jest.fn(),
    };

    const handler = new SplitStreamHandler({
      runId,
      handlers: mockHandlers,
      blockThreshold: 10,
    });

    const stream = createMockStream({
      text: 'First text. Second text. Third text.',
      reasoningText: 'First thought. Second thought. Third thought.',
      streamRate: 0,
    })();

    for await (const chunk of stream) {
      handler.handle(chunk);
    }

    const runSteps = (mockHandlers[GraphEvents.ON_RUN_STEP] as jest.Mock).mock.calls;
    const reasoningDeltas = (mockHandlers[GraphEvents.ON_REASONING_DELTA] as jest.Mock).mock.calls;
    const messageDeltas = (mockHandlers[GraphEvents.ON_MESSAGE_DELTA] as jest.Mock).mock.calls;

    // Both content types should create multiple blocks
    expect(runSteps.length).toBeGreaterThan(2);
    expect(reasoningDeltas.length).toBeGreaterThan(0);
    expect(messageDeltas.length).toBeGreaterThan(0);

    // Verify splitting behavior for both types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getStepTypes = (calls: any[]): string[] => calls.map(([{ data }]) =>
      data.stepDetails?.type === StepTypes.MESSAGE_CREATION ?
        data.stepDetails.message_creation.message_id : null
    ).filter(Boolean);

    const messageSteps = getStepTypes(runSteps);
    expect(new Set(messageSteps).size).toBeGreaterThan(1);
  });
});