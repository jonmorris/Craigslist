# Presentation outline: craigslist modern refresh

The deck: https://claude.ai/artifact/HfML2PPvNBSg19qWgBHqJh (private until shared from its Share menu).

**Shape:** three parts. Part 1 frames the project (goals, where we are, the visual refresh). Part 2 walks through the four screens up for review today: home, browsing a category, search, and the listing. Part 3 recaps, demos the prototype and opens the discussion. 18 slides, plus a 4-slide appendix (22 in all).

**Walkthrough slides:** today’s screen on the left (from [`audit-screens/`](audit-screens/)), the redesign on the right (from [`presentation-screens/`](presentation-screens/)), and three callouts. Each callout is a short grey label over a bold line, and describes a feature you can see in that slide’s screenshots. No claims about how today’s app works beyond what its screenshot shows.

**Every phone shot** is the Galaxy Z Fold 8 cover screen at 1248×1972, with its status bar and 3-button nav. Every content slide has the footer “craigslist x Livefront”. Headlines sit in a fixed two-line box so content doesn’t move between slides.

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
4. Modernize without losing what people love about craigslist. *No ads, no algorithm, the plain voice, privacy first.*
5. Serve both sides of the marketplace: buyers and sellers. *Ensure browsers, buyers, community organizers have the tools they need.*

### 4. Where we are, and what we’re reviewing today
- A strip of the seven stages: Discovery and Research, Brand and Visual Design, Concepts and Wireframes, User Testing (done) → **Design Phase** (now) → Development, Release.
- **Today, for feedback and approval:** visual refresh, home screen, browsing a category, search for an item or post, viewing the details of an item or post.
- **Next time:** iOS app, creating a post, managing saved and created posts, account.

### 5. Same purple, same peace sign, a warmer feel
The visual refresh on one slide: logo, five core colors (#6A2BB8, #CAA4FF, #EBDDFB, #FCFAFE, #1E1A24), Young Serif for headlines and Figtree for everything else, the six section tints, and the bottom nav. Detail is in the appendix.

---

## Part 2: The walkthrough

### 6. Part 2 · Buying: Let’s start with someone shopping for a bike
Purple divider. “I live in Longfellow and want a used road bike for under $300.”

### 7. Home gets you to listings right away
- **Screens:** today [06](audit-screens/06-home-categories.jpg); redesign `04a-home`, `04b-home-scrolled`
- Simplified category choice / **Subcategories live on the next screen**
- Saved searches, out of a tab / **More prominent, and easier to jump back in**
- Fresh near you / **New items based on your saved searches and recent views**

### 8. Sections start with what people shop for most
- **Screens:** today [07](audit-screens/07-category-picker-modal.jpg); redesign `05a-section-for-sale`, `05b-section-a-z`
- New category landing page / **A dedicated space to explore an entire category**
- Popular or featured subcategories / **A personalized start, or scroll for the whole list**
- Better browsing for browsers / **People who know what they want lean on search**

### 9. Everything you need is right on the list
- **Screens:** today [14](audit-screens/14-list-overflow-menu.jpg); redesign `06a-list-bicycles`, `17b-save-search-sheet`
- Exposing important filters / **The same filter depth, now in plain sight**
- More functional cards / **Save, location and distance on every card**
- Prominent save search button / **Makes it easy to come back**

### 10. See what a filter does before you apply it
- **Screens:** today [33](audit-screens/33-filter-sort-bikes-top.jpg); redesign `07b-filters-live-count`, `08b-price-bracket`
- Every filter in one sheet / **Each group laid out as chips you can tap**
- A live result count / **The button says how many listings you’ll get**
- Pick a price on the chart / **Drag a range across what bikes actually sell for**

### 11. Search helps before you finish typing
- **Screens:** today [36](audit-screens/36-search-typeahead-bike.jpg); redesign `12d-search-typing-bike-device`, `12e-search-typing-bike-scrolled-device`
- Suggestions finish your word / **What you typed stays plain, the rest is bold**
- Listings right in the suggestions / **Jump straight to a listing, with its photo and price**
- Search in a category / **Matching categories with counts, most relevant first**

### 12. Is it worth the trip? The listing tells you up front
- **Screens:** today [24](audit-screens/24-detail-top-gallery.jpg); redesign `14a-detail-top`, `14c-detail-where`
- Where and when, at a glance / **Neighborhood, distance and age right under the title**
- Specs in a grid / **Condition, frame, make and more, easy to scan**
- Actions where you expect them / **Save over the photo; hide, share and message at the bottom**

### 13. If a deal looks too good, we say so
- **Screens:** today [27](audit-screens/27-detail-overflow-sheet.jpg); redesign `15c-far-below-typical`, `15b-seller-report-safety`
- Price check / **The typical local price range, right on the listing**
- A heads-up on prices far below typical / **See it in person before you pay anything**
- Seller card and safety tip / **Who posted it, where to meet, and a report link**

### 14. Reaching the seller takes one tap
- **Screens:** today [28](audit-screens/28-detail-reply-sheet.jpg); redesign `16a-message-seller`
- One message button / **Message seller is the main action on every listing**
- Quick replies / **“Is this still available?” is one tap away**
- Private by default / **Reply through craigslist chat or the email relay**

---

## Part 3: Recap and discussion

### 15. Part 3 · Recap and discussion: Let’s talk it through
Purple divider. “A quick look in the prototype, then your feedback on today’s screens.”

### 16. See it for yourself
Live demo on the phone, prototype at jonmorris.github.io/Craigslist.
- **Browse:** home → for sale → bicycles → filters → a listing → message seller
- **Search:** search “bike” → jump straight to a listing from the suggestions

### 17. Questions?

### 18. Thank you
“craigslist modern refresh · Android App Redesign”, with the prototype link.

---

## Appendix: the visual refresh, in detail

- Divider: “The visual refresh, in detail”
- **Same purple, same peace sign, just a little brighter:** logo, app icon, core palette, section tints
- **Warm headlines, and everything else easy to read:** Young Serif and Figtree specimens
- **A few new pieces to build with:** icon set, bottom nav, chips, category and area buttons, a listing card, the save-search button

---

## Still to capture

Short screen recordings (5–10 s) to play on the filters, search and listing slides, or to fall back on if the live demo fails.
