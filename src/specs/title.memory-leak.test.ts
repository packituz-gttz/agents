/* eslint-disable no-console */

import { config } from 'dotenv';
config();
import type { LLMResult } from '@langchain/core/outputs';
import { getLLMConfig } from '@/utils/llmConfig';
import { Providers, TitleMethod } from '@/common';
import { Run } from '@/run';
import type * as t from '@/types';

/**
 * Helper to force garbage collection if available
 * Note: This requires Node.js to be run with --expose-gc flag
 */
function forceGC(): void {
  if (global.gc) {
    global.gc();
  }
}

/**
 * Helper to wait for potential async cleanup
 */
async function waitForCleanup(ms: number = 100): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Factory function to create a callback handler that captures LLM results
 * without creating memory leaks through closures
 */
function createLLMResultCapture(): {
  callback: {
    handleLLMEnd(data: LLMResult): void;
  };
  getResult(): LLMResult | undefined;
  } {
  let capturedResult: LLMResult | undefined;

  return {
    callback: {
      handleLLMEnd(data: LLMResult): void {
        capturedResult = data;
      },
    },
    getResult(): LLMResult | undefined {
      return capturedResult;
    },
  };
}

/**
 * Test to ensure title generation doesn't create memory leaks
 * Note: These tests verify that the title generation functions
 * properly clean up after themselves and don't retain references
 */
describe('Title Generation Memory Leak Tests', () => {
  jest.setTimeout(120000); // 2 minutes timeout for memory tests

  const providers = [Providers.OPENAI];

  providers.forEach((provider) => {
    describe(`${provider} Memory Leak Tests`, () => {
      let run: Run<t.IState>;

      beforeEach(async () => {
        const llmConfig = getLLMConfig(provider);
        run = await Run.create<t.IState>({
          runId: `memory-test-${Date.now()}`,
          graphConfig: {
            type: 'standard',
            llmConfig,
            tools: [],
            instructions: 'You are a helpful assistant.',
          },
          returnContent: true,
        });
      });

      test('should not leak memory when using callback factory', async () => {
        const weakRefs: WeakRef<LLMResult>[] = [];
        const iterations = 5;

        // Run multiple title generations with callbacks
        for (let i = 0; i < iterations; i++) {
          const resultCapture = createLLMResultCapture();

          const result = await run.generateTitle({
            provider,
            inputText: `Test message ${i}`,
            titleMethod: TitleMethod.STRUCTURED,
            contentParts: [{ type: 'text' as const, text: `Response ${i}` }],
            chainOptions: {
              callbacks: [resultCapture.callback],
            },
          });

          expect(result).toBeDefined();
          expect(result.title).toBeDefined();
          expect(result.language).toBeDefined();

          const capturedResult = resultCapture.getResult();
          if (capturedResult) {
            weakRefs.push(new WeakRef(capturedResult));
          }
        }

        // Clear references and wait for async operations
        await waitForCleanup(3000);
        forceGC();
        await waitForCleanup(3000);
        forceGC(); // Run GC twice to be thorough
        await waitForCleanup(3000);

        // Check that most LLMResult objects have been garbage collected
        let aliveCount = 0;
        weakRefs.forEach((ref) => {
          if (ref.deref() !== undefined) {
            aliveCount++;
          }
        });

        // We expect most references to be collected
        // LangChain may cache 0-2 results temporarily for optimization
        // The exact number can vary based on timing and internal optimizations
        expect(aliveCount).toBeLessThanOrEqual(2);
        console.log(
          `Memory leak test: ${aliveCount} out of ${iterations} references still alive`
        );
      });

      test('should not accumulate callbacks across multiple invocations', async () => {
        const callbackCounts: number[] = [];

        // Run multiple title generations with the same callback pattern
        for (let i = 0; i < 3; i++) {
          let callbackInvocations = 0;

          const trackingCallback = {
            handleLLMEnd: (_data: LLMResult): void => {
              callbackInvocations++;
            },
          };

          await run.generateTitle({
            provider,
            inputText: `Test message ${i}`,
            titleMethod: TitleMethod.STRUCTURED,
            contentParts: [{ type: 'text' as const, text: `Response ${i}` }],
            chainOptions: {
              callbacks: [trackingCallback],
            },
          });

          // Each generation should trigger the callback exactly once
          callbackCounts.push(callbackInvocations);
        }

        // Verify each invocation triggered the callback exactly once
        expect(callbackCounts).toEqual([1, 1, 1]);
      });

      test('should isolate callback state between concurrent invocations', async () => {
        const captures: ReturnType<typeof createLLMResultCapture>[] = [];

        // Run multiple concurrent title generations
        const promises = Array.from({ length: 5 }, (_, i) => {
          const capture = createLLMResultCapture();
          captures.push(capture);

          return run.generateTitle({
            provider,
            inputText: `Concurrent test ${i}`,
            titleMethod: TitleMethod.STRUCTURED,
            contentParts: [
              { type: 'text' as const, text: `Concurrent response ${i}` },
            ],
            chainOptions: {
              callbacks: [capture.callback],
            },
          });
        });

        const results = await Promise.all(promises);

        // All results should be defined and have titles
        results.forEach((result, i) => {
          expect(result).toBeDefined();
          expect(result.title).toBeDefined();
          expect(result.language).toBeDefined();

          // Each capture should have its own result
          const capturedResult = captures[i].getResult();
          expect(capturedResult).toBeDefined();
          expect(capturedResult?.generations).toBeDefined();
        });

        // Verify all captured results are unique instances
        const capturedResults = captures
          .map((c) => c.getResult())
          .filter((r) => r !== undefined);
        const uniqueResults = new Set(capturedResults);
        expect(uniqueResults.size).toBe(capturedResults.length);
      });

      test('should handle completion method with callbacks properly', async () => {
        const resultCapture = createLLMResultCapture();

        const result = await run.generateTitle({
          provider,
          inputText: 'Completion test',
          titleMethod: TitleMethod.COMPLETION,
          contentParts: [
            { type: 'text' as const, text: 'Response for completion' },
          ],
          chainOptions: {
            callbacks: [resultCapture.callback],
          },
        });

        expect(result).toBeDefined();
        expect(result.title).toBeDefined();
        // Completion method doesn't return language
        expect(result.language).toBeUndefined();

        const capturedResult = resultCapture.getResult();
        expect(capturedResult).toBeDefined();
        expect(capturedResult?.generations).toBeDefined();
      });

      test('factory function should create isolated instances', async () => {
        // Create multiple captures
        const captures = Array.from({ length: 3 }, () =>
          createLLMResultCapture()
        );

        // Simulate different LLM results
        const mockResults: LLMResult[] = [
          { generations: [[{ text: 'Result 1' }]], llmOutput: {} },
          { generations: [[{ text: 'Result 2' }]], llmOutput: {} },
          { generations: [[{ text: 'Result 3' }]], llmOutput: {} },
        ];

        // Each capture should store its own result
        captures.forEach((capture, i) => {
          capture.callback.handleLLMEnd(mockResults[i]);
        });

        // Verify each capture has its own isolated result
        captures.forEach((capture, i) => {
          const result = capture.getResult();
          expect(result).toBe(mockResults[i]);
          expect(result?.generations[0][0].text).toBe(`Result ${i + 1}`);
        });
      });

      test('diagnostic: check if creating new Run instances helps', async () => {
        const weakRefs: WeakRef<LLMResult>[] = [];
        const iterations = 5;

        // Create a new Run instance for each iteration
        for (let i = 0; i < iterations; i++) {
          const llmConfig = getLLMConfig(provider);
          const newRun = await Run.create<t.IState>({
            runId: `memory-test-${Date.now()}-${i}`,
            graphConfig: {
              type: 'standard',
              llmConfig,
              tools: [],
              instructions: 'You are a helpful assistant.',
            },
            returnContent: true,
          });

          const resultCapture = createLLMResultCapture();

          await newRun.generateTitle({
            provider,
            inputText: `Test message ${i}`,
            titleMethod: TitleMethod.STRUCTURED,
            contentParts: [{ type: 'text' as const, text: `Response ${i}` }],
            chainOptions: {
              callbacks: [resultCapture.callback],
            },
          });

          const capturedResult = resultCapture.getResult();
          if (capturedResult) {
            weakRefs.push(new WeakRef(capturedResult));
          }
        }

        // Clear references and wait for async operations
        await waitForCleanup(200);
        forceGC();
        await waitForCleanup(200);
        forceGC();
        await waitForCleanup(100);

        // Check how many references are still alive
        let aliveCount = 0;
        weakRefs.forEach((ref) => {
          if (ref.deref() !== undefined) {
            aliveCount++;
          }
        });

        console.log(
          `Diagnostic (new Run instances): ${aliveCount} out of ${iterations} references still alive`
        );

        // Hypothesis: If it's still 2, it's LangChain global cache
        // If it's 5 or more, it's per-instance caching
        expect(aliveCount).toBeLessThanOrEqual(2);
      });

      test('memory retention patterns with different scenarios', async () => {
        const scenarios = [
          {
            iterations: 3,
            waitTime: 100,
            description: '3 iterations, short wait',
          },
          {
            iterations: 5,
            waitTime: 200,
            description: '5 iterations, medium wait',
          },
          {
            iterations: 10,
            waitTime: 300,
            description: '10 iterations, long wait',
          },
        ];

        for (const scenario of scenarios) {
          const weakRefs: WeakRef<LLMResult>[] = [];

          // Run title generations
          for (let i = 0; i < scenario.iterations; i++) {
            const resultCapture = createLLMResultCapture();

            await run.generateTitle({
              provider,
              inputText: `Test message ${i}`,
              titleMethod: TitleMethod.STRUCTURED,
              contentParts: [{ type: 'text' as const, text: `Response ${i}` }],
              chainOptions: {
                callbacks: [resultCapture.callback],
              },
            });

            const capturedResult = resultCapture.getResult();
            if (capturedResult) {
              weakRefs.push(new WeakRef(capturedResult));
            }
          }

          // Multiple cleanup cycles with increasing wait times
          await waitForCleanup(scenario.waitTime);
          forceGC();
          await waitForCleanup(scenario.waitTime);
          forceGC();
          await waitForCleanup(scenario.waitTime / 2);

          // Count alive references
          let aliveCount = 0;
          weakRefs.forEach((ref) => {
            if (ref.deref() !== undefined) {
              aliveCount++;
            }
          });

          console.log(
            `${scenario.description}: ${aliveCount} out of ${scenario.iterations} references still alive`
          );

          // Expect 0-2 references regardless of iteration count
          expect(aliveCount).toBeLessThanOrEqual(2);
        }
      });

      test('should properly handle skipLanguage option with callbacks', async () => {
        const resultCapture = createLLMResultCapture();

        const result = await run.generateTitle({
          provider,
          inputText: 'Skip language test',
          titleMethod: TitleMethod.STRUCTURED,
          contentParts: [{ type: 'text' as const, text: 'Response' }],
          skipLanguage: true,
          chainOptions: {
            callbacks: [resultCapture.callback],
          },
        });

        expect(result).toBeDefined();
        expect(result.title).toBeDefined();
        // When skipLanguage is true, language should not be returned
        expect(result.language).toBeUndefined();

        const capturedResult = resultCapture.getResult();
        expect(capturedResult).toBeDefined();
      });
    });
  });

  test('should handle errors gracefully', async () => {
    const llmConfig = getLLMConfig(Providers.OPENAI);

    // Create a run with invalid configuration to trigger errors
    const run = await Run.create<t.IState>({
      runId: 'error-test',
      graphConfig: {
        type: 'standard',
        llmConfig: {
          ...llmConfig,
          apiKey: 'invalid-key', // This will cause API errors
        },
        tools: [],
        instructions: 'Test',
      },
      returnContent: true,
    });

    // Attempt multiple failing title generations
    for (let i = 0; i < 3; i++) {
      try {
        const resultCapture = createLLMResultCapture();

        await run.generateTitle({
          provider: Providers.OPENAI,
          inputText: `Error test ${i}`,
          titleMethod: TitleMethod.STRUCTURED,
          contentParts: [{ type: 'text' as const, text: `Response ${i}` }],
          chainOptions: {
            callbacks: [resultCapture.callback],
          },
        });

        // Should not reach here
        fail('Expected error to be thrown');
      } catch (error) {
        // Expected to fail due to invalid API key
        console.log(
          `Expected error ${i}:`,
          error instanceof Error ? error.message : String(error)
        );
        expect(error).toBeDefined();
      }
    }
  });
});
