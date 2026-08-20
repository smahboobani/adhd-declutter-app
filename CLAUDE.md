# CLAUDE.md — Project Context for Claude Code

## What this is
A single-user (n=1) Progressive Web App that helps Sapna declutter her own physical belongings by turning small "zones" (a drawer, a shelf, a cabinet) into short, gamified sessions — curated item checklists, sensory feedback, XP, leveling, and collectible rewards. Built solo, nights/weekends, zero budget, by a technical beginner learning Claude Code as she goes.

Read in this order before writing code:
1. `PRODUCT_BRIEF.md` — why this exists *(local-only, gitignored — see note below)*
2. `PRD.md` — what to build (functional requirements, FR-001 to FR-015) *(local-only, gitignored)*
3. `TECHNICAL_DESIGN.md` — how to build it (architecture, ADRs, data model)
4. `ROADMAP.md` — build order, sliced into small verifiable steps
5. `DECISIONS.md` / `ASSUMPTIONS.md` *(local-only, gitignored)* / `FEATURE_PARKING_LOT.md` — as needed for context on why something is or isn't in scope

**`PRD.md`, `PRODUCT_BRIEF.md`, and `ASSUMPTIONS.md` are intentionally not
tracked in git** (see `.gitignore`) — they contain personal/health-context
detail and this repo is public. They still exist on disk and should still be
read/edited normally; they're just never committed or pushed. Their history
was scrubbed from this repo on 2026-08-20 (see CHANGELOG.md) — they're
mirrored in Notion instead (see `NOTION_SYNC.md`).
6. `NOTION_SYNC.md` — read at the start and end of every session; governs how this repo and the Notion project stay in sync

## Non-negotiable constraints
- **No budget.** No paid APIs, no paid hosting, no paid dev tools. Free static hosting only.
- **No backend, no auth, no accounts.** Fully client-side. Single implicit user.
- **Stack: vanilla HTML/CSS/JavaScript.** No framework. Every file should stay directly readable and debuggable by a non-technical beginner.
- **Storage: browser localStorage**, one JSON blob. No database.
- **Target device: iPhone**, installed via Safari "Add to Home Screen." No App Store, no native wrap.
- **No haptics available** on iOS Safari — sound + visual strikeout carry the sensory-feedback job. Don't try to work around this; it's an accepted, documented limitation (see TECHNICAL_DESIGN.md).
- **Non-punitive design.** No countdown timers, no punishing streaks, no penalty for an interrupted session (it just stays "in progress").

## How to work on this project
- Before proposing a change, check which FR or roadmap slice it addresses. State it explicitly.
- One coherent change per slice. Don't bundle unrelated changes.
- Don't silently change approved product behavior — anything in PRD.md or DECISIONS.md is locked; if a build step reveals a reason to change it, stop and flag it rather than deciding unilaterally.
- Manual testing happens on Sapna's actual iPhone. Automated unit tests are optional/learning-value only for v1 (see TECHNICAL_DESIGN.md, ADR-8) — nice to have, not blocking.
- Update `CHANGELOG.md` when a slice ships. Update `DECISIONS.md` if a decision changes.
- Never claim something works without it actually being verified (manually on-device, or via a test).

## Documentation upkeep
See `NOTION_SYNC.md` for the full protocol (batched at session start/end, one
writer per file). Ownership and sync direction per file are canonical in the
Notion "🔗 Notion ↔ Repo Ownership Map" — don't duplicate that table locally.
At minimum, every session ends with the Notion "ADHD Decluttering App —
Project Status" page (https://app.notion.com/p/3c201769c848811c838df73189dd63d2)
updated with the current milestone status and next step — it has no repo
file, so this is a direct write, done once per session.

## Current status
See ROADMAP.md's gating notes and the latest CHANGELOG.md entry for where the build actually stands.
