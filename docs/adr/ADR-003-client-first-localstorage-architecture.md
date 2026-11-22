# ADR 003: Client-First LocalStorage & Portable State

## Status
Accepted

## Context
Players need to bookmark locations, mark found items, take personal notes, and plan routes on their phone while playing on Xbox without requiring account registration, backend servers, or third-party cookies.

## Decision
1. MVP persistence is entirely client-side using browser `LocalStorage`.
2. Provide a robust, typed store wrapper that handles serialization, schema versions, and migration.
3. Provide single-click JSON Export & Import so users can transfer progress between phone, tablet, and PC.
4. Keep user personal markers separate from canonical game datasets.

## Consequences
- 100% privacy-friendly and zero operational server costs.
- Instant load and offline capability.
- Ready for optional Supabase / cloud sync in future phases.
