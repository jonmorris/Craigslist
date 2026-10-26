# Decision log: today's app vs. the redesign

Every change from the current Craigslist Android app (v1.29.1), and why we made it. It's for building the presentation and for answering "why is this different?"

**How to read it:**
- **Today:** what the current app does. Screenshot numbers point to [`audit-screens/`](audit-screens/).
- **Redesign:** what the prototype does instead.
- **Why:** the reason for the change.
- **Source:** where the evidence came from:
  - **audit:** our UX audit ([`audit.md`](audit.md))
  - **users:** what people praise or complain about (midflow audit, from review and press summaries)
  - **review:** feedback from testing the prototype on a phone
  - **brief:** the design challenge
  - **platform:** Android / Material 3 conventions

Kept on purpose: things we deliberately did *not* change are listed too, because "we kept this" is a decision.

Update this log with every change to the prototype (see `CLAUDE.md`).

---

## Home

| # | Today | Redesign | Why | Source |
|---|---|---|---|---|
| H1 | Home is a search bar plus a two-pane text list of 7 sections and their subcategories, with a "my searches" tab. No listings ([06](audit-screens/06-home-categories.jpg)) | Search, six section tiles with live counts, your saved searches with new-match badges, and a "fresh near you" grid | Home was a directory, not a destination. The first listing was 3+ taps away, and saved searches (the main reason to come back) sat on another tab | audit, brief |
| H2 | Location is set during onboarding and hard to find later | A location header on home ("Minneapolis, MN · all areas") opens the location picker | Where you're looking changes every result, so it should be visible and one tap away | audit |
| H3 | Search bar scrolls away | The search bar collapses into a sticky bar with the peace sign as you scroll | Search stays reachable without a separate header | platform (M3 search) |
| H4 | — | Three home directions were built side by side to compare on the phone, and we chose A (search + browse) | A keeps Craigslist's browse-by-category habit and still puts listings on the first screen | review |

## Category → list

| # | Today | Redesign | Why | Source |
|---|---|---|---|---|
| L1 | A category picker modal lists subcategories A–Z ("atvs" and "aviation" above bicycles), with an odd outlined "raised tab" ([07](audit-screens/07-category-picker-modal.jpg)) | A section landing page: popular subcategories ordered by demand, trending searches, just posted, then the full A–Z list with "none nearby" marked | People pick a subcategory in context, not from an alphabetical wall. A–Z is kept for people who know what they want | audit |
| L2 | Changing category or area means backing out | A scope row of two full-size buttons under the title: **category** and **area** | Both change the results, so both should be one tap away. The first version used small text links that failed the 48dp touch-target minimum, so they're now 56dp buttons | audit, review, platform |
| L3 | Filter, sort, map, view, save search and share all sit behind ☰, which on Android reads as a navigation drawer ([14](audit-screens/14-list-overflow-menu.jpg)) | Filter chips in plain sight (filters, sort, price, sold by, has photos), a layout button in the top bar, and a save-search button | The main actions were hidden, and the icon misled | audit, platform |
| L4 | Cards show a cut-off title and a price ([12](audit-screens/12-list-bicycles-grid.jpg)) | Cards show price, "below/above typical", title, age, neighborhood and distance | Buyers judge by price, freshness and distance, and we shouldn't make them open each listing for those | audit |
| L5 | Dealer reposts crowd the grid (two Haro bikes at $128) ([12](audit-screens/12-list-bicycles-grid.jpg)). "Hide duplicates" is an option you turn on ([35](audit-screens/35-filter-sort-bikes-options.jpg)) | Dealer reposts are bundled into one card with "+N similar" by default. "Bundle duplicates" can be turned off | Repost spam is a common complaint, so the clean view should be the default | audit, users |
| L6 | "355 results" takes a full row and says little | A quiet results line: "12,480 listings · 1,312 new today · newest first" | It says how fresh the list is and how it's sorted | audit |
| L7 | No results says "retry", plus "search a wider area" with no count ([18](audit-screens/18-list-no-results.jpg)) | Each way out shows what it would bring back ("clear the price filter · 6"). Separate states for area-empty (with a small map) and zero-local (the nearest cities that have one, and related categories) | A dead end becomes a next step, and people can see what each option gets them | audit |
| L8 | List, thumbnail and gallery views behind ☰ | A layout menu: grid, large photos, list, no images, map. The button shows the current layout's icon | The current app's views, plus a no-images mode people use for scanning. It's a menu so the options are named, not a cycle | review |
| L9 | Going back from a listing (or to home) clears the search filters | Filters, sort and scroll position survive going back. Layout is an app-wide preference. Choices survive reopening the app | "Back wipes my filters" is one of the most common app-review complaints | users |
| L10 | Save search toggles are **off** by default and labeled "(optional)" ([21](audit-screens/21-save-search.jpg)) | Save search turns alerts on by default (instantly or once a day) | Alerts are the point of saving a search | audit |
| L11 | Map view, behind ☰ ([14](audit-screens/14-list-overflow-menu.jpg)) | Map view with count bubbles for listings close together (tap to zoom in) and price markers for single ones, Zillow-style. The area is outlined, and tapping opens a preview | Readable at metro scale, and price is the first thing people scan | review |
| L12 | — | Kept: newest first is the default sort, with no promoted or ranked feed | No algorithm and no ads is one of the most-praised things about Craigslist | users |
| L13 | Saving a listing means opening it first | A save bookmark on every card (list, search results, home, section pages, map preview, saved). Tapping it saves without leaving the list; the snackbar has "view". Over the photo in grid and large photos, at the right in list and no images | People shortlist a few options and follow up later. Saving from the list keeps the browsing flow going, so they don't have to find a listing again. Being tested on the phone | review |
| L14 | Kept: resumes sits with jobs, where job seekers post for employers to find | **Resumes** is a popular subcategory on the jobs page (first by volume). A resume post reads "seeking part-time" where a price would be, its specs are what they're looking for, experience, skills and start date, and the action is "message them" (not "message seller") | It's one of the most-used jobs categories, and it's the other side of the jobs market | review |

## Filters and sort

| # | Today | Redesign | Why | Source |
|---|---|---|---|---|
| F1 | A full-screen "filter & sort" page with **two apply buttons** (top and bottom) and attributes collapsed into accordions ([15](audit-screens/15-filter-sort-price-histogram.jpg), [16](audit-screens/16-filter-category-attributes.jpg), [33](audit-screens/33-filter-sort-bikes-top.jpg)–[35](audit-screens/35-filter-sort-bikes-options.jpg)) | One bottom sheet with every group open as chips, a single button that shows the live result count ("show 4 listings"), and clear | No hidden accordions or duplicate buttons, and you can see what a filter will do before you apply it | audit, platform |
| F2 | Bicycle filters: make and model, type, wheel size, frame material, suspension, brake type, handlebar type, electric assist, condition ([34](audit-screens/34-filter-sort-bikes-attributes.jpg)) | All of them, plus **frame size** (with cm/in ranges), which riders shop by first | Parity first; frame size answers "will it fit me?" | audit, review |
| F3 | Make-and-model typeahead ([17](audit-screens/17-filter-make-model-typeahead.jpg)) | A make-and-model search with quick picks of common makes. It also matches titles, so "long haul trucker" works | Kept one of the current app's hidden gems | audit |
| F4 | Sold by: all / owner / dealer | A sold-by chip that always shows the current choice ("all sellers", "by owner", "by dealer") and opens all / owner / dealer, mirrored in the filters sheet | It's a three-way choice, not a toggle, and a dropdown chip should name what's selected, like the sort chip does | review |
| F5 | Has image, hide duplicates, posted today, search titles only, cryptocurrency ok, delivery available, language of posting ([35](audit-screens/35-filter-sort-bikes-options.jpg)) | All of them. "Search titles only" shows only in search results, where it means something | Parity | review |
| F6 | Price: min–max fields, with the histogram and average shown in filters ([15](audit-screens/15-filter-sort-price-histogram.jpg)) | A price sheet where the histogram is the control: tap it to drop a $300 bracket centered on the tap, drag either end or slide the whole bracket ($50 steps), clear to reset. Min–max fields and presets (free, under $100…) stay in sync, with a live count | The histogram is unique market data and was only a picture. Picking a range on it lets people see where most prices sit while they choose | audit, review |
| F7 | A free toggle | "Free" as a price preset, plus "free" shown in green on cards | Free is a price, so it belongs with price | review |
| F8 | Sort: newest, oldest, low→high, high→low, distance | The same five, in a sort sheet | Parity | review |
| F9 | Sub-areas as filter chips (hennepin co, ramsey co, anok/chis/isa, washington/WI, dakota/scott, carv/sher/wri) ([35](audit-screens/35-filter-sort-bikes-options.jpg)) | Sub-areas live in the location picker, next to neighborhoods and distance | Where you're looking is one decision, so it's in one place | review |

## Location

| # | Today | Redesign | Why | Source |
|---|---|---|---|---|
| A1 | Two different radius controls: a 30–200 mi dialog ([20](audit-screens/20-list-radius-dialog.jpg)) and a map picker ([22](audit-screens/22-location-picker-50mi.jpg)) | One full-screen location picker everywhere (home, lists, search), with save in the top bar | One control, one mental model | audit |
| A2 | Radius only, 30 mi minimum. 50 mi from Epping, NH includes Boston | Regions (Minneapolis, St. Paul, the suburbs), neighborhoods, sub-areas, and distance of 2, 5, 10 or 25 mi | People in Minneapolis think in neighborhoods, and radius-only is an app-review complaint | audit, users |
| A3 | Two confirm buttons ("apply" and "choose this location"). Panning snaps the center to the nearest town and gives odd radii ("49 miles") ([23](audit-screens/23-location-picker-panned-cornish.jpg)) | One save. Dragging the map sets a custom center ("near Uptown"), and the radius snaps to the set distances | No duplicate actions and no surprising values | audit |
| A4 | Kept: a fixed purple circle over a map that pans underneath, with the outside tinted | The same interaction, without the center dot or "you" marker | People already know it, and the cutout reads well | review |
| A5 | No count while choosing | A live count ("about 21,330 listings", or the list's own count), plus a warning when an area has nothing | You can see the result of a choice before saving it | audit |
| A6 | Kept: Craigslist capitalizes place names | Place names capitalized with state abbreviations ("Minneapolis, MN"); the rest of the UI stays lowercase | Matches Craigslist's own convention (our first pass had them lowercase) | review |

## Search

| # | Today | Redesign | Why | Source |
|---|---|---|---|---|
| S1 | Empty: "You do not seem to have any search history," with random suggestions (plumber, community volunteer) ([08](audit-screens/08-search-focus-empty-history.jpg)) | Recent searches, saved searches with new-match badges, trending in Minneapolis | An empty screen becomes a useful starting point | audit |
| S2 | Suggestions shown in quotes, like raw data, with no thumbnails ([09](audit-screens/09-search-typeahead-keyboard.jpg)) | Completions with the typed part plain and the rest bold, an arrow to edit the search, and up to three matching listings with thumbnails | Reads like a modern search, and you can jump straight to a listing | audit, platform |
| S3 | Results-by-category list is noisy ("all housing 399" for "bike") and counts don't match between screens ([10](audit-screens/10-search-results-by-category.jpg), [11](audit-screens/11-search-results-loading-overlay.jpg)) | "Search in" rows with the most relevant first, counted the same way as the results screen | Counts that disagree erode trust | audit |
| S3b | Counts don't match between screens (2,833 vs 2,861) ([10](audit-screens/10-search-results-by-category.jpg)) | One count per view, everywhere: the home tile, section page, popular tiles, A–Z list, category menu, list header, filter and price sheets, and the location picker all show the same number for the same category, area and filters. Tap a tile that says 1,354 and the list says 1,354 | A number that changes when you tap it erodes trust | audit, review |
| S4 | A translucent "searching for…" overlay sits on top of the results ([11](audit-screens/11-search-results-loading-overlay.jpg)) | No overlay | It hid the very thing you were waiting for | audit |
| S5 | — | The location chip in search opens the same picker and shows counts for the current query | One location control everywhere (A1) | audit |
| S6 | No results | "Search all areas (n listings)" when only the area is too tight, or an offer to save the search and get an alert | A no-result search becomes an alert | audit |
| S7 | Kept: scrolling the suggestions closes the keyboard | Same | It's the native behavior people expect | review |

## Listing detail

| # | Today | Redesign | Why | Source |
|---|---|---|---|---|
| D1 | Specs are right-aligned purple text that looks like links ([25](audit-screens/25-detail-specs.jpg)) | A readable spec grid (label above value) | Specs aren't links | audit |
| D2 | Distance never shown; the example listing was ~40 mi away ([24](audit-screens/24-detail-top-gallery.jpg)) | "Longfellow · 3.8 mi away · posted 38 min ago" under the title, plus an approximate-area map card | Distance decides whether a pickup is worth it | audit |
| D3 | Reply opens another menu (email / view or copy contact info / cancel), two taps for the main job ([28](audit-screens/28-detail-reply-sheet.jpg)) | **Message seller** is the primary button. Quick replies ("is this still available?", an offer at the typical price) and a choice of craigslist chat or email relay | One tap for the main job, plus a nudge past the blank-message problem (and the flaky-buyer complaint) | audit, users |
| D4 | No seller context or safety guidance. "Flag as prohibited" sits in an overflow sheet next to "vote for best-of" ([27](audit-screens/27-detail-overflow-sheet.jpg)) | A seller card (on craigslist since, other listings), a report link in plain sight, and a meet-somewhere-public safety tip | Scams are the top complaint, and trust has to show up when someone gets in touch | audit, users |
| D5 | Favorite ★ and hide 🗑 are gray squares that look disabled, and hide has a scary trash icon ([26](audit-screens/26-detail-map-actions.jpg)) | Save (bookmark) sits top-right over the photo, the same spot as on every listing card; filled purple when saved. The bottom bar is for acting on the listing: hide (eye-off), share, message seller. Hide asks first ("hide this listing?", with where to find it again) and offers "report it and hide it" in the same sheet. Undo after hiding | They read as active, and save is in one consistent place. Hide takes a post out of every list, so it confirms; people often hide because something's wrong, so reporting sits right there. Still reversible from saved › hidden | audit, review |
| D6 | Share and "this listing" options in an overflow menu that duplicates share | Share in the bottom action bar opens the Android share sheet (which has copy link). The overflow menu is removed | One way to share, using the platform's own sheet | review, platform |
| D7 | Kept: prev/next through results ([24](audit-screens/24-detail-top-gallery.jpg)) | A "3 of 17" pager over the photo, plus a sideways swipe on the page | Kept a hidden gem and made it a gesture | audit |
| D8 | — | A "price check" section with a fair-price bar ("bicycles in Minneapolis usually go for $300–$1,200. this one is $235"). It sits below details, description and where, above the seller. The price row keeps its small below/above typical badge | Uses the histogram data to answer "is this a good price?" At first it sat right under the title; it moved down so the listing comes first and the market context after | audit, review |
| D9 | The listing ID is shown on the page | Removed (it's in the shared link) | It means nothing to buyers | audit |
| D10 | Kept: approximate location circle, never an exact pin | Same, on the detail map and the results map | Privacy first | audit |
| D11 | — | Similar listings, and a "have one to sell?" prompt | Keeps browsing going and feeds the supply side | brief |
| D12 | — | "Below typical" is a **neutral** gray badge, not green good news. The typical-range bar is neutral too. A price under 40% of the typical low adds a nudge in the price check: "well under the usual price. it may be a great deal, or a scam: see it in person before you pay anything." Above typical keeps its warning color | A price far below the going rate is a classic scam signal (scams are the top complaint), so we shouldn't celebrate it. Resolves open question O1 | users, review |

## Saved

| # | Today | Redesign | Why | Source |
|---|---|---|---|---|
| V1 | Favorites and saved searches live in separate places. Saved searches can't be edited, only deleted and re-created | A Saved tab with listings, searches and hidden. A saved search keeps **everything**: filters, area and sort. Opening it restores all of them; change anything and the button becomes "update search", which updates that search in place (no duplicates). Alerts toggle per search; delete has undo | Every save and hide now leads somewhere, and "saved searches can't be edited" is a known complaint | users, review |
| V2 | Hidden posts are gone for good | A hidden tab with "unhide" | Hiding should be reversible | review |
| V3 | Filters reset between visits; no way to keep "my size" or "owners only" | **Considered, not built:** separate filter preferences (global like owners only, or per category like frame size). Saved searches cover it instead: save "apartments · Northeast · under $1,400 · cats ok" once and jump back in | One feature instead of two similar ones. Most real cases (apartment hunting in an area at a price) are a saved search already. Revisit if people keep re-applying the same size across many searches | review |

## Posting and your posts

What the current app does here needs a hands-on check (Jon is trying it). From the research summary: posting and managing ads happen in the app and on the site's account page, where posts are listed with renew, edit and delete; posting needs an account, and some posts need phone verification. Facebook Marketplace, for comparison, makes your own listings hard to find (survey feedback and Jon's own experience).

| # | Today | Redesign | Why | Source |
|---|---|---|---|---|
| P1 | Post sits behind the account / menu; the app is built for browsers, not listers | **Post** is the highlighted nav item and opens a four-step flow: category → photos and details → where and contact → preview. Real fields, validated as you go; the preview lists anything missing with a jump back | Posting is the other half of the marketplace and should be one tap | review |
| P2 | — | The price field shows the typical range for the category ("bicycles in Minneapolis usually go for $300–$1,200") | Same market data buyers see, used to help sellers price fairly | audit |
| P3 | Category attributes are typed on the site's posting form | Bike posts collect the same fields buyers filter by (type, frame size, wheel size, frame material, brakes, make, condition), so a post shows up in those filters | One vocabulary for listers and browsers | review |
| P4 | Contact options: relay email, optional phone | Reply by craigslist chat (default) or the anonymous email relay; showing a phone number is off by default, with a scam warning | Keeps the anonymity people value; phone numbers get harvested | users |
| P5 | Neighborhood / location typed | Pick a neighborhood; buyers see an approximate area, never the address | Privacy first, and it feeds the neighborhood filters | audit |
| P6 | Your posts live on the account page; hard to get back to on Facebook Marketplace | Three ways back: **account** tab is the seller home (your posts first: active / sold, views · saves · messages, edit); **home** shows a "your posts" strip once you have one; and after posting you land on your live post | "I couldn't find my listing again" is the complaint to beat | users, review |
| P7 | Your own post looks like anyone's | Your own listing shows an owner card (live / sold, views, saves, messages) and an owner bar: edit, mark sold, more (share, renew, delete). No "message seller", no save, no report | The page should do what the person looking at it needs | review |
| P8 | Mark sold / delete | Mark sold hides it from search but keeps it under account › sold, with undo and relist. Delete asks first, then offers undo | Sold and deleted are different: sold keeps your record | review |
| P9 | Renew after 48 hours | Renew is shown in the owner menu, disabled with "available 48 hours after posting" | Kept: it's how Craigslist bumps a post, and the rule should be visible | review |

## Visual design, brand and platform

| # | Today | Redesign | Why | Source |
|---|---|---|---|---|
| B1 | A dated custom UI | Material 3 throughout (search view, chips, sheets, segmented buttons, menus, snackbars, nav bar) | It's an Android app, and everything maps to Jetpack Compose components | platform |
| B2 | Purple accent | A hand-picked, brighter palette pinned over M3 roles generated from the craigslist purple (#9945C8), with a tint per section. Dynamic color was tried first (too neon, then too muted) | Brand recognition plus a brighter, friendlier feel | review |
| B3 | System sans | Young Serif (headings, wordmark) + Figtree (UI) | Warm and a little old-fashioned like the brand, and clear at small sizes | review |
| B4 | Mixed icons | Material Symbols Rounded, weight 500 | Native, consistent, and ready for Compose | platform |
| B9 | Favorites use a ★ star, and the app mixes save metaphors | Saving is a **bookmark** everywhere: the Saved tab, the card button, the listing's bottom bar. Outline when unsaved; filled on the brand purple when saved | One symbol for one idea. A heart reads as "like", but this is "keep for later", which is what the Saved tab's bookmark already says | review |
| B10 | Not checked on foldables or tablets in our audit | **Responsive by M3 window size class.** Compact (phones): bottom nav, as designed. Medium, 600+ (e.g. Galaxy Z Fold open in portrait): navigation rail on **every** screen, including the listing, search and location (phones still hide the bottom bar on those), with post on top (each item a 64dp rounded square that holds icon and label, so the active state is a full target, not a small pill), wider grids, content capped and centered, sheets max 640 wide. Wide, 800+ (Fold in landscape, tablets): listings still open **full screen**: a pinned top bar (back, prev/next, share) spans the page, **all photos stack in the left column** (no swiping when there's room), details on the right. On medium screens the top bar is pinned too instead of floating over the photo. (A list-and-listing side-by-side view was tried and dropped: opening a listing should feel like opening it, not a tray.) Works in portrait and landscape | Foldables and tablets are a real share of Android, and the Fold is the device we review on.  | review, platform |
| B5 | Kept: the lowercase, plain-spoken voice, the peace sign, and dark mode | Same voice everywhere, including empty states. Peace sign as the app mark | It's the brand's personality | audit |
| B6 | — | **Post** stays a filled, highlighted item in the nav (an exception to M3). Every nav item, on the phone's bottom bar and the larger-screen rail, is a 64dp rounded square holding icon and label; the active one fills, and post is always filled in the brand color | Posting is the other half of the marketplace. The square makes the active state a full target that reads at a glance, instead of a small pill over the icon | review |
| B7 | — | No hover states, only pressed and focus | It's a touch app | review, platform |
| B8 | — | WCAG 2.1 AA: text at least 4.5:1, control outlines at least 3:1, both themes, 48dp+ touch targets, selection not shown by color alone | Accessibility is table stakes for a client-ready app | review |

## Still open

| # | Question | Notes |
|---|---|---|
| O2 | Section landing pages add a tap before the list | Keep them, or let the home tiles go straight to the list? |
| O3 | Seller verification and two-way ratings (eBay / Uber style: buyer and seller leave positive or negative feedback after a deal) | Considering, probably not this version. **For:** answers the top complaint (scams, no buyer protection) and rewards good sellers. **Against:** heavy, long-time users may pick up negative reviews, and if ratings push them off the platform, supply drops; it also needs accounts, which cuts against anonymous, no-login use. Lighter options to weigh first: phone-verified badge (shown today), "on craigslist since", response rate |
| O4 | Rollout to loyal users who like that Craigslist never changes | How would a redesign this big ship? |
| O5 | Chat flow | Still a stub in the prototype (the post flow is built: P1–P9) |

## Native feasibility

The prototype is a web app standing in for a native Android app (Jetpack Compose, Material 3). Each piece below maps to native, or is flagged as prototype-only.

| Prototype | Native equivalent | Flag |
|---|---|---|
| Bottom bar on phones, navigation rail at 600+ | `NavigationSuiteScaffold` (switches by window size class) | — |
| Listing page at 600+: pinned top bar; at 800+: photos stacked in the left column, details right, always full screen | Compose layout by available width (`BoxWithConstraints` / window size class); a `TopAppBar` pinned with `LazyColumn` | — |
| Content adapts to its pane (container queries) | `BoxWithConstraints` / pane width in the adaptive scaffold | — |
| Portrait and landscape everywhere | Standard. Android 16 ignores orientation and resizability locks on large screens (600dp+) for apps targeting API 36 | Competitors like Uber still lock portrait, and Duolingo letterboxes on tablets; being adaptive from day one is the point |
| Bottom sheets, chips, segmented buttons, menus, snackbars with undo, search view, tabs | M3 Compose components | — |
| Share over the photo opens the system share sheet | `Intent.ACTION_SEND` / Android Sharesheet | — |
| Back gesture pops one screen; lists restore filters and scroll | Navigation back stack, predictive back, `rememberSaveable`, `LazyGridState` | — |
| Favorites, hidden posts, saved searches, area, layout survive restarts (localStorage) | DataStore / Room | — |
| Draggable price bracket on the histogram | Custom `Canvas` drawing with `pointerInput` | — |
| Map with count bubbles and price markers | Google Maps SDK + Maps Compose clustering | **Prototype-only:** the map is a static image overlay; it blurs past zoom 14 and has no real tiles |
| Keyboard pushes content up; scrolling dismisses it | Edge-to-edge with IME insets (`imePadding`), `adjustResize` | — |
| Fullscreen display mode in the installed web app | Edge-to-edge drawing with system-bar insets | **Prototype-only:** a workaround for Chrome's white nav bar with 3-button navigation. Native draws behind the bars instead of hiding them |
| Phone-frame overview (`?frame`), "reset prototype data", service worker and offline cache, `noindex` | — | **Prototype-only:** presentation and hosting tools, not part of the app |
| No hover states; pressed and focus only | Same (touch-first; ripple + focus indicator) | — |
| Fonts from Google Fonts (Young Serif, Figtree) | Bundled font resources / downloadable fonts | — |
| Realistic counts over a small sample of listings | Real counts from the listings service | **Prototype-only:** each category has a realistic Minneapolis total; areas and filters scale it by the share of the ~24 sample listings that match. Lists show the sample ("prototype: showing 10 sample listings of 1,354"). Search result counts are the real sample counts |
| Photo picker sheet in the post flow | Android Photo Picker (`PickMultipleVisualMedia`) | **Prototype-only:** picks from the prototype's sample photos |
| "fill example" in the post flow | — | **Prototype-only:** a demo shortcut |
| Your posts saved on the phone | Server-side posts tied to the account; DataStore for drafts | **Prototype-only:** posts live in localStorage on this device |
