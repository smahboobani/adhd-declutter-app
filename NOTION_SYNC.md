# Notion Sync Protocol

*How Claude Code keeps this repo and the "ADHD Decluttering Gamified App" Notion
project in sync, without drifting and without wasting Notion API calls.*

**The ownership/direction table itself is NOT copied here.** It's canonical in
Notion, on the "🔗 Notion ↔ Repo Ownership Map" section of the
[ADHD Decluttering Gamified App](https://app.notion.com/p/3c101769c84881668b23f4fd244f63ca)
project page. Read it there each time — don't rely on memory of it, and don't
let this file become a second, staler copy of it.

## The one rule

**One writer per file, one direction.** Every file/page pair in the ownership
map has exactly one side that's allowed to be edited, and a stated direction
for syncing the other side. Never edit both sides of a pair independently in
the same session. If the repo file and its Notion mirror appear to disagree,
stop and ask — don't guess which one is stale and don't silently overwrite
either.

## Sync timing — batch at session boundaries, not per-edit

Notion writes are the expensive, drift-risky part. Minimize the number of
Notion API calls by batching them at two fixed points instead of firing one
per file edit:

1. **Start of session** — pull any pull-down pairs (per the ownership map,
   currently just Feature Parking Lot) from Notion into the repo file, if the
   Notion side has changed since the repo file was last updated. This is the
   only point at which Notion is read *into* the repo.
2. **During the session** — write locally only. Edit as many repo files as
   the work requires (DECISIONS.md, PRD.md, ROADMAP.md, CHANGELOG.md,
   TECHNICAL_DESIGN.md, etc.), as many times as needed. Do not push any of
   these to Notion mid-session — accumulate the diff instead.
3. **End of session** — one consolidated Notion pass:
   - For each push-up pair whose repo file actually changed this session,
     push the accumulated diff in a single `update_content` call per Notion
     page — not one call per edit made during the session.
   - Update the Project Status page once (milestone table + next step).
   - Create one new Build Log page per milestone shipped this session, if
     any — not one per commit.
   - Files with no Notion mirror (CLAUDE.md, and anything not listed in the
     ownership map) stay repo-only. Don't create ad hoc Notion pages for them
     without asking first.

If a session is interrupted before the end-of-session sync, say so explicitly
rather than leaving Notion stale without flagging it.

## Out-of-scope ideas

Per the ownership map's discipline rule: if Claude Code notices an
out-of-scope idea mid-build, surface it to Sapna in chat. Never write to the
Feature Parking Lot Notion page directly — that page is Notion-owned and only
syncs *down* to the repo, never up.
