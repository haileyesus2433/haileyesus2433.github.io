---
title: BlockRouter
summary: MVP of a self-custodial stablecoin payment gateway for AI inference on Solana.
role: Relayer, CLI, web dashboard and client
stack: [Rust, Anchor, Solana, TypeScript, Hono, SQLite]
status: shipped
group: solana
links:
  code: https://github.com/haileyesus2433/BlockRouter
  demo: https://blockrouter.netlify.app
order: 2
featured: true
---

## The problem

AI providers sell prepaid credits that you buy with an international card and can't get back. BlockRouter lets a user pay per token in USDC or USDT from a vault only they can withdraw from. It's my Turbin3 capstone, and the MVP runs on devnet.

## What I built

The on-chain program holds the funds. A user locks a capped budget into a session for one relayer and a set of models. The relayer reports raw token counts, and the program prices them at on-chain rates. It rejects any charge above the cap and returns unspent funds to the vault.

Around that program, I built:

- The relayer, an OpenAI-compatible gateway in TypeScript with Hono and SQLite. It checks each API key against an open session, forwards the request, records token usage and settles on-chain.
- The `br` CLI and a React dashboard for the vault, sessions, API keys and a playground. Both sign every transaction with the user's wallet.
- A `@solana/kit` client generated from the program's IDL with Codama, shared by the CLI and the dashboard.
- Devnet deployment scripts for the program, the mints and the models.

## The decision that mattered

I made the relayer hold the worst-case cost of every request before forwarding it. The program rejects a settlement above the session's cap outright, so the relayer must never serve more than the cap can pay for.

Each hold uses the higher of the current and any pending model rate, and pads the prompt estimate, because the provider's own token count is what gets billed. If the budget can't cover the requested `max_tokens`, the relayer cuts it down. The cost is caution. A session can't spend the last of its budget, and the relayer refuses concurrent requests while earlier ones hold money they may not use.

<figure class="excerpt">

```typescript start=201 notes=202,204,209
    const estimatedPrompt = provider.countTokens(request);
    const paddedPrompt = (BigInt(estimatedPrompt) * PROMPT_ESTIMATE_NUM + PROMPT_ESTIMATE_DEN - 1n) / PROMPT_ESTIMATE_DEN;

    // No awaits from here until the hold is placed, so concurrent requests see each other's holds.
    const sessionKey = active.session.address;
    const remaining = deps.ledger.remaining(active);
    const affordable = affordableCompletion(remaining, paddedPrompt, rates);
    if (affordable < 1n) throw sessionCapExhausted(remaining, active.session.reservedAmount);
    request.maxTokens = Number(affordable < BigInt(request.maxTokens) ? affordable : BigInt(request.maxTokens));
    const hold = maxCost(paddedPrompt, BigInt(request.maxTokens), rates);
    deps.ledger.hold(sessionKey, hold);
```

<ol class="notes">
<li><span class="ref">Line 202</span>The prompt estimate is padded, since the provider's count is the one that gets billed.</li>
<li><span class="ref">Line 204</span>No await until the hold is placed, so a concurrent request can't read the same remaining budget.</li>
<li><span class="ref">Line 209</span>The request's max_tokens shrinks to what the session can still pay for.</li>
</ol>

<figcaption>Holding a request's worst-case cost. <a href="https://github.com/haileyesus2433/BlockRouter/blob/4ca0df253756c6105b663752187e733a861388cb/relayer/src/routes/chat.ts#L201-L211"><code>relayer/src/routes/chat.ts</code></a></figcaption>
</figure>
