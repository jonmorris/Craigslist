# Design review rubric

A self-review checklist distilled from a real design-challenge review (Livefront, November 2026: [verbatim feedback](feedback/2026-11-19-livefront-review.md)). Each criterion is something that reviewer praised or criticized, generalized so it applies to any product design project. Use it to guide the work while you do it, and to check the work before anyone else sees it.

This file is project-agnostic. Copy it into other projects as is.

## How the reviewers worked

Worth knowing before the criteria, because it's how they'll read your work too:

- **They read the actual screens, not the story about them.** Every point came from looking at a rendered screen: text sizes, overlaps, edges, which control sits where.
- **They checked your claims against your evidence.** They quoted deck copy word for word ("what bikes actually sell for") and asked where the data comes from. "Research is done" without findings counted against the work.
- **Credit for the big ideas, critique on execution.** The liked list was mostly concept (goals, brand, IA, novel flows). The opportunities were mostly density, hierarchy, color logic and unsupported claims.
- **They rewarded realism.** Ordinary photos, missing-image states and a timeline of real progress all earned praise. Idealized screens (no keyboard, perfect content) got questioned.
- **Every critique names a consequence,** for example "…weakening the distinction between structural elements and interactive controls". Write your self-review the same way.

## The criteria

Each has the question to ask, what earned praise, what drew criticism, and how to check it.

### 1. Goals and framing
- **Ask:** Are the goals explicit, and does every major decision trace back to one?
- **Praised:** goals clearly identified; a timeline that anchors the audience in work done and work to come.
- **Check:** for each key screen, name the goal it serves. If one serves none, cut it or add the goal.

### 2. Brand continuity
- **Ask:** Is it still recognizably the client's product, and does it hang together better than before?
- **Praised:** signature elements kept (type, accent color, mark) while the identity got more cohesive.
- **Check:** show it to someone who knows the brand without the logo. Do they recognize it?

### 3. System consistency
- **Ask:** Are type, icons, color and components used the same way on every screen?
- **Praised:** one consistent type, icon, color and component language.
- **Check:** put every screen side by side and look for one-offs.

### 4. Color and surface roles
- **Ask:** Does every color have a job, and can someone tell structure from controls by color alone?
- **Criticized:** an accent tint on everything (nav, headers, fields, chips, sheets) blurs what's tappable; several surface colors with no pattern.
- **Check:** write the rule for each surface color in one line ("neutral = structure, accent = interactive or selected"). Any color without a rule is a problem.

### 5. Platform conventions, used with judgment
- **Ask:** Do you use the platform's standard patterns where people expect them, adapted to the brand?
- **Praised:** default system components that fit the brand; familiar patterns (bottom sheets, selection controls, anchored menus).
- **Criticized:** breaking a convention without resolving its cost (an action button styled as an always-selected nav item).
- **Check:** list every deliberate break from the platform's guidelines. For each, can you say what it costs and why it's worth it?

### 6. Readability and density
- **Ask:** Is the text big enough, and does the layout feel as comfortable as its styling suggests?
- **Criticized:** small metadata, chip, label and helper text; tightly packed controls that undercut generous, rounded styling.
- **Check:** view on a real device at its real size, not zoomed out on a monitor. Set a minimum size for secondary text and hold to it.

### 7. Information hierarchy
- **Ask:** Does the most decision-relevant information get the most space?
- **Criticized:** large images beside compressed titles and metadata, giving the photo more room than the facts needed to decide.
- **Check:** for each card or row, list what someone needs to decide. Is that what gets the space?

### 8. Navigation model
- **Ask:** Is navigation persistent, labeled, and only destinations? Is the current location obvious?
- **Praised:** persistent, labeled navigation.
- **Criticized:** a creation action mixed in with destinations; an always-emphasized item competing with the active state.
- **Check:** for every nav item, is it a place? Take a screenshot of each tab. Is the active one the most prominent thing in the bar?

### 9. Action hierarchy
- **Ask:** Is emphasis proportional to importance and frequency?
- **Praised:** key actions stay reachable while scrolling.
- **Criticized:** a floating secondary action covering content everywhere; a secondary action given a permanent slot beside the primary ones.
- **Check:** rank actions by how often and how importantly they're used. Does visual weight follow that ranking?

### 10. Friction against frequency
- **Ask:** Do confirmations and extra steps match how often people take the action and how costly mistakes are?
- **Criticized:** a confirmation sheet on an action people repeat while sorting.
- **Check:** for every confirmation, ask whether undo would do the job instead.

### 11. Ambiguous controls
- **Ask:** Can two nearby controls be mistaken for each other?
- **Criticized:** next/previous item controls over a photo, next to photo paging.
- **Check:** look for controls with similar shapes or arrows in the same area that do different things.

### 12. Edges and containment
- **Ask:** Does every surface have a clear boundary, so nothing looks cut off?
- **Criticized:** sheet buttons on a surface with no clear edge, making content look truncated.
- **Check:** look at every sheet, sticky bar and scroll edge with content scrolled under it.

### 13. Realistic content and states
- **Ask:** Do the screens show real conditions: messy content, empty and missing states, the keyboard, long text?
- **Praised:** ordinary photos and a missing-image treatment.
- **Criticized:** search shown without the keyboard, so the space while typing was never proven.
- **Check:** for each input, show it with the keyboard up. For each content slot, show a bad, long and missing version.

### 14. Data honesty
- **Ask:** Is every judgment the product makes (badges, scores, comparisons) backed by data it could actually have, with its source and limits visible?
- **Criticized:** "below typical" judgments with no data source and no account of condition, model or age; a chart claiming sale prices the product can't know.
- **Check:** for every number or verdict, ask where it comes from, whether the product can really get it, and what it ignores. Say so in the UI.

### 15. Evidence for decisions
- **Ask:** If you say research or testing happened, do you show what it found, and which decisions it drove?
- **Criticized:** "research and user testing complete" with no findings shown.
- **Check:** every "users said" or "testing showed" needs a finding, a source and a count, or it comes out.

### 16. Accessibility, demonstrated
- **Ask:** Do you show accessibility working, not just claim it?
- **Criticized:** contrast claims with no large-text layouts showing how dense controls adapt.
- **Check:** show key screens at 200% font scale and in dark mode, and state contrast results with the tool used.

### 17. Scope and initiative
- **Ask:** Did you go beyond the brief where it helps, and did the extras hold up?
- **Praised:** filtering as a well-thought-out bonus; a novel seller shortcut (start from a comparable listing); similar items that keep people moving; live result counts on filter buttons; safety balanced with the product's values.
- **Check:** for each extra, is it as polished as the required screens? A rough bonus can cost more than it earns.

## Before you send it

- [ ] Every screen viewed on a real device at real size (6, 13)
- [ ] One-line rule for each color and surface (4)
- [ ] Every deliberate platform-guideline break listed, with its cost (5, 8)
- [ ] Minimum text size set and checked (6)
- [ ] Nav holds only destinations, with a clear active state (8)
- [ ] Actions ranked, with visual weight matching the ranking (9, 10)
- [ ] Keyboard, empty, missing and long-content states shown (13)
- [ ] Every number, badge and claim has a source the product could really have (14)
- [ ] Every "research shows" has a finding and a count (15)
- [ ] Large-text and dark-mode versions of key screens (16)
- [ ] Every sentence in the deck checked against what's on its slide

## Running it as a review

To get a second opinion, from a colleague or an AI, give them the screens and the deck (not your notes) with this prompt:

> Review this design work as a hiring panel at a product design consultancy would. Look only at what's on the screens and slides. Use these 17 criteria: [paste the criteria]. Write two lists, "What we liked" and "Areas of opportunity". Each point is one sentence naming the specific element and its consequence. Quote any claim in the deck that the screens or data can't back up.

Then work the "areas of opportunity" the way [`BACKLOG.md`](BACKLOG.md) does: one item each, a direction agreed first, then fixed and checked off.
