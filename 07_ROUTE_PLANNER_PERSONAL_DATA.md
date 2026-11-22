# 07 — ROUTE PLANNER AND PERSONAL DATA

## 1. Route Planner

Users can:
- Select multiple destinations.
- Add/remove stops.
- Reorder stops manually.
- Set a start point.
- Optimize stop order where supported.
- Save routes.
- Share routes.
- Mark destinations visited.
- Add route notes.

## 2. Route distance semantics

Possible route types:
- `ROAD_NETWORK`
- `STRAIGHT_LINE`
- `MANUAL_ORDER`

Always label which method is used.

Never present straight-line distance as road distance.
Never fabricate driving duration.
If a road network is unavailable, show a clear limitation.

## 3. Money Farming Route

Allow selected Money Finder opportunities to be added to a route.

Where data allows, consider:
- Starting position.
- Road distance.
- Stop order.
- Opportunity verification.
- Estimated payout.
- Estimated duration.

Do not claim an optimal route if the routing graph or relevant data is incomplete. Label it approximate.

## 4. Personal markers

Users can:
- Add custom markers.
- Set title and category.
- Choose icon/color.
- Add notes.
- Edit and delete markers.
- Favorite locations.
- Mark as found.
- Add to routes.

Personal records must be stored separately from canonical game records.

## 5. Local persistence

Use LocalStorage for MVP.

Requirements:
- Version the stored schema.
- Handle malformed storage safely.
- Do not overwrite valid data on a failed migration.
- Debounce frequent writes where appropriate.
- Show clear errors when persistence fails.

## 6. Backup and restore

Provide:
- Export personal data as JSON.
- Import JSON backup.
- Validate file schema and version.
- Preview import summary.
- Confirm before replacing/merging.
- Keep existing data unchanged if validation fails.

## 7. Privacy

No account required for MVP.
Do not send personal notes or markers to third-party services.
Document any external network requests.
