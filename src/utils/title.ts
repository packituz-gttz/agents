import { z } from 'zod';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnableLambda } from '@langchain/core/runnables';
import type { Runnable } from '@langchain/core/runnables';
import * as t from '@/types';

const defaultTitlePrompt = `Analyze this conversation and provide:
1. The detected language of the conversation
2. A concise title in the detected language (5 words or less, no punctuation or quotation)

{convo}`;

const titleSchema = z.object({
  title: z
    .string()
    .describe(
      'A concise title for the conversation in 5 words or less, without punctuation or quotation'
    ),
});

const combinedSchema = z.object({
  language: z.string().describe('The detected language of the conversation'),
  title: z
    .string()
    .describe(
      'A concise title for the conversation in 5 words or less, without punctuation or quotation'
    ),
});

export const createTitleRunnable = async (
  model: t.ChatModelInstance,
  _titlePrompt?: string
): Promise<Runnable> => {
  // Disabled since this works fine
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /* @ts-ignore */
  const titleLLM = model.withStructuredOutput(titleSchema);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /* @ts-ignore */
  const combinedLLM = model.withStructuredOutput(combinedSchema);

  const titlePrompt = ChatPromptTemplate.fromTemplate(
    _titlePrompt ?? defaultTitlePrompt
  );

  return new RunnableLambda({
    func: async (input: {
      convo: string;
      inputText: string;
      skipLanguage: boolean;
    }): Promise<{ language: string; title: string } | { title: string }> => {
      if (input.skipLanguage) {
        return (await titlePrompt.pipe(titleLLM).invoke({
          convo: input.convo,
        })) as { title: string };
      }

      const result = (await titlePrompt.pipe(combinedLLM).invoke({
        convo: input.convo,
      })) as { language: string; title: string } | undefined;

      return {
        language: result?.language ?? 'English',
        title: result?.title ?? '',
      };
    },
  });
};
