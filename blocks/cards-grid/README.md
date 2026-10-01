# cards-grid

One card grid with several looks. The author picks the look by adding an
option in brackets to the block name. It replaces the older `cards-icon` block.

## Authoring (Document Authoring)

Model: `standalone`

The first row is the block name. Every following row is one card:

| Cards Grid (option) | |
|---|---|
| image (icon, logo or photo — optional) | heading and/or text, optional link |

Rows without an image can leave the first cell empty or have a single cell.

## Supported variations

| Block name | Look | Card content |
|---|---|---|
| `Cards Grid` | Icon cards (default) — icon, bold title, description | icon image · heading (H6) + text |
| `Cards Grid (logos)` | Centred logo + label, optional text and link | logo image · **bold label** + text + link |
| `Cards Grid (text)` | No image: heading + text + optional link, four across | heading (H5) + text + link |
| `Cards Grid (stats)` | Large number + label, three across | first line = the number (e.g. `$30B+`), then the label |
| `Cards Grid (people)` | 16:9 headshot, **bold name**, role, region — centred | photo · **name** + role + region |
| `Cards Grid (promo)` | Centred navy panel with eyebrow, heading, text and CTA, two across | eyebrow + heading + text + link |
| `Cards Grid (promo, rounded)` | Any look above with 24px rounded card corners — add `rounded` to the options | same as the look it's combined with |

Notes:

- Text colour follows the section: put stats or logos in a `dark` or `navy`
  section (Section Metadata `Style`) for white text.
- A paragraph that contains only a link is styled as the card's link — an
  underlined text link, or a white pill button in `promo`.
- Icons and logos are served as transparent PNGs; `people` photos keep their
  normal format.
- `logos` sits four across; a multiple of three logos (e.g. six) sits three
  across.
- The default icon look is laid out four across by placing four `Cards Grid`
  blocks (one card each) next to each other in one section, as on the homepage.

## Universal Editor fields

N/A (Document Authoring project)
