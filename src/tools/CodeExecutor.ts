import { z } from 'zod';
import { config } from 'dotenv';
import { tool, DynamicStructuredTool } from '@langchain/core/tools';

config();

const EXEC_ENDPOINT = 'https://api.librechat.ai/exec';

export type CodeExecutionToolParams = {
  session_id?: string;
  user_id?: string;
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
          },
          body: JSON.stringify(postData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ExecuteResult = await response.json();
        let formattedOutput = '';
        if (result.stdout) formattedOutput += `stdout:\n${result.stdout}\n`;
        if (result.stderr) formattedOutput += `stderr:\n${result.stderr}\n`;
        if (result.files && result.files.length > 0) {
          formattedOutput += 'Generated files:\n';
          result.files.forEach((file: FileRef) => {
            formattedOutput += `${file.name}`;
          });
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
      description: 'Executes code in various programming languages, returning stdout/stderr output.',
      schema: CodeExecutionToolSchema,
      responseFormat: 'content_and_artifact',
    }
  );
}

export { createCodeExecutionTool };