---
title: token22-remittance
summary: Remittance stablecoin on Token-2022 with transfer fees, KYC freezes and confidential transfers.
role: Token-2022 program and LiteSVM tests
stack: [Rust, Anchor, Solana, Token-2022, LiteSVM]
status: coursework
group: coursework
links:
  code: https://github.com/haileyesus2433/token22-remittance
order: 3
featured: true
---

## The problem

A remittance stablecoin has to answer to three parties. The issuer wants a fee on every transfer, regulators want KYC and the power to seize funds, and users want private balances. Token-2022 has an extension for each, but they don't all fit together.

## What I built

I wrote this Anchor program for Turbin3 in September 2026.

- `create_remittance_mint` stacks transfer fees, a self-pointing metadata pointer, a close authority and a default `Frozen` state. Every new account starts frozen.
- `thaw_kyc_account` unfreezes one account after KYC and leaves the mint's default state alone.
- `transfer_with_fee` works out the expected fee for the current epoch before calling `transfer_checked_with_fee`.
- `reissue_remittance_mint` adds a permanent delegate for seizures and confidential transfers.
- Instructions cover the whole confidential lifecycle: configure, approve, deposit, apply pending, withdraw and transfer with zero-knowledge proofs.
- `StateReader` unpacks accounts through `StateWithExtensions`, so extension data is never dropped.
- Integration tests run in Rust with LiteSVM, against a Token-2022 build with ZK support.

## The decision that mattered

The re-issued mint has both a seizure authority and encrypted balances, and the two conflict. A permanent delegate can move plaintext tokens, but it can't decrypt an ElGamal balance or produce the proofs to move one.

I set confidential accounts to manual approval and left the auditor key unset. The issuer approves each account before it can hold encrypted funds, and a seizure has to freeze the account first. The cost is an extra approval step for every user, and no way to read a confidential balance without the owner's key.

<figure class="excerpt">

```rust start=150 notes=154,166,167
        // 6. Initialize PermanentDelegate (Regulatory Seizure Authority)
        let init_perm_delegate_ix = initialize_permanent_delegate(
            self.token_2022_program.key,
            self.mint.key,
            self.permanent_delegate.key,
        )?;
        anchor_lang::solana_program::program::invoke(
            &init_perm_delegate_ix,
            &[self.mint.to_account_info()],
        )?;

        // 7. Initialize ConfidentialTransferMint with approve_policy = manual (auto_approve_new_accounts = false)
        let init_confidential_transfer_ix = initialize_confidential_transfer_mint(
            self.token_2022_program.key,
            self.mint.key,
            Some(*self.confidential_transfer_authority.key),
            false, // approve_policy = manual (auto_approve_new_accounts = false)
            None,  // Optional auditor ElGamal pubkey
        )?;
```

<ol class="notes">
<li><span class="ref">Line 154</span>The seizure authority. It can move any plaintext balance on this mint.</li>
<li><span class="ref">Line 166</span>No account gets encrypted balances until the issuer approves it.</li>
<li><span class="ref">Line 167</span>No auditor key, so nobody but the owner can decrypt a confidential balance.</li>
</ol>

<figcaption>Seizure and privacy on the re-issued mint. <a href="https://github.com/haileyesus2433/token22-remittance/blob/f9e9d08ab02553dcdf894186b92f64f38aa5eb24/programs/token22_remittance/src/instructions/reissue_mint.rs#L150-L168"><code>programs/token22_remittance/src/instructions/reissue_mint.rs</code></a></figcaption>
</figure>
