# Backlog: review feedback

Livefront's "areas of opportunity" from the design challenge review ([verbatim](feedback/2026-11-19-livefront-review.md)), one item each, worked one at a time. Repo-only.

**How to work an item:**
1. Agree the direction before building it. The "Direction" column is a starting proposal, not a decision.
2. Change the prototype, and the deck or its screenshots where the item is about them.
3. In the same commit, update the item's row in [`decisions.md`](decisions.md) (or add one), add a [decision-log](DECISION-LOG.md) entry file (usually Design, or Reversed when it undoes an earlier call), and set the item here to **Done** with the date.
4. Anything we decide not to change stays here as **Won't do**, with the reason.

**Status:** To do · In progress · Done · Won't do

**Suggested order:** the claims first (FB14–FB16), because they're cheap and they cost the most credibility. Then readability (FB1, FB7, FB17), which share one fix. Then the nav and the color system, then the smaller items.

| # | Feedback | Where | Direction (to agree) | Size | Status |
|---|---|---|---|---|---|
| FB1 | Small text in listing metadata, filter chips, nav labels and supporting explanations | Prototype | Raise the type scale one step for metadata, chips, labels and helper text (M3 body-medium and label-large as the floor), and check every screen at the Fold's cover-screen width | M | To do |
| FB2 | Large images next to compressed titles and metadata | Prototype | Rebalance the medium-images card: shorter photo, two-line titles, metadata on its own line. Reconsider which view is the default | M | To do |
| FB3 | Purple-tinted surfaces everywhere blur structure and controls | Prototype | Neutral surfaces for structure (nav, headers, sheets, fields), with purple only on interactive and selected elements. Goes with FB10 | M | To do |
| FB4 | The filled Post button competes with the selected nav destination | Prototype | Post stops looking selected all the time. Goes with FB5 | S | To do |
| FB5 | Post in the nav bar mixes an action with destinations | Prototype, deck | Move Post out of the nav: a floating action button on home and lists, or a top-bar action, leaving the nav to destinations only. Rethink with FB4 | M | To do |
| FB6 | The floating Save search button overlaps listings and over-emphasizes a secondary action | Prototype | Move save search into the scope row or the top bar, or collapse it to an icon on scroll | S | To do |
| FB7 | Small, tightly packed filter chips feel less comfortable than the rounded styling suggests | Prototype | Bigger chips with more spacing, and fewer chips in the row. Goes with FB1 | S | To do |
| FB8 | Search screenshots omit the keyboard, so the layout is unproven while typing | Deck | Retake the search shots with the keyboard up, and check what still fits above it | S | To do |
| FB9 | Prev/next over the photo is easy to confuse with photo paging | Prototype | Move prev/next off the photo, into the top bar or a bar below the gallery, and keep the photo counter alone on the image | S | To do |
| FB10 | Several surface colors with no clear pattern | Prototype, docs | Define a small surface hierarchy in `design-tokens.md` and apply it. Goes with FB3 | M | To do |
| FB11 | Hide takes a persistent spot beside Share and Message seller | Prototype | Move hide into an overflow (⋮) or the top bar, leaving the action bar to share and message | S | To do |
| FB12 | Confirming every hide adds friction when sorting through results | Prototype | Hide immediately, with an undo snackbar that also offers "report". Goes with FB11 | S | To do |
| FB13 | Filter sheet buttons sit on a surface with no clear boundary, so content looks cut off | Prototype | Give the sheet's button bar a divider or elevation and its own surface | S | To do |
| FB14 | "Below typical" and the price comparisons judge without explaining the data or accounting for condition, model and age | Prototype, deck | Say where the range comes from ("asking prices for similar bikes posted in Minneapolis in the last 90 days") and what it ignores; soften the badge wording | S | To do |
| FB15 | The price chart claims what bikes "actually sell for" without sale data | Prototype, deck | Reword to asking prices everywhere, in the app and the deck. Craigslist doesn't know sale prices | S | To do |
| FB16 | The deck says research and testing are done but shows no findings | Deck | Add a findings slide with what was learned and from where (the audit, app-review complaints, testing), saying what kind of testing it was and with how many people, and tie a few decisions to it | S | To do |
| FB17 | Accessibility claims come without larger-text layouts | Prototype, deck | Test at 200% font scale, fix what breaks, and show the large-text layouts in the deck | M | To do |
