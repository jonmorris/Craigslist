# Decision log

A dated index of every decision on this project, one line each. It's a pointer, not a second source of truth: each row's **Ref** names the file and section where the reasoning lives. Repo-only: it is never built into the prototype or the deck.

Where the reasoning lives:

- [`decisions.md`](decisions.md): every difference from today's Craigslist app, with today / redesign / why / source, coded by screen (H1, L8, D13…). Its **Still open** section is the deferred list, and **Native feasibility** records what maps to Compose and what is prototype-only. This is the main source.
- [`audit.md`](audit.md): the UX audit of the current Android app: scope, what to keep, findings, principles.
- [`design-tokens.md`](design-tokens.md): the visual system (color roles, type, shape, components, icons).
- [`presentation-outline.md`](presentation-outline.md): the client deck, slide by slide.
- [`../CLAUDE.md`](../CLAUDE.md): the working rules (keep the log current, native-feasible only, the shareable tracker).
- [`../prototype/README.md`](../prototype/README.md): how the prototype is built, run and installed.
- `git history`: for the few early engineering choices nothing else explains.

The story built from these facts is in [`CASE-STUDY.md`](CASE-STUDY.md).

## How to keep this file

- **Add a file, not a row.** A new decision goes in [`decision-log/`](decision-log/) as its own file named `YYYY-MM-DD-short-name.md` (lowercase, hyphenated), holding exactly one table row. Never edit the table on a branch: rows appended to the same last line by parallel branches always conflict, and separate files never do.
- **Fold on main.** `npm run decision-log -- --fold` (from `prototype/`) appends the waiting entries to the end of the table in filename order (date, then name) and deletes their files. Run it on main, in a commit of its own, whenever the folder gets long. Without `--fold` it validates the entries and prints them with a count.
- **One row per decision, not per commit.** A reversed decision gets a new row of kind Reversed. The old row stays.
- **Say the decision, not the change** ("Save is a bookmark everywhere", not "edit ListingCard.jsx").
- **Kind** is one of these. The list lives in code as `KINDS` in [`../prototype/scripts/decision-log-lib.mjs`](../prototype/scripts/decision-log-lib.mjs); change it there and here together.
  - **Product:** scope, features, flows and information architecture.
  - **Design:** interaction, layout and visual choices.
  - **Content:** wording, and the story the presentation tells.
  - **Kept:** something today's app does that we deliberately did not change. This project treats "we kept this" as a decision.
  - **Engineering:** how the prototype is built, deployed and run.
  - **Process:** how we work: rules, records, review.
  - **Deferred:** considered and not done now, or left open.
  - **Reversed:** an earlier decision undone. Name what replaced it.
- **Ref** names the file → section holding the why, using the codes in `decisions.md` where there is one. If no why is written anywhere, write it there first. "git history" is only for the backfilled rows below.
- `npm test` (from `prototype/`) checks every pending entry, so a malformed one fails the tests.

## Log

| Date | Kind | Decision | Ref |
|---|---|---|---|
| 2026-10-16 | Process | Start from a UX audit of today's Android app (v1.29.1), with numbered screenshots as evidence | audit.md → 1. Summary |
| 2026-10-16 | Product | Scope is four screens: home, category → list, search and the listing, set in Minneapolis | audit.md → intro |
| 2026-10-16 | Deferred | Onboarding is context only, out of scope | audit.md → 3. Findings, Onboarding |
| 2026-10-16 | Design | Build three home directions side by side and test them on a phone; direction A (search + browse) wins | decisions.md → Home, H4; prototype/README.md |
| 2026-10-17 | Design | The home search bar collapses into a sticky bar with the peace sign | decisions.md → Home, H3 |
| 2026-10-17 | Design | Material 3 throughout, mapping every piece to a Jetpack Compose component | decisions.md → Visual design, B1 |
| 2026-10-17 | Reversed | Generated dynamic color dropped for a hand-picked palette pinned over M3 roles from the craigslist purple | decisions.md → Visual design, B2 |
| 2026-10-17 | Design | No hover states, only pressed and focus: it's a touch app | decisions.md → Visual design, B7 |
| 2026-10-17 | Design | Post stays a filled, highlighted nav item, an exception to M3 | decisions.md → Visual design, B6 |
| 2026-10-17 | Engineering | The prototype deploys to GitHub Pages on every push, and stays out of search engines | git history |
| 2026-10-17 | Design | The listing's overflow menu goes: hide moves to the action bar, report to the seller card | decisions.md → Listing detail, D4, D6 |
| 2026-10-17 | Design | One icon family: Material Symbols Rounded, weight 500 | decisions.md → Visual design, B4 |
| 2026-10-17 | Product | Section landing pages sit between home and the list | decisions.md → Category → list, L1 |
| 2026-10-17 | Design | Category and area become two full-size buttons on every list | decisions.md → Category → list, L2 |
| 2026-10-17 | Product | Dead ends become next steps: area-empty and zero-local states, each showing what it would bring back | decisions.md → Category → list, L7 |
| 2026-10-17 | Design | One location picker everywhere, with regions, neighborhoods and short distances | decisions.md → Location, A1, A2 |
| 2026-10-17 | Reversed | Dragging the circle's center replaced by today's fixed circle over a panning map | decisions.md → Location, A4 |
| 2026-10-17 | Deferred | The map stays a static image in the prototype; real tiles wait for the native build | decisions.md → Native feasibility |
| 2026-10-17 | Engineering | The prototype is an installable PWA so it can be reviewed on a real phone | prototype/README.md → Install as an app |
| 2026-10-17 | Kept | Place names stay capitalized, with state abbreviations; the rest of the UI stays lowercase | decisions.md → Location, A6 |
| 2026-10-17 | Kept | Scrolling the search suggestions closes the keyboard | decisions.md → Search, S7 |
| 2026-10-17 | Design | WCAG 2.1 AA in both themes, with 48dp touch targets | decisions.md → Visual design, B8 |
| 2026-10-18 | Design | A named layout menu for the list instead of a cycling toggle | decisions.md → Category → list, L8 |
| 2026-10-18 | Product | Filters, sort and scroll survive going back, and choices survive reopening the app | decisions.md → Category → list, L9 |
| 2026-10-18 | Product | A Saved tab holds listings, searches (with alerts on) and hidden posts | decisions.md → Saved, V1, V2; Category → list, L10 |
| 2026-10-18 | Kept | Prev/next through results from a listing, now a pager and a swipe | decisions.md → Listing detail, D7 |
| 2026-10-18 | Product | Category-specific filters, matching today's bicycle filters plus frame size | decisions.md → Filters and sort, F2 |
| 2026-10-18 | Product | A map view of results with count bubbles and price markers | decisions.md → Category → list, L11 |
| 2026-10-18 | Design | Sold by is a three-way chip that names its current choice | decisions.md → Filters and sort, F4 |
| 2026-10-18 | Process | Keep a decision log of every change from today's app, with why and the evidence, including what we kept | decisions.md → intro; CLAUDE.md → Keep the decision log current |
| 2026-10-18 | Kept | Newest first by default, with no promoted or ranked feed | decisions.md → Category → list, L12 |
| 2026-10-18 | Kept | The lowercase voice, the peace sign and dark mode | decisions.md → Visual design, B5 |
| 2026-10-18 | Kept | An approximate location circle, never an exact pin | decisions.md → Listing detail, D10 |
| 2026-10-18 | Design | The typical-price module moves below the listing, as "price check" | decisions.md → Listing detail, D8 |
| 2026-10-18 | Design | Hiding asks first and offers report-and-hide in the same sheet | decisions.md → Listing detail, D5 |
| 2026-10-18 | Design | "Below typical" is a neutral badge, with a scam nudge for very low prices | decisions.md → Listing detail, D12 |
| 2026-10-18 | Design | The price histogram is the price control | decisions.md → Filters and sort, F6 |
| 2026-10-18 | Product | Save from the list: a save button on every card | decisions.md → Category → list, L13 |
| 2026-10-18 | Reversed | The heart on cards becomes a bookmark, the one save symbol everywhere | decisions.md → Visual design, B9 |
| 2026-10-18 | Deferred | Separate filter preferences considered and not built; saved searches cover it | decisions.md → Saved, V3 |
| 2026-10-18 | Deferred | Section landing pages kept for now, with the extra tap left as an open question | decisions.md → Still open, O2 |
| 2026-10-18 | Deferred | Seller verification and two-way ratings: probably not this version | decisions.md → Still open, O3 |
| 2026-10-18 | Deferred | How a redesign this big ships to loyal users is left open | decisions.md → Still open, O4 |
| 2026-10-18 | Deferred | The chat flow stays a stub in the prototype | decisions.md → Still open, O5 |
| 2026-10-18 | Design | Responsive by M3 window size class: bottom nav on phones, a rail on every screen from 600 wide | decisions.md → Visual design, B10 |
| 2026-10-18 | Process | Design only what a native Android app can do; flag anything prototype-only | CLAUDE.md → Native-feasible only; decisions.md → Native feasibility |
| 2026-10-18 | Reversed | A list-and-listing side-by-side view dropped: listings always open full screen | decisions.md → Visual design, B10 |
| 2026-10-18 | Design | On the listing, save sits top-right over the photo and share joins the bottom action bar | decisions.md → Listing detail, D5, D6 |
| 2026-10-18 | Product | A four-step post flow and a home for your own posts | decisions.md → Posting and your posts, P1–P9 |
| 2026-10-18 | Design | Nav items are rounded squares holding icon and label, on the bar and the rail | decisions.md → Visual design, B6 |
| 2026-10-20 | Product | One count per view, the same everywhere it appears | decisions.md → Search, S3b |
| 2026-10-24 | Process | The decision log is also published as a shareable tracker page, generated from decisions.md | CLAUDE.md → Shareable decision tracker |
| 2026-10-25 | Kept | Resumes stay with jobs, as a popular jobs subcategory | decisions.md → Category → list, L14 |
| 2026-10-26 | Content | Every deck screenshot is the Galaxy Z Fold 8 cover screen, today's shots beside the redesign's | presentation-outline.md → intro |
| 2026-10-26 | Engineering | The installed prototype shows the system bars, tinted to the in-app theme | decisions.md → Native feasibility |
| 2026-10-26 | Content | Callouts describe only what their screenshots show, with no claims about today's app beyond its screenshot | presentation-outline.md → intro |
| 2026-10-26 | Deferred | iOS, posting, saved and created posts, and account held for the next review | presentation-outline.md → 4. Where we are |
| 2026-10-26 | Design | On the listing, the description comes before the details grid | decisions.md → Listing detail, D1 |
| 2026-10-26 | Content | The walkthrough follows one shopper: a used road bike under $500, from Longfellow | presentation-outline.md → intro |
| 2026-10-26 | Design | The listing's X becomes a back arrow | decisions.md → Listing detail, D13 |
| 2026-10-26 | Deferred | Quick replies in message seller left open, to test | decisions.md → Still open, O6 |
| 2026-10-26 | Design | List views are named by image size: large, medium, small, no images, and map | decisions.md → Category → list, L8 |
| 2026-10-27 | Content | The deck has four parts, and the visual refresh gets its own | presentation-outline.md → intro |
| 2026-10-27 | Content | The next-steps slide is cut; the questions slide becomes the Part 4 divider with the prototype link | presentation-outline.md → Part 4 |
