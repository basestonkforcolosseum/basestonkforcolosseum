<!-- Snapshot of https://docs.basestonk.io/integration/trading-bots.md taken 2026-10-10T17:22:37.428Z. Live version: https://docs.basestonk.io/integration/trading-bots -->

# Trading bots

> The assembly order for a bot, on either chain.

Pick the chain once; read that chain's token record; sign against that
chain's router.

<Tip>
  Skip the assembly: `POST /api/v1/agent/trade/prepare` runs this recipe server-side and returns the unsigned transaction with a verdict. Your key still signs. [AI agents →](/integration/agents)
</Tip>

<Steps>
  <Step title="Read the token record">
    `GET /api/launchpad/tokens/{address}?chain={chain}` - pair, hook (`curve`), tax (`buyTaxBps` / `sellTaxBps`, or `taxBps` pre-V6). One batched call beats a loop; a 429 is refused, never empty.
  </Step>

  <Step title="Build the PoolKey">
    `(token, pair, 3000, 60, hook)`. The hook is part of the pool's identity - [the per-generation trap](/integration/onchain#the-poolkey).
  </Step>

  <Step title="Quote at the live rate">
    `AdvancedFeeHookV6.taxFor(key, zeroForOne)` - includes the anti-sniper toll on a fresh launch. Set `minOut` with at least that headroom. [The three rules](/integration/onchain#three-things-every-integration-must-handle)
  </Step>

  <Step title="Swap through the router">
    Exact-in, approve first. [The router](/integration/onchain#trading)
  </Step>

  <Step title="Decode reverts by name">
    `CurrencyNotSettled` is *reduce size*. `HopTooThin` (`0xb5377e60`) is the pair's feed refusing, raised by a contract the launcher calls. [The table](/integration/onchain#decoding-reverts)
  </Step>
</Steps>

Launching from a bot? [The tuples and constraints](/integration/onchain#launching-programmatically).
Evaluating a flagged token? [What each scanner flag means here](/token-safety).


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.