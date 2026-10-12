// A real V7 launch: Base Inu ($BINU), paired with wtCOIN, with holder rewards.
// Reads the launch from the public API, then checks its transaction receipt on Base.
// Run: node examples/05-v7-launch-receipt.mjs [TOKEN_ADDRESS]
import { API, getJson, rpc } from './lib.mjs';

const V7_LAUNCHER = '0x4bc0e8c2caab145612956652a5668864ffcc7af7';
const address = process.argv[2] || '0x2cc93433eca5a3e4377c478819f049feb591e222';
const j = await getJson(`${API}/api/v1/launchpad/tokens/${address}`);
const t = j.token || j;
// Label fee recipients by role rather than printing a creator's wallet.
const BASKET_VAULT = '0x99feb612f130c5e981dbc0a96c436bc06ca0fe9e';
const role = to => {
  const a = to.toLowerCase();
  if (a === (t.chainState?.rewardTracker || '').toLowerCase()) return 'holder rewards';
  if (a === BASKET_VAULT) return 'basket vault';
  if (a === (t.creator || t.chainState?.controller || '').toLowerCase()) return 'creator';
  return 'other recipient';
};
const tx = await rpc('eth_getTransactionByHash', [t.txHash]);
const rc = await rpc('eth_getTransactionReceipt', [t.txHash]);
const blk = await rpc('eth_getBlockByNumber', [rc.blockNumber, false]);
console.log({
  token: `${t.name} ($${t.symbol})`, generation: t.generation, pair: t.chainState?.pairSymbol,
  holders: t.holders, feeSplit: (t.chainState?.payees || []).map(p => `${p.shareBps / 100}% -> ${role(p.to)}`),
  launchTx: t.txHash, status: rc.status === '0x1' ? 'success' : rc.status,
  block: parseInt(rc.blockNumber, 16), utc: new Date(parseInt(blk.timestamp, 16) * 1000).toISOString(),
  sentToV7Launcher: tx.to.toLowerCase() === V7_LAUNCHER,
  explorer: `https://base.blockscout.com/tx/${t.txHash}`, page: `https://basestonk.io/tokens/${address}`,
});
