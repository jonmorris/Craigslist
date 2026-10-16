# Craigslist Android app — UX audit

Livefront design challenge: redesign of Craigslist's native mobile app (Android, Material 3).
In scope: **(a) Home, (b) browsing a category → list, (c) search, (d) listing detail.** Assumed location: Minneapolis.

Source: screenshots of the current Android app (v1.29.1), taken on a Samsung device. Location was set to Epping, NH. All screens are in [`audit-screens/`](audit-screens/), numbered in flow order.

---

## 1. Summary

The current app is fast, private and functional. It also hides its best ideas: the price histogram, search results grouped by category with counts, and saved-search alerts. Home is a directory, not a destination. Primary actions sit behind ☰ and ⋮ menus. The listing page gives buyers almost nothing to decide with, and nothing to trust.

**Opportunity:** keep Craigslist's soul (local, anonymous, free, plain-spoken, fast), and make browsing visual, put context on every card, and build trust at the moment someone gets in touch.

---

## 2. What to keep (the soul + hidden gems)

| What | Where | Why it matters |
|---|---|---|
| Lowercase, plain-spoken voice ("search a wider area", "tell us what you think") | everywhere | Brand personality. Keep it. |
| Floating peace-sign pattern | [01](audit-screens/01-onboarding-splash.jpg), [29](audit-screens/29-account-about.jpg) | Proof the brand can be playful. Reuse for empty, loading and success states. |
| Location ask before the system dialog, with "not now" | [02](audit-screens/02-onboarding-location-permission.jpg) | The right permission pattern. |
| Results by category with counts | [10](audit-screens/10-search-results-by-category.jpg) | Great scoping. Hidden in the typeahead today. |
| Price histogram with average | [15](audit-screens/15-filter-sort-price-histogram.jpg) | Unique market data that tells you what a fair price is. Buried in filters. |
| Make/model typeahead | [17](audit-screens/17-filter-make-model-typeahead.jpg) | The system already understands category structure. |
| Applied filters as chips | [19](audit-screens/19-list-filtered-surly.jpg) | Correct pattern. Extend it into a full filter-chip row. |
| Approximate location circle (not exact pin) | [26](audit-screens/26-detail-map-actions.jpg) | Privacy-first. Keep it. |
| Saved searches with alerts | [21](audit-screens/21-save-search.jpg) | The biggest reason to come back. Under-used. |
| Prev/next through results | [24](audit-screens/24-detail-top-gallery.jpg) | Good idea. Modernize it as swipe. |
| Dark mode support | [32](audit-screens/32-account-dark-mode.jpg) | Table stakes. Already there. |

---

## 3. Findings by screen

### Onboarding (context only — out of scope)
- 3–4 screens before any content: splash → permission → location → radius map ([01–05](audit-screens/)).
- The splash's most prominent items are legal links (terms, privacy). "get started" promises nothing.
- The permission screen is mostly empty black, and it never shows the payoff ("1,240 listings near you").

### (a) Home — a directory, not a destination
- Home = search bar + **categories | my searches** tabs ([06](audit-screens/06-home-categories.jpg)).
- **Zero listings on Home.** It's a two-pane text list: 7 sections, alphabetical subcategories.
- **Subcategories are alphabetical, not ordered by demand.** "atvs, utvs, snowmobiles" and "aviation" sit above bicycles ([07](audit-screens/07-category-picker-modal.jpg)). "et cetera" is in the middle of jobs.
- The selected section looks odd (an outlined "raised tab"), and the last item is clipped by the system navigation bar ([07](audit-screens/07-category-picker-modal.jpg)).
- "my searches" is a sibling tab. Saved searches and their new results never appear on Home itself.
- Time to the first listing: ~3 taps from Home, 6+ from first launch.

### (b) Category → list
- **Key actions are hidden behind ☰** (filter & sort, map, change view, save search, share) ([14](audit-screens/14-list-overflow-menu.jpg)). On Android, ☰ reads as "navigation drawer", so the icon misleads too.
- **Cards show only a truncated title and price.** No age, distance or neighborhood ([12](audit-screens/12-list-bicycles-grid.jpg)).
- **Repeat posts and one seller crowding the grid:** Mens/Womens Haro, both $128 ([12](audit-screens/12-list-bicycles-grid.jpg)). "Fuji mountain bike $1,000" appears twice, once with **no photo**, just a black box ([11](audit-screens/11-search-results-loading-overlay.jpg)).
- The "355 results" bar takes a full row and says little.
- No results: **"retry"** makes no sense, and "search a wider area" doesn't say how many results that would give ([18](audit-screens/18-list-no-results.jpg)).
- **Two different radius controls:** a 30/50/100/150/200-mile dialog ([20](audit-screens/20-list-radius-dialog.jpg)) and the map picker ([22](audit-screens/22-location-picker-50mi.jpg)).

### Location picker
- Fixed circle over a moving map: panning sets the center, zooming sets the radius. Nothing explains this, and you end up with odd values ("radius: 49 miles") ([23](audit-screens/23-location-picker-panned-cornish.jpg)).
- The center snaps to the closest town (Epping, NH → Cornish, ME).
- **Two confirm buttons:** "apply" in the top bar *and* "choose this location" at the bottom.
- **Regional, not local:** 50 mi from Epping includes Boston. Minneapolis shoppers think in neighborhoods (Uptown, Northeast, St. Paul, suburbs), not 50-mile circles.

### (c) Search & filter
- Empty state: "You do not seem to have any search history," with random suggestions (plumber, community volunteer) ([08](audit-screens/08-search-focus-empty-history.jpg)).
- Suggestions appear in quotes ("black ebike"), like raw database output. No thumbnails ([09](audit-screens/09-search-typeahead-keyboard.jpg)).
- The results-by-category list is noisy: "all housing 399" for "bike" ranks above bicycle parts ([10](audit-screens/10-search-results-by-category.jpg)).
- **Counts don't match:** 2833 in the suggestions vs 2,861 on the results screen ([10](audit-screens/10-search-results-by-category.jpg), [11](audit-screens/11-search-results-loading-overlay.jpg)).
- The loading message ("searching for…") is a translucent overlay sitting **on top of** the results count and the listings ([11](audit-screens/11-search-results-loading-overlay.jpg)).
- The filter screen is a long full-screen list with **two "apply" buttons** (top and bottom). Category attributes are collapsed accordions ([15](audit-screens/15-filter-sort-price-histogram.jpg), [16](audit-screens/16-filter-category-attributes.jpg)).
- **Save search:** the alert toggles are **off by default** and labeled "(optional)", yet alerts are the point of saving ([21](audit-screens/21-save-search.jpg)).

### (d) Listing detail
- Specs are right-aligned purple text that **look like links**, with no hierarchy ([25](audit-screens/25-detail-specs.jpg)).
- **Distance never shown:** the listing is in Manchester-by-the-Sea, MA, ~40 mi from the search location ([24](audit-screens/24-detail-top-gallery.jpg)).
- **Reply = another menu** (email / view-copy contact info / cancel): two taps to do the main job ([28](audit-screens/28-detail-reply-sheet.jpg)). There's a chat tab, but reply doesn't use it.
- **No trust signals at all:** no seller context, no safety guidance. "flag as prohibited" sits in an overflow sheet next to "vote for best-of" ([27](audit-screens/27-detail-overflow-sheet.jpg)).
- The ★ (favorite) and 🗑 (hide) buttons are gray squares that look disabled. "Hide" has a scary icon ([26](audit-screens/26-detail-map-actions.jpg)).
- The listing ID shown on the page means nothing to buyers.

### Visual system
- Pure black background. One purple used for everything (links, buttons, values, selections). Green prices. Android's default font (Roboto).
- No button hierarchy: cancel and ok are **both** filled purple ([32](audit-screens/32-account-dark-mode.jpg)).
- Black text on mid-purple buttons has weak contrast. Check it against accessibility standards (WCAG).
- No light-mode screenshots yet (the app has a setting for it).

---

## 4. User needs

1. **"Is this worth my time?"** Price, freshness, distance and condition at a glance.
2. **"Can I trust this?"** Signals that a listing and seller are real, plus guidance on meeting safely.
3. **"Find it for me."** Search that scopes well and remembers. Alerts when the right thing appears.
4. **"Near *me*."** Neighborhood-level local, not a 50-mile circle.
5. **"Don't make me work."** One-tap reply, visible actions, no dead ends.
6. **"Leave me anonymous."** Keep the relay email and privacy-first maps.

## 5. Business opportunities

- **Engagement:** saved searches with alerts on by default drive return visits, more replies, and more successful sales.
- **Supply:** "sell one like this" on the listing page and an easy post entry point → more listings, the marketplace's lifeblood.
- **Revenue:** most revenue comes from paid categories (jobs, dealer listings, brokered housing). Better-presented paid listings justify the fee, without becoming ads.
- **Trust as brand protection:** visible safety features answer the #1 public complaint (scams).
- **Data advantage:** fair-price signals from Craigslist's own listing history. Competitors can't easily copy it.

## 6. Design principles

1. **Browse *or* search, never a dead end.** Home works for people who don't know what they want yet.
2. **Show the context that drives a decision on every card:** price, age, distance or neighborhood.
3. **Primary actions in plain sight.** Nothing important behind ☰ or ⋮.
4. **Trust at the moment of contact.** Safety, seller context and in-app chat appear when someone taps reply.
5. **Remember for me, on by default.** Saved searches come with alerts.
6. **Keep the soul:** lowercase voice, privacy-first, playful peace sign, fast. Still Craigslist, just finally pleasant.

## 7. How might we…

- **(a) Home:** …make browsing a destination, not a settings dialog?
- **(b) List:** …help people judge *fresh, near, fair price* at a glance?
- **(c) Search:** …turn the hidden category counts into confident scoping, and make alerts the default?
- **(d) Detail:** …make reply one tap and build trust at the moment of contact?

## 8. Signature-moment candidates

- **Fair-price signal:** turn the histogram into a badge on cards and listings ("$128 · below typical").
- **Smart no-results:** "0 here · 12 within 25 mi →" as a one-tap expansion.
- **Swipe between listings** in detail, replacing prev/next.
- **Reply sheet:** a Material bottom sheet with chat, call or email, quick replies ("still available?"), and a safe-meetup note.
- **Neighborhood location sheet:** chips, a radius slider with a live count, and a map preview, with one confirm button.
- **Peace-sign motion:** pull-to-refresh, empty states, and the save-search confirmation.
