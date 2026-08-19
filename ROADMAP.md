# Roadmap — Build Slices

*Output of Phase 6 (Build Preparation), drafted 2026-08-19. Each slice below is meant to be one Claude Code session/PR: small, individually testable, one coherent change. Check items off (or note deviations) in CHANGELOG.md as they ship. Do not start a slice out of order — later slices depend on earlier data-layer work existing.*

## M0 — Spike (de-risk before building features)
**Goal:** Confirm the riskiest technical unknown — iOS PWA storage persistence — before investing in real features.
- **0.1 — Installable PWA skeleton:** manifest.json + service worker + minimal index.html. Acceptance: installs to Sapna's iPhone home screen via "Add to Home Screen," opens full-screen (no Safari chrome).
- **0.2 — localStorage persistence check:** write a test key/value on load, display it, install on-device, leave untouched for several days, reopen and confirm the value survived. Acceptance: value still present after real elapsed time on the actual device — this is a manual, calendar-time test, not something to fake with a quick reload.

**Do not proceed to M1 until 0.2 is confirmed on-device — a failure here changes ADR-3 and needs a stop-and-flag conversation, not a workaround.**

## M1 — Core data layer + zone list
Affected FRs: FR-001, FR-003, FR-011
- **1.1 — Data layer:** Zone/Item/Reward/WeeklyCheckIn JSON schema (see TECHNICAL_DESIGN.md Data Model) + localStorage read/write/persist helper functions. No UI yet. Acceptance: can create, read, update, delete a Zone object programmatically; data survives a page reload.
- **1.2 — Zone list view (FR-011):** display all zones with name/status/% resolved; empty state prompts zone creation. Acceptance: matches FR-011 acceptance criteria exactly.
- **1.3 — Zone creation from template library (FR-001):** ≥10 curated zone types selectable, user names the zone, default checklist attaches automatically. Acceptance: matches FR-001 acceptance criteria.
- **1.4 — Freeform zone creation (FR-003):** custom name, zero pre-populated items. Acceptance: matches FR-003 acceptance criteria.

## M2 — Zone checklist + item interactions
Affected FRs: FR-002, FR-004, FR-005, FR-014
- **2.1 — Zone-type checklist content (FR-002):** author the actual curated content — ≥10 zone types × ≥5 typical items each, static JSON. Acceptance: matches FR-002 acceptance criteria.
- **2.2 — Item status cycle (FR-004):** Pending / Dealt With / N/A, 3-state. Acceptance: matches FR-004 acceptance criteria; confirm during this slice whether N/A gets a lightweight non-XP acknowledgment (open question flagged in PRD.md FR-004 — resolve with Sapna, don't just pick one).
- **2.3 — Add custom item (FR-005):** addable at any time, behaves identically to template items. Acceptance: matches FR-005.
- **2.4 — Undo/revert item status (FR-014):** revert Dealt With/N/A back to Pending; reverting removes any XP awarded. Acceptance: matches FR-014.

## M3 — Sensory feedback + XP system
Affected FRs: FR-006, FR-007
- **3.1 — Visual + sound feedback (FR-006, partial):** sound cue + visual strikeout/animation fire on "Dealt With." Acceptance: both fire reliably on-device.
- **3.2 — Haptic feedback + settings toggle (FR-006, complete):** attempt haptic where supported (note: expected to no-op on iOS Safari per TECHNICAL_DESIGN.md — verify, don't assume); add a settings toggle for all sensory feedback. Acceptance: toggle off silences all three; graceful no-op confirmed on iPhone for haptic specifically.
- **3.3 — XP system (FR-007, partial):** fixed XP per item on "Dealt With," visible and persistent across sessions. Acceptance: XP total correct and survives reload.

## M4 — Zone completion + leveling + rewards
Affected FRs: FR-008, FR-009, FR-010 (and completes FR-007)
- **4.1 — Zone completion (FR-008):** auto-flag ready-to-complete when all items resolved; manual early-end option; bonus XP on completion (completes FR-007); early-exit stays "in progress," no penalty. Acceptance: matches FR-008.
- **4.2 — Leveling system (FR-010):** XP-to-level thresholds; current level + progress-to-next visible persistently. Acceptance: matches FR-010.
- **4.3 — Collectible reward system (FR-009):** 3-5 milestone tiers, dedicated rewards/collection view. Acceptance: matches FR-009; exact visual theme is a build-time creative call, not a blocking decision.

## M5 — Progress/stats view + weekly check-in
Affected FRs: FR-012, FR-013
- **5.1 — Progress/stats view (FR-012):** cumulative zones completed, items dealt with, current level, reward progress; real-time updates. Acceptance: matches FR-012.
- **5.2 — Weekly self-rating check-in (FR-013):** passive in-app prompt (no push notifications), 1-5 rating stored with timestamp, simple history view. Acceptance: matches FR-013; skipped weeks are just a data gap, no penalty logic needed.

## M6 — Archive, polish, deploy
Affected: FR-015, NFRs, hosting
- **6.1 — Archive a zone (FR-015):** archived zones hidden from active list/stats but recoverable, not deleted. Acceptance: matches FR-015.
- **6.2 — NFR pass:** load time (app usable within a couple seconds), offline capability check (core logging works with no connection), ≤2-tap session start, tap target sizing, color contrast, no countdown/time-pressure UI anywhere. Acceptance: each NFR/UX requirement in PRD.md sections 11-12 individually verified on-device.
- **6.3 — Deploy:** push to GitHub Pages or Netlify free tier, confirm HTTPS, confirm PWA installs correctly from the live URL (not just localhost). Acceptance: fresh install from the deployed URL works end-to-end on Sapna's iPhone.

## M7 — Personal launch
- **7.1 — Real install + persistence re-check:** install the deployed app on Sapna's iPhone, re-confirm storage persists over several real days now that the full app (not the M0 spike) is what's installed.
- **7.2 — Begin 6-week trial:** start tracking against PRD.md Success Criteria (≥1 zone session in 4/6 weeks, avg weekly self-rating ≥3.5/5, no downward trend). This is the start of Phase 8/9, not a build task — nothing further to code here unless the trial surfaces a bug or a genuine product question, which gets flagged, not silently fixed with new scope.
