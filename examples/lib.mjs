// Shared helpers for the read-only examples. Node 18+; no dependencies, no keys, no wallet.
export const API = 'https://api.basestonk.io';
export const MCP = 'https://api.basestonk.io/mcp';
export const BASE_RPC = 'https://mainnet.base.org';
export const EVENT_START = Date.parse('2026-09-14T13:00:00Z'); // Crypto World's Fair start, 06:00 PT
export const EVENT_END = Date.parse('2026-10-13T06:59:59Z');   // official end, 12 Oct 23:59 PT

const sleep = ms => new Promise(r => setTimeout(r, ms));

export async function getJson(url, init = {}) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, { ...init, headers: { 'user-agent': 'basestonk-worlds-fair-examples', ...(init.headers || {}) } });
    if (res.status === 429) { await sleep(Number(res.headers.get('retry-after') || 5) * 1000); continue; }
    if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
    return res.json();
  }
  throw new Error(`${url} -> rate limited`);
}

// Stateless MCP call over Streamable HTTP (the public read tier needs no auth).
export async function mcpCall(name, args) {
  const body = { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } };
  const res = await fetch(MCP, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' }, body: JSON.stringify(body) });
  const text = await res.text();
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status} ${text.slice(0, 200)}`);
  // The server may answer as JSON or as a single SSE event.
  const json = text.trim().startsWith('{') ? JSON.parse(text) : JSON.parse(text.split('\n').find(l => l.startsWith('data:')).slice(5));
  if (json.error) throw new Error(`${name}: ${json.error.message}`);
  if (json.result?.isError) throw new Error(`${name}: tool error: ${(json.result.content || []).map(c => c.text).join(' ')}`);
  return json.result;
}

export async function rpc(method, params) {
  const json = await getJson(BASE_RPC, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) });
  if (json.error) throw new Error(`${method}: ${json.error.message}`);
  return json.result;
}

export const hex = n => '0x' + n.toString(16);
