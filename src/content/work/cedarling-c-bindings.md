---
title: Cedarling C bindings
summary: A C API for Cedarling, the Rust authorization engine of the Janssen Project.
role: Designed and wrote the C FFI layer
stack: [Rust, C, FFI, cbindgen]
status: shipped
group: open-source
links:
  code: https://github.com/JanssenProject/jans/tree/main/jans-cedarling/bindings/cedarling_c
  pr: https://github.com/JanssenProject/jans/pull/13542
order: 7
---

## The problem

Cedarling had bindings for Python, Java, Kotlin, Go and WASM, but no C API. A C API has to assume the caller can pass a null pointer, free memory twice, or keep using an object after it's gone.

## What I built

I wrote the `cedarling_c` crate, merged in April 2026.

- It builds as a shared and a static library, and `build.rs` generates the header with cbindgen.
- C programs can create instances, run unsigned, multi-issuer and batch authorization, push context data and read logs.
- Every call returns 0 or a `CedarlingErrorCode`. Result structs carry the error message, and a thread-local last error covers the rest.
- Every exported function runs inside a `catch_unwind` guard, so a panic becomes an error code instead of crossing into C.
- Rust frees what Rust allocates. Strings leave as `CString::into_raw` and come back through `cedarling_free_string` and `cedarling_free_result`.
- A C test suite checks null pointers, bad JSON and unknown instance IDs, and CI builds and runs it.

## The decision that mattered

C never holds a pointer to a Rust object. `cedarling_new` returns a `u64` ID, and every later call looks the instance up in a registry.

An ID that was never issued, or was already dropped, returns `InstanceNotFound` instead of touching freed memory. The cost is a global `Mutex` on every call. `get_instance` clones the instance and releases the lock before the request runs, so the lock covers only the lookup.

<figure class="excerpt">

```rust start=43 notes=44,56
struct CedarlingRuntime {
    instances: Mutex<HashMap<u64, blocking::Cedarling>>,
}

/// Lock acquisition failure when accessing the instance registry (`CedarlingErrorCode` + detail).
pub(crate) type InstanceRegistryLockError = (CedarlingErrorCode, String);

impl CedarlingRuntime {
    fn add_instance(&self, instance: blocking::Cedarling) -> Result<u64, String> {
        let instance_id = get_instance_id();
        match self.instances.lock() {
            Ok(mut guard) => {
                guard.insert(instance_id, instance);
                Ok(instance_id)
            },
            Err(e) => Err(format!(
                "Internal lock failure while adding instance: {}",
                e
            )),
        }
```

<ol class="notes">
<li><span class="ref">Line 44</span>The registry owns every instance. C only ever holds the key.</li>
<li><span class="ref">Line 56</span>The caller gets a number back. A stale ID misses the map and returns an error code.</li>
</ol>

<figcaption>The instance registry. <a href="https://github.com/JanssenProject/jans/blob/c820fc3e3e44b089834c45f403756cd1f0046e57/jans-cedarling/bindings/cedarling_c/src/c_interface.rs#L43-L62"><code>bindings/cedarling_c/src/c_interface.rs</code></a></figcaption>
</figure>
