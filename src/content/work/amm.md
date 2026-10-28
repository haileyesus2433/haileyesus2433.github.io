---
title: amm
summary: Constant-product AMM in Anchor with LP tokens, slippage limits and a protocol treasury fee.
role: Anchor program and LiteSVM tests
stack: [Rust, Anchor, Solana, LiteSVM]
status: coursework
group: coursework
links:
  code: https://github.com/haileyesus2433/amm
order: 8
---

## The problem

A two-token pool has to price each swap from its own reserves, protect traders from price moves, and track who owns the liquidity. The pool also pays a protocol fee to a treasury.

## What I built

I wrote this Anchor program for Turbin3 in September 2026.

- `initialize` creates a config PDA, an LP mint and two vaults owned by the config.
- `deposit` sets the price on the first deposit. Later deposits add both tokens in proportion to LP supply, capped by the depositor's maximums.
- `withdraw` burns LP tokens for a proportional share of both vaults, with minimum amounts.
- `swap` prices with x times y equals k and rejects any trade that returns less than `min_out`.
- The authority can change the fee up to the `MAX_FEE` cap, change the treasury, and lock the pool. A locked pool rejects deposits, swaps and withdrawals.
- Integration tests run in Rust with LiteSVM.

## The decision that mattered

The fee comes off the input before pricing and goes straight to the treasury. The pool only ever sees and prices the net amount.

This keeps the treasury's income out of the reserves, so k only ever reflects the liquidity providers' tokens. The cost is that liquidity providers earn nothing from swaps. Their share changes with the price and never grows from fees.

<figure class="excerpt">

```rust start=86 notes=91,97
    pub fn swap(&mut self, amount_in: u64, min_out: u64, is_x: bool) -> Result<()> {
        require!(!self.config.locked, AmmError::PoolLocked);
        require!(amount_in > 0, AmmError::ZeroAmount);

        // Calculate protocol fee and net input amount
        let fee_amount = (amount_in as u128)
            .checked_mul(self.config.fee as u128)
            .and_then(|v| v.checked_div(FEE_DENOMINATOR as u128))
            .and_then(|v| u64::try_from(v).ok())
            .ok_or(AmmError::MathOverflow)?;

        let net_in = amount_in
            .checked_sub(fee_amount)
            .ok_or(AmmError::MathOverflow)?;
        require!(net_in > 0, AmmError::ZeroAmount);
```

<ol class="notes">
<li><span class="ref">Line 91</span>The fee is a cut of the input, worked out in u128 with checked math.</li>
<li><span class="ref">Line 97</span>Only the net amount reaches the pool and the pricing formula.</li>
</ol>

<figcaption>Taking the protocol fee before a swap. <a href="https://github.com/haileyesus2433/amm/blob/c66cda0cd44d76181235db33d224f0171815b10f/programs/amm/src/instructions/swap.rs#L86-L100"><code>programs/amm/src/instructions/swap.rs</code></a></figcaption>
</figure>
