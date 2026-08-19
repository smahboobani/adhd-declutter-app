# Feature Parking Lot

Running list of deferred ideas — captured but not committed to MVP scope. Append new entries here as they come up; do not build any of these without explicitly reopening scope with Sapna first.

## 1. Auto-generated daily decluttering tasks
**Feature/idea:** App proactively generates two small decluttering tasks per day, of varying difficulty, each tied to a reward.
**Problem it might solve:** Provides structured, proactive daily engagement beyond purely reactive urge-triggered sessions — could build habit/consistency and reduce "what do I even start with" decision fatigue.
**Reason for deferral:** MVP is scoped to reactive, urge-triggered, zone-based sessions only. Auto-generating tasks requires task-difficulty modeling and a rewards system beyond the MVP's minimal core loop.
**Possible future phase:** Post-MVP (v2), after the core hypothesis is validated through real usage.
**Dependencies:** Requires the zone/task data model from MVP to exist first, plus a reward system and difficulty-tiering logic.
**Trigger for reconsideration:** After MVP has been live and used for a few weeks — if usage data shows urge-based triggers alone aren't producing enough engagement/consistency.

## 2. AI-generated dynamic zone checklists
**Feature/idea:** Instead of fixed hand-curated templates, generate a typical-items checklist on the fly via an LLM for any zone name typed in.
**Problem it might solve:** Removes the limitation of a fixed template library — works for any zone, not just pre-curated ones.
**Reason for deferral:** Requires a paid API call per zone, directly against the "minimize paid APIs for now" constraint, and adds build complexity for v1.
**Possible future phase:** Post-MVP, once core hypothesis is validated and API cost/complexity is more acceptable.
**Dependencies:** MVP's fixed-template zone system as the fallback/baseline.
**Trigger for reconsideration:** If the fixed template library proves too limiting in real use.

## 3. Randomized narrative/lore reveals
**Feature/idea:** Random story/lore snippets revealed as a gamification layer, alongside XP and rewards.
**Problem it might solve:** Tests the "immersion" part of the core hypothesis more fully; adds depth to the gamification layer.
**Reason for deferral:** Content-authoring heavy — too much time cost for a nights/weekends solo build before the core hypothesis is even validated.
**Possible future phase:** Post-MVP, once core loop (XP, sensory feedback, simplified collectible rewards) is proven to work.
**Dependencies:** None blocking — purely additive content layer.
**Trigger for reconsideration:** After MVP validates the core hypothesis and there's appetite/time to invest in content authoring.

## 4. Streak mechanics
**Feature/idea:** Non-punitive daily streak tracking tied to decluttering activity.
**Problem it might solve:** Could reinforce consistency/habit if daily engagement becomes a goal.
**Reason for deferral:** Streaks assume a daily-cadence usage pattern, but actual triggers are random/unscheduled — the mechanic doesn't fit current usage pattern.
**Possible future phase:** Post-MVP, and only if paired with "auto-generated daily tasks" (#1), which would create an actual daily-cadence pattern for streaks to track.
**Dependencies:** Daily auto-generated tasks feature (#1).
**Trigger for reconsideration:** If/when daily auto-generated tasks are built.

## 5. Photo/before-after documentation
**Feature/idea:** Capture before/after photos of a zone to visually document progress.
**Problem it might solve:** Could reinforce the macro goal ("open, breathing home") with visual proof, beyond stats/numbers.
**Reason for deferral:** Not raised as a stated need; adds image storage/handling complexity not required to test the core hypothesis.
**Possible future phase:** Post-MVP, if stats-only progress view proves insufficiently motivating.
**Dependencies:** None blocking.
**Trigger for reconsideration:** If real usage shows the numeric progress view isn't emotionally satisfying enough.

## 6. Multi-device sync / accounts
**Feature/idea:** Login/accounts with sync across multiple devices.
**Problem it might solve:** Would let Sapna use the app from more than one device.
**Reason for deferral:** Adds real build complexity (auth, backend, data sync) not required for MVP — phone-only, single-device use is sufficient to test the hypothesis.
**Possible future phase:** Post-MVP, if single-device use proves limiting.
**Dependencies:** None blocking.
**Trigger for reconsideration:** If Sapna wants to use the app across multiple devices in practice.

## 7. Expanding scope to shared household/partner/pet items
**Feature/idea:** Extend decluttering scope beyond Sapna's own belongings to shared household, partner's, and pet-related items.
**Problem it might solve:** Would address the full household clutter picture, not just Sapna's own stuff.
**Reason for deferral:** MVP is explicitly scoped to personal belongings only — shared items introduce joint-decision and permission complexity not needed to test the core hypothesis.
**Possible future phase:** Post-MVP, once the core hypothesis is validated on personal belongings.
**Dependencies:** MVP validation; likely also needs some form of partner buy-in/involvement design.
**Trigger for reconsideration:** If MVP succeeds and there's interest in expanding scope to the full household.
