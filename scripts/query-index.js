/*
 * Shared helpers for reading the site's EDS query index (/query-index.json).
 * Used by the search and cards-filter blocks.
 */

const PAGE_SIZE = 500;

// one in-flight/fetched promise per index URL, so each page load fetches once
const cache = new Map();

/**
 * Fetches every row of a query index, following offset/limit pagination.
 * @param {string} [url] Index URL
 * @returns {Promise<object[]>} All index rows
 */
export async function fetchQueryIndex(url = '/query-index.json') {
  if (cache.has(url)) return cache.get(url);
  const promise = (async () => {
    const rows = [];
    let offset = 0;
    let total = Infinity;
    while (offset < total) {
      // eslint-disable-next-line no-await-in-loop
      const resp = await fetch(`${url}?limit=${PAGE_SIZE}&offset=${offset}`);
      if (!resp.ok) throw new Error(`query-index ${resp.status}`);
      // eslint-disable-next-line no-await-in-loop
      const json = await resp.json();
      const data = json.data || [];
      rows.push(...data);
      total = typeof json.total === 'number' ? json.total : rows.length;
      if (!data.length) break;
      offset += data.length;
    }
    return rows;
  })().catch((e) => {
    // drop the failed promise so a later call can retry
    cache.delete(url);
    throw e;
  });
  cache.set(url, promise);
  return promise;
}

/**
 * Splits a row's comma-separated `keywords` column into trimmed tags.
 * @param {object} row Index row
 * @returns {string[]} Keyword tags
 */
export function keywordTags(row) {
  return (row.keywords || '')
    .split(/[,;|]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/**
 * Derives a content-type label ("Blog Post", "Ebook", …) from a page path.
 * @param {string} path Page path
 * @returns {string} Label, or '' when the folder is not a known content type
 */
export function pageType(path = '') {
  if (/\/articles-blogs\//i.test(path)) return 'Blog Post';
  if (/\/press-releases\//i.test(path)) return 'Press Release';
  if (/\/ebooks\//i.test(path)) return 'Ebook';
  if (/\/events\//i.test(path)) return 'Event';
  if (/\/work\/case-studies\//i.test(path)) return 'Case Study';
  return '';
}

/**
 * Whether an index row is a real content page (not a fragment, nav, footer or
 * the search page).
 * @param {object} row Index row
 * @returns {boolean}
 */
export function isContentPage(row) {
  const path = row.path || '';
  if (!path) return false;
  if (/(^|\/)(nav|footer|fragments?)(\/|$)/i.test(path)) return false;
  if (/\/search(\.html)?$/i.test(path)) return false;
  return true;
}
