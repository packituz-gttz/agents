/* eslint-disable no-console */
import { Readable } from 'stream';
import type { ReadableOptions } from 'stream';
export interface TextStreamOptions extends ReadableOptions {
  minChunkSize?: number;
  maxChunkSize?: number;
  delay?: number;
}

export type ProgressCallback = (chunk: string) => void;
export type PostChunkCallback = (chunk: string) => void;

export class TextStream extends Readable {
  private text: string;
  private currentIndex: number;
  private minChunkSize: number;
  private maxChunkSize: number;
  private delay: number;

  constructor(text: string, options: TextStreamOptions = {}) {
    super(options);
    this.text = text;
    this.currentIndex = 0;
    this.minChunkSize = options.minChunkSize ?? 2;
    this.maxChunkSize = options.maxChunkSize ?? 4;
    this.delay = options.delay ?? 20; // Time in milliseconds
  }

  _read(): void {
    const { delay, minChunkSize, maxChunkSize } = this;

    if (this.currentIndex < this.text.length) {
      setTimeout(() => {
        const remainingChars = this.text.length - this.currentIndex;
        const chunkSize = Math.min(this.randomInt(minChunkSize, maxChunkSize + 1), remainingChars);

        const chunk = this.text.slice(this.currentIndex, this.currentIndex + chunkSize);
        this.push(chunk);
        this.currentIndex += chunkSize;
      }, delay);
    } else {
      this.push(null); // signal end of data
    }
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  async processTextStream(progressCallback: ProgressCallback): Promise<void> {
    const streamPromise = new Promise<void>((resolve, reject) => {
      this.on('data', (chunk) => {
        progressCallback(chunk.toString());
      });

      this.on('end', () => {
        resolve();
      });

      this.on('error', (err) => {
        reject(err);
      });
    });

    try {
      await streamPromise;
    } catch (err) {
      console.error('[processTextStream] Error in text stream:', err);
      // Handle the error appropriately, e.g., return an error message or throw an error
    }
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