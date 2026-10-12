// Recompute launch activity during Crypto World's Fair from the public launch list.
// Window: 14 Sep 2026 13:00 UTC up to the earlier of now and the official end (12 Oct 23:59 PT).
// Prints counts only; no wallet addresses are written out.
// Run: node examples/03-event-period-launches.mjs
import { API, EVENT_START, EVENT_END, getJson } from './lib.mjs';

const chains = ['base', 'robinhood', 'arc'];
const windowEnd = Math.min(Date.now(), EVENT_END);
const inWindow = t => { const at = Date.parse(t.createdAt); return at >= EVENT_START && at <= windowEnd; };

async function allTokens(chain) {
  const rows = [];
  for (let offset = 0; offset != null;) {
    const page = await getJson(`${API}/api/v1/launchpad/tokens?chain=${chain}&sort=age&dir=desc&limit=200&offset=${offset}`);
    rows.push(...page.tokens);
    offset = page.hasNext === false ? null : page.nextOffset;
  }
  return [...new Map(rows.map(t => [t.address.toLowerCase(), t])).values()]; // de-duplicate defensively
}

const result = { windowUtc: [new Date(EVENT_START).toISOString(), new Date(windowEnd).toISOString()], perChain: {}, total: { listed: 0, duringEvent: 0, stockPairedDuringEvent: 0, v7DuringEvent: 0 } };
const creators = new Set();
for (const chain of chains) {
  const tokens = await allTokens(chain);
  // The pairs endpoint's offset paging repeats rows, so fetch the whole registry in one page.
  const pairs = (await getJson(`${API}/api/v1/launchpad/pairs/${chain}?limit=5000`)).rows;
  const kind = new Map(pairs.map(p => [p.address.toLowerCase(), p.kind]));
  const during = tokens.filter(inWindow);
  for (const t of during) if (t.creator) creators.add(t.creator.toLowerCase());
  const stock = during.filter(t => kind.get((t.pairToken || '').toLowerCase()) === 'equity').length;
  const v7 = during.filter(t => t.generation === 'v7').length;
  result.perChain[chain] = { listed: tokens.length, duringEvent: during.length, stockPairedDuringEvent: stock, v7DuringEvent: v7 };
  result.total.listed += tokens.length; result.total.duringEvent += during.length; result.total.stockPairedDuringEvent += stock; result.total.v7DuringEvent += v7;
}
result.total.creatorWalletsDuringEvent = creators.size;
result.notes = ['Listed launches from /api/v1/launchpad/tokens; the stats endpoint may report a slightly different indexed total.', 'Creator wallets are distinct non-empty addresses, not people.', 'Stock-paired = pair registry kind "equity".'];
console.log(JSON.stringify(result, null, 2));
