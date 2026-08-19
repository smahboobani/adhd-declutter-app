# Changelog

All notable changes to this project are documented here, in reverse-chronological order. Add an entry each time a roadmap slice ships (see ROADMAP.md).

Format per entry: date, roadmap slice / FR reference, one-line description, verification status.

## [Unreleased]
- **2026-08-18 — M0.1 (Installable PWA skeleton):** Added `manifest.json`, `service-worker.js`, `index.html`, and placeholder icons (`icons/`). Deployed to GitHub Pages at https://smahboobani.github.io/adhd-declutter-app/. **Confirmed on-device by Sapna (2026-08-18):** installs via Safari "Add to Home Screen," opens full-screen with no Safari chrome. Slice done.
- **2026-08-18 — M0.2 (localStorage persistence check), in progress:** `index.html` now writes a timestamp to `localStorage` on first load only (never overwritten) and displays "First recorded" / "Viewed just now" / "Days since first recorded" on screen. Verified locally: value survives a page reload unchanged while "viewed" timestamp updates. Service worker cache bumped to `v2` so the phone picks up the new file. **Still needed per ROADMAP.md:** reopen the installed app on Sapna's iPhone after several real days untouched and confirm "First recorded" hasn't reset — this is a calendar-time test, not something a reload can substitute for. Do not proceed to M1 until this is confirmed.
