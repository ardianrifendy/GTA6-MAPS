# 10 — MANDATORY MULTI-AGENT / SUB-AGENT EXECUTION

## 1. Mandatory requirement

The project must be developed using actual separate Antigravity agents and/or sub-agents.

The Lead Orchestrator must delegate real tasks to distinct agents using the orchestration capability available in the environment.

A single agent writing a list of fictional roles does not satisfy this requirement.

If the environment cannot execute multiple agents, report the limitation and request explicit user approval before switching to single-agent execution.

## 2. Agent topology

### Agent 0 — Lead Orchestrator / Principal Engineer
Responsibilities:
- Own overall architecture.
- Inspect repository and environment.
- Launch and coordinate specialist agents.
- Define shared contracts.
- Resolve dependencies and conflicts.
- Review code and data outputs.
- Integrate work.
- Run final QA.
- Maintain ADRs and project status.

Must not delegate final integration responsibility.

### Agent 1 — Product Architect
Scope:
- Product requirements.
- User journeys.
- Feature boundaries.
- Acceptance criteria.
- Navigation and information architecture.

Deliverables:
- Product requirement review.
- Feature dependency map.
- Acceptance checklist.

### Agent 2 — UI/UX Specialist
Scope:
- Dark Premium design system.
- Desktop and mobile layout.
- Component inventory.
- Responsive interaction patterns.
- Accessibility design.

Deliverables:
- Design tokens.
- Layout/component specification.
- UI implementation or isolated UI branch, subject to shared contract.

### Agent 3 — Map/GIS Engineer
Scope:
- Leaflet/image overlay architecture.
- Custom coordinate system.
- Basemap integration.
- Markers, layers, clustering.
- Map URL state and map performance.

Deliverables:
- Map engine module.
- Coordinate transform utilities and tests.
- Map asset requirements and license assessment.

### Agent 4 — Vehicle Intelligence Specialist
Scope:
- Vehicle data model.
- Tracker / Non-Tracker / Unknown classification.
- Selling and storage semantics.
- Vehicle filters and ranking.
- Non-Tracker Hunt layer requirements.

Deliverables:
- Typed vehicle schema.
- Vehicle Finder module.
- Data validation rules.
- Tests for classification and filters.

### Agent 5 — Money Finder Specialist
Scope:
- Money opportunity schema.
- Money efficiency calculation.
- Filters and ranking.
- Farming route integration contract.

Deliverables:
- Money Finder module.
- Ranking utilities.
- Validation and tests.

### Agent 6 — Mission & Completion Specialist
Scope:
- Mission data model.
- Prerequisite graph.
- Completion tracker.
- Xbox controls and cheat verification model.
- Spoiler handling.

Deliverables:
- Mission/guide modules.
- Completion calculations.
- Xbox guide structure.
- Tests.

### Agent 7 — Route & Personal Data Specialist
Scope:
- Multi-stop route planner.
- Approximate/road route semantics.
- Personal markers and notes.
- LocalStorage persistence.
- Backup and restore.

Deliverables:
- Route planner module.
- Personal data hooks/services.
- Import/export validation.
- Tests.

### Agent 8 — QA, Security & Release Specialist
Scope:
- Test strategy.
- Accessibility review.
- Security review.
- Production build.
- Vercel readiness.
- Smoke tests.

Deliverables:
- QA report.
- Test results.
- Release checklist.
- Deployment notes.

## 3. Sub-agent use

Specialist agents may launch sub-agents for bounded tasks when Antigravity supports nested delegation.

Examples:
- UI agent: desktop layout sub-agent and mobile layout sub-agent.
- Map agent: coordinate-system sub-agent and marker-performance sub-agent.
- Vehicle agent: schema sub-agent and filter/ranking sub-agent.
- QA agent: accessibility sub-agent and production-build sub-agent.

Sub-agents must report to their parent specialist. Parent specialists remain accountable for reviewing and integrating their outputs.

Do not create unnecessary agents for trivial tasks. Every sub-agent must have a defined deliverable and owner.

## 4. Dependency graph

Suggested order:

```text
Phase 0: Orchestrator + Product Architect
                  |
          Shared architecture
                  |
       Shared types and contracts
                  |
    +-------------+--------------+
    |             |              |
  UI Agent     Map Agent     Data Governance
    |             |              |
    +-------------+--------------+
                  |
       Feature implementation
    +------+------+------+------+
    |      |      |      |      |
 Vehicle Money Mission Route Personal
 Agent   Agent  Agent   Agent  Data
    |      |      |      |      |
    +------+------+------+------+
                  |
              Integration
                  |
              QA Agent
                  |
            Production build
                  |
             GitHub/Vercel
```

The exact execution graph may change based on repository state and technical constraints. Document changes.

## 5. File ownership and conflict avoidance

Before parallel coding, Lead Orchestrator must create a file ownership matrix.

Rules:
- Avoid multiple agents editing the same file concurrently.
- Define shared TypeScript contracts before feature agents implement against them.
- UI agent owns shared visual components unless explicitly reassigned.
- Map agent owns map engine and coordinate utilities.
- Domain agents own their domain modules and tests.
- Lead Orchestrator owns app integration and shared configuration.
- QA agent may propose changes but should not overwrite domain logic without coordination.

Use separate branches/worktrees if the environment supports them. Otherwise sequence edits to shared files.

## 6. Agent task contract

Every delegated task must include:

```text
TASK ID:
AGENT:
OBJECTIVE:
SCOPE:
OUT OF SCOPE:
INPUTS:
FILES OWNED:
DEPENDENCIES:
DELIVERABLES:
ACCEPTANCE CRITERIA:
TESTS REQUIRED:
REPORT FORMAT:
```

## 7. Agent report format

Every agent must return:

```text
AGENT:
TASK ID:
STATUS: NOT STARTED / IN PROGRESS / BLOCKED / COMPLETE
FILES CREATED:
FILES MODIFIED:
IMPLEMENTED:
TESTS RUN:
TEST RESULTS:
ASSUMPTIONS:
DATA SOURCES:
LICENSE NOTES:
BLOCKERS:
KNOWN LIMITATIONS:
INTEGRATION NOTES:
```

## 8. Orchestrator integration protocol

1. Receive agent report.
2. Inspect actual changed files.
3. Check compliance with shared types and domain rules.
4. Run relevant tests.
5. Resolve conflicts.
6. Integrate changes.
7. Update architecture and project status.
8. Request next phase approval when the phase gate is met.

Never accept “complete” based only on an agent's claim. Inspect the implementation and test results.

## 9. Parallelism policy

Parallelize independent research, design, schema, and isolated modules.

Do not parallelize tasks that depend on an unresolved shared contract.

Before launching parallel coding, establish:
- Shared types.
- Module boundaries.
- File ownership.
- Import/export conventions.
- Error handling conventions.
- Test framework.

## 10. Multi-agent audit

At the end of every phase, provide a table:

| Agent | Assigned scope | Actual output | Tests | Status |
|---|---|---|---|---|

Also report:
- Number of actual agents/sub-agents launched.
- Tasks delegated.
- Tasks completed.
- Tasks blocked.
- Integration conflicts.
- Remaining risks.

Do not claim an agent was launched unless the orchestration environment confirms it.

## 11. Failure and fallback

If agent launch fails:
1. Stop delegated implementation.
2. Record the capability/error.
3. Explain whether the limitation is environmental or task-related.
4. Ask the user for explicit permission to continue in single-agent mode.

Do not silently replace multi-agent execution with one agent.
