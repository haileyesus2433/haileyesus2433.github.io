```rust
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
