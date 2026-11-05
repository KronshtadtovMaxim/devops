import { readFile } from 'node:fs/promises';

const data = JSON.parse(await readFile('/app/out/result.json', 'utf8'));
if (!Array.isArray(data) || data.length === 0 || data.some(quote =>
  typeof quote.text !== 'string' || !quote.text ||
  typeof quote.author !== 'string' || !quote.author ||
  !Array.isArray(quote.tags)
)) {
  throw new Error('out/result.json must contain complete quotes');
}

console.log(`Validated ${data.length} quotes`);
