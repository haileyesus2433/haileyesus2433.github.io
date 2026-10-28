---
title: Cedarling
summary: Features across the Janssen Project's Rust authorization engine, from batch authorization to policy store security.
role: Open-source contributor since June 2025
stack: [Rust, Cedar, C FFI, PyO3, UniFFI]
status: shipped
group: open-source
links:
  code: https://github.com/JanssenProject/jans/tree/main/jans-cedarling
  pr: https://github.com/JanssenProject/jans/pulls?q=is%3Apr+author%3Ahaileyesus2433+is%3Amerged
order: 1
featured: true
---

## The problem

Cedarling is an embeddable policy decision point for the Janssen Project. One Rust core serves applications in C, Python, Java, Kotlin, Go and WASM. Every feature has to work through all of those bindings and stay safe with policy files it didn't write.

## What I built

I've contributed to Cedarling since June 2025. Three pieces have their own write-ups.

- [Archive limits](/work/cedarling-archive-limits). Size limits on policy archives, enforced on the bytes actually decompressed.
- [Policy testing CLI](/work/cedarling-policy-testing). YAML test cases, policy coverage and store validation from the command line.
- [C bindings](/work/cedarling-c-bindings). The C API, built on opaque handles and panic guards.

The rest of my work:

- Batch authorization for unsigned and multi-issuer requests in the core engine, exposed through every binding, with benchmarks and docs.
- The policy store loader, with format detection and `.cjar` archive support, and later format versioning for the store.
- A fix for recursive directory traversal, and a size limit on StatusList zlib decompression.
- Cut marshalling overhead on hot paths in the PyO3 and UniFFI bindings, and added a cross-binding benchmark suite. Upgraded UniFFI from 0.29 to 0.32.
- A precomputed index in place of an O(n) token-metadata reverse lookup.
- A PostgreSQL extension built with pgrx in April 2026, which the project later removed.

## The decision that mattered

In batch authorization, the shared work runs once and each item fails on its own. Token validation and principal setup happen once per batch, and every item gets its own resource, context and result.

A bad action or resource in one item becomes `Err` in that item's slot, and the other items still get decisions. The cost is that the shared setup is all or nothing. One invalid token or a failed status-list refresh fails the entire batch, because every item depends on it.

<figure class="excerpt">

```rust start=484 notes=485,496
                Err(e) => {
                    let item_err = classify_batch_item_error(&e, item_index);
                    self.config.metrics.record_error(&e);
                    self.config.metrics.record_authz_error();
                    let log_entry = LogEntry::new(BaseLogEntry::new_decision(item_request_id))
                        .set_batch_id(batch_id)
                        .set_message(format!(
                            "Batch item {item_index} failed setup ({}) for batch {batch_id}",
                            item_err.category(),
                        ))
                        .set_error(item_err.to_string());
                    self.config.log_service.log_any(log_entry);
                    results.push(Err(item_err));
                    continue;
```

<ol class="notes">
<li><span class="ref">Line 485</span>The failure is turned into a typed, serializable error for this item alone.</li>
<li><span class="ref">Line 496</span>The item records its error and the loop moves on to the next one.</li>
</ol>

<figcaption>A failed item in a multi-issuer batch. <a href="https://github.com/JanssenProject/jans/blob/c820fc3e3e44b089834c45f403756cd1f0046e57/jans-cedarling/cedarling/src/authz/mod.rs#L484-L497"><code>cedarling/src/authz/mod.rs</code></a></figcaption>
</figure>
