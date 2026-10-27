# Presentation outline: craigslist modern refresh

The deck: https://claude.ai/artifact/HfML2PPvNBSg19qWgBHqJh (private until shared from its Share menu).

**Shape:** three parts, 27 slides. Part 1 frames the project: goals, where we are, and and the visual refresh: a divider, then type, color, icons and the building blocks. Part 2 follows one shopper through the four screens up for review today: home, browsing a category, search, and the listing. Part 3 recaps, demos the prototype, takes questions and sets out next steps.

**Walkthrough slides:** today’s screen on the left (from [`audit-screens/`](audit-screens/)), the redesign on the right (from [`presentation-screens/`](presentation-screens/)), and numbered callouts. Each callout is a short grey label over a bold 28px line, and describes a feature you can see in that slide’s screenshots. No claims about how today’s app works beyond what its screenshot shows.

**The shopper:** “I live in Longfellow and want a used road bike for under $500.” The list, filter, listing, details and actions shots follow that search: bicycles under $500, the Trek 5200 road bike ($375, St. Louis Park) and the Electra Townie ($235, Longfellow). The trust slide uses the $50 Schwinn choppers on purpose, to show the warning a too-good price gets.

**Every phone shot** is the Galaxy Z Fold 8 cover screen at 1248×1972, with its status bar and 3-button nav, redesign shots in light mode. Every slide has the footer “craigslist x Livefront”. Headlines sit in a fixed two-line box so content doesn’t move between slides. “craigslist” is always lowercase.

---

## Part 1: Introduction

### 1. craigslist modern refresh
Cover: the peace sign icon, “craigslist / modern refresh” with “Android App Redesign” under it.

### 2. Part 1 · Introduction: First, where we’re headed
Purple divider. “Our goals, where the project stands, and the visual refresh.”

### 3. What we set out to do
Five cards, each a goal with the reason under it:
1. Re-launch mobile apps following modern design trends. *A UI that feels current, native on every screen.*
2. Improve engagement with new and existing users. *Features that make the app more enjoyable to come back to.*
3. Build up craigslist’s reputation around security and trust. *Digital security is at a premium. The UI has to show people they’re safe.*
4. Modernize without losing what people love about craigslist. *No ads, the plain voice, privacy first.*
5. Serve both sides of the marketplace: buyers and sellers. *Ensure browsers, buyers, community organizers have the tools they need.*

### 4. Where we are, and what we’re reviewing today
- A strip of the seven stages: Discovery and Research, Brand and Visual Design, Concepts and Wireframes, User Testing (done) → **Design Phase** (now) → Development, Release.
- **Today, for feedback and approval:** visual refresh, home screen, browsing a category, search for an item or post, viewing the details of an item or post.
- **Next review:** iOS app, creating a post, managing saved and created posts, account.

### 5. Visual refresh: Same purple, new style
Purple divider. “Type, color, icons and the building blocks.”

### 6. Warm headlines, and everything else easy to read
Young Serif for screen titles, section names and the wordmark; Figtree for prices, cards, chips and body text, in regular, semibold and bold.

### 7. Same purple, same peace sign, just a little brighter
Logo and app icon, the five core colors with their roles, and a tint per section, built from the original #9945C8 and passing 4.5:1 in light and dark.

### 8. One icon family, rounded and friendly
The 24-icon set, with three callouts:
- Material Symbols Rounded, weight 500 / **Native to Android and ready for Compose**
- An icon for every section / **For sale, housing, jobs, services, gigs and community**
- Icons that say what they do / **Hide is an eye, saving is a bookmark**

### 9. A few new pieces to build with
Filter chips, the category and area buttons, the bottom nav, a listing card and the save-search button.

---

## Part 2: The walkthrough

### 10. Part 2 · Design walkthrough: Let’s look at someone shopping for a used bike
Purple divider. “I live in Longfellow and want a used road bike for under $500.”

### 11. Home offers more than categories
- **Screens:** today [06](audit-screens/06-home-categories.jpg); redesign `04a-home`, `04b-home-scrolled` (the top of fresh near you)
- Search, more prominent / **The primary way into the catalog**
- Six sections, one small decision / **Subcategories move to the next screen**
- Saved searches, out of a tab / **Get back to where you left off**
- Fresh near you / **New items from your searches and recent views**

### 12. A nav bar built around getting back home
- **Screens:** today's nav bar (cropped from [12](audit-screens/12-list-bicycles-grid.jpg)); the redesign's (cropped from `04a-home`)
- Search becomes home / **A quick way to reset, and a home worth coming back to**
- Post, the primary action / **Always filled, so adding to the catalog is obvious**
- Account moves to the end / **Saved, post and chat form a central group**
- Favorites becomes saved / **You're bookmarking it for later, not picking a favorite**

### 13. Sections start with what people shop for most
- **Screens:** today [07](audit-screens/07-category-picker-modal.jpg); redesign `05a-section-for-sale`, `05b-section-a-z`
- New category landing page / **A dedicated space to explore an entire category**
- Popular or featured subcategories / **A personalized start, or scroll for the whole list**
- Better browsing for browsers / **People who know what they want lean on search**

### 14. Everything you need is right on the list
- **Screens:** today [37](audit-screens/37-list-view-menu.jpg) (the view picker); redesign `06a-list-bicycles` (under $500 on), `06c-layout-menu` (the view menu open)
- Category and area, front and center / **Tweak either without leaving the list**
- Exposing important filters / **The full set is one tap away in filters**
- One menu for every view / **Large, medium or small images, no images, or the map**
- Location and distance on every card / **Know how local it really is**
- Save on every card / **Top right of the photo, the same spot as on the listing**

### 15. The same list, four more ways to see it
A new layout: four redesign screenshots with the view’s name under each, and no “Today” column. The list slide shows medium images, the default; this one shows the other four views from the view menu.
- **Screens:** `06e-view-large-photos` (large images), `06d-layout-list` (small images), `06f-view-no-images`, `10a-map` (all bicycles under $500)
- **Large images**
- **Small images**
- **No images**
- **Map**

### 16. Save the search once, come back anytime
- **Screens:** today [14](audit-screens/14-list-overflow-menu.jpg); redesign `17b-save-search-sheet`, `17d-saved-searches`
- A summary of what you’re saving / **The name, price and area, right in the sheet**
- Alerts, your way / **Tell me about new ones, instantly or once a day**
- Every search in saved / **With how many new listings each one has**
- Pick up where you left off / **Opening one brings back all of its filters**

### 17. Simpler filters when you need them
- **Screens:** today [33](audit-screens/33-filter-sort-bikes-top.jpg); redesign `07b-filters-live-count`, `08b-price-bracket` ($0 to $500)
- Chips instead of accordions / **Every option visible, nothing to open and close**
- Price gets its own sheet / **A chart of what bikes actually sell for, so the filter sheet stays short**
- Filters that fit the category / **Make, bike type and frame size, with popular brands one tap away**

### 18. Improving quick search
- **Screens:** today [36](audit-screens/36-search-typeahead-bike.jpg); redesign `12d-search-typing-bike`, `12e-search-typing-bike-scrolled`
- A visual refresh / **Cleaner and easier to scan**
- Four kinds of results as you type / **Your term, suggestions, the term in a category, and matching listings**
- A preview of what you’ll get / **Photos and prices before you even hit search**

### 19. The essentials sit right at the top
- **Screens:** today [24](audit-screens/24-detail-top-gallery.jpg); redesign `14a-detail-top` (the Trek, 2 of 4), `14f-detail-next-saved` (back one to the Townie, saved)
- A back arrow, not an X / **You’re on a page, and back takes you to the list**
- Next and previous, kept / **Move between results without the back button**
- Price and location up front / **A more prominent price, and distance with the location**
- Save at the top / **The same spot as on the list, so saving several in a row is quick**

### 20. Hide, share and message, all in one bar
- **Screens:** redesign only, no “Today” column: `14a-detail-top` (the Trek with its action bar), `14d-hide-confirm`, `16a-message-seller` (both sheets over the top of the listing)
- A clearer hide icon / **Hiding asks first, and lets you report it too**
- Share in the middle / **Prominent, so passing a listing along is easy**
- Message on the right / **The main action, with quick replies to get started**

### 21. The details are easy to browse
- **Screens:** today [25](audit-screens/25-detail-specs.jpg); redesign `14b-detail-specs`, `15c-far-below-typical` (the $50 choppers’ price check)
- Description first, details below / **The seller’s own words, then condition, frame size, make and more in a grid**
- Where, kept / **A map to easily understand where the item is**
- New price check / **Helps gauge an offer against typical local prices**

### 22. A measured step toward more trust
- **Screens:** today [26](audit-screens/26-detail-map-actions.jpg) (the bottom of today’s listing); redesign `15d-seller-report-safety-verified` (the $50 choppers), `14e-detail-similar`
- More about the seller / **Phone verified, and how many other listings they have**
- Safety tips right where you need them / **A heads-up when the price looks too good, and where to meet**
- Report where people look for it / **Right with the seller info, before you message**
- Similar items, right at the bottom / **Not quite right? The next option is one tap away**
- *Notes:* the price check may be cut, since it gets complicated fast. Not in the UI yet: a rating system, or shadowbanning people with many negative reviews. Report is also in the hide flow, two slides back, and could go at the very bottom.

---

## Part 3: Recap and discussion

### 23. Part 3 · Recap and discussion: Let’s talk it through
Purple divider. “A quick look in the prototype, then your feedback on today’s screens.”

### 24. See it for yourself
Live demo on the phone, prototype at jonmorris.github.io/Craigslist.
- **Browse:** home → for sale → bicycles → filters → a listing → message seller

### 25. Questions?
“What feels right, what doesn’t, and what’s missing?” Next to it, what we covered:
- **Visual refresh:** same purple and peace sign, warmer type, new building blocks
- **Home and navigation:** search up front, six sections, saved searches, a home worth coming back to
- **Browsing a category:** a landing page per category, the list, and filters with a live count
- **Search:** suggestions with listings, and the same list plus a keyword
- **The listing:** essentials at the top, easy details, one action bar, and more trust

### 26. Here’s what happens next
1. **Feedback due:** within a week. Take time to try the prototype on your phone before you send it.
2. **How to send it:** one combined set. Gather everyone’s notes into a single list, with any conflicting asks settled on your side.
3. **Next review:** iOS, posting and account. Creating a post, managing saved and created posts, and updates from your feedback.

### 27. Thank you
Purple, with the peace sign reversed (purple on white) and “craigslist modern refresh · Android App Redesign”.

---

## Still to capture

Short screen recordings (5–10 s) to play on the filters, search and listing slides, or to fall back on if the live demo fails.
