# Evidence

Captured on 10 Oct 2026 from public sources. These files are frozen records. Each script listed under "Live check" runs the corresponding check against today's data. It is not a byte-for-byte reproduction: event counts keep changing after the snapshot, and the scripts check slightly different points.

| File | What it shows | Live check |
|---|---|---|
| `v7-rpc-check.json` | The V7 launcher **and** the V7 rewards factory: no code at Base block 52,132,549, code at block 52,132,565 (3 Oct 2026, 19:07:57 UTC) | `examples/04-verify-deployments.mjs` checks the V7 launcher at its exact deployment block (52,132,561). It does not check the rewards factory. |
| `b20-v6b-rpc-check.json` | The B20 V6B launcher: no code at block 51,697,070, code at block 51,697,071 (23 Sep 2026, 17:11:29 UTC) | `examples/04-verify-deployments.mjs` |
| `sourcify-verification.json` | Sourcify verification status, deploy transaction and deployer for the V6, V7 and B20 V6B launchers | `examples/04-verify-deployments.mjs` |
| `event-period-summary.json` | Snapshot at 10 Oct 2026, 12:58 UTC: listed launches during the event, creator wallets, pair types and V7 adoption | `examples/03-event-period-launches.mjs` returns live counts, which are higher than the snapshot while the event is still running. |
| `platform-stats-2026-10-10.json` | Raw response from the public stats endpoint, captured 10 Oct 11:43 UTC | `examples/01-platform-stats.mjs` returns the current totals. |

These checks establish deployment timing, source correspondence and public usage figures. They do not establish code authorship dates and are not an audit.
