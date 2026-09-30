# Migration Plan: Platforms & Engineering + AI Expertise

## Goal
Migrate two merkle.com pages into the DA site, with content and design:

| Source | Target in DA |
|---|---|
| https://www.merkle.com/en/capabilities/platforms-engineering.html | `/capabilities/platforms-engineering` |
| https://www.merkle.com/en/ai-expertise.html | `/ai-expertise` |

Existing blocks are reused wherever they fit. Where the content differs slightly, it becomes an **option (variant) of a block**, which the author applies through the block name. A new block is built only when nothing existing fits.

## Decisions (confirmed)
- **Target:** generate content with the import script, **upload to DA** at the paths above and preview it. Publishing stays with you.
- **Design:** content **and** design pass against the source.
- **AI hero:** background video with a poster image. The video is **compressed and uploaded to DA `/media/`**.
- **Cards:** `cards-icon` is **renamed to `cards-grid`**, and the icon, logo, text, stats, people and promo looks become options of it.

## Unified cards block: `cards-grid`
Every card look has the same structure: an optional image cell (icon, logo, photo or none) and a text cell (heading, text, optional link). One block covers all of them, and the author picks the look in the block's name row:

| Author writes | Look | Used on |
|---|---|---|
| `Cards Grid` | Icon cards (default; today's homepage look) | Homepage "Built for the experience economy" |
| `Cards Grid (logos)` | Centered logo + label, optional text and link | P&E awards (4), P&E partner logos (6) |
| `Cards Grid (text)` | No image: heading + text + optional link on white | P&E "areas of expertise" (4) |
| `Cards Grid (stats)` | Large number + label | P&E stats rows (5 and 3) |
| `Cards Grid (people)` | Headshot + name + role + region, centered | AI leadership (3 regional groups) |
| `Cards Grid (promo)` | Navy centered card: eyebrow, large heading, text, CTA | AI "For Enterprise / For CX" pair |

### What the rename involves
- **Code:** the `cards-icon` code moves into a new `blocks/cards-grid/` folder, with its CSS scoped to `.cards-grid`. The icon look stays the **default**, so it's unchanged.
- **Homepage content:** the homepage block in DA is authored as `cards-icon`. It has to be renamed to `Cards Grid` in DA, then previewed and published.
- **No broken homepage during the switch.** DA content is shared by every code branch, but a code change only reaches the live site when the branch merges into `main`. So the switch happens in this order:
  1. Add `cards-grid` **alongside** the existing `cards-icon`, which stays untouched.
  2. Merge the code to `main`.
  3. Rename the homepage block in DA to `Cards Grid`, then preview and publish it.
  4. Only then delete the old `cards-icon` folder, in a follow-up change.

  Deleting `cards-icon` in the same change, or before the homepage is switched, would break the homepage on whichever version still uses the old name.
- Other references to `cards-icon` are only in migration notes and the old import bundle. They don't affect the site and get updated when the import tooling is rebuilt.

## Base blocks: CSS only, with one exception

| Look | Built on | What changes | CSS only? |
|---|---|---|---|
| `cards-grid` (default icon look) | `cards` (moved over from `cards-icon`) | Same code as today, renamed | Yes (rename only) |
| `cards-grid (logos / text / stats / promo)` | `cards-grid` | New CSS rules per option. The JS already sorts cells into image and text. | **Yes** |
| `cards-grid (people)` | `cards-grid` | CSS plus a **one-line JS guard**. Today every image is converted to a transparent PNG, which suits icons and logos but makes headshot photos heavier, so the conversion is skipped for `people`. | **Almost:** CSS + tiny JS guard |
| `columns (media)`, `columns (media, grey)` | `columns` | New CSS rules for the option. The columns JS already marks the image column. | **Yes** |
| `hero (video)` | `hero` | CSS **and JS**. `hero` has no JS today, and a background video has to be created by code (muted loop, poster fallback, reduced-motion pause). The JS only runs when the block contains a video link. | **No:** needs JS |

The existing separate variants (`cards-casestudy`, `cards-featured`, `cards-filter`) stay as they are.

## Hero video
The source hero is a Scene7 adaptive video set (`Merkle-GTM-Motion_Vignette-01-AVS`), streamed in pieces, with smart-crop versions for 16:9, 1:1, 4:3, 4:5 and 9:16.
1. Download the **16:9** version (`…/Merkle-GTM-Motion_Vignette-01_16x9`) and confirm it's a plain MP4.
2. Measure its length and bitrate, then compress to ≤ 300 KB/s. The **audio is removed**, since a background video is muted anyway.
3. Upload to DA as `/media/ai-expertise-hero.mp4` and preview it.
4. Use the Scene7 poster as the fallback image.

On phones, the 16:9 file is cropped to fill the screen. A mobile-specific file can be added later if the crop looks wrong.

## Page breakdown

### Platforms & Engineering
| # | Source section | Treatment |
|---|---|---|
| 1 | Hero: "CAPABILITY" eyebrow, "Platforms & Engineering", text, image on the right (navy) | `columns (media)`, `navy` section |
| 2 | "Impact business agility…" heading + paragraph | Default content, `navy, center` |
| 3 | 5 stats ($30B+ … 1000+) | `cards-grid (stats)` |
| 4 | "Our areas of expertise" heading | Default content, `center` |
| 5 | 4 expertise items (one with "Learn More") | `cards-grid (text)` |
| 6 | 4 awards (logo, "Leader", description, "Download Report") | `cards-grid (logos)` |
| 7 | "Success stories" carousel (8) | **Reuse `cards-casestudy`** |
| 8 | "Our technology partnerships": 6 partner logos + 3 stats | Default heading + `cards-grid (logos)` + `cards-grid (stats)`, `dark` section |
| 9 | "More on this topic": ebook promo + related carousel | Default heading + `columns (media)` + **reuse `cards-casestudy`** |

### AI Expertise
| # | Source section | Treatment |
|---|---|---|
| 1 | Hero: background video, "AI Innovation at Merkle", text, "Our insights" jump link | `hero (video)` |
| 2 | Two navy cards: "For Enterprise" / "For Customer Experience" | `cards-grid (promo)` |
| 3 | "AI for Enterprise" + 3 case-study teasers (black panel) | Default heading + `columns (media)` ×3 |
| 4 | "AI for Customer Experience" + 3 case-study teasers (grey panel) | Default heading + `columns (media, grey)` ×3 |
| 5 | "News & Industry Insights / AI Essentials…" + "View All Insights" | Default content, `center` |
| 6 | 6-card insights gallery | **Reuse `cards-featured`** |
| 7 | Forbes thought-leadership teaser | `columns (media)` |
| 8 | "Partnerships / Better together" + video | Default content + **reuse `video-centered`** |
| 9 | "Leadership / Meet our team" + Americas / EMEA / APAC groups | Default headings + `cards-grid (people)` ×3 |

## Summary of work
- **New blocks:** `cards-grid`, which replaces `cards-icon`.
- **Options:**
  - `cards-grid`: `logos`, `text`, `stats`, `people`, `promo`
  - `columns`: `media`, `grey`
  - `hero`: `video`
- **Reused unchanged:** `cards-casestudy`, `cards-featured`, `video-centered`, `header`, `footer`; section styles `navy`, `dark`, `center`. A `grey` section style is added only if the AI "Customer Experience" band is grey across the whole section, not just behind each panel.

## Things to handle during the build
- **Import tooling is gone locally** and needs rebuilding: the cleanup, DM-image and sections transformers, plus parsers for `cards-grid` (writing the right option into the block name), `columns (media)`, `hero (video)`, `cards-casestudy`, `cards-featured` and `video-centered`.
- **Homepage safety:** `Cards Grid` with no option must look exactly like today's `cards-icon`.
- **Jump links on the AI page** (`#insights`, `#enterprise`, `#customer`) are rewritten to the ids EDS generates for the matching headings.
- **Existing DA pages:** check whether the target paths already exist, and ask before overwriting. The homepage rename in DA also needs your go-ahead.
- **Links inside the content** keep merkle.com's `/en/….html` form. Remapping links is out of scope.

## Checklist

### 1. Analysis and templates
- [ ] Classify both URLs into templates (expected: 2)
- [ ] Analyze both pages and confirm the option assignments above

### 2. `cards-grid` (new block that replaces `cards-icon`)
- [ ] Create `blocks/cards-grid/` from `cards-icon`; rename the CSS scope and card classes to `.cards-grid…`; the icon look stays the default
- [ ] Leave `blocks/cards-icon/` untouched for now, so the current homepage keeps working
- [ ] Add CSS for the `logos`, `text`, `stats`, `people` and `promo` options
- [ ] Add the JS guard so `people` photos keep their normal format
- [ ] Write the `cards-grid` README (all options, with authoring examples) and `metadata.json`
- [ ] Check that `Cards Grid` with no option matches today's homepage icon cards exactly

### 3. Other block options
- [ ] `columns`: add CSS for `media` (eyebrow, CTA, dark panel) and `grey`
- [ ] `hero`: add JS and CSS for `video` (muted loop, poster fallback, reduced-motion pause); other heroes unaffected
- [ ] Update the `columns` and `hero` READMEs with the new options; lint passes

### 4. Hero video
- [ ] Download the 16:9 smart-crop version and confirm it's an MP4
- [ ] Compress to ≤ 300 KB/s with the audio removed; keep it under 2 min and 36 MB
- [ ] Upload to DA as `/media/ai-expertise-hero.mp4`; preview it and confirm it's served as `video/mp4`

### 5. Mapping and import tooling
- [ ] Map selectors for blocks and sections in `page-templates.json`, including section styles
- [ ] Rebuild the transformers (cleanup, DM images, sections)
- [ ] Rebuild the parsers (`cards-grid` with options, `columns (media)`, `hero (video)` pointing at `/media/ai-expertise-hero.mp4`, `cards-casestudy`, `cards-featured`, `video-centered`)
- [ ] Rewrite the AI page's jump links; bundle an import script per template

### 6. Import and upload
- [ ] Import both pages locally; check content completeness (≥ 90%)
- [ ] Check DA for existing pages at the target paths; ask before overwriting
- [ ] Upload both pages to DA and preview them

### 7. Design and verification
- [ ] Design pass for each new option against merkle.com
- [ ] Visual comparison of both pages; fix any gaps
- [ ] Check desktop and mobile on the feature-branch preview
- [ ] `npm run lint`
- [ ] Ask whether to commit and push to `feature/custom-blocks`

### 8. Switch the homepage to `cards-grid` (after the code is on `main`)
- [ ] With your go-ahead, rename the homepage block in DA from `cards-icon` to `Cards Grid`, then preview it
- [ ] Check that the homepage looks the same; you publish it
- [ ] In a follow-up change, delete `blocks/cards-icon/` and remove leftover `cards-icon` references

## Notes
- The only JS planned is the `people` image guard and the `hero (video)` option. Anything else that turns out to need JS gets flagged first.
- **Execution requires Execute mode.** This plan is ready for your approval.
