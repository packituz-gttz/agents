import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function addJsExtension(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(
    /from\s+['"](.\/[^'"\s]+)['"]/g,
    (match, p1) => `from '${p1}.js'`
  );
  fs.writeFileSync(filePath, updatedContent);
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      processDirectory(filePath);
    } else if (path.extname(file) === '.js') {
      addJsExtension(filePath);
    }
  }
}

processDirectory(path.join(__dirname, 'dist'));
