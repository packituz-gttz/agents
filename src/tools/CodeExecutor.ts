import { z } from 'zod';
import { config } from 'dotenv';
import { tool, DynamicStructuredTool } from '@langchain/core/tools';
import { getEnvironmentVariable } from '@langchain/core/utils/env';
import type * as t from '@/types';
import { EnvVar, Constants } from '@/common';

config();

export const imageExtRegex = /\.(jpg|jpeg|png|gif|webp)$/i;
export const getCodeBaseURL = (): string => getEnvironmentVariable(EnvVar.CODE_BASEURL) ?? Constants.OFFICIAL_CODE_BASEURL;

const imageMessage = ' - the image is already displayed to the user';
const otherMessage = ' - the file is already downloaded by the user';

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
    'd',
    'f90',
  ])
    .describe('The programming language or runtime to execute the code in.'),
  code: z.string()
    .describe('The complete, self-contained code to execute, without any truncation or minimization.'),
  args: z.array(z.string()).optional()
    .describe('Additional arguments to execute the code with.'),
});

const EXEC_ENDPOINT = `${getCodeBaseURL()}/exec`;

function createCodeExecutionTool(params: t.CodeExecutionToolParams = {}): DynamicStructuredTool<typeof CodeExecutionToolSchema> {
  const apiKey = params[EnvVar.CODE_API_KEY] ?? params.apiKey ?? getEnvironmentVariable(EnvVar.CODE_API_KEY) ?? '';
  if (!apiKey) {
    throw new Error('No API key provided for code execution tool.');
  }

  let fileInstructions = '';
  if (params.files && params.files.length > 0) {
    fileInstructions = 'Available files:\n';
    params.files.forEach((file) => {
      const filePath = `/mnt/data/${file.name}`;
      fileInstructions += `- ${filePath}\n`;
    });
    fileInstructions += '\nUse these files in your code as needed.\n';
  }

  const description = `Executes code in various programming languages, returning stdout/stderr output.

# Usage
- Input code is automatically displayed to the user, so don't repeat it in your response unless asked.
- All desired output must be explicitly written to stdout; e.g.:
  - For \`py\`, use the \`print()\` function.
  - For \`js\` and \`ts\`, use the \`console\` or \`process\` methods.
  - For other languages, use the appropriate output functions.
- There is no network access.
- NEVER provide a link to download any generated files.
  - Files are automatically delivered to the user.
- NEVER use this tool to execute malicious code.

${fileInstructions}`.trim();

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

        const result: t.ExecuteResult = await response.json();
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
            const filename = result.files[i].name;
            const isImage = imageExtRegex.test(filename);
            formattedOutput += isImage ? `${filename}${imageMessage}` : `${filename}${otherMessage}`;

            if (i < fileCount - 1) {
              formattedOutput += fileCount <= 3 ? ', ' : ',\n';
            }
          }

          return [formattedOutput.trim(), {
            session_id: result.session_id,
            files: result.files,
          }];
        }

        return [formattedOutput.trim(), { session_id: result.session_id }];
      } catch (error) {
        return `Calling tool with arguments:\n\n${JSON.stringify({
          lang,
          code,
          ...rest,
        })}\n\nraised the following error:\n\n${(error as Error | undefined)?.message}`;
      }
    },
    {
      name: Constants.EXECUTE_CODE,
      description,
      schema: CodeExecutionToolSchema,
      responseFormat: Constants.CONTENT_AND_ARTIFACT,
    }
  );
}

export { createCodeExecutionTool };