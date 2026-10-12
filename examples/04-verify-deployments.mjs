// Verify when the launchers appeared on Base, and that their source is verified on Sourcify.
// PASS requires: Sourcify match, a deployment record, no code one block before, code at the deployment block.
// Exits non-zero if any check fails. Run: node examples/04-verify-deployments.mjs
import { rpc, getJson, hex } from './lib.mjs';

const contracts = [
  { name: 'AdvancedLauncherV6 (pre-event baseline)', address: '0x80459E17eC8269f058152169e58022a70ed9F1fa' },
  { name: 'AdvancedLauncherB20V6B (event)', address: '0xEb743E4D89fBE31F5145EbC189A19E1b71dE4E3b' },
  { name: 'AdvancedLauncherV7 (event)', address: '0x4BC0E8c2caaB145612956652A5668864FfcC7AF7' },
];

let failures = 0;
for (const c of contracts) {
  const problems = [];
  let s = {};
  try { s = await getJson(`https://sourcify.dev/server/v2/contract/8453/${c.address}?fields=deployment`); }
  catch (e) { problems.push(`sourcify lookup failed: ${e.message}`); }
  if (!['match', 'exact_match'].includes(s.match)) problems.push(`sourcify status ${s.match ?? 'missing'}`);
  const block = s.deployment ? Number(s.deployment.blockNumber) : null;
  if (!block) problems.push('no deployment record');
  let codeBefore = null, codeAt = null, utc = null;
  if (block) {
    codeBefore = ((await rpc('eth_getCode', [c.address, hex(block - 1)])).length - 2) / 2;
    codeAt = ((await rpc('eth_getCode', [c.address, hex(block)])).length - 2) / 2;
    utc = new Date(parseInt((await rpc('eth_getBlockByNumber', [hex(block), false])).timestamp, 16) * 1000).toISOString();
    if (codeBefore !== 0) problems.push(`code already present at block ${block - 1}`);
    if (!(codeAt > 0)) problems.push(`no code at block ${block}`);
  }
  if (problems.length) failures++;
  console.log({
    result: problems.length ? 'FAIL' : 'PASS', contract: c.name, address: c.address,
    sourcify: s.match ?? null, deployTx: s.deployment?.transactionHash, deployer: s.deployment?.deployer,
    block, utc, codeBytesBlockBefore: codeBefore, codeBytesAtBlock: codeAt, problems,
  });
}
console.log('\nSourcify "match" = bytecode matches, metadata hash differs (partial match). This proves deployment timing and source correspondence, not authorship or an audit.');
if (failures) { console.error(`${failures} contract(s) failed verification`); process.exit(1); }
