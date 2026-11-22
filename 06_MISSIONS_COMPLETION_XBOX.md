# 06 — MISSIONS, COMPLETION TRACKER, AND XBOX GUIDE

## 1. Mission Guide

Categories:
- Main Story.
- Side Missions.
- Character Missions.
- Optional Missions.
- Unlockable Content.

Mission fields:
- `id`
- `name`
- `chapter`
- `character`
- `locationId`
- `prerequisites`
- `objectives`
- `walkthrough`
- `rewards`
- `unlocks`
- `relatedMissionIds`
- `spoilerLevel`
- `source`
- `verificationStatus`
- `lastVerifiedAt`

Implement a prerequisite/dependency view where data supports it.

Add spoiler warnings before story-critical details.

Never invent mission order, rewards, unlock conditions, or walkthrough steps.

## 2. Completion Tracker

Track:
- Main missions.
- Side missions.
- Activities.
- Collectibles.
- Discoverable locations.
- Vehicles.
- Challenges.
- Other documented completion requirements.

Features:
- Overall progress.
- Per-category progress.
- Found/completed counts.
- Remaining items.
- Hide completed.
- Filter incomplete.
- Personal notes.
- Persistence after refresh.

### Completion accuracy rule

Only calculate a definitive completion percentage if the full set of applicable requirements is known and documented.

If the data is incomplete, label it:
- `Partial Checklist`
- `Known Items Progress`
- `Completion Requirements Incomplete`

Never claim the game is 100% complete based on a partial dataset.

## 3. Xbox Quick Guide

Provide:
- Xbox Series X controls.
- Character controls.
- Vehicle controls.
- Combat controls.
- Useful shortcuts.
- Cheat codes.

For each cheat:
- Name.
- Exact Xbox button sequence, only if verified.
- Activation method.
- Requirements.
- Restrictions.
- Source.
- Verification status.

Classification:
- Verified.
- Verified Community.
- Community Reported.
- Unverified.
- Not Available.

Do not present GTA V codes as GTA VI codes.

Do not invent button sequences.

## 4. Acceptance criteria

- Mission prerequisites are navigable.
- Spoiler warning is functional.
- Completion percentage is honest about dataset completeness.
- Xbox controls are source-backed.
- Cheat codes expose verification status.
- Progress persists.
