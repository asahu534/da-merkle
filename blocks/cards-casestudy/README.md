# cards-casestudy

Horizontally scrolling gallery of tall image cards (case studies, articles).
Each card shows an eyebrow, a title and a link over the image. Round
prev/next arrows scroll one card at a time; they turn red on hover and dim
at either end of the track.

## Authoring (Document Authoring)

Model: `standalone`

The first row is the block name. Every following row is one card:

| Cards Casestudy (options) | |
|---|---|
| image | eyebrow (e.g. `Party City`) · heading · link (e.g. `Read case`) |

## Supported variations

Add options in brackets after the block name; they can be combined, e.g.
`Cards Casestudy (rounded, heading-left)`.

| Block name | Look |
|---|---|
| `Cards Casestudy` | Square cards, arrows bottom left |
| `Cards Casestudy (rounded)` | Cards with 24px rounded corners |
| `Cards Casestudy (arrows-right)` | Arrows at the bottom right (e.g. "More on this topic" related content) |
| `Cards Casestudy (heading-left)` | The section heading sits in a left column with the arrows at its bottom; the cards start to its right (e.g. "Success stories"). Stacks on mobile. |

For `heading-left`, write the heading (e.g. `Success stories`) as normal text
above the block, in the same section. It is shown 44px bold.

The card text is white on the image; the gallery takes its section's
background (Section Metadata `Style`, e.g. `navy` or `dark`, or none for white).

## Universal Editor fields

N/A (Document Authoring project)
