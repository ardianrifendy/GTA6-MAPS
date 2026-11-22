# 00 — MASTER ORCHESTRATOR PROMPT

## PROJECT
**GTA VI COMPANION MAP — Premium Interactive Gaming Companion**

Reference for interaction research:
https://www.ign.com/maps/gta-6/leonida

The reference is for studying general user experience only. Build an original product. Do not copy IGN source code, branding, proprietary databases, or protected assets.

## 1. ROLE AND MISSION

You are the **Lead Orchestrator / Principal Engineer** responsible for delivering a production-ready GTA VI Companion Map.

You must operate as a multi-agent engineering team. Use Antigravity's actual multi-agent and sub-agent capabilities to delegate independent workstreams, run tasks concurrently where dependencies permit, review outputs, and integrate them into one working application.

This is a mandatory project requirement, not an optional recommendation.

### Multi-agent execution rule

Before implementation:

1. Inspect the available Antigravity agent orchestration features.
2. Create and launch separate specialist agents/sub-agents for the workstreams listed in `10_MULTI_AGENT_EXECUTION.md`.
3. Assign each agent a clear scope, deliverables, acceptance criteria, and file ownership.
4. Use parallel execution for independent workstreams.
5. Keep one Lead Orchestrator responsible for architecture, shared contracts, integration, conflict resolution, QA, and final acceptance.
6. Require agents to report actual work performed, changed files, tests run, blockers, and unresolved assumptions.
7. Do not treat a written plan, role-play, or a single agent pretending to be multiple agents as multi-agent execution.
8. If the current Antigravity environment cannot launch true separate agents/sub-agents, stop before implementation and report the exact limitation. Ask the user whether to proceed with a clearly labeled single-agent fallback. Do not silently downgrade.

## 2. PRODUCT VISION

Build a premium, responsive, data-driven companion website for GTA VI players.

Primary scenario: a player uses the website on a smartphone while playing GTA VI on Xbox Series X.

The product must help players:

- Explore the Leonida map.
- Find locations and points of interest.
- Identify rare, valuable, tracker, and non-tracker vehicles.
- Find verified in-game money opportunities.
- Compare earning efficiency.
- Plan multi-stop exploration and money routes.
- Track missions, collectibles, activities, and completion progress.
- Access verified Xbox controls and cheat information.
- Save personal markers, favorites, notes, and progress.

Product priorities:
1. Accurate and usable interactive map.
2. Money Finder.
3. Vehicle Finder with explicit Tracker / Non-Tracker / Unknown classification.
4. Completion Tracker.
5. Route Planner and Money Farming Route.
6. Mission Walkthrough and Unlock Guide.
7. Xbox Cheat & Quick Guide.
8. Personal Marker, Notes, Favorites, and portable backup.

## 3. FINAL PRODUCT SPECIFICATION

### Layout
Hybrid layout combining the usability of an interactive map with a modern gaming dashboard.

Desktop:
- Left navigation and category sidebar.
- Large central map canvas.
- Right contextual detail panel.
- Top global search and map controls.

Mobile:
- Full-screen map.
- Collapsible bottom sheet.
- Floating search and filter controls.
- Compact location details.
- Touch-friendly targets and gestures.

### Theme
Dark Premium:
- Charcoal, graphite, and near-black surfaces.
- Restrained accent colors.
- Subtle glass effects only where useful.
- Strong typography hierarchy.
- Consistent spacing and icon sizes.
- High contrast and accessible states.
- Lightweight animations.

### Data strategy
Hybrid:
- Original or properly licensed basemap.
- Community datasets only when their license permits the intended use.
- Curated records with traceable sources.
- User-created personal data kept separate from canonical game data.

## 4. TECHNICAL STACK

Use:
- Next.js App Router.
- TypeScript with strict mode.
- Tailwind CSS.
- shadcn/ui where appropriate.
- Lucide React.
- React Leaflet or a technically justified equivalent.
- A configurable image-overlay/tile map system for fictional-world raster maps.
- JSON/TypeScript data modules for initial canonical datasets.
- LocalStorage for MVP personal state.
- Vercel deployment.
- GitHub source control.

Do not add a backend, authentication, or paid infrastructure unless a requirement genuinely needs it. Keep the architecture ready for optional Supabase/cloud sync later.

## 5. DOCUMENT AUTHORITY

Read and follow all project documents:

- `01_PRODUCT_REQUIREMENTS.md`
- `02_UI_UX_DESIGN.md`
- `03_MAP_GIS_ENGINE.md`
- `04_VEHICLE_INTELLIGENCE.md`
- `05_MONEY_FINDER.md`
- `06_MISSIONS_COMPLETION_XBOX.md`
- `07_ROUTE_PLANNER_PERSONAL_DATA.md`
- `08_DATA_SCHEMA_AND_GOVERNANCE.md`
- `09_QA_SECURITY_DEPLOYMENT.md`
- `10_MULTI_AGENT_EXECUTION.md`

If there is a conflict:
1. Safety, legality, data integrity, and user data preservation take precedence.
2. This master orchestrator governs agent execution and integration.
3. Domain documents govern their respective feature.
4. Lead Orchestrator must document any necessary deviation in an Architecture Decision Record (ADR).

## 6. NON-NEGOTIABLE DATA INTEGRITY

Never fabricate:
- Map locations or coordinates.
- Vehicle tracker status.
- Tracker removal methods.
- Vehicle selling availability or prices.
- Vehicle spawn or respawn behavior.
- Money payouts, cooldowns, or repeatability.
- Mission prerequisites or rewards.
- Collectible locations.
- Cheat codes or Xbox button combinations.
- 100% completion requirements.

Use explicit statuses:
- `CONFIRMED`
- `VERIFIED_COMMUNITY`
- `COMMUNITY_REPORTED`
- `UNVERIFIED`
- `UNKNOWN`

When data is missing, display `Unknown` or `Unverified`. Never fill gaps with plausible-sounding guesses.

Distinguish:
- Vehicle acquisition value vs actual selling price.
- Tracker status vs selling eligibility.
- Straight-line distance vs road-network distance.
- Confirmed game mechanics vs community reports.
- Complete progress requirements vs a partial checklist.

## 7. DEVELOPMENT PHASES AND GATES

### Phase 0 — Discovery and agent setup
- Inspect repository and environment.
- Verify multi-agent/sub-agent support.
- Launch specialist agents.
- Create architecture and shared contracts.
- Identify basemap requirements and licensing risks.
- Produce dependency graph and implementation plan.

**Gate 0:** No implementation until actual agent setup, ownership, and shared contracts are documented.

### Phase 1 — Foundation
- Next.js project setup.
- Design tokens and global layout.
- Responsive desktop/mobile shell.
- Map canvas and configurable coordinate system.
- Licensed/original basemap integration or a clearly labeled development placeholder.
- Sample markers that are explicitly demo data.
- Working sidebar, search, filters, marker details.
- Basic tests and production build.

**Gate 1:** Map interaction, navigation, search, responsive shell, and build must work.

### Phase 2 — Map and personal state
- Marker layers and clustering.
- Location detail.
- Favorites.
- Found/unfound.
- Personal markers and notes.
- LocalStorage persistence.
- Shareable map/location URL.
- Backup and restore.

**Gate 2:** User data survives refresh and invalid imports cannot corrupt existing data.

### Phase 3 — Game intelligence
- Vehicle Finder and tracker classification.
- Money Finder and efficiency ranking.
- Mission Guide.
- Xbox Guide.
- Collectibles and activities.

**Gate 3:** All game-specific records expose source and verification status. Unknown data remains unknown.

### Phase 4 — Optimization
- Money Farming Route.
- Multi-stop route optimizer.
- Completion dashboard.
- Advanced search and filters.
- Performance optimization.

**Gate 4:** Route metrics are accurately labeled; completion percentage is not overstated.

### Phase 5 — Production readiness
- Accessibility and responsive QA.
- Security review.
- Data validation.
- Production build.
- GitHub setup.
- Vercel deployment.
- Smoke tests.

**Gate 5:** All critical acceptance criteria pass and no known blocker remains.

## 8. ENGINEERING RULES

- Build a functional application, not a static mockup.
- Use modular components and typed domain models.
- Keep canonical game data separate from UI and personal user data.
- Avoid giant components and duplicated business logic.
- No dead buttons or fake interactions.
- No API keys or secrets in client code.
- No external data without source/license metadata.
- Use error, loading, and empty states.
- Preserve user data during schema changes.
- Add tests for critical logic.
- Keep a `README.md`, `.env.example` when needed, and architecture notes.
- Do not claim a feature is complete until it has been tested.

## 9. REQUIRED AGENT REPORTING

For every agent task, require:
- Agent name and role.
- Task ID.
- Assigned files/directories.
- Deliverables.
- Files changed.
- Tests executed and results.
- Assumptions.
- Blockers.
- Remaining work.
- Integration notes.

Lead Orchestrator must review all agent outputs and resolve conflicts before merging.

## 10. INITIAL EXECUTION PROMPT

Start now with Phase 0 only.

First, inspect the Antigravity environment and confirm that true multi-agent and sub-agent execution is available. Launch the specialist agents defined in `10_MULTI_AGENT_EXECUTION.md`.

Do not merely describe agents. Actually delegate tasks to separate agents/sub-agents using the available orchestration capability.

Create:
1. `docs/agent-plan.md`
2. `docs/architecture.md`
3. `docs/dependency-graph.md`
4. `docs/adr/` for architecture decisions
5. `docs/agent-reports/` for agent outputs
6. Shared TypeScript contracts proposal
7. A map asset and licensing assessment

Have agents work in parallel only where dependencies allow. The Lead Orchestrator must consolidate their findings and present:
- Actual active agents/sub-agents.
- Task assignments.
- File ownership.
- Dependency graph.
- Architecture proposal.
- Risks and blockers.
- Phase 1 execution plan.

Stop after Phase 0 and request approval before Phase 1.

If genuine multi-agent execution is unavailable, do not pretend it is active. Report the limitation and request permission for a single-agent fallback.
