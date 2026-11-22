# ADR 002: Zero-Hallucination Data Governance & Verification Badges

## Status
Accepted

## Context
Many game companion websites publish speculative or unverified information as fact (e.g. invented cheat codes, fabricated vehicle prices, unconfirmed respawn timers).

## Decision
1. All canonical entities must implement a mandatory `verificationStatus` field:
   - `CONFIRMED`: Official Rockstar reveal, official trailer frame, or hands-on press report.
   - `VERIFIED_COMMUNITY`: Multi-source verified leak analysis or mapping project consensus.
   - `COMMUNITY_REPORTED`: Single source or player speculation.
   - `UNVERIFIED`: Plausible but uncorroborated.
   - `UNKNOWN`: Explicit missing datum.
2. Missing details (such as whether a vehicle is sellable or has a tracker) must remain `UNKNOWN` and highlighted with a neutral badge. Never invent values.
3. Every record must cite traceable sources.
