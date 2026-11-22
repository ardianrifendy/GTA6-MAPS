# 05 — MONEY FINDER

## 1. Objective

Identify and compare verified in-game money-making opportunities and help players plan efficient activity sequences.

## 2. Main sections

### Fast Cash
Short-duration opportunities, quick activities, and verified loot.

### High Value
High-payout missions, robberies, treasure hunting, valuable items, and other verified opportunities.

### Money Farming
Repeatable activities and routes, but only when repeatability and cooldown mechanics are verified.

## 3. Opportunity data model

Fields:
- `id`
- `name`
- `description`
- `category`
- `locationId`
- `estimatedPayout`
- `payoutCurrency`
- `estimatedDurationMinutes`
- `difficulty`
- `riskLevel`
- `requiredEquipment`
- `unlockRequirements`
- `repeatability`
- `cooldownMinutes`
- `source`
- `verificationStatus`
- `lastVerifiedAt`
- `notes`

Unknown values must remain null/unknown.

## 4. Money efficiency

Calculate money per minute only when payout and duration are both known and sufficiently verified.

Formula:

`moneyPerMinute = verifiedPayout / verifiedDurationMinutes`

Display:
- Payout.
- Duration.
- Money per minute.
- Verification status.
- Assumptions.

Do not create a score from missing or unverified inputs.

## 5. Sorting and filters

Sort:
- Highest verified payout.
- Highest verified money per minute.
- Lowest difficulty.
- Lowest risk.
- Repeatable confirmed activities.
- Available immediately, if unlock requirements are known.

Filter:
- Category.
- Region.
- Difficulty.
- Risk.
- Repeatability.
- Unlock status.
- Verification status.

## 6. Money Farming Route

Allow users to select several money opportunities and add them to Route Planner.

Optimize only with available route data. If road-network routing is unavailable, state that the sequence is based on approximate map distance, not actual driving time.

## 7. Data integrity

Never invent:
- Payout.
- Cooldown.
- Repeatability.
- Exploit.
- Unlock requirement.
- Risk.
- Completion duration.

Clearly separate confirmed game mechanics from community reports.

## 8. Acceptance criteria

- Unknown payout does not appear as zero.
- Efficiency ranking excludes records with missing required inputs.
- Source and verification status are visible.
- Filters and sorting work.
- Money opportunities can be added to a route.
