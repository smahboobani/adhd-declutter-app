# Changelog

All notable changes to this project are documented here, in reverse-chronological order. Add an entry each time a roadmap slice ships (see ROADMAP.md).

Format per entry: date, roadmap slice / FR reference, one-line description, verification status.

## [Unreleased]
- **2026-08-18 — M0.1 (Installable PWA skeleton):** Added `manifest.json`, `service-worker.js`, `index.html`, and placeholder icons (`icons/`). Verified locally: page loads, manifest parses with correct icon references, icons decode at the right dimensions (192/512/180px). Service worker registration could not be verified in the sandboxed local preview browser (registration API rejects there — a known limitation of embedded webviews, not app code) so **on-device verification on Sapna's iPhone via Safari "Add to Home Screen" is still required** before this slice counts as done per ROADMAP.md acceptance criteria (installs, opens full-screen with no Safari chrome).
- Next up: M0.2 (localStorage persistence check) — do not start until 0.1 is confirmed on-device.
