# hero

Full-width page hero with a background image and text on top.

## Authoring (Document Authoring)

Model: `standalone`

| Hero |
|---|
| background image |
| heading, text, optional CTA link |

## Supported variations

| Block name | Look |
|---|---|
| `Hero` | Background image hero (default) |
| `Hero (video)` | Muted, looping background video behind the text. The image is used as the poster, shown first and kept when the video can't play. |

For `Hero (video)`, add the video as a link to an MP4 in its own row or
paragraph, e.g. `/media/ai-expertise-hero.mp4`. The link is not shown on the
page. The video:

- starts after the page has loaded, so it doesn't slow the first paint
- is always muted and loops
- is not played for visitors who have reduced motion turned on — they see the
  poster image instead

MP4 files uploaded to DA must meet the media limits: at most 300 KB/s average
bitrate, 2 minutes and 36 MB. Background videos can have their audio removed.

## Universal Editor fields

N/A (Document Authoring project)
