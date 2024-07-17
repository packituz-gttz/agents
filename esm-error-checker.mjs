import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const fileName = process.argv[2];
if (!fileName) {
  console.error('Please provide a file name');
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fullPath = path.resolve(__dirname, fileName);
const program = ts.createProgram([fullPath], {
  strict: true,
  noEmit: true,
  allowJs: true,
  checkJs: true,
});

const sourceFile = program.getSourceFile(fullPath);
const diagnostics = ts.getPreEmitDiagnostics(program);

let output = '';

if (sourceFile) {
  output += '```ts\n' + sourceFile.getFullText() + '\n```\n\n// Type Errors:\n';

  diagnostics.forEach((diagnostic) => {
    if (diagnostic.file === sourceFile) {
      const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      const lineContent = sourceFile.text.split('\n')[line];

      output += `Line ${line + 1}, Column ${character + 1}: ${message}\n`;
      output += '```ts\n' + lineContent + '\n```\n\n';
    }
  });
}

console.log(output);
fs.writeFileSync('ts_error_output.txt', output);
