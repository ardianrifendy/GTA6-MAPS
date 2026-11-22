# Technical Architecture — GTA VI Companion Map

## 1. System Overview

GTA VI Companion Map is an interactive, data-driven web companion designed primarily for mobile-alongside-console (Xbox Series X) and desktop multi-monitor gaming workflows.

```
+---------------------------------------------------------------------------------+
|                                Next.js 15 App Shell                             |
|  - App Router ('src/app')                                                       |
|  - Tailwind CSS Dark Premium Theme (Glassmorphism, High Contrast, Vice Accents) |
+---------------------------------------------------------------------------------+
                                      |
       +------------------------------+------------------------------+
       |                                                             |
+------v-----------------------------------+           +-------------v---------------------+
|         Map & GIS Subsystem              |           |       Intelligence Modules        |
|  - React Leaflet / Custom CRS.Simple     |           |  - Vehicle Finder (Tracker State) |
|  - Vice City / Leonida Raster Map Canvas |           |  - Money Finder ($/min ranking)   |
|  - Coordinate Transform Engine (x,y)     |           |  - Mission & Xbox Cheat Guides    |
|  - Layer Toggles & Marker Clustering     |           |  - Route Planner (Multi-stop TSP) |
+------------------------------------------+           +-----------------------------------+
       |                                                             |
       +------------------------------+------------------------------+
                                      |
+-------------------------------------v-------------------------------------------+
|                          Data & State Layer                                     |
|  - Canonical Datasets (JSON modules in 'src/data/')                             |
|  - Strict Governance: CONFIRMED | COMMUNITY_REPORTED | UNVERIFIED | UNKNOWN    |
|  - Client State: LocalStorage (User favorites, personal markers, notes, prog.) |
|  - Portable JSON Backup & Restore                                               |
+---------------------------------------------------------------------------------+
```

## 2. Coordinate System Specification

The Leonida basemap utilizes a Cartesian 2D coordinate system (`CRS.Simple` in Leaflet):
- Origin `(0, 0)` is located at the top-left of the fictional bounds (or normalized centered `[-1000, 1000]`).
- Coordinate Transform maps pixel dimensions (e.g. $4096 \times 4096$) into world units.
- Straight-line distance calculation:
  $$d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$
- Clearly labeled as straight-line distance unless confirmed road network graphs are verified.

## 3. Data Governance

All canonical records expose:
- `id`: Unique string
- `name`: Record name
- `category`: Category slug
- `verificationStatus`: `CONFIRMED` | `VERIFIED_COMMUNITY` | `COMMUNITY_REPORTED` | `UNVERIFIED` | `UNKNOWN`
- `sources`: Array of verifiable reference objects
- Missing game mechanics must default to `UNKNOWN` or `UNVERIFIED` without speculation.
