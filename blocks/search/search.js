/*
 * Search block — site search landing with live, client-side results.
 *
 * Authored content (rows):
 *   row 1: the search placeholder/prompt text (e.g. "What can we help you search for?")
 *   row 2: a "Trending Topics" heading
 *   row 3: a list of trending topic terms (as list items or links)
 *
 * The input, submit button, and topic pills are built here. Submitting, clicking
 * a pill, or typing filters the EDS `/query-index.json` feed in the browser and
 * renders matches inline below the search bar — no page reload. Results render in
 * a two-column layout: a FILTERS sidebar (facets built from the `keywords` column)
 * and a list of result cards. The active query is reflected in the URL (?q=) via
 * the History API so results are shareable and the back/forward buttons work.
 */

const QUERY_INDEX = '/query-index.json';
const PAGE_SIZE = 500;

// module-scope cache so the index is fetched at most once per page load
let indexPromise;

/* Fetch every page of the query index, following offset/limit pagination. */
async function fetchIndex() {
  if (indexPromise) return indexPromise;
  indexPromise = (async () => {
    const rows = [];
    let offset = 0;
    let total = Infinity;
    while (offset < total) {
      // eslint-disable-next-line no-await-in-loop
      const resp = await fetch(`${QUERY_INDEX}?limit=${PAGE_SIZE}&offset=${offset}`);
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
    // reset so a later interaction can retry a transient failure
    indexPromise = undefined;
    throw e;
  });
  return indexPromise;
}

/* Split a row's `keywords` column into trimmed, non-empty tags. */
function keywordTags(row) {
  return (row.keywords || '')
    .split(/[,;|]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/* Derive a card eyebrow ("Blog Post", "Ebook", …) from the page path. */
function pathToType(path = '') {
  if (/\/articles-blogs\//i.test(path)) return 'Blog Post';
  if (/\/press-releases\//i.test(path)) return 'Press Release';
  if (/\/ebooks\//i.test(path)) return 'Ebook';
  if (/\/events\//i.test(path)) return 'Event';
  if (/\/work\/case-studies\//i.test(path)) return 'Case Study';
  return '';
}

/* Paths that are not real content pages and must never appear in results. */
function isContentPage(row) {
  const path = row.path || '';
  if (!path) return false;
  if (/(^|\/)(nav|footer|fragments?)(\/|$)/i.test(path)) return false;
  if (/\/search(\.html)?$/i.test(path)) return false; // don't list the search page itself
  return true;
}

/* Score a row against the lowercased query. Matching is driven by the page's
   `keywords` metadata from query-index.json; title is a lighter fallback so the
   search still surfaces obvious pages when keywords are sparse. 0 = no match. */
function scoreRow(row, q) {
  const keywords = (row.keywords || '').toLowerCase();
  const title = (row.title || '').toLowerCase();
  let score = 0;
  // primary: match against the keywords column
  if (keywords) {
    const tags = keywordTags(row).map((t) => t.toLowerCase());
    if (tags.some((t) => t === q)) score += 10; // exact tag hit
    else if (tags.some((t) => t.includes(q) || q.includes(t))) score += 6;
    else if (keywords.includes(q)) score += 4;
  }
  // fallback: title contains the query
  if (title.includes(q)) score += title.startsWith(q) ? 3 : 2;
  return score;
}

function search(rows, query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return rows
    .filter(isContentPage)
    .map((row) => ({ row, score: scoreRow(row, q) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || (a.row.title || '').localeCompare(b.row.title || ''))
    .map((r) => r.row);
}

function renderResult(row) {
  const li = document.createElement('li');
  li.className = 'search-result';

  const link = document.createElement('a');
  link.className = 'search-result-link';
  link.href = row.path;

  const type = pathToType(row.path);
  if (type) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'search-result-type';
    eyebrow.textContent = type;
    link.append(eyebrow);
  }

  const h = document.createElement('h3');
  h.className = 'search-result-title';
  h.textContent = row.title || row.path;
  link.append(h);

  if (row.description) {
    const p = document.createElement('p');
    p.className = 'search-result-desc';
    p.textContent = row.description;
    link.append(p);
  }

  li.append(link);
  return li;
}

export default function decorate(block) {
  const rows = [...block.children];
  let placeholder = 'What can we help you search for?';
  let heading = 'Trending Topics';
  const topics = [];
  const textRows = [];

  rows.forEach((row) => {
    const list = row.querySelector('ul, ol');
    const headingEl = row.querySelector('h1, h2, h3, h4, h5, h6');
    if (list) {
      list.querySelectorAll('li').forEach((li) => {
        const text = li.textContent.trim();
        if (text) topics.push(text);
      });
    } else if (headingEl) {
      heading = headingEl.textContent.trim();
    } else {
      const text = row.textContent.trim();
      if (text) textRows.push(text);
    }
  });
  if (textRows[0]) [placeholder] = textRows;
  if (textRows[1]) [, heading] = textRows;

  block.textContent = '';

  // --- search form ---
  const form = document.createElement('form');
  form.className = 'search-form';
  form.setAttribute('role', 'search');

  const input = document.createElement('input');
  input.type = 'search';
  input.name = 'q';
  input.className = 'search-input';
  input.placeholder = placeholder;
  input.setAttribute('aria-label', placeholder);

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'search-submit';
  submit.setAttribute('aria-label', 'Search');

  form.append(input, submit);
  block.append(form);

  // --- trending topics ---
  let topicsWrap;
  if (topics.length) {
    topicsWrap = document.createElement('div');
    topicsWrap.className = 'search-topics';

    const h = document.createElement('h2');
    h.className = 'search-topics-title';
    h.textContent = heading;
    topicsWrap.append(h);

    const list = document.createElement('ul');
    list.className = 'search-topics-list';
    topics.forEach((topic) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'search-topic';
      btn.textContent = topic;
      // eslint-disable-next-line no-use-before-define
      btn.addEventListener('click', () => runSearch(topic));
      li.append(btn);
      list.append(li);
    });
    topicsWrap.append(list);
    block.append(topicsWrap);
  }

  // --- results region (white panel: count + filters sidebar + result cards) ---
  const results = document.createElement('div');
  results.className = 'search-results';
  results.setAttribute('aria-live', 'polite');
  results.hidden = true;
  block.append(results);

  // state for the current query + active facet selections
  let currentMatches = [];
  const selectedFilters = new Set();

  const setEmptyView = (empty) => {
    // hide the trending topics once the user is actively searching
    if (topicsWrap) topicsWrap.hidden = !empty;
    results.hidden = empty;
  };

  // render the filtered view (count + cards) for the current query/facets
  const renderView = () => {
    const filtered = selectedFilters.size
      ? currentMatches.filter((row) => keywordTags(row).some((t) => selectedFilters.has(t)))
      : currentMatches;

    const q = input.value.trim();
    const main = results.querySelector('.search-results-main');
    main.textContent = '';

    const count = document.createElement('p');
    count.className = 'search-count';
    count.textContent = filtered.length
      ? `Showing 1–${filtered.length} of ${filtered.length} results for “${q}”`
      : `No results for “${q}”`;
    main.append(count);

    if (filtered.length) {
      const ul = document.createElement('ul');
      ul.className = 'search-results-list';
      filtered.forEach((row) => ul.append(renderResult(row)));
      main.append(ul);
    }

    // reflect selected/cleared state on the clear button
    const clearBtn = results.querySelector('.search-filters-clear');
    if (clearBtn) clearBtn.disabled = selectedFilters.size === 0;
  };

  // build the FILTERS sidebar facet from the keyword tags of the current matches
  const buildFilters = () => {
    const counts = new Map();
    currentMatches.forEach((row) => {
      keywordTags(row).forEach((t) => counts.set(t, (counts.get(t) || 0) + 1));
    });
    const tags = [...counts.keys()].sort((a, b) => a.localeCompare(b));

    const aside = document.createElement('aside');
    aside.className = 'search-filters';

    const h = document.createElement('h2');
    h.className = 'search-filters-title';
    h.textContent = 'Filters';
    aside.append(h);

    if (tags.length) {
      const list = document.createElement('ul');
      list.className = 'search-filter-list';
      tags.forEach((tag) => {
        const li = document.createElement('li');
        const label = document.createElement('label');
        label.className = 'search-filter-option';

        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.value = tag;
        cb.addEventListener('change', () => {
          if (cb.checked) selectedFilters.add(tag);
          else selectedFilters.delete(tag);
          renderView();
        });

        const text = document.createElement('span');
        text.className = 'search-filter-label';
        text.textContent = tag;

        const n = document.createElement('span');
        n.className = 'search-filter-count';
        n.textContent = counts.get(tag);

        label.append(cb, text, n);
        li.append(label);
        list.append(li);
      });
      aside.append(list);
    } else {
      const empty = document.createElement('p');
      empty.className = 'search-filters-empty';
      empty.textContent = 'No filters available.';
      aside.append(empty);
    }

    const clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'search-filters-clear';
    clear.textContent = 'Clear all filters';
    clear.disabled = true;
    clear.addEventListener('click', () => {
      selectedFilters.clear();
      aside.querySelectorAll('input[type="checkbox"]').forEach((c) => { c.checked = false; });
      renderView();
    });
    aside.append(clear);

    return aside;
  };

  const render = async (query) => {
    const q = query.trim();
    if (!q) {
      setEmptyView(true);
      results.textContent = '';
      return;
    }
    setEmptyView(false);
    results.innerHTML = '<div class="search-results-inner"><p class="search-status">Searching…</p></div>';
    let matches;
    try {
      const data = await fetchIndex();
      matches = search(data, q);
    } catch (e) {
      results.innerHTML = '<div class="search-results-inner"><p class="search-status">Search is temporarily unavailable. Please try again later.</p></div>';
      return;
    }
    // guard against an out-of-order response for a stale query
    if (input.value.trim() !== q) return;

    currentMatches = matches;
    selectedFilters.clear();

    // scaffold the two-column layout
    results.innerHTML = '';
    const inner = document.createElement('div');
    inner.className = 'search-results-inner';

    const layout = document.createElement('div');
    layout.className = 'search-results-layout';

    const main = document.createElement('div');
    main.className = 'search-results-main';

    layout.append(buildFilters(), main);
    inner.append(layout);
    results.append(inner);

    renderView();
  };

  const updateUrl = (query) => {
    const url = new URL(window.location.href);
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    window.history.replaceState({}, '', url);
  };

  function runSearch(query) {
    input.value = query;
    updateUrl(query);
    render(query);
  }

  // submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    runSearch(input.value.trim());
  });

  // debounced live typing
  let debounce;
  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      updateUrl(input.value.trim());
      render(input.value);
    }, 250);
  });

  // back/forward navigation
  window.addEventListener('popstate', () => {
    const q = new URL(window.location.href).searchParams.get('q') || '';
    input.value = q;
    render(q);
  });

  // hydrate from ?q= on load
  const initial = new URL(window.location.href).searchParams.get('q');
  if (initial) {
    input.value = initial;
    render(initial);
  }
}
