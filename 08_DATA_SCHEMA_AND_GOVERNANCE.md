# 08 — DATA SCHEMA AND GOVERNANCE

## 1. Canonical data files

Create separate datasets:
- `locations.json`
- `vehicles.json`
- `money-opportunities.json`
- `missions.json`
- `collectibles.json`
- `activities.json`
- `regions.json`
- `categories.json`

Do not hardcode canonical records inside UI components.

## 2. Shared metadata

Every canonical record should support:
- Unique stable ID.
- Name/title.
- Category.
- Description.
- Related location or map coordinates.
- Source references.
- Verification status.
- Last verified date.
- Optional notes.

## 3. Verification enum

Use:
- `CONFIRMED`
- `VERIFIED_COMMUNITY`
- `COMMUNITY_REPORTED`
- `UNVERIFIED`
- `UNKNOWN`

Document the evidence threshold for each classification.

## 4. Source object

Suggested shape:

```ts
type SourceReference = {
  title: string;
  url?: string;
  publisher?: string;
  sourceType: "official" | "direct_observation" | "community" | "other";
  accessedAt?: string;
  notes?: string;
};
```

Do not invent URLs or sources. If no source exists, represent it as unavailable and keep the record unverified/unknown.

## 5. Coordinate model

For fictional map coordinates, define a project-specific coordinate type.

Example:

```ts
type MapPoint = {
  x: number;
  y: number;
};
```

Document coordinate bounds and transform rules. Do not mix geographic lat/long with image pixel coordinates.

## 6. Vehicle schema

Vehicle-specific fields must separately represent:
- Tracker status.
- Tracker removal availability.
- Storage availability.
- Selling availability.
- Actual selling price.
- Estimated market value.
- Acquisition method.
- Spawn location.
- Respawn behavior.

## 7. Money schema

Money-specific fields:
- Payout amount.
- Currency.
- Duration.
- Repeatability.
- Cooldown.
- Requirements.
- Risk.
- Source and verification.

Unknown values remain null/unknown.

## 8. Validation

Implement automated validation for:
- Duplicate IDs.
- Missing required fields.
- Invalid enum values.
- Invalid coordinates.
- Broken references.
- Malformed source references.
- Impossible numeric values.
- Inconsistent status/value combinations.

Add test fixtures for valid and invalid records.

## 9. Licensing and attribution

Maintain a data/assets register documenting:
- Asset or dataset name.
- Source.
- License.
- Required attribution.
- Allowed modifications.
- Commercial/non-commercial restrictions.
- Date accessed.
- Local file path or URL.

Do not assume a community map is free to reuse merely because it is publicly accessible.

Do not copy IGN protected assets, source code, branding, or proprietary data without explicit permission.
