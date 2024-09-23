import { z } from 'zod';
import { config } from 'dotenv';
import { DynamicStructuredTool } from '@langchain/core/tools';

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
  return new DynamicStructuredTool({
    name: 'execute_code',
    description: 'Executes code in various programming languages, returning stdout/stderr output.',
    schema: CodeExecutionToolSchema,
    func: async ({ lang, code }): Promise<string> => {
      const postData = {
        lang,
        code,
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
        }
        return formattedOutput.trim();
      } catch (error) {
        throw new Error(`Failed to execute code: ${(error as Error).message}`);
      }
    },
  });
}

export { createCodeExecutionTool };