---
title: Change data capture at Decentral
summary: A Rust service that streams PostgreSQL changes to NATS JetStream for a buy-now-pay-later platform.
role: Lead backend developer
stack: [Rust, Tokio, PostgreSQL, NATS JetStream]
status: shipped
group: other
links: {}
order: 9
---

## The problem

I led the backend of a live buy-now-pay-later platform at Decentral Technologies. Several services had to react when rows changed in PostgreSQL, across more than one database. The code is private, so this page describes the design without excerpts.

## What I built

I wrote a change-data-capture service in Rust on Tokio.

- PostgreSQL triggers send a notification for every change. The service listens on each configured database.
- Each database gets its own Tokio task. All tasks share one NATS client and JetStream context through `Arc`.
- Inside a task, notifications flow over a channel to a handler that publishes them to JetStream concurrently.
- A broadcast channel tells every task to shut down, and database connections retry on startup.
- It first published to Kafka. In March 2025 I moved it to NATS JetStream.

## The decision that mattered

Failed publishes go to durable storage. The service writes the event to a table in the same database, then hands it over a second channel to a retry task. That task retries with a fixed delay and a cap, and marks each event processed when it lands.

The tasks share nothing mutable, so the design needs no `Mutex`. The cost is ordering. A retried event can reach JetStream after newer changes to the same row, so consumers can't assume events arrive in order.
