---
title: Cedarling policy testing CLI
summary: A command-line tool that tests and validates Cedarling policy stores before they ship.
role: Designed and wrote the CLI and the validation API
stack: [Rust, Cedar, YAML]
status: shipped
group: open-source
links:
  code: https://github.com/JanssenProject/jans/tree/main/jans-cedarling/cedarling-cli
  pr: https://github.com/JanssenProject/jans/pull/14673
order: 7
---

## The problem

To test a policy change, a Cedarling author had to write an application around the engine. `cedar run-tests` checks raw Cedar policies. It knows nothing about Cedarling's policy store format, entity data or bootstrap configuration.

## What I built

I wrote `cedarling-cli`, merged in August 2026, with three subcommands.

- `test` runs YAML test cases through `authorize_unsigned`. Each case can assert the decision, the policy IDs behind it and the error count.
- After a passing run, `test` lists the policies the suite triggered and the ones it never reached.
- `validate` reports parse, schema and metadata as separate levels. With `--strict`, a skipped level fails the run.
- `authorize` evaluates a single request from command-line flags.
- Configuration layers the same way as the library: file, then environment, then flags.
- Exit code 1 means a test or check failed. Exit code 2 means the setup itself is broken.

In the core, I added `Cedarling::validate_policy_store` behind a `tools` feature.

## The decision that mattered

`validate` has no parser of its own. It calls `load_policy_store`, the loader Cedarling runs at startup, so validation and loading can't disagree about what a valid store is.

The cost shows in the error messages. The loader returns a single error string, so parse and metadata failures carry no line or column, and they mark the remaining levels as skipped. Schema errors name the failing policy instead of a line.

<figure class="excerpt">

```rust start=980 notes=982,994
    /// Run parse / schema / metadata validation against a policy-store source
    /// without initializing the authorization engine. Never returns Err for
    /// validation failures — those land in the returned report; only
    /// returns Err for underlying I/O or network failures.
    #[allow(clippy::too_many_lines)]
    pub async fn validate_policy_store(
        config: &PolicyStoreConfig,
        http_config: &crate::http::HttpClientConfig,
    ) -> Result<ValidationReport, ValidateInfraError> {
        // 1. Build a fresh HttpClient
        let http_client = crate::http::HttpClient::new(*http_config)?;

        // 2. Call load_policy_store
        let load_result =
            crate::init::policy_store::load_policy_store(config, &http_client, false).await;
```

<ol class="notes">
<li><span class="ref">Line 982</span>A broken store goes into the report. Only I/O and network problems return an error.</li>
<li><span class="ref">Line 994</span>The same loader Cedarling runs at startup.</li>
</ol>

<figcaption>The validation entry point. <a href="https://github.com/JanssenProject/jans/blob/c820fc3e3e44b089834c45f403756cd1f0046e57/jans-cedarling/cedarling/src/lib.rs#L980-L994"><code>cedarling/src/lib.rs</code></a></figcaption>
</figure>
