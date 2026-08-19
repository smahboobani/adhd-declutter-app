# Changelog

All notable changes to this project are documented here, in reverse-chronological order. Add an entry each time a roadmap slice ships (see ROADMAP.md).

Format per entry: date, roadmap slice / FR reference, one-line description, verification status.

## [Unreleased]
- **2026-08-18 — M0.1 (Installable PWA skeleton):** Added `manifest.json`, `service-worker.js`, `index.html`, and placeholder icons (`icons/`). Deployed to GitHub Pages at https://smahboobani.github.io/adhd-declutter-app/. **Confirmed on-device by Sapna (2026-08-18):** installs via Safari "Add to Home Screen," opens full-screen with no Safari chrome. Slice done.
- **2026-08-18 — M0.2 (localStorage persistence check), in progress:** `index.html` now writes a timestamp to `localStorage` on first load only (never overwritten) and displays "First recorded" / "Viewed just now" / "Days since first recorded" on screen. Verified locally and confirmed on-device on Sapna's actual installed home-screen app (2026-08-18): reopening repeatedly keeps "First recorded" static while "Viewed just now" updates, as expected same-day. Along the way, found and documented a GitHub Pages caching gotcha (see TECHNICAL_DESIGN.md, Deployment/Testing Note) that initially made the update look like it hadn't deployed. **Still needed per ROADMAP.md:** leave the installed app untouched for several real days, reopen, and confirm "First recorded" still shows the original 2026-08-18 timestamp (not reset) — this is a calendar-time test, nothing further to build until then. Do not proceed to M1 until this is confirmed.
