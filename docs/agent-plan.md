# Agent Execution Plan & Team Topology

This document outlines the multi-agent execution topology, file ownership, and integration workflow for the **GTA VI Companion Map** project in accordance with `10_MULTI_AGENT_EXECUTION.md`.

## 1. Active Specialist Agents

| Agent ID | Role | Scope & Domain Responsibility | File Ownership |
|---|---|---|---|
| **Agent 0** | Lead Orchestrator / Principal Engineer | Architecture, integration gates, conflicts, master QA, release review | `docs/*`, `package.json`, `next.config.mjs`, `src/app/layout.tsx` |
| **Agent 1** | Product Architect | Requirements alignment, user journeys, navigation structure | `01_PRODUCT_REQUIREMENTS.md`, `src/config/navigation.ts` |
| **Agent 2** | UI/UX Specialist | Dark Premium design system, responsive shell (desktop & mobile), components | `src/components/ui/*`, `src/components/layout/*`, `src/app/globals.css` |
| **Agent 3** | Map/GIS Engineer | Custom CRS coordinate transform, Leaflet wrapper, raster canvas, marker layers | `src/components/map/*`, `src/lib/map/*` |
| **Agent 4** | Vehicle Intelligence Specialist | Vehicle schemas, tracker/non-tracker taxonomy, selling/garage filters | `src/data/vehicles.json`, `src/components/vehicles/*`, `src/lib/vehicles/*` |
| **Agent 5** | Money Finder Specialist | Opportunity schema, $/min efficiency calculations, farming routes | `src/data/money-opportunities.json`, `src/components/money/*`, `src/lib/money/*` |
| **Agent 6** | Mission & Completion Specialist | Mission dependency graph, completion percentages, Xbox guide & cheat codes | `src/data/missions.json`, `src/data/xbox-guide.json`, `src/components/missions/*` |
| **Agent 7** | Route & Personal Data Specialist | Multi-stop route calculation, personal markers & notes, LocalStorage backup/restore | `src/lib/storage/*`, `src/lib/route/*`, `src/components/personal/*` |
| **Agent 8** | QA, Security & Release Specialist | Unit testing, type checks, build validation, Vercel/GitHub deployment | `test/*`, `.github/workflows/*`, `docs/qa-report.md` |

## 2. Integration Gates

1. **Gate 0 (Discovery & Topology)**: Agent plan, ADRs, shared TypeScript types, baseline repo committed.
2. **Gate 1 (Foundation Shell)**: Working Next.js App Router, Leaflet CRS.Simple canvas, responsive desktop/mobile layout.
3. **Gate 2 (Map & Personal State)**: Markers with layer filters, search, custom personal markers, LocalStorage sync.
4. **Gate 3 (Intelligence Modules)**: Vehicle Finder, Money Finder, Mission & Xbox guides with zero-hallucination verification badges.
5. **Gate 4 (Route & Completion)**: Multi-stop route planner, completion progress tracker with partial checklist warning.
6. **Gate 5 (Production & QA)**: Zero TypeScript errors, test suite passing, production build verification, GitHub repo synced.
