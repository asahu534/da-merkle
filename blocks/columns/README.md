# columns

Side-by-side columns. Each row is one set of columns; each cell is one column.
A cell that holds only an image becomes the image column.

## Authoring (Document Authoring)

Model: `standalone`

| Columns | |
|---|---|
| content | content |

## Supported variations

| Block name | Look |
|---|---|
| `Columns` | Plain columns (default) |
| `Columns (media)` | Text + image teaser: eyebrow, large heading, text and a pill CTA on the left, a large image on the right. Each row is one teaser; several rows stack with space between. |
| `Columns (media, rounded)` | Each teaser becomes a separate card with 24px rounded corners and its own black background (the image is clipped to the corners). Put it in a plain white section. |
| `Columns (media, rounded, grey)` | Same rounded card on a light grey background, with black text and a black button. |
| `Columns (media, rounded, navy)` | Same rounded card on a navy background. |
| `Columns (media, hero)` | Full-width page hero: the image fills the right half to the screen edge and the heading is larger and lighter. Use as the first block on the page. |

For `media`, author the text cell as:

1. a short paragraph for the eyebrow (e.g. `Case Study`) — only styled as an
   eyebrow when a heading follows it
2. a heading
3. paragraphs of text
4. a paragraph with just a link, for the CTA button

The panel colour comes from the section: set Section Metadata `Style` to
`dark`, `navy` or `grey`. On `grey` the eyebrow is darker and the button is
black; on dark sections the button is white.

With `rounded` the card carries its own colour instead, so leave the section
white (no Style). For a coloured heading band above the cards (as on AI
Expertise), put the heading in its own section with `Style = dark, center` or
`grey, center`, then the rounded columns in the next section.

## Universal Editor fields

N/A (Document Authoring project)
