# 04 — VEHICLE INTELLIGENCE

## 1. Objective

Build a vehicle database and discovery workflow that helps players identify, acquire, store, and where supported, sell vehicles.

This module must explicitly distinguish **Tracker**, **Non-Tracker**, and **Unknown**.

## 2. Tracker classification

Allowed values:
- `TRACKER`
- `NON_TRACKER`
- `UNKNOWN`

Never infer tracker status from vehicle class, price, appearance, or player assumptions.

Every tracker claim must have a source and verification status.

## 3. Vehicle record fields

Required or optional fields as appropriate:
- `id`
- `name`
- `class`
- `trackerStatus`
- `trackerRemovalAvailability`
- `ownershipStatus`
- `garageStorageAvailability`
- `sellingAvailability`
- `verifiedSellingPrice`
- `estimatedMarketValue`
- `acquisitionMethod`
- `spawnLocationId`
- `respawnAvailability`
- `acquisitionDifficulty`
- `acquisitionRisk`
- `rarity`
- `image`
- `source`
- `verificationStatus`
- `lastVerifiedAt`
- `notes`

Use explicit unknown/null states. Do not use a guessed value.

## 4. Distinguish separate concepts

Do not conflate:
- Tracker status.
- Tracker removal availability.
- Ownership status.
- Garage storage availability.
- Selling availability.
- Actual selling price.
- Estimated market value.
- Spawn location.
- Respawn behavior.

A non-tracker vehicle is not automatically sellable. A vehicle with a tracker is not automatically impossible to store or sell. Each mechanic requires separate evidence.

## 5. Vehicle Finder filters

- Non-Tracker.
- Tracker.
- Unknown tracker status.
- Confirmed sellable.
- Confirmed non-sellable.
- Unknown selling availability.
- Highest verified selling price.
- Rarest.
- Easiest to acquire.
- Available early in the game, if verified.
- Vehicle class.
- Region.

## 6. Non-Tracker Hunt layer

Create a dedicated map layer named **NON-TRACKER HUNT**.

It must show only records whose tracker status is `NON_TRACKER` and whose location is sufficiently verified.

Allow filtering by:
- Confirmed selling availability.
- Vehicle class.
- Verified value.
- Acquisition difficulty.
- Region.

Create a separate **TRACKER VEHICLES** layer and an **UNKNOWN STATUS** layer.

Do not include unknown or unverified markers in the confirmed non-tracker layer.

## 7. Vehicle detail panel

Display:
- Vehicle name and image.
- Vehicle class.
- Tracker status.
- Selling availability.
- Verified selling price, if available.
- Estimated market value, separately labeled.
- Acquisition method.
- Location.
- Storage compatibility.
- Tracker removal information, if verified.
- Respawn information, if verified.
- Risk and difficulty.
- Sources and verification date.

## 8. Ranking logic

Support:
1. Highest verified selling price.
2. Highest verified profit per acquisition time, only when both values are available.
3. Confirmed non-tracker and confirmed sellable.
4. Easiest verified acquisition.
5. Rarest vehicles.

Do not rank unknown values as zero or silently treat them as confirmed.

## 9. Required labels

Examples:
- `Non-Tracker — Confirmed`
- `Tracker — Community Reported`
- `Unknown — Not Verified`
- `Selling Availability — Unknown`

## 10. Acceptance criteria

- Tracker / Non-Tracker / Unknown filters work.
- Non-Tracker Hunt excludes unknown records.
- Selling availability is independent of tracker status.
- Estimated market value is not displayed as selling price.
- Every canonical vehicle record has source and verification metadata.
- No invented vehicle locations, prices, or mechanics.
