---
title: Cedarling archive limits
summary: Size limits on Cedarling's policy archives, enforced on the bytes actually decompressed.
role: Designed and wrote the limits and their tests
stack: [Rust, ZIP]
status: shipped
group: open-source
links:
  code: https://github.com/JanssenProject/jans/blob/main/jans-cedarling/cedarling/src/common/policy_store/archive_handler.rs
  pr: https://github.com/JanssenProject/jans/pull/15050
order: 5
---

## The problem

Cedarling loads policy stores from `.cjar` files, which are ZIP archives. A small archive can decompress into gigabytes and exhaust memory. The ZIP central directory records each entry's size, but whoever builds the archive writes those numbers.

## What I built

I added `ArchiveLimits` to the archive reader in September 2026.

- The defaults are 10 MB per entry, ten times that for the whole archive, and 10,000 entries.
- One setting, `CEDARLING_POLICY_STORE_MAX_FILE_SIZE`, sets the entry cap, and the total scales with it. Zero turns off both size caps.
- When an archive opens, `from_reader` rejects it if the entry count or any declared size is over a limit.
- On every read, `read_file` checks the entry cap against decompressed bytes, and an atomic counter adds each read to an archive-wide total.
- Tests cover each limit at its exact value and one byte over, plus an archive whose header claims a 1-byte entry.

## The decision that mattered

The declared sizes are only a fast first check. The real limits apply to bytes coming out of the decompressor.

`read_file` reads at most one byte past the cap, so it catches a lying header after that byte and never buffers the rest. The cost is that a read can hold up to the cap in memory before `read_file` rejects it. A read that trips the total still counts toward it, because the decompressor already produced those bytes.

<figure class="excerpt">

```rust start=443 notes=451,454,462
        let max_entry_size = self.limits.max_entry_size;
        let mut contents = Vec::new();

        if max_entry_size == 0 {
            file.read_to_end(&mut contents)?;
        } else {
            // One byte past the cap is enough to detect a central directory that
            // understated this entry and slipped past the check in `from_reader`.
            file.take(max_entry_size.saturating_add(1))
                .read_to_end(&mut contents)?;

            if contents.len() as u64 > max_entry_size {
                return Err(std::io::Error::other(ArchiveError::EntrySizeExceeded {
                    path: path.to_string(),
                    limit: max_entry_size,
                }));
            }
        }

        self.charge_total(contents.len())?;
```

<ol class="notes">
<li><span class="ref">Line 451</span>The reader stops one byte past the cap. That extra byte is how a lying header gets caught.</li>
<li><span class="ref">Line 454</span>The check compares the length that actually came out of the decompressor.</li>
<li><span class="ref">Line 462</span>Each read adds its real length to an atomic total for the whole archive.</li>
</ol>

<figcaption>Reading one archive entry. <a href="https://github.com/JanssenProject/jans/blob/c820fc3e3e44b089834c45f403756cd1f0046e57/jans-cedarling/cedarling/src/common/policy_store/archive_handler.rs#L443-L462"><code>cedarling/src/common/policy_store/archive_handler.rs</code></a></figcaption>
</figure>
