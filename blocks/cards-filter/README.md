# cards-filter

Filterable, paginated content archive. The cards are pulled automatically from
the site's query index (`/query-index.json`), so newly published pages appear
without editing the block.

## Authoring (Document Authoring)

Model: `standalone`

A block table with one setting row:

| Cards Filter | |
|---|---|
| Path | /articles-blogs/ |

- **Path** — the folder whose pages are listed. List several folders
  comma-separated (e.g. `/articles-blogs/, /ebooks/`). Leave the block empty
  to list every indexed content page.

Each card shows the page's content type (from its folder, e.g. "Blog Post"),
its title, and a "Read more" link. Cards are ordered newest first and shown 12
at a time with a "Load more" button.

The **Filters** chips are built from the pages' `keywords` metadata
(comma-separated). Pages without keywords still appear under "All". Only
published pages are in the index.

## Supported variations

No variations.

## Universal Editor fields

N/A (Document Authoring project)
