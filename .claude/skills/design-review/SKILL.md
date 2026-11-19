---
name: design-review
description: Review product design work (app or web screens, prototypes, presentation decks) the way a design consultancy hiring panel would, against 17 criteria from a real review. Use when the user asks to review, critique, audit or double-check design work, wants a self-review before submitting or presenting, or asks "what would a reviewer say about this". Produces "What we liked" and "Areas of opportunity", a claims audit, a pre-send checklist, and optionally a backlog.
---

# Design review

Review the work as a skeptical hiring panel would: from what is actually on the screens and slides, not from the designer's intentions. The criteria are in [references/criteria.md](references/criteria.md). Read that file first, every time.

## 1. Gather the work

Find what a reviewer would see:
- **Screens:** screenshots, exported frames, or the running prototype. If you can run the prototype and capture screens, do it at a real device size, including the keyboard-up state of any input.
- **The deck or write-up:** every slide's visible text, and the speaker notes if there are any.
- **The brief,** if there is one, so you can tell required work from extras.

Judge from these, not from design docs or notes, which explain intent. Use the notes only to understand what was meant, never as proof that something works. If you can't see the screens, say so and ask for them, rather than reviewing from descriptions.

## 2. Look before you judge

For each screen, note concretely:
- the smallest text sizes, and how dense the controls are;
- which colors and surfaces are used, and for what;
- what's in the navigation, and how the active item shows;
- each action's position and visual weight;
- nearby controls that look alike;
- edges, overlaps and anything that looks cut off;
- whether content and states look real: messy photos, missing images, long text, the keyboard, empty states.

## 3. Audit every claim

List every factual claim in the deck and in the UI copy: research or testing done, user quotes, numbers, data-driven badges or verdicts, accessibility claims, "users prefer…". For each, find the evidence shown. Flag any claim that:
- has no finding, source or count shown;
- relies on data the product couldn't actually have (for example, sale prices on a classifieds site that only sees asking prices);
- states a judgment without its source and limits.

Quote the claim exactly.

## 4. Score against the criteria

Go through all 17 criteria in [references/criteria.md](references/criteria.md). For each, decide whether it earns praise, needs work, or doesn't apply. Skip criteria that don't apply rather than padding.

## 5. Write the review

Use this format. Each point is one sentence that names the specific element and its consequence, in the reviewers' plain, even tone. No praise inflation, no hedging.

```
## What we liked
- <element> <what it does well>, <consequence for the user or client>.

## Areas of opportunity
- <element> <problem>, <consequence>.

## Claims to back up or cut
- "<exact quote>" — <what evidence is missing, or why the product can't know this>.

## Before you send it
- [x] / [ ] each item of the checklist in references/criteria.md, with a few words on why
```

Order the areas of opportunity by impact: unsupported claims and readability first, polish last. Note the criterion number in brackets at the end of each point, for example "(6)".

## 6. Offer a backlog

Offer to turn the areas of opportunity into a backlog file, one item each:

| # | Feedback | Where | Direction (to agree) | Size | Status |
|---|---|---|---|---|---|

Here "Where" is prototype, deck or docs; "Size" is S, M or L; "Status" is To do, In progress, Done or Won't do. Then work items one at a time, agreeing each direction with the user before changing anything.

## Rules

- Never invent findings, test results, metrics or quotes. If something can't be verified from the material, say that.
- Be specific: "the 12px metadata on list cards", not "some text is small".
- Credit real strengths. The point is an accurate picture, not a takedown.
- Don't change the work during a review. The review is the deliverable; fixes come after, from the backlog.
