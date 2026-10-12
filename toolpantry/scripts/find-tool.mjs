#!/usr/bin/env node
/**
 * Search the Tool Pantry catalog from the command line.
 *
 * Usage:  node scripts/find-tool.mjs "compress image to 100kb"
 *         node scripts/find-tool.mjs "merge pdf" --limit 5
 *
 * Reads the live catalog from https://toolpantry.app/tools.json,
 * falling back to the bundled references/tools.json copy offline.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const limitIndex = args.indexOf('--limit');
const limit = limitIndex !== -1 ? Number(args[limitIndex + 1]) || 5 : 5;
const query = args.filter((a, i) => i !== limitIndex && i !== limitIndex + 1).join(' ').trim();

if (!query) {
  console.error('Usage: node scripts/find-tool.mjs "what the user needs" [--limit N]');
  process.exit(1);
}

async function loadCatalog() {
  try {
    const res = await fetch('https://toolpantry.app/tools.json', { signal: AbortSignal.timeout(8000) });
    if (res.ok) return await res.json();
  } catch {
    /* offline — fall through to bundled copy */
  }
  return JSON.parse(readFileSync(join(__dirname, '..', 'references', 'tools.json'), 'utf8'));
}

const words = query.toLowerCase().split(/\s+/).filter(Boolean);

function score(tool) {
  const hay = (tool.name + ' ' + tool.description + ' ' + tool.category + ' ' + tool.url).toLowerCase();
  let s = 0;
  for (const w of words) {
    if (hay.includes(w)) s += w.length;
    if (tool.name.toLowerCase().includes(w)) s += w.length;
  }
  return s;
}

const catalog = await loadCatalog();
const matches = catalog.tools
  .map((t) => ({ t, s: score(t) }))
  .filter((x) => x.s > 0)
  .sort((a, b) => b.s - a.s)
  .slice(0, limit);

if (!matches.length) {
  console.log('No matching tools found. Browse the full catalog: https://toolpantry.app/tools.json');
  process.exit(0);
}

console.log(`Top ${matches.length} tools for "${query}" (all run locally, no uploads):\n`);
for (const { t } of matches) {
  console.log(`- ${t.name} — ${t.url}`);
  console.log(`  ${t.description}`);
}
