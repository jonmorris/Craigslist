# Presentation outline: the design section

The hybrid structure: principles up front, a buyer-then-seller walkthrough as the main story, then what's underneath, what we kept, and what we chose not to build. IDs in brackets (H1, L7…) point to rows in [`decisions.md`](decisions.md), so every callout has a "why" behind it if someone asks.

**Length:** about 24 slides, roughly 15–20 minutes plus the demo. Slides marked *optional* can go if time is short.

**Slide format for the walkthrough:** today's screen on the left (from [`audit-screens/`](audit-screens/)), the redesign on the right, two or three numbered callouts. Each callout is one line: what changed, then why. Tag each callout with a small principle marker (①–⑤) so the principles stay visible through the story.

**Assets to capture:** prototype screenshots for each "redesign" side, and short screen recordings (5–10 s) for the slides marked 🎥.

---

## Part 1: Framing

### 1. Redesigning Craigslist without losing Craigslist
- **On screen:** the redesigned home next to today's home ([06](audit-screens/06-home-categories.jpg)).
- **Say:** Craigslist users are loyal *because* it never changes. The goal was to make it easier to use without making it feel like a different product.

### 2. Five principles
- **On screen:** five short lines, each with its marker.
  1. **Keep what people love:** no ads, no algorithm, the plain voice, privacy.
  2. **Make the main action obvious:** controls in plain sight, one tap for the main job.
  3. **Never a dead end:** every empty screen offers a next step.
  4. **Show the numbers:** counts, freshness, distance and price context, and they match everywhere.
  5. **Built for Android:** Material 3, accessible, works on every screen size.
- **Say:** every change in the next slides ties back to one of these, and every one is logged with the evidence behind it (audit, user complaints, testing, platform).

### 3. What we kept on purpose
- **On screen:** a grid of small screens or icons, each labeled.
  - Newest first, no promoted or ranked feed [L12]
  - The lowercase voice, peace sign and dark mode [B5]
  - The purple circle location picker [A4]
  - Approximate location only, never an exact pin [D10]
  - Prev / next through results, now also a swipe [D7]
  - Make-and-model search [F3]
  - Renew after 48 hours [P9]
  - Resumes under jobs [L14]
- **Say:** saying no on purpose is a design decision. These are what people praise, so we built around them.

---

## Part 2: Buying a bike

**Set up the task (spoken, or a title card):** "You live in Longfellow and want a used road bike for under $300."

### 4. Home: from a directory to a starting point
- **Today:** [06](audit-screens/06-home-categories.jpg). **Redesign:** home.
- ① Six section tiles with live counts, saved searches with new-match badges, and fresh listings on the first screen [H1] ②④
- ② Location in the header, one tap to change [H2] ②
- ③ The search bar collapses into a sticky bar, so search is always reachable [H3] ⑤
- *Optional aside:* we built three home directions and tested them on the phone before choosing [H4].

### 5. Browsing a section
- **Today:** [07](audit-screens/07-category-picker-modal.jpg). **Redesign:** the for-sale section page.
- ① Popular subcategories ordered by demand, not A–Z ("atvs" and "aviation" no longer sit above bicycles) [L1] ②
- ② A–Z is still there, with "none nearby" marked [L1] ①

### 6. The list
- **Today:** [12](audit-screens/12-list-bicycles-grid.jpg), [14](audit-screens/14-list-overflow-menu.jpg). **Redesign:** the bicycles list.
- ① Everything that was behind ☰ is now a chip in plain sight: filters, sort, price, sold by [L3] ②
- ② Cards show price, below / above typical, age, neighborhood and distance [L4] ④
- ③ Dealer reposts bundled into one "+N similar" card by default [L5] ①
- ④ Change the category or area without backing out [L2] ②
- *Optional:* the layout menu (grid, large photos, list, no images, map) [L8].

### 7. Filters 🎥
- **Today:** [15](audit-screens/15-filter-sort-price-histogram.jpg), [33](audit-screens/33-filter-sort-bikes-top.jpg)–[35](audit-screens/35-filter-sort-bikes-options.jpg). **Redesign:** the filter sheet.
- ① One sheet, every group open, one button with a live count ("show 4 listings") instead of two apply buttons [F1] ②④
- ② Full parity with today's bike filters, plus frame size, which riders shop by first [F2, F5]
- ③ The sold-by chip always names its choice: all sellers, by owner, by dealer [F4] ②

### 8. Price as a control 🎥
- **Today:** the histogram is a picture ([15](audit-screens/15-filter-sort-price-histogram.jpg)). **Redesign:** the price sheet.
- ① Tap the histogram to drop a bracket, then drag or slide it; the count updates live [F6] ④
- ② Free is a price preset, not a separate toggle [F7]
- **Say:** this is unique market data Craigslist already has. We turned it into the control, and reused it on the listing (slide 14) and in posting (slide 18).

### 9. Where you're looking
- **Today:** [20](audit-screens/20-list-radius-dialog.jpg), [22](audit-screens/22-location-picker-50mi.jpg), [23](audit-screens/23-location-picker-panned-cornish.jpg). **Redesign:** the location picker.
- ① One picker everywhere, instead of two different radius controls [A1] ②
- ② Neighborhoods, sub-areas and small distances (2–25 mi), not a 30 mi minimum [A2] ①
- ③ A live count while you choose, and one save button [A3, A5] ④

### 10. The map 🎥
- **Today:** map view hidden behind ☰. **Redesign:** the results map.
- ① Count bubbles that split as you zoom; price markers for single listings [L11] ④
- ② Positions stay approximate, by neighborhood [D10] ①

### 11. Never a dead end
- **Today:** "retry" ([18](audit-screens/18-list-no-results.jpg)). **Redesign:** a row of the five empty states.
  - Typing with no matches → suggestions
  - A search with no results → save it as an alert [S6]
  - Filters too tight → each way out shows its count ("clear the price filter · 1,354 listings") [L7]
  - Nothing in your area → nearby areas with counts and a map [L7]
  - Nothing local at all → the nearest cities that have one [L7]
- **Say:** this is principle ③ in one slide. A dead end becomes a next step, and you can see what each option gets you.

### 12. Search
- **Today:** [08](audit-screens/08-search-focus-empty-history.jpg), [09](audit-screens/09-search-typeahead-keyboard.jpg), [11](audit-screens/11-search-results-loading-overlay.jpg). **Redesign:** search.
- ① An empty search shows recents, saved searches and what's trending, not "you do not seem to have any search history" [S1] ③
- ② Suggestions with matching listings and thumbnails [S2] ②
- ③ No loading overlay hiding the results [S4]

### 13. Counts you can trust
- **Today:** 2,833 on one screen, 2,861 on the next ([10](audit-screens/10-search-results-by-category.jpg)). **Redesign:** home tile → section → list, all showing 1,354.
- **Say:** tap a tile that says 1,354 and the list says 1,354. A number that changes when you tap it erodes trust [S3, S3b] ④

### 14. The listing
- **Today:** [24](audit-screens/24-detail-top-gallery.jpg)–[26](audit-screens/26-detail-map-actions.jpg). **Redesign:** the bike listing.
- ① Distance and neighborhood under the title, an approximate-area map below [D2] ④
- ② A readable spec grid instead of purple text that looks like links [D1]
- ③ Save is in the same spot as on every card; the bottom bar is hide, share, message [D5, D6] ②
- *Optional:* the listing ID is removed; it's in the shared link [D9].

### 15. Is this a good deal, or a scam?
- **Today:** no price context or safety guidance; report sits next to "vote for best-of" ([27](audit-screens/27-detail-overflow-sheet.jpg)). **Redesign:** the price check and seller card.
- ① A price check: "bicycles in Minneapolis usually go for $300–$1,200" [D8] ④
- ② "Below typical" is a neutral badge, not a green "deal"; far below triggers a scam warning [D12] ①
- ③ A seller card, a report link in plain sight, and a meet-in-public tip [D4]
- **Say:** scams are the top complaint, and a price far below the going rate is a classic scam signal, so we chose not to celebrate it.

### 16. Getting in touch
- **Today:** reply opens another menu ([28](audit-screens/28-detail-reply-sheet.jpg)). **Redesign:** message seller.
- ① Message seller is one tap [D3] ②
- ② Quick replies ("is this still available?", an offer at the typical price) get people past the blank message [D3]

### 17. Keeping what you found
- **Today:** save from inside a listing only; saved searches can't be edited; back clears your filters. **Redesign:** card bookmarks and the Saved tab.
- ① Save from any card without leaving the list; one bookmark symbol everywhere [L13, B9] ②
- ② Saved searches keep filters, area and sort, can be updated in place, and alerts are on by default [V1, L10]
- ③ Filters and scroll position survive going back [L9]
- ④ Hidden listings can be unhidden [V2]

---

## Part 3: Selling a bike

**Set up the task:** "Now you're the one selling."

### 18. Posting 🎥
- **Today:** posting sits behind the account menu. **Redesign:** the four-step post flow.
- ① Post is a highlighted item in the nav, one tap away [P1, B6] ②
- ② The price step shows the typical range, the same data buyers see [P2] ④
- ③ The form asks for the same fields buyers filter by, so the post shows up in those filters [P3]
- ④ Chat by default, phone off by default, location shown as a neighborhood [P4, P5] ①

### 19. Finding your post again
- **Today:** posts live on a web account page; on Facebook Marketplace your own listings are hard to find. **Redesign:** account tab, home strip, owner view.
- ① Three ways back: the account tab, a "your posts" strip on home, and landing on your live post after posting [P6] ③
- ② Your own listing shows views, saves and messages, with edit and mark sold [P7]
- ③ Mark sold keeps a record and can be undone; delete asks first [P8]

---

## Part 4: Underneath it all

### 20. Built for Android
- **On screen:** a component sheet (chips, sheets, nav, snackbars) in light and dark.
- ① Material 3 throughout; every piece maps to a Jetpack Compose component [B1, B4] ⑤
- ② The craigslist purple, brightened, with a tint per section; Young Serif and Figtree [B2, B3]
- ③ WCAG 2.1 AA in both themes, 48dp+ touch targets [B8] ⑤
- *Optional:* we flag anything prototype-only in the log's "Native feasibility" section.

### 21. One app, every screen 🎥
- **On screen:** phone, Fold open in portrait, Fold in landscape.
- ① Bottom nav on phones, navigation rail at 600dp+ [B10] ⑤
- ② On wide screens the listing stays full screen, with photos on the left and details on the right [B10]

---

## Part 5: Closing

### 22. Considered, not built
- **Default filter presets** ("my size", "owners only"): saved searches already cover most cases [V3]
- **Two-way ratings:** they answer the scam complaint, but could push heavy sellers away and require accounts. Lighter signals first: phone-verified, "on craigslist since" [O3]
- **Dynamic color:** tried, too neon then too muted [B2]
- **Say:** restraint is part of the design.

### 23. Open questions and next steps
- Do section pages earn their extra tap? [O2]
- How do you roll this out to users who like that nothing changes? [O4]
- Chat is still a stub [O5]
- Next: refine in Figma, and test with real Craigslist users.

### 24. Live demo
- **On screen:** a QR code for the prototype and a link to the decision tracker.
- **Demo path:** home → bicycles → filters → price bracket → map → listing → save. Then post the example bike → find it on the account tab → mark it sold. Finish on the Fold.
