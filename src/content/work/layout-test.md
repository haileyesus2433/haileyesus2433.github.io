---
title: Layout test
summary: Placeholder case study for checking the template. Delete before publishing.
role: Placeholder role
stack: [Rust]
status: shipped
group: other
links:
  code: https://github.com/JanssenProject/jans/tree/main/jans-cedarling
order: 99
---

## The problem

Placeholder. Two or three sentences that say what was wrong and why it mattered. This paragraph is here to check the reading width and the space under a heading.

## What I built

Placeholder. Short paragraphs or a short list:

- First placeholder item with `inline code`.
- Second placeholder item.
- Third placeholder item.

## The decision that mattered

Placeholder. One decision, why it was made, and what it cost.

<figure class="excerpt">

```rust start=446 notes=451,454
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
```

<ol class="notes">
<li><span class="ref">Line 451</span>Placeholder note about this line.</li>
<li><span class="ref">Line 454</span>Placeholder note about this line.</li>
</ol>

<figcaption>Placeholder caption. <a href="https://github.com/JanssenProject/jans/blob/c820fc3e3e44b089834c45f403756cd1f0046e57/jans-cedarling/cedarling/src/common/policy_store/archive_handler.rs#L446-L460"><code>cedarling/src/common/policy_store/archive_handler.rs</code></a></figcaption>
</figure>

## What I'd change

Placeholder. Honest and specific.
