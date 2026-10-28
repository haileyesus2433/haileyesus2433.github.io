---
title: dynarule
summary: JSON-driven rule engine for Rust with nested conditions, priorities and hot updates.
role: Author
stack: [Rust, serde, Tera]
status: shipped
group: open-source
links:
  code: https://github.com/haileyesus2433/dynarule
  crate: https://crates.io/crates/dynarule
order: 4
featured: true
---

## The problem

The buy-now-pay-later platform at Decentral Technologies needed eligibility, risk-scoring and repayment rules. Rules written as Rust code only change with a new build.

## What I built

I wrote dynarule and published it on crates.io in March 2025.

- Rules live in JSON. Each one has a condition, an outcome and a priority.
- A condition is a short expression like `age > 18`, or an `And` or `Or` of other conditions, nested as deep as needed.
- The left side of an expression can call a Rust function registered with `with_function`, like `length(name)`.
- Rules run highest priority first, and `with_stop_on_first_match` stops at the first rule that matches.
- String outcomes are Tera templates, rendered with the input and a separate context map.
- `update_rules` and `Config::reload_from_file` replace the rule set while the program runs.

## The decision that mattered

Conditions are plain data. `Condition` is a serde enum, so a rule file deserializes straight into the types the engine evaluates, and the file can change without a rebuild.

Simple conditions stay as strings until evaluation, which keeps the JSON short and readable. The cost is late errors. A typo like a missing operator passes when the file loads and only fails when that rule runs.

<figure class="excerpt">

```rust start=29 notes=31,33,42
/// A condition to evaluate, either a simple expression or a nested combination.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", content = "value")]
pub enum Condition {
    Simple(String),
    And(Vec<Condition>),
    Or(Vec<Condition>),
}

/// The result of a rule evaluation, supporting templated values.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Outcome {
    pub key: String,
    pub value: serde_json::Value, // Can be a template like "Hello, {{name}}!"
}
```

<ol class="notes">
<li><span class="ref">Line 31</span>Each condition serializes as a type and a value, so nested rules read cleanly in JSON.</li>
<li><span class="ref">Line 33</span>A simple condition is the raw expression. It's parsed only when the rule runs.</li>
<li><span class="ref">Line 42</span>A string value is rendered as a Tera template with the input and context.</li>
</ol>

<figcaption>The rule types. <a href="https://github.com/haileyesus2433/dynarule/blob/e0969749afa7d6cc053d5798dc989124741307bd/src/types.rs#L29-L43"><code>src/types.rs</code></a></figcaption>
</figure>
