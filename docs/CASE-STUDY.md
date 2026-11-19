# Case study: craigslist modern refresh

A running, modular portfolio case study of the Livefront design challenge: an Android / Material 3 redesign of the Craigslist app, set in Minneapolis. Repo-only: it is never built into the prototype or the deck.

## How this file works

- **Modules, not chapters.** Each `##` module stands alone, so a write-up can pick modules and drop the rest without leaving a gap. No module leans on "as above".
- **Tag lines.** Every module opens with an italic tag line:
  - **Core:** the spine of any version.
  - **Optional [audience]:** long form, or for the audience in brackets.
  - **Evidence:** what to show beside the text. `[x]` means it exists (with its path), `[ ]` means it hasn't been captured yet.
- **Running.** When work is worth telling, add or amend a module and add a row to *Log of additions*. Facts and dates come from [`DECISION-LOG.md`](DECISION-LOG.md), and the reasoning behind them from [`decisions.md`](decisions.md) and [`audit.md`](audit.md). This file is where they become a story.
- **Placeholders** go in `[[double brackets]]` for the owner to fill in: role, tools, metrics, reflections. Never invent those.

## Suggested cuts

| Form | Modules |
|---|---|
| Short (one page, or a 3-minute talk) | 1, 2, 3, 5, 7, 14 |
| Standard (portfolio page) | 1, 2, 3, 4, 5, 6, 7, 10, 11, 14 |
| Long (full write-up or interview walkthrough) | 1–14 |

---

## 1. Overview

*Core. Evidence: [x] cover and app icon (`brand/app-icon.svg`, `brand/craigslist-logo.svg`); [ ] one hero image of home, the list and the listing side by side; [ ] link to the live prototype (jonmorris.github.io/Craigslist, owner to confirm it stays up)*

craigslist modern refresh is a redesign of the Craigslist Android app, done as a Livefront design challenge. The brief covered four screens: home, browsing a category, search and the listing page. The result is a working prototype you can install on a phone, an evidence-backed decision log, and a client presentation.

- **Role:** [[your role and title on this project]]
- **Team:** [[who else was involved, if anyone]]
- **Timeline:** October 16 to October 27, 2026, from the first audit to the final deck ([[confirm, and add the review date]])
- **Platform:** Android, Material 3, designed to map onto Jetpack Compose. Reviewed on a Galaxy Z Fold 8.
- **Tools:** a Vite + React prototype deployed to GitHub Pages as an installable web app; Material color utilities for the palette; axe-core for accessibility checks; Claude Code as the build collaborator; [[design tools you used, e.g. Figma]]
- **Deliverables:** the prototype, a UX audit of today's app (37 screenshots), a decision log of about 80 differences from today's app, and a 24-slide client deck.

## 2. The problem

*Core. Evidence: [x] today's home, list and listing (`docs/audit-screens/06-home-categories.jpg`, `12-list-bicycles-grid.jpg`, `24-detail-top-gallery.jpg`); [ ] a one-slide summary of the audit findings*

The audit of today's app (v1.29.1) found a product that is fast, private and functional, and that hides its best ideas. Home is a directory, not a destination: a search bar and a text list of sections and subcategories, with no listings. The primary actions on a list (filter, sort, map, view, save search) all sit behind a ☰ menu that reads as a navigation drawer on Android. Cards show a cut-off title and a price, so buyers have to open each listing to judge it. And the listing page gives buyers almost nothing to decide with and nothing to trust, which matters because scams are the top public complaint.

The hidden gems were already there: a price histogram, search results grouped by category with counts, saved searches with alerts, and prev/next through results. Each was buried.

Source: `audit.md` → 1. Summary, 3. Findings by screen.

## 3. Reframing the brief

*Core. Evidence: [x] the design principles (`docs/audit.md` → 6); [x] the three home directions (git history, 2026-10-16); [ ] a sketch or screenshot of directions B and C*

The brief asked for a modern redesign. The audit reframed it: the job wasn't to make Craigslist look new, it was to **keep its soul (local, anonymous, free, plain-spoken, fast) and surface what it already does well.** That became six principles:

1. Browse *or* search, never a dead end.
2. Show the context that drives a decision on every card: price, age, distance.
3. Primary actions in plain sight; nothing important behind ☰ or ⋮.
4. Trust at the moment of contact.
5. Remember for me, on by default.
6. Keep the soul.

The first build tested this directly: three home directions side by side, compared on a phone. Direction A, search plus browsing by section, won because it keeps the browse-by-category habit and still puts listings on the first screen (`decisions.md` → H4).

[[A line on how you interpreted the brief and what you chose to emphasize]]

## 4. Keeping the soul

*Optional [brand-led or loyalty-sensitive clients]. Evidence: [x] the "Kept" rows in `docs/decisions.md`; [ ] a slide or graphic grouping what stayed*

Craigslist's users are loyal precisely because it never changes, so this project treated "we kept this" as a decision, logged like any other. Kept on purpose:

- the lowercase, plain-spoken voice, the peace sign and dark mode;
- newest first, with no promoted or ranked feed: no algorithm and no ads is one of the most praised things about Craigslist;
- an approximate location circle, never an exact pin;
- the fixed circle over a panning map in the location picker (after a draggable version was tried and reverted);
- prev/next through results, now a pager and a swipe;
- resumes sitting with jobs;
- place names capitalized, as Craigslist already does.

The palette tells the same story: generated dynamic color was tried and dropped as too neon, then too muted, in favor of a hand-picked palette built from the original craigslist purple (`decisions.md` → B2).

## 5. Home: from directory to jumping-off point

*Core. Evidence: [x] today vs redesign (`docs/audit-screens/06-home-categories.jpg`, `docs/presentation-screens/04a-home.png`, `04b-home-scrolled.png`); [x] nav bars (deck slide "A nav bar built for action"); [ ] a short screen recording of home to a listing*

Today's home is the same for everyone, every time. The redesign keeps search prominent, since most people search, and turns the rest into a place worth coming back to:

- **Six sections, one small decision.** Subcategories move to a section landing page, so home has room for personal things.
- **Your searches,** with how many new listings each has.
- **Fresh near you:** new listings from your searches and recent views.

The nav bar follows: search becomes **home**, because that is where today's search icon actually takes you; **post** becomes the always-highlighted primary action, because posting feeds the marketplace; **favorites becomes saved**, because it also holds searches and hidden posts; and account moves to the end so saved, post and chat form a central group.

Source: `decisions.md` → H1–H4, B6, B9; DECISION-LOG rows 2026-10-16 to 2026-10-18.

## 6. Browsing, search and the list: tools in plain sight

*Optional [product designers, IA-focused readers]. Evidence: [x] list, view menu and the four views (`docs/presentation-screens/06a-list-bicycles.png`, `06c-layout-menu.png`, `06d`–`06f`, `10a-map.png`); [x] filters and price bracket (`07b-filters-live-count.png`, `08b-price-bracket.png`); [x] search (`12d-search-typing-bike.png`)*

On the list, everything that was behind ☰ comes out:

- **Category and area** are two full-size buttons, so either can change without leaving the list.
- **The most-used filters** are chips that name their current choice ("under $500", "by owner").
- **One view menu,** named by image size (large, medium, small, no images, map), because today's names didn't say what you get: "list" meant no images.
- **Every card** shows price, age, neighborhood and distance, with a save bookmark in the same spot as on the listing.
- **Price has its own sheet,** where the histogram is the control, which keeps the filter sheet short: every option as a chip, no accordions.
- **Search** offers four kinds of results as you type: your term, completions, the term searched in matching categories, and listings with photos and prices.

Filters, sort and scroll survive going back, a fix for one of the most common complaints in app reviews (`decisions.md` → L9).

## 7. Trust without giving up privacy

*Core. Evidence: [x] seller card, safety tip and report (`docs/presentation-screens/15d-seller-report-safety-verified.png`); [x] hide and report (`14d-hide-confirm.png`); [x] the removed price check, for the before (git history before 2026-11-19, `15e-price-check-trek.png`)*

Scams are the number one complaint, but Craigslist's users also value anonymity, so trust had to come without surveillance. The redesign elevates a little meaningful information at the moment of contact:

- **A seller card:** on craigslist since, how many other listings, phone verified.
- **Safety tips in context:** meet somewhere public, and never pay before you've seen it in person.
- **Report where people look for it:** with the seller info, and inside the hide flow, since people often hide a listing because something is wrong.

Contact stays anonymous: craigslist chat or the email relay by default, with a phone number off by default.

**What we took out.** The first version also judged prices: a "below typical" badge on cards (deliberately neutral gray, since a price far under the going rate is a scam signal), a price check on the listing ("bicycles in Minneapolis usually go for $300–$1,200"), and a scam nudge for very low prices. The client review caught the flaw: Craigslist only sees asking prices, never what things sell for, and a typical range can't account for condition, model or age. A confident verdict on weak data undermines the trust it was meant to build, so the whole feature was removed (`decisions.md` → D8, D12). The price histogram stays, labeled honestly as asking prices.

## 8. Native-feasible only

*Optional [Android teams, engineering-minded readers]. Evidence: [x] the Native feasibility table (`docs/decisions.md` → Native feasibility); [ ] a side-by-side of a prototype component and its Compose equivalent*

The prototype is a web app standing in for a native Android app, so the project adopted a rule on day three: design only what a native app can do, and flag anything prototype-only in the same commit (`CLAUDE.md` → Native-feasible only). Every pattern maps to a named Compose piece: `NavigationSuiteScaffold` for the bar-to-rail switch, M3 sheets, chips and snackbars, `Canvas` with `pointerInput` for the draggable price bracket, DataStore for saved state. The map is the honest exception: a static image in the prototype, with Maps Compose clustering as the native equivalent.

The rule kept the design credible to an Android team, and it kept web-only flourishes out.

## 9. Designing for the Fold

*Optional [large-screen or Android audiences]. Evidence: [ ] captures of the phone, Fold-open and tablet layouts; [ ] photos of the prototype on the Fold, closed and open*

The review device was a Galaxy Z Fold, so the layout responds by Material 3 window size class instead of locking to portrait. Phones get the bottom nav. From 600 wide (the Fold open in portrait) a navigation rail appears on every screen. From 800 wide, a listing stacks its photos in the left column with details on the right. A list-and-listing side-by-side view was tried and dropped: opening a listing should feel like opening it, not a tray (`decisions.md` → B10).

## 10. Saying no on the record

*Core. Evidence: [x] the Still open section (`docs/decisions.md` → Still open); [x] Deferred rows in `docs/DECISION-LOG.md`*

What we didn't do is logged as carefully as what we did:

- **Two-way ratings and seller verification** (eBay or Uber style): considered and probably not this version. They answer the top complaint, but they're heavy, and they cut against the anonymity loyal users value.
- **Separate filter preferences** ("always owners only", "my frame size"): considered and not built, because saved searches already cover it.
- **Quick replies in message seller:** left open to test. "Is this still available?" is a trope, and prefilled messages make spam easy.
- **Onboarding** was out of scope. **Chat** stayed a stub. **The rollout to loyal users** is an open question.
- **iOS, posting, saved and created posts, and account** were held for the next review.

Source: `decisions.md` → V3, Still open; DECISION-LOG rows of kind Deferred.

## 11. Quality

*Core. Evidence: [x] the decision log and tracker (`docs/decisions.md`, the shareable tracker page); [ ] an accessibility report or screenshot from axe-core*

- **Accessibility:** WCAG 2.1 AA in both themes: text at 4.5:1, control outlines at 3:1, touch targets of 48dp or more, and selection never shown by color alone (`decisions.md` → B8).
- **Honest numbers:** one count per view, the same on the home tile, section page, list header and filter sheets. Today's app shows 2,833 in one place and 2,861 in another (`decisions.md` → S3b).
- **A decision for every difference:** about 80 rows map each change from today's app to its evidence (audit, user complaints, phone testing, the brief, platform conventions), and the log is published as a shareable page for the client.
- **Tested on a real device,** installed as an app on the Fold.

[[Any test results or numbers: usability sessions, task success, feedback counts]]

## 12. Telling the story: the client deck

*Optional [presentation and storytelling, consulting audiences]. Evidence: [x] deck screenshots (`docs/presentation-screens/`); [x] the outline (`docs/presentation-outline.md`); [ ] a PDF export of the deck*

The 24-slide deck walks one shopper, "I live in Longfellow and want a used road bike for under $500," from home to messaging a seller. Every walkthrough slide puts today's screen beside the redesign, all at the Fold's cover-screen size. The callouts follow two rules:

- describe only what the screenshots show;
- make no claim about today's app beyond what its screenshot proves.

Where a screen had more to show than the Today-versus-redesign layout allowed, the slide dropped the Today column and showed four redesign screens instead. A final pass removed copy that sounded machine-written.

## 13. Working with an AI collaborator

*Optional [AI-curious readers, process-focused teams]. Evidence: [x] `CLAUDE.md`; [x] git history (every commit co-authored with Claude); [ ] one before-and-after example of a correction*

The prototype, the logs and the deck were built with Claude Code, directed by [[your role]]. Every commit in the repo was made through it. What made it useful was writing the working rules down in `CLAUDE.md`, where every session reads them:

- **Keep the decision log current** in the same commit as any change, so the why never drifts from the what.
- **Native-feasible only,** so the work stayed buildable in Compose instead of reaching for web-only tricks.
- **No unverified claims about today's app.** Early slide drafts asserted things the screenshots didn't show. After that correction, callouts describe only what's on screen.

[[Your reflection: what you delegated, what you kept for yourself, where it helped and where it didn't]]

## 14. Outcome and reflection

*Core. Evidence: [ ] the client's response or review notes; [ ] any follow-up work*

- **Outcome:** [[how the review went, what the client approved or pushed back on]]
- **What worked:** [[your view]]
- **What I'd do differently:** [[your view]]
- **What I learned:** [[your view]]

---

## Log of additions

| Date | Module | Change |
|---|---|---|
| 2026-11-19 | 1–14 | First draft, from the decision log, `decisions.md`, `audit.md`, the deck outline and the git history |
| 2026-11-19 | 7 | The price estimate removed after the client review; told as "what we took out" |
