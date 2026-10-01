/*
 * Cards Filter — filterable, paginated content archive powered by the site's
 * query index (/query-index.json).
 *
 * Authored content: a single setting row
 *   | Path | /articles-blogs/ |
 * Several folders can be listed, comma-separated or one per line. Without a
 * path, every indexed content page is listed.
 *
 * Cards are the indexed pages under the path(s), newest first. Filter chips are
 * built from the pages' comma-separated `keywords`.
 */

import { readBlockConfig } from '../../scripts/aem.js';
import {
  fetchQueryIndex, keywordTags, pageType, isContentPage,
} from '../../scripts/query-index.js';

const BATCH_SIZE = 12;

/** Normalise a folder setting (text or link) to a path with a trailing slash. */
function toFolder(value) {
  const text = String(value).trim();
  if (!text) return '';
  let { pathname } = new URL(text, window.location.origin);
  pathname = pathname.replace(/\.html$/, '');
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

/** Read the folder(s) to list from the block's setting rows. */
function readFolders(block) {
  const config = readBlockConfig(block);
  let values = config.path || config.folder || [];
  if (!Array.isArray(values)) values = [values];
  // also accept a bare single-cell row that just holds a path
  block.querySelectorAll(':scope > div').forEach((row) => {
    const text = row.textContent.trim();
    if (row.children.length === 1 && text.startsWith('/')) values.push(text);
  });
  return values
    .flatMap((v) => String(v).split(','))
    .map(toFolder)
    .filter(Boolean);
}

/** Pick and order the pages to show. */
function selectPages(rows, folders) {
  const here = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '');
  return rows
    .filter(isContentPage)
    .filter((row) => {
      const path = row.path.replace(/\/$/, '');
      if (!path || path === here) return false; // skip the home and listing page itself
      if (!folders.length) return true;
      return folders.some((f) => row.path.startsWith(f) && `${path}/` !== f);
    })
    .sort((a, b) => (Number(b.lastModified) || 0) - (Number(a.lastModified) || 0));
}

function renderCard(row) {
  const li = document.createElement('li');
  li.dataset.keywords = JSON.stringify(keywordTags(row));

  const body = document.createElement('div');
  body.className = 'cards-filter-card-body';

  const type = pageType(row.path);
  if (type) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'cards-filter-card-type';
    eyebrow.textContent = type;
    body.append(eyebrow);
  }

  const title = row.title || row.path;
  const h3 = document.createElement('h3');
  h3.textContent = title;
  body.append(h3);

  const linkP = document.createElement('p');
  linkP.className = 'cards-filter-card-link';
  const a = document.createElement('a');
  a.href = row.path;
  a.textContent = 'Read more';
  a.setAttribute('aria-label', `Read more: ${title}`);
  linkP.append(a);
  body.append(linkP);

  li.append(body);
  return li;
}

/** Reveal up to `count` more hidden cards; returns the number still hidden. */
function revealBatch(list, count) {
  const hidden = [...list.querySelectorAll('li[hidden]:not([data-filtered])')];
  hidden.slice(0, count).forEach((li) => li.removeAttribute('hidden'));
  return list.querySelectorAll('li[hidden]:not([data-filtered])').length;
}

/** Apply the active keyword filter, then re-batch the visible set. */
function applyFilter(list, loadMore, active) {
  list.querySelectorAll(':scope > li').forEach((li) => {
    const match = active === null || JSON.parse(li.dataset.keywords).includes(active);
    li.toggleAttribute('data-filtered', !match);
    li.hidden = true; // reset; batch logic re-reveals
  });
  const remaining = revealBatch(list, BATCH_SIZE);
  loadMore.hidden = remaining === 0;
}

function makeChip(label, keyword) {
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = 'cards-filter-chip';
  if (keyword !== null) chip.dataset.filter = keyword;
  chip.textContent = label;
  return chip;
}

export default async function decorate(block) {
  const folders = readFolders(block);
  block.textContent = '';

  let pages;
  try {
    pages = selectPages(await fetchQueryIndex(), folders);
  } catch (e) {
    block.innerHTML = '<p class="cards-filter-status">Content is temporarily unavailable. Please try again later.</p>';
    return;
  }
  if (!pages.length) {
    block.innerHTML = '<p class="cards-filter-status">No content found.</p>';
    return;
  }

  const ul = document.createElement('ul');
  ul.className = 'cards-filter-list';
  pages.forEach((row) => ul.append(renderCard(row)));

  // one chip per distinct keyword across the listed pages
  const keywords = [...new Set(pages.flatMap(keywordTags))]
    .sort((a, b) => a.localeCompare(b));

  // filter control
  const controls = document.createElement('div');
  controls.className = 'cards-filter-controls';
  const filterBtn = document.createElement('button');
  filterBtn.type = 'button';
  filterBtn.className = 'cards-filter-toggle';
  filterBtn.textContent = 'Filters';
  filterBtn.setAttribute('aria-expanded', 'false');

  const panel = document.createElement('div');
  panel.className = 'cards-filter-panel';
  panel.hidden = true;
  const allChip = makeChip('All', null);
  allChip.classList.add('is-active');
  panel.append(allChip, ...keywords.map((k) => makeChip(k, k)));

  filterBtn.addEventListener('click', () => {
    const open = filterBtn.getAttribute('aria-expanded') === 'true';
    filterBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
    panel.hidden = open;
  });

  controls.append(filterBtn, panel);
  if (!keywords.length) filterBtn.hidden = true; // nothing to filter by

  // load more
  const loadMore = document.createElement('button');
  loadMore.type = 'button';
  loadMore.className = 'cards-filter-loadmore';
  loadMore.textContent = 'Load more';

  block.append(controls, ul, loadMore);

  // chip selection
  panel.addEventListener('click', (e) => {
    const chip = e.target.closest('.cards-filter-chip');
    if (!chip) return;
    panel.querySelectorAll('.cards-filter-chip').forEach((c) => c.classList.remove('is-active'));
    chip.classList.add('is-active');
    applyFilter(ul, loadMore, chip.dataset.filter ?? null);
  });

  loadMore.addEventListener('click', () => {
    const remaining = revealBatch(ul, BATCH_SIZE);
    loadMore.hidden = remaining === 0;
  });

  // initial paged view
  applyFilter(ul, loadMore, null);
}
