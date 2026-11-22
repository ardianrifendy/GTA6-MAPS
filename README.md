# GTA VI Companion Map — Premium Interactive Gaming Companion

[![Production Build](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)]()
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8.svg)]()
[![CRS.Simple](https://img.shields.io/badge/Leaflet-CRS.Simple-orange.svg)]()

A high-performance, data-driven companion map and game intelligence application for **Grand Theft Auto VI** (Leonida & Vice City). Specifically optimized for **Xbox Series X / PS5** players using a mobile second-screen browser or multi-monitor desktop setup.

---

## Live Demo & Repository
- **GitHub Repository**: [https://github.com/ardianrifendy/GTA6-MAPS](https://github.com/ardianrifendy/GTA6-MAPS)
- **Deployment Ready**: Fully configured for one-click deployment on [Vercel](https://vercel.com).

---

## Key Modules & Intelligence Features

### 1. Interactive Leonida GIS Engine (`CRS.Simple`)
- Dedicated Cartesian 2D grid coordinate system ($4096 \times 4096$ px) decoupling fictional map geometry from real-world GPS coordinates.
- Responsive pan, pinch-zoom, and dynamic coordinates HUD ($X, Y$) tracker.
- Custom vector basemap with distinct districts: *Vice City Downtown, Ocean Beach, Starfish Island, Port Gellhorn, Grassrivers, Leonida Keys, Ambrosia County*.

### 2. Vehicle Intelligence & Non-Tracker Hunter
- Strict taxonomy: `NON_TRACKER`, `TRACKER`, or `UNKNOWN`.
- Acquisition methods, garage/storage eligibility, and resale values.
- Real-time filters by class (Super, Sports, Muscle, Emergency, Boats, Commercial).

### 3. Money Finder & Earning Efficiency
- Payout comparisons across Fast Cash robberies, high-value container heists, and repeatable swamp farming loops.
- Real-time ranking by **$/Minute Efficiency** ($/min) with risk & difficulty metrics.

### 4. Multi-Stop Route Optimizer
- Traveling route planner using Nearest Neighbor heuristics.
- Calculates total straight-line distance ($m$ / $km$) across selected farming spots and vehicle spawns.
- Export route data to JSON.

### 5. Missions & Heist Walkthrough
- Dual-protagonist (Lucia & Jason) mission trees and prerequisite dependencies.
- Built-in **Spoiler Protection Shield** to blur story endings until toggled.

### 6. Collectibles & Secrets Tracker
- Hidden Vice Contraband Packages, Stunt Jump ramps, and Folklore Totems.
- Per-set progress bars and precise hunting clues.

### 7. Xbox Series X Companion Guide
- Wireless controller button mapping schemes for driving, dual-weapon combat, and character hot-swaps.
- Verification badges for cheat codes and anti-scam warnings regarding fake online generator tools.

### 8. Personal Markers & Portable State
- Zero-telemetry, privacy-first local storage (`LocalStorage`).
- Custom waypoint placement via manual coordinates or **Click-to-Pin Mode**.
- One-click **JSON Backup Export & Import** to migrate progress seamlessly across devices.

---

## Data Governance & Integrity (Zero-Hallucination Policy)

Every location, vehicle, and money opportunity is tagged with a transparent verification badge:
- `CONFIRMED`: Direct observation from official Rockstar Games trailers and publications.
- `VERIFIED_COMMUNITY`: Corroborated by cartographic analysis and mapping community consensus.
- `COMMUNITY_REPORTED`: Player reports awaiting secondary validation.
- `UNVERIFIED`: Plausible gameplay hypothesis or legacy reference.
- `UNKNOWN`: Missing data explicitly kept blank. Never filled with AI hallucinations.

---

## Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: TypeScript (Strict Mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Dark Premium Theme)
- **Map & GIS**: [Leaflet](https://leafletjs.com/) with `L.CRS.Simple` custom image raster overlay
- **Icons**: [Lucide React](https://lucide.dev/)
- **State & Storage**: Client-side `LocalStorage` with portable JSON schema validation
- **Testing**: Node.js Test Runner (`node:test`)

---

## Getting Started

### Prerequisites
- Node.js 18.x or later (tested on v24.13.1)
- npm or yarn

### Installation
```bash
git clone https://github.com/ardianrifendy/GTA6-MAPS.git
cd GTA6-MAPS
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Tests
```bash
npm test
```

### Production Build
```bash
npm run build
npm start
```

---

## Project Structure

```text
├── docs/                      # Architecture, ADRs, Agent Plan & Dependency Graph
│   ├── adr/                   # Architecture Decision Records
│   ├── agent-reports/         # Agent outputs & phase reports
│   ├── architecture.md        # Technical architecture
│   └── dependency-graph.md    # Mermaid dependency graph
├── public/
│   └── images/
│       └── leonida-basemap.svg # Fictional Leonida 4096px basemap asset
├── src/
│   ├── app/                   # Next.js App Router (layout, page, globals.css)
│   ├── components/
│   │   ├── collectibles/      # Collectibles & Secrets components
│   │   ├── layout/            # Header, Sidebar, MobileNav
│   │   ├── map/               # Leaflet MapCanvas, DetailPanel
│   │   ├── missions/          # Mission guide & spoiler controls
│   │   ├── money/             # Money opportunity finder & $/min ranking
│   │   ├── personal/          # Personal markers & JSON backup
│   │   ├── route/             # Multi-stop route optimizer
│   │   ├── tracker/           # Completion progress & partial checklist
│   │   ├── vehicles/          # Vehicle hunter & tracker taxonomy
│   │   └── xbox/              # Xbox Series X guide & cheats
│   ├── data/                  # Canonical JSON datasets
│   ├── lib/                   # Coordinates transform, route engine, user state
│   └── types/                 # Shared TypeScript contracts
└── test/                      # Unit test suites (coordinates, route, state)
```

---

## License
MIT License. Created for the GTA community. Original assets & design. Not affiliated with or endorsed by Rockstar Games or Take-Two Interactive.
