# Technical Design — ADHD Decluttering Gamified App

*Output of Phase 5 (Technical Planning), locked 2026-08-19.*

## Context
Target device confirmed: **iPhone**. Key implication: no web-based haptic feedback (Safari has never implemented the vibration API). Sound + visual strikeout carry FR-006's sensory feedback job; graceful degradation was already specified in the PRD, so no PRD change needed. Getting real haptics would require a native app wrap (Apple Developer Program $99/yr, Xcode, App Store) — rejected, conflicts with the no-budget constraint and the "no native app-store distribution" non-goal.

## Architecture Decision Records

| # | Decision | Choice | Reversibility |
|---|---|---|---|
| ADR-1 | Delivery format | Progressive Web App (PWA), installed via Safari "Add to Home Screen" — no App Store, no fee, no review process | Reversible; wrapping in something like Capacitor later for native haptics is a real rebuild |
| ADR-2 | Frontend stack | Vanilla HTML/CSS/JavaScript, no framework — avoids build-tooling overhead for a technical beginner, keeps every file directly readable/debuggable | Cheap to change later; framework migration is moderate effort given small app size |
| ADR-3 | Data storage | Browser localStorage, JSON-serialized | Reversible; IndexedDB migration straightforward if data volume ever grows |
| ADR-4 | Backend/server | None — fully client-side | N/A |
| ADR-5 | Hosting | Static hosting, free tier (GitHub Pages or Netlify), HTTPS included (required for PWA/service worker) | Trivial to swap |
| ADR-6 | Auth | None — no login, single implicit user | N/A |
| ADR-7 | Analytics | None external — local stats view is the only measurement | N/A |
| ADR-8 | Testing | Manual testing on Sapna's actual iPhone throughout build; automated unit tests for core logic (XP, completion) optional/learning-value only, not required for v1 | N/A |

**Expected cost: $0.** Static hosting free tier, no APIs, no App Store fee, no backend.

## Data Model
- **Zone**: id, name, typeId (nullable), status (not_started / in_progress / complete / archived), createdAt, completedAt
- **ZoneType** (static, bundled with app — not user data): id, name, defaultItems[]
- **Item**: id, zoneId, name, status (pending / dealt_with / na), source (template / custom), xpAwarded
- **Reward/Milestone**: id, xpThreshold, name, unlockedAt
- **WeeklyCheckIn**: id, weekStartDate, rating (1-5), timestamp

All fits as one JSON blob in localStorage — no real database needed at this scale.

## Technical Risks
- **iOS storage persistence (needs verification against current Apple documentation before relying on it):** iOS has historically auto-cleared website storage after inactivity under Safari's tracking-prevention rules. Home-screen-installed PWAs are generally treated as more persistent in current iOS versions, but this must be confirmed, not assumed — it directly compounds the already-accepted "no backup" data-loss risk from the PRD.
- Haptic feedback unavailable on iOS Safari (see Context above) — accepted, not a risk to mitigate.
- No cross-device/cross-browser testing needed — single known target (Sapna's iPhone).

## Recommended Spike (before feature build)
Build a minimal "Hello World" installable PWA that writes/reads localStorage. Install it to Sapna's actual iPhone and confirm data survives a few days untouched. Cheap, de-risks the riskiest technical unknown (storage persistence) before investing in real features. This is Roadmap milestone M0 — see ROADMAP.md.

## Implementation Milestones (summary — full slice breakdown in ROADMAP.md)
- **M0 — Spike:** Installable PWA + localStorage persistence check
- **M1 — Core data layer + zone list:** FR-001, FR-003, FR-011
- **M2 — Zone checklist + item interactions:** FR-002, FR-004, FR-005, FR-014
- **M3 — Sensory feedback + XP system:** FR-006, FR-007
- **M4 — Zone completion + leveling + rewards:** FR-008, FR-009, FR-010
- **M5 — Progress/stats view + weekly check-in:** FR-012, FR-013
- **M6 — Archive zones, polish, deploy:** FR-015, NFRs, hosting deployment
- **M7 — Personal launch:** install on phone, begin the 6-week Success Criteria trial
