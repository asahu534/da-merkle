# Platforms & Engineering polish: stats lines, Work Sans font, case-study carousel options

## Status
**Approved and ready to start.** The changes need **Execute mode**. Switch it on and I'll go through the checklist in order, starting with step 1.

## Goal
Three requests, all checked against merkle.com:

1. **Stats:** add the blue line above each stat.
2. **Font:** use merkle.com's typeface on every page, including the "Our areas of expertise" section you pointed out.
3. **Case-study carousel:** add three options authors can turn on:
   - rounded cards;
   - arrows on the right;
   - the heading in a left column, with the cards starting to its right.

   The arrows also get a new look on every carousel.

## What I measured on merkle.com (1440px)
| Item | Source | Migrated today |
|---|---|---|
| Font family | **Work Sans**, hosted on merkle.com (one file covering weights 100–900) | `proxima-nova`, which never loads, so the browser shows a fallback font |
| Body text | Work Sans 18px / 24px, weight 400 | fallback font |
| "Our areas of expertise" heading (h2) | 52px / 56px, weight 400 | 48px, fallback font |
| "Success stories" and "More on this topic" (h2) | 44px / 48px, weight 700 | 48px, weight 400 |
| Expertise card titles (h5) | 26px / 32px, weight 700 | 26px / 32px, already matching |
| Stat cards | **2px solid line, rgb(3 145 242)**, across the top of each card, 16px above the number. Number is 44px / 48px, weight 400 | no line |
| Success stories layout | Heading in a left column (x 30, 345px wide). Cards (330 × 587) start at x 375. The prev/next arrows sit at the bottom of the heading column | heading above the carousel, arrows below it on the left |
| Related content ("More on this topic") | Cards start at the left edge. Arrows at the **bottom right** (x 1304 and x 1360) | arrows bottom left |
| Card corners (your references) | rounded, about 24px | square |
| Arrows (your references) | filled light-grey circle with a dark chevron, **turns red on hover** | outlined circle |

## Decisions (confirmed)
- **Heading column:**
  - On desktop, the section's heading sits in a left column about 345px wide, with the arrows at the bottom of that column. The cards scroll to its right.
  - On mobile it stacks: heading, then cards, then arrows.
- **Arrow look:** filled light-grey circles with a dark chevron on **every** case-study carousel, including the homepage. They turn red on hover, matching merkle.com. I'll measure the exact red and transition first.
- **Font:**
  - Work Sans for the whole site, served from our own site rather than an external font service. Work Sans is free to self-host under its open font licence (OFL).
  - A size-matched fallback font keeps the page from jumping while Work Sans loads.

## How authors use it
| Block name | Result |
|---|---|
| `Cards Casestudy` | Current carousel with the new arrow look |
| `Cards Casestudy (rounded)` | Cards with 24px rounded corners |
| `Cards Casestudy (arrows-right)` | Arrows at the bottom right |
| `Cards Casestudy (heading-left)` | The section's heading moves into a left column, with the arrows under it and the cards to its right |
| Combined options | e.g. `Cards Casestudy (rounded, heading-left)` for Success stories, `Cards Casestudy (rounded, arrows-right)` for related content |

For `heading-left`, the author keeps writing the heading ("Success stories") as normal text above the block, in the same section. No extra cells are needed.

The stats line needs no authoring. It becomes part of the `Cards Grid (stats)` look, because merkle.com shows it on every stats row, including the P&E intro stats and the partnership stats.

## How it works
- **Stats (`cards-grid.css`):** each stats card gets a 2px rgb(3 145 242) top border and 16px top padding, at every screen size.
- **Font:**
  - Add the Work Sans file to `/fonts`, declare it in `styles/fonts.css`, and switch the heading and body font settings in `brand.css` and `styles.css` to Work Sans.
  - Add a size-adjusted Arial fallback and remove the unused `proxima-nova` references.
  - Compare the text styles (h1–h6, paragraphs, eyebrows, buttons) with merkle.com and fix sizes and weights that differ, including the two h2 styles (52/400 and 44/700).
- **Case-study carousel (`cards-casestudy.css`, small JS only if needed):**
  - `rounded`: 24px corners on each card, with the image clipped to them.
  - `arrows-right`: the arrow row aligns to the right.
  - `heading-left`: on desktop the section becomes a two-column grid. The heading takes the 345px left column and the carousel takes the right. The arrows go at the bottom of the left column. It stacks on mobile. I'll use CSS only if I can; if CSS can't place the arrows reliably, a few lines of JS will move them.
  - Arrows on every carousel: filled light-grey circles, dark chevron, red on hover.

## Applying it to the pages
- **Import script (`import-capability.js`):**
  - Success stories becomes `cards-casestudy (rounded, heading-left)`.
  - Related content becomes `cards-casestudy (rounded, arrows-right)`.
  - Then rebuild the import bundle and re-import.
- **DA pages:** you've edited the P&E page in DA, so I won't overwrite it. You'll add the options to the two Cards Casestudy block names yourself. The stats line and the font need no DA edits.
- **Homepage:** only the arrow look and the font change. The layout stays the same.

## Checklist

### 1. Measure the source
- [ ] Measure the arrows on merkle.com: size, fill colour, chevron, hover red, transition
- [ ] Confirm the card radius from the references (expected 24px)
- [ ] Measure the text styles on the merkle.com homepage and the P&E page (h1–h6, paragraphs, eyebrows, CTA pills) and list the differences from the migrated pages
- [ ] Confirm the partnership stats use the same blue line

### 2. Font: Work Sans site-wide
- [ ] Add the Work Sans file (weights 100–900, normal) to `/fonts` and declare it in `styles/fonts.css`
- [ ] Switch the heading and body font settings to Work Sans, add a size-adjusted fallback, and remove `proxima-nova`
- [ ] Fix the text sizes and weights that differ from step 1, including the h2 52/400 and 44/700 styles
- [ ] Check the homepage, history, merkle-now, search and article pages for text overflow or wrapping problems

### 3. Stats line
- [ ] Add the 2px rgb(3 145 242) top line and 16px spacing above the number to `Cards Grid (stats)`
- [ ] Check the P&E intro stats and partnership stats against the reference screenshot

### 4. Case-study carousel options
- [ ] New arrow look for every carousel: filled light-grey circle, dark chevron, red on hover
- [ ] `rounded` option: 24px card corners
- [ ] `arrows-right` option: arrows at the bottom right
- [ ] `heading-left` option: heading column (345px) on desktop with the arrows at its bottom and the cards to the right; stacked on mobile
- [ ] Update the block guide (`README.md`) and `metadata.json` with the three options and examples

### 5. Apply to the page
- [ ] Update `import-capability.js`: Success stories becomes `(rounded, heading-left)` and related content becomes `(rounded, arrows-right)`; rebuild the bundle and re-import
- [ ] List the exact DA edits for you to make on the P&E page

### 6. Verify
- [ ] Desktop 1440px: compare the stats, expertise section, Success stories and related content with merkle.com and your references
- [ ] Mobile 390px: stacked layouts, arrows usable, no overflow
- [ ] Homepage carousel: same layout, new arrows, Work Sans
- [ ] AI Expertise page: fonts and the rounded cards still correct
- [ ] Run `npm run lint`

## Notes
- The `split` section style from the previous plan is done and verified.
- Everything stays uncommitted on `feature/custom-blocks` until you say so.
- **The changes need Execute mode.** Switch it on and I'll start with step 1.
