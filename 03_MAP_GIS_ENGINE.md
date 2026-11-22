# 03 — MAP / GIS ENGINE

## 1. Purpose

Implement a fictional-world map using a raster image or tiled map asset. Do not assume the map uses real-world latitude/longitude.

## 2. Engine

Use React Leaflet where suitable. Use a custom CRS or image overlay approach appropriate to the selected asset. The architecture must permit changing the basemap without rewriting marker data.

## 3. Map asset requirements

- Use original, user-owned, or properly licensed map assets.
- Record asset source, license, attribution requirements, version, and date acquired.
- Do not download or scrape IGN protected map assets unless permission explicitly allows it.
- If no usable map asset is available, use a clearly labeled development placeholder. Do not represent it as the actual Leonida map.

## 4. Coordinate system

Define a configurable coordinate transform:
- Map image dimensions.
- World/map coordinate bounds.
- Pixel-to-map coordinate conversion.
- Map-to-pixel conversion.
- Zoom constraints.
- Marker anchor behavior.

Keep coordinate conversion in a dedicated utility/module with unit tests.

Marker coordinates must be independent of UI components.

## 5. Layers and categories

Support independent visibility toggles for:
- Locations.
- Vehicles.
- Money opportunities.
- Collectibles.
- Missions.
- Activities.
- Services.
- User personal markers.

Use category icon/color metadata from a central registry.

## 6. Markers and performance

- Cluster markers at low zoom levels.
- Render only relevant markers where practical.
- Avoid recreating marker components unnecessarily.
- Use stable IDs.
- Support selected, found, favorite, and personal marker states.
- Provide a legend.
- Keep marker hit areas usable on mobile.

## 7. Map navigation

- Pan and zoom.
- Reset to default view.
- Focus a selected marker.
- Fit map bounds for selected route.
- Optional URL state for center, zoom, selected marker, and active layers.
- Validate URL parameters before applying them.

## 8. Location search

Search across canonical map records and personal markers.
Selecting a result must focus the marker and open its details.

## 9. Route geometry

If reliable road-network data exists and licensing permits, use it for road routing. Otherwise use straight-line geometry and label it clearly. Never invent road distances or travel times.

## 10. Tests

Test:
- Coordinate conversion round trips.
- Marker alignment at different zoom levels.
- Map bounds.
- URL state parsing.
- Layer toggles.
- Marker selection.
- Empty basemap state.
- Mobile touch interactions.
