/*
 * Search block — site search landing.
 * Authored content (rows):
 *   row 1: the search placeholder/prompt text (e.g. "What can we help you search for?")
 *   row 2: a "Trending Topics" heading
 *   row 3: a list of trending topic terms (as list items or links)
 * The input, submit button, and topic pill buttons are built here; submitting
 * (or clicking a pill) navigates to the search results with a ?q= query.
 */

const SEARCH_ACTION = '/en/search.html';

function readConfig(block) {
  const rows = [...block.children];
  let placeholder = 'What can we help you search for?';
  let heading = 'Trending Topics';
  const topics = [];

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
      if (text) placeholder = text;
    }
  });

  return { placeholder, heading, topics };
}

function goToSearch(query) {
  const url = new URL(SEARCH_ACTION, window.location.origin);
  if (query) url.searchParams.set('q', query);
  window.location.assign(url.toString());
}

export default function decorate(block) {
  const { placeholder, heading, topics } = readConfig(block);
  block.textContent = '';

  // --- search form ---
  const form = document.createElement('form');
  form.className = 'search-form';
  form.setAttribute('role', 'search');
  form.action = SEARCH_ACTION;

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
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    goToSearch(input.value.trim());
  });
  block.append(form);

  // --- trending topics ---
  if (topics.length) {
    const wrap = document.createElement('div');
    wrap.className = 'search-topics';

    const h = document.createElement('h2');
    h.className = 'search-topics-title';
    h.textContent = heading;
    wrap.append(h);

    const list = document.createElement('ul');
    list.className = 'search-topics-list';
    topics.forEach((topic) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'search-topic';
      btn.textContent = topic;
      btn.addEventListener('click', () => goToSearch(topic));
      li.append(btn);
      list.append(li);
    });
    wrap.append(list);
    block.append(wrap);
  }
}
