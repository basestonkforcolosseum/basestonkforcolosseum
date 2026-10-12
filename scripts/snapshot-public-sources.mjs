// Refresh the public snapshots in docs/ and spec/ from BaseStonk's public website, API and MCP server.
// Read-only GETs/POSTs to public endpoints; no keys. Run: node scripts/snapshot-public-sources.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const now = new Date().toISOString();
const get = async (url, init) => { const r = await fetch(url, init); if (!r.ok) throw new Error(`${url} -> ${r.status}`); return r; };

// 1. Docs: every page listed in the public llms.txt index.
const index = await (await get('https://docs.basestonk.io/llms.txt')).text();
const pages = [...index.matchAll(/\]\((https:\/\/docs\.basestonk\.io\/[^)]+\.md)\)/g)].map(m => m[1]);
fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
const written = [];
for (const url of pages) {
  const rel = url.replace('https://docs.basestonk.io/', '');
  const body = (await (await get(url)).text()).replace(/^> ## Documentation Index[\s\S]*?\n\n/, '');
  const file = path.join(root, 'docs', rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `<!-- Snapshot of ${url} taken ${now}. Live version: ${url.replace(/\.md$/, '')} -->\n\n${body}`);
  written.push(rel);
}
fs.writeFileSync(path.join(root, 'docs', 'README.md'), `# Documentation snapshot\n\nCopied from the public BaseStonk docs (https://docs.basestonk.io) on ${now}. The live docs are authoritative; their source history is public at https://github.com/Xipzer/basestonk-docs.\n\n${written.map(r => `- [${r}](${r})`).join('\n')}\n`);

// 2. API: the public OpenAPI document served by the API itself.
fs.mkdirSync(path.join(root, 'spec'), { recursive: true });
const openapi = await (await get('https://api.basestonk.io/api/v1/openapi.json')).json();
fs.writeFileSync(path.join(root, 'spec', 'openapi.json'), JSON.stringify(openapi, null, 2));

// 3. MCP: the public read tier's tool list (tools/list).
const mcp = await (await get('https://api.basestonk.io/mcp', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} }) })).text();
const mcpJson = mcp.trim().startsWith('{') ? JSON.parse(mcp) : JSON.parse(mcp.split('\n').find(l => l.startsWith('data:')).slice(5));
fs.writeFileSync(path.join(root, 'spec', 'mcp-tools.json'), JSON.stringify(mcpJson.result, null, 2));
fs.writeFileSync(path.join(root, 'spec', 'README.md'), `# Public interface specs\n\nCaptured ${now}.\n\n- \`openapi.json\`: served at https://api.basestonk.io/api/v1/openapi.json (${Object.keys(openapi.paths || {}).length} paths, OpenAPI ${openapi.openapi}).\n- \`mcp-tools.json\`: \`tools/list\` from the public MCP read tier at https://api.basestonk.io/mcp (${mcpJson.result.tools.length} tools: ${mcpJson.result.tools.map(t => t.name).join(', ')}).\n`);
console.log(`docs: ${written.length} pages; openapi paths: ${Object.keys(openapi.paths || {}).length}; mcp tools: ${mcpJson.result.tools.length}`);
