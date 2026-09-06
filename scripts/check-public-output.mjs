import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
// Fail closed before deployment if excluded material returns to the public build.
const forbidden = /Inbox\s?Health|eClinicalWorks|Carlos Arenas|medical[- ]billing|facturación médica/i;
function inspect(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (forbidden.test(path)) throw new Error(`Excluded public asset: ${path}`);
    if (entry.isDirectory()) inspect(path);
    else if (/\.(html|js|css|json|txt|xml|svg|map)$/i.test(path) && forbidden.test(readFileSync(path, 'utf8'))) {
      throw new Error(`Excluded public content: ${path}`);
    }
  }
}
inspect(new URL('../dist/', import.meta.url).pathname);
console.log('Public output: excluded text and asset names absent (binary contents require manual review).');
