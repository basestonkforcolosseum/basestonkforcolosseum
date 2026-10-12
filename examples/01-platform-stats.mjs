// Lifetime platform totals from the public stats endpoint (all chains in `venue`).
// Run: node examples/01-platform-stats.mjs
import { API, getJson } from './lib.mjs';

const { venue } = await getJson(`${API}/api/launchpad/stats/base`);
const usd = n => '$' + Math.round(n).toLocaleString('en-US');
console.log({
  chains: venue.chains,
  indexedLaunches: venue.tokens,
  indexedTrades: venue.trades,
  lifetimeVolume: usd(venue.volumeTotal),
  volume24h: usd(venue.volume24h),
  creatorFeeAllocations: usd(venue.creatorRevenueUsd),
  platformFeeAllocations: usd(venue.platformRevenueUsd),
  note: 'Platform-reported lifetime totals, including activity before 14 Sep 2026. Fee allocations are not company profit.',
});
