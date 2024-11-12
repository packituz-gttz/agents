import { ChatAnthropic  } from '@langchain/anthropic';
import { AIMessageChunk } from '@langchain/core/messages';
import { ChatGenerationChunk } from '@langchain/core/outputs';
import type { BaseMessage } from '@langchain/core/messages';
import type { CallbackManagerForLLMRun } from '@langchain/core/callbacks/manager';
import type { AnthropicInput } from '@langchain/anthropic';
import type { AnthropicMessageCreateParams } from '@/llm/anthropic/types';
import { _makeMessageChunkFromAnthropicEvent } from './utils/message_outputs';
import { _convertMessagesToAnthropicPayload } from './utils/message_inputs';

function _toolsInParams(params: AnthropicMessageCreateParams): boolean {
  return !!(params.tools && params.tools.length > 0);
}

function extractToken(chunk: AIMessageChunk): string | undefined {
  if (typeof chunk.content === 'string') {
    return chunk.content;
  } else if (
    Array.isArray(chunk.content) &&
    chunk.content.length >= 1 &&
    'input' in chunk.content[0]
  ) {
    return typeof chunk.content[0].input === 'string'
      ? chunk.content[0].input
      : JSON.stringify(chunk.content[0].input);
  } else if (
    Array.isArray(chunk.content) &&
    chunk.content.length >= 1 &&
    'text' in chunk.content[0]
  ) {
    return chunk.content[0].text;
  }
  return undefined;
}

export class CustomAnthropic extends ChatAnthropic {
  constructor(fields: AnthropicInput) {
    super(fields);
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
      if (options.signal?.aborted) {
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
      const token = extractToken(chunk);
      const generationChunk = new ChatGenerationChunk({
        message: new AIMessageChunk({
          // Just yield chunk as it is and tool_use will be concat by BaseChatModel._generateUncached().
          content: chunk.content,
          additional_kwargs: chunk.additional_kwargs,
          tool_call_chunks: chunk.tool_call_chunks,
          usage_metadata: shouldStreamUsage ? chunk.usage_metadata : undefined,
          response_metadata: chunk.response_metadata,
          id: chunk.id,
        }),
        text: token ?? '',
      });
      yield generationChunk;

      await runManager?.handleLLMNewToken(
        token ?? '',
        undefined,
        undefined,
        undefined,
        undefined,
        { chunk: generationChunk }
      );
    }
  }

}
