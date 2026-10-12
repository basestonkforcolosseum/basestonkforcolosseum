# BaseStonk · Crypto World's Fair 2026

**BaseStonk** is a live launchpad on Base: anyone can launch a token paired with a tokenized stock, a stablecoin or crypto. One wallet-signed transaction creates the token and opens its Uniswap v4 pool. Trading fees are split between the creator, the platform and, optionally, a basket of assets paid to the token's holders.

Live product: https://basestonk.io · Docs: https://docs.basestonk.io · API: https://api.basestonk.io · MCP: https://api.basestonk.io/mcp

## What this repository is

This is BaseStonk's **public integration repository** for Crypto World's Fair. **The product's application source is private and is not included.** What is here:

| Folder | Contents |
|---|---|
| [`examples/`](examples) | Read-only scripts written for this submission. They call the public API, the public MCP server and Base's public RPC. No keys, no wallet, no dependencies (Node 18+). |
| [`spec/`](spec) | The public OpenAPI document (101 paths) and the MCP tool list (11 tools) that the live services serve. |
| [`docs/`](docs) | A snapshot of the public documentation. Its edit history is public at [Xipzer/basestonk-docs](https://github.com/Xipzer/basestonk-docs). |
| [`evidence/`](evidence) | Captured checks behind the claims below: Base RPC deployment checks, Sourcify verification and event-period launch counts. |
| [`scripts/`](scripts) | Refreshes the `docs/` and `spec/` snapshots from the live public sources. |

## Shipped during the event (14 Sep – 12 Oct 2026)

| When | What | Check it |
|---|---|---|
| 3 Oct | **V7 holder rewards.** A wallet must hold a minimum balance (1/100,000 of supply) to earn. A balance bought in a block earns nothing from that block's fees. Every transfer updates reward accounting. Launch pools charge no LP fee. 290 launches used V7 in its first week. | V7 launcher [`0x4BC0…7AF7`](https://base.blockscout.com/address/0x4BC0E8c2caaB145612956652A5668864FfcC7AF7?tab=contract): deploy transaction in Base block 52,132,561; [Sourcify](https://repo.sourcify.dev/8453/0x4BC0E8c2caaB145612956652A5668864FfcC7AF7); [docs commit](https://github.com/Xipzer/basestonk-docs/commit/3727f659032291a994dc1995d540706c2ad95dac) |
| 23 Sep | **B20 V6B launcher.** Launches a B20-standard token against any oracle-priced pair. | [`0xEb74…4E3b`](https://base.blockscout.com/address/0xEb743E4D89fBE31F5145EbC189A19E1b71dE4E3b?tab=contract): block 51,697,071; [Sourcify](https://repo.sourcify.dev/8453/0xEb743E4D89fBE31F5145EbC189A19E1b71dE4E3b); [docs commit](https://github.com/Xipzer/basestonk-docs/commit/4f6028261adc71d109cd4a60a44cc9cf82c7dfd9) |
| 23 Sep | **API and MCP access for agents.** Open reads; a signed-in tier prepares transactions it never signs; a one-click connector for Claude, plus setup steps for ChatGPT and Cursor. | [docs commit](https://github.com/Xipzer/basestonk-docs/commit/b81360aea31196ab9119c39dbb46eef0b7fd0fe9); [`spec/`](spec); [`examples/02-mcp-agent-handoff.mjs`](examples/02-mcp-agent-handoff.mjs) |
| 21–25 Sep | **Partner launch presets** (for example Reppo), plus the partner's next step after launch. | [preset commit](https://github.com/Xipzer/basestonk-docs/commit/56b216deb51040e99ddefa98a3bd334639785301); [return-flow commit](https://github.com/Xipzer/basestonk-docs/commit/cfd644a9a3f7df4f8c4639360d1e344cbf9e6101) |

The V7 and B20 V6B launchers were deployed by the same address (`0x9372…ad82`) that deployed the pre-event V6 launcher ([`0x8045…a1fa`](https://repo.sourcify.dev/8453/0x80459E17eC8269f058152169e58022a70ed9F1fa), block 50,637,286, 30 Aug). Sourcify shows a partial match for each contract: the bytecode matches and only the metadata hash differs. This establishes deployment timing and that the published source matches the deployed bytecode. It is not an audit.

**A real V7 launch:** Base Inu ($BINU), paired with wtCOIN (a tokenized stock). Its fee split is 60% to holder rewards, 30% to the creator and 10% to the basket vault. [Launch transaction](https://base.blockscout.com/tx/0xd7773125e817807a2877a9a7ca48ebe801090956bbb0e4d681cdb0dc650bd3d7), block 52,292,907, 7 Oct. Run [`examples/05-v7-launch-receipt.mjs`](examples/05-v7-launch-receipt.mjs) to check it yourself.

## Usage

Snapshot taken 10 Oct 2026. Run the scripts for live numbers.

| | Value | Source |
|---|---:|---|
| Lifetime trading volume, all chains | $40.86M | [`evidence/platform-stats-2026-10-10.json`](evidence/platform-stats-2026-10-10.json) |
| Listed launches during the event (14 Sep – 10 Oct) | 2,941 | [`evidence/event-period-summary.json`](evidence/event-period-summary.json) |
| Creator wallets during the event | 633 | same |
| Launches during the event paired with tokenized stocks | 1,148 | same |
| Launches on V7, first week | 290 | same |

**Prior work disclosure:** BaseStonk was live before the event. It launched on Base on 17 Aug 2026, and the V6 launcher was deployed on 30 Aug. Lifetime figures include pre-event activity.

## Try it

```bash
node examples/01-platform-stats.mjs        # lifetime totals from the public stats endpoint
node examples/02-mcp-agent-handoff.mjs     # an agent checks a stock pair and prepares a launch link
node examples/03-event-period-launches.mjs # recompute event-period launch counts from the public list
node examples/04-verify-deployments.mjs    # Base RPC + Sourcify checks for the V6, B20 V6B and V7 launchers
node examples/05-v7-launch-receipt.mjs     # a real V7 launch and its on-chain receipt
```

**Use BaseStonk from an agent:** add `https://api.basestonk.io/mcp` as a custom connector in Claude ([one-click link](https://claude.ai/customize/connectors?modal=add-custom-connector&connectorName=BaseStonk&connectorUrl=https%3A%2F%2Fapi.basestonk.io%2Fmcp)) or in any MCP client. The agent prepares the action; the user signs in their own wallet.

## Team

Built and submitted by **Xipz** (UK), BaseStonk's developer: the contracts, the API, the MCP server and the app.

## License

The code in `examples/` and `scripts/` is MIT-licensed (see [LICENSE](LICENSE)). The documentation, specs and brand in `docs/` and `spec/` are © BaseStonk, reproduced here for reference.
