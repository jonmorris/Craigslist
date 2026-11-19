# Craigslist redesign prototype

Livefront design challenge: an Android / Material 3 redesign of the Craigslist app for Minneapolis. The prototype lives in `prototype/` (Vite + React), published to GitHub Pages from this branch.

## Keep the decision log current

`docs/decisions.md` maps every difference from today's Craigslist app to the reason for it. It feeds the client presentation.

Whenever a change alters what the user sees or does compared with today's app (or with an earlier decision), update the log in the same commit:

- Add a row, or edit the existing row, in the right section. Fill in today / redesign / why / source.
- Link screenshots in `docs/audit-screens/` when they show today's behavior. Save new screenshots the user shares there, numbered in order.
- Things kept on purpose get a "Kept:" row.
- Move resolved items out of "Still open".

## Running records

`docs/DECISION-LOG.md` (a dated one-line index of every decision) and `docs/CASE-STUDY.md` (a modular portfolio case study) are repo-only indexes over the other docs. The reasoning itself stays in `docs/decisions.md`, `docs/audit.md` and the rest.

When a change makes a decision, add a decision-log entry in the same commit. When it's worth telling, amend a case-study module and add a row to its *Log of additions*. A decision-log entry is always a new file in `docs/decision-log/` (`YYYY-MM-DD-short-name.md`, one table row), never an edit to the table. `npm run decision-log` (from `prototype/`) checks pending entries; `npm test` fails on a malformed one; `--fold` moves them into the table, on main only.

## Native-feasible only

This prototype stands in for a native Android app (Jetpack Compose, Material 3). Only design things a native app can do. If something is web-only or prototype-only, either avoid it or flag it in the "Native feasibility" section of `docs/decisions.md` in the same commit, with the native equivalent or the reason it's prototype-only.

## Shareable decision tracker

The log is also published as an artifact: https://claude.ai/artifact/E7PkDFeWbYp7PJS884M1LU. It's built from `docs/decisions.md` by `prototype/scripts/decisions-page.mjs`. After changing the log, rebuild it (`node prototype/scripts/decisions-page.mjs <out.html>`) and republish to that URL.
