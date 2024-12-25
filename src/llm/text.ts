/* eslint-disable no-console */
import type { ReadableOptions } from 'stream';
export interface TextStreamOptions extends ReadableOptions {
  minChunkSize?: number;
  maxChunkSize?: number;
  delay?: number;
}

export type ProgressCallback = (chunk: string) => void;
export type PostChunkCallback = (chunk: string) => void;

export class TextStream {
  private text: string;
  private currentIndex: number;
  private minChunkSize: number;
  private maxChunkSize: number;
  private delay: number;

  constructor(text: string, options: TextStreamOptions = {}) {
    this.text = text;
    this.currentIndex = 0;
    this.minChunkSize = options.minChunkSize ?? 2;
    this.maxChunkSize = options.maxChunkSize ?? 4;
    this.delay = options.delay ?? 20;
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  async *generateText(progressCallback?: ProgressCallback): AsyncGenerator<string, void, unknown> {
    const { delay, minChunkSize, maxChunkSize } = this;

    while (this.currentIndex < this.text.length) {
      await new Promise(resolve => setTimeout(resolve, delay));

      const remainingChars = this.text.length - this.currentIndex;
      const chunkSize = Math.min(this.randomInt(minChunkSize, maxChunkSize + 1), remainingChars);

      const chunk = this.text.slice(this.currentIndex, this.currentIndex + chunkSize);
      progressCallback?.(chunk);

      yield chunk;
      this.currentIndex += chunkSize;
    }
  }
}