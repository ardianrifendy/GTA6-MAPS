# 01 — PRODUCT REQUIREMENTS

## 1. Product identity

**Name:** GTA VI Companion Map  
**Tagline:** Explore Leonida. Find Opportunities. Master Every Location.  
**Reference:** https://www.ign.com/maps/gta-6/leonida

The reference is for interaction research only. The implementation, branding, content, and assets must be original or properly licensed.

## 2. Target use case

A player uses a mobile browser alongside GTA VI on Xbox Series X. The player needs to find a location, check a vehicle or activity, plan a route, and save progress without repeatedly searching external websites.

## 3. Product objectives

- Make map exploration fast and intuitive.
- Help identify verified money-making opportunities.
- Distinguish tracker and non-tracker vehicles.
- Record vehicle acquisition and selling information separately.
- Track progress without claiming unsupported 100% completion.
- Provide verified mission and Xbox information.
- Keep user-created notes and progress locally available.

## 4. Navigation

1. Overview
2. Interactive Map
3. Money Finder
4. Vehicle Finder
5. Collectibles
6. Missions
7. Activities
8. Route Planner
9. Completion Tracker
10. Xbox Guide
11. My Locations
12. Settings

Every navigation item must lead to a working page or a clearly labeled planned feature. Do not render inert navigation.

## 5. Core user journeys

### Journey A — Find a location
1. Open map.
2. Search for a name or category.
3. Select a result.
4. Map pans/zooms to the marker.
5. Detail panel opens.
6. User can favorite, mark found, add note, or share URL.

### Journey B — Find a non-tracker vehicle
1. Open Vehicle Finder or enable the Non-Tracker Hunt layer.
2. Filter by `NON_TRACKER`.
3. Optionally filter by confirmed selling availability.
4. Select vehicle.
5. Review location, acquisition method, storage status, selling status, and evidence.
6. Add it to a personal route or mark as found.

### Journey C — Compare money opportunities
1. Open Money Finder.
2. Select Fast Cash, High Value, or Farming.
3. Filter by availability, difficulty, risk, and repeatability.
4. Sort by verified money per minute where both payout and duration are known.
5. Add selected opportunities to a route.

### Journey D — Track completion
1. Open Completion Tracker.
2. Select a category.
3. Mark an item completed.
4. Progress updates.
5. Data persists after refresh.
6. If the full official requirement set is unavailable, show “Partial checklist” rather than a definitive 100% claim.

### Journey E — Plan a route
1. Select multiple map markers.
2. Add to route.
3. Set start point.
4. Optimize stop order if supported.
5. Review distance type and route assumptions.
6. Save or share route.

## 6. Product quality attributes

- Responsive: desktop, tablet, and mobile.
- Accessible: keyboard navigation, visible focus, contrast, semantic controls.
- Reliable: robust error and empty states.
- Maintainable: modular code and typed data contracts.
- Performant: lazy loading, clustering, viewport-aware rendering.
- Data honest: source and verification visible.
- Private by default: no account required for MVP.

## 7. MVP scope

Must include:
- Responsive app shell.
- Interactive map with a configurable map asset.
- Category filters.
- Search.
- Marker detail panel.
- Vehicle tracker status field.
- Money Finder data model.
- Progress persistence.
- Personal markers and notes.
- Import/export personal data.
- Vercel-compatible production build.

Advanced route optimization, full canonical game database, cloud sync, and community submissions can follow after MVP.

## 8. Acceptance criteria

A feature is accepted only when:
- Its primary interaction works.
- Loading, empty, and error states exist where relevant.
- Data is typed and validated.
- Mobile layout is usable.
- Critical logic has tests.
- No fake game facts are displayed as confirmed.
- No dead controls remain.
