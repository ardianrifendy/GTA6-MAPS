# ADR 001: Fictional Coordinate System & CRS.Simple

## Status
Accepted

## Context
GTA VI takes place in the fictional state of Leonida (including Vice City, Port Gellhorn, Keys, Grassrivers). Real-world WGS84 geographic latitude/longitude (EPSG:4326 / EPSG:3857) are inappropriate and distort fictional game maps.

## Decision
1. Use Leaflet with `L.CRS.Simple`.
2. Define a normalized 2D cartesian grid where top-left is `(0, 0)` and map dimensions default to a configurable coordinate bounding box `[4096, 4096]`.
3. Provide bidirectional conversion helpers between UI pixel space and world coordinate units.
4. Distances are calculated and rendered as straight-line Euclidean distance with a clear disclaimer until verified road network graphs exist.

## Consequences
- Clean separation from real-world map projections.
- Easy swap of basemap artwork without needing to remap GPS coordinates.
- Full mobile pan & pinch-zoom smoothness.
