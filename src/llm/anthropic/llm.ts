import { AIMessageChunk } from '@langchain/core/messages';
import { ChatAnthropicMessages } from '@langchain/anthropic';
import { ChatGenerationChunk } from '@langchain/core/outputs';
import type { BaseMessage, MessageContentComplex } from '@langchain/core/messages';
import type { CallbackManagerForLLMRun } from '@langchain/core/callbacks/manager';
import type { AnthropicInput } from '@langchain/anthropic';
import type { AnthropicMessageCreateParams } from '@/llm/anthropic/types';
import { _makeMessageChunkFromAnthropicEvent } from './utils/message_outputs';
import { _convertMessagesToAnthropicPayload } from './utils/message_inputs';
import { TextStream } from '@/llm/text';

function _toolsInParams(params: AnthropicMessageCreateParams): boolean {
  return !!(params.tools && params.tools.length > 0);
}

function extractToken(chunk: AIMessageChunk): [string, 'string' | 'input' | 'content'] | [undefined] {
  if (typeof chunk.content === 'string') {
    return [chunk.content, 'string'];
  } else if (
    Array.isArray(chunk.content) &&
    chunk.content.length >= 1 &&
    'input' in chunk.content[0]
  ) {
    return typeof chunk.content[0].input === 'string'
      ? [chunk.content[0].input, 'input']
      : [JSON.stringify(chunk.content[0].input), 'input'];
  } else if (
    Array.isArray(chunk.content) &&
    chunk.content.length >= 1 &&
    'text' in chunk.content[0]
  ) {
    return [chunk.content[0].text, 'content'];
  }
  return [undefined];
}

function cloneChunk(text: string, tokenType: string, chunk: AIMessageChunk): AIMessageChunk {
  if (tokenType === 'string') {
    return new AIMessageChunk(Object.assign({}, chunk, { content: text }));
  } else if (tokenType === 'input') {
    return chunk;
  }
  const content = chunk.content[0] as MessageContentComplex;
  if (tokenType === 'content' && content.type === 'text') {
    return new AIMessageChunk(Object.assign({}, chunk, { content: [Object.assign({}, content, { text })] }));
  } else if (tokenType === 'content' && content.type === 'text_delta') {
    return new AIMessageChunk(Object.assign({}, chunk, { content: [Object.assign({}, content, { text })] }));
  }

  return chunk;
}

export type CustomAnthropicInput = AnthropicInput & { _lc_stream_delay?: number };

export class CustomAnthropic extends ChatAnthropicMessages {
  _lc_stream_delay: number;
  constructor(fields: CustomAnthropicInput) {
    super(fields);
    this._lc_stream_delay = fields._lc_stream_delay ?? 25;
  }

  async *_streamResponseChunks(
    messages: BaseMessage[],
    options: this['ParsedCallOptions'],
    runManager?: CallbackManagerForLLMRun
  ): AsyncGenerator<ChatGenerationChunk> {
    const params = this.invocationParams(options);
    const formattedMessages = _convertMessagesToAnthropicPayload(messages);
    const coerceContentToString = !_toolsInParams({
      ...params,
      ...formattedMessages,
      stream: false,
    });

    const stream = await this.createStreamWithRetry(
      {
        ...params,
        ...formattedMessages,
        stream: true,
      },
      {
        headers: options.headers,
      }
    );

    for await (const data of stream) {
      if (options.signal?.aborted === true) {
        stream.controller.abort();
        throw new Error('AbortError: User aborted the request.');
      }
      const shouldStreamUsage = this.streamUsage ?? options.streamUsage;
      const result = _makeMessageChunkFromAnthropicEvent(data, {
        streamUsage: shouldStreamUsage,
        coerceContentToString,
      });
      if (!result) continue;

      const { chunk } = result;

      // Extract the text content token for text field and runManager.
      const [token = '', tokenType] = extractToken(chunk);
      const createGenerationChunk = (text: string, incomingChunk: AIMessageChunk): ChatGenerationChunk => {
        return new ChatGenerationChunk({
          message: new AIMessageChunk({
          // Just yield chunk as it is and tool_use will be concat by BaseChatModel._generateUncached().
            content: incomingChunk.content,
            additional_kwargs: incomingChunk.additional_kwargs,
            tool_call_chunks: incomingChunk.tool_call_chunks,
            usage_metadata: shouldStreamUsage ? incomingChunk.usage_metadata : undefined,
            response_metadata: incomingChunk.response_metadata,
            id: incomingChunk.id,
          }),
          text,
        });
      };

      if (!tokenType || tokenType === 'input') {
        const generationChunk = createGenerationChunk(token, chunk);
        yield generationChunk;
        await runManager?.handleLLMNewToken(
          token,
          undefined,
          undefined,
          undefined,
          undefined,
          { chunk: generationChunk }
        );
        continue;
      }

      const textStream = new TextStream(token, {
        delay: this._lc_stream_delay,
      });
      for await (const currentToken of textStream.generateText()) {
        const newChunk = cloneChunk(currentToken, tokenType, chunk);
        const generationChunk = createGenerationChunk(currentToken, newChunk);
        yield generationChunk;

        await runManager?.handleLLMNewToken(
          token,
          undefined,
          undefined,
          undefined,
          undefined,
          { chunk: generationChunk }
        );
      }
    }
  }

}
