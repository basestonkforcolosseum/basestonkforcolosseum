// What an agent sees: check a stock pair, then prepare a launch link the user opens and signs themselves.
// Uses the public MCP read tier (no auth). Nothing is signed or sent on-chain.
// Run: node examples/02-mcp-agent-handoff.mjs [PAIR]
import { mcpCall } from './lib.mjs';

const pair = process.argv[2] || 'wtCOIN';
const text = result => (result.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n');

console.log(`--- check_pair(${pair}) ---`);
console.log(text(await mcpCall('check_pair', { pair, chain: 'base' })));

console.log(`\n--- launch_link(Demo Token, DEMO, ${pair}) ---`);
console.log(text(await mcpCall('launch_link', { name: 'Demo Token', symbol: 'DEMO', pair, chain: 'base' })));
console.log('\nOpen the returned link: the live create page loads pre-filled; the user reviews and signs in their own wallet.');
