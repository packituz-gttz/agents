import { z } from 'zod';
import { config } from 'dotenv';
import { tool, DynamicStructuredTool } from '@langchain/core/tools';
import { getEnvironmentVariable } from '@langchain/core/utils/env';

config();

const EXEC_ENDPOINT = 'https://api.librechat.ai/exec';

export type CodeExecutionToolParams = undefined | {
  session_id?: string;
  user_id?: string;
  apiKey?: string;
  LIBRECHAT_CODE_API_KEY?: string;
}

export type FileRef = {
  id: string;
  name: string;
  path?: string;
};

export type FileRefs = FileRef[];

export type ExecuteResult = {
  session_id: string;
  stdout: string;
  stderr: string;
  files?: FileRefs;
};

const CodeExecutionToolSchema = z.object({
  lang: z.enum([
    'py',
    'js',
    'ts',
    'c',
    'cpp',
    'java',
    'php',
    'rs',
    'go',
    'bash',
    'd',
    'f90',
  ])
    .describe('The programming language or runtime to execute the code in.'),
  code: z.string()
    .describe('The complete, self-contained code to execute, without any truncation or minimization.'),
  args: z.array(z.string()).optional()
    .describe('Additional arguments to execute the code with.'),
});

function createCodeExecutionTool(params: CodeExecutionToolParams = {}): DynamicStructuredTool<typeof CodeExecutionToolSchema> {
  const apiKey = params.LIBRECHAT_CODE_API_KEY ?? params.apiKey ?? getEnvironmentVariable('LIBRECHAT_CODE_API_KEY') ?? '';
  if (!apiKey) {
    throw new Error('No API key provided for code execution tool.');
  }
  return tool<typeof CodeExecutionToolSchema>(
    async ({ lang, code, ...rest }) => {
      const postData = {
        lang,
        code,
        ...rest,
        ...params,
      };

      try {
        const response = await fetch(EXEC_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'LibreChat/1.0',
            'X-API-Key': apiKey,
          },
          body: JSON.stringify(postData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ExecuteResult = await response.json();
        let formattedOutput = '';
        if (result.stdout) {
          formattedOutput += `stdout:\n${result.stdout}\n`;
        } else {
          formattedOutput += 'stdout: Empty. To output values, write explicitly to stdout.\n';
        }
        if (result.stderr) formattedOutput += `stderr:\n${result.stderr}\n`;
        if (result.files && result.files.length > 0) {
          formattedOutput += 'Generated files:\n';

          const fileCount = result.files.length;
          for (let i = 0; i < fileCount; i++) {
            formattedOutput += result.files[i].name;

            if (i < fileCount - 1) {
              formattedOutput += fileCount <= 3 ? ', ' : ',\n';
            }
          }

          return [formattedOutput.trim(), result.files];
        }

        return [formattedOutput.trim(), undefined];
      } catch (error) {
        return `Calling tool with arguments:\n\n${JSON.stringify({
          lang,
          code,
          ...rest,
        })}\n\nraised the following error:\n\n${(error as Error | undefined)?.message}`;
      }
    },
    {
      name: 'execute_code',
      description: `Executes code in various programming languages, returning stdout/stderr output.

# Usage
- Input code is automatically displayed to the user, so don't repeat it in your response unless asked.
- All desired output must be explicitly written to stdout.`,
      schema: CodeExecutionToolSchema,
      responseFormat: 'content_and_artifact',
    }
  );
}

export { createCodeExecutionTool };