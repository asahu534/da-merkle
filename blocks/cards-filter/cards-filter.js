import { createOptimizedPicture } from '../../scripts/aem.js';

const BATCH_SIZE = 12;

/** Slugify a label into a filter token. */
function slug(text) {
  return text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** Reveal up to `count` more hidden cards; returns the number still hidden. */
function revealBatch(list, count) {
  const hidden = [...list.querySelectorAll('li[hidden]:not([data-filtered])')];
  hidden.slice(0, count).forEach((li) => li.removeAttribute('hidden'));
  return list.querySelectorAll('li[hidden]:not([data-filtered])').length;
}

/** Apply the active category filter, then re-batch the visible set. */
function applyFilter(block, list, loadMore, active) {
  list.querySelectorAll(':scope > li').forEach((li) => {
    const match = active === 'all' || li.dataset.category === active;
    li.toggleAttribute('data-filtered', !match);
    li.hidden = true; // reset; batch logic re-reveals
  });
  const remaining = revealBatch(list, BATCH_SIZE);
  loadMore.hidden = remaining === 0;
}

export default function decorate(block) {
  /* build the card list from authored rows */
  const ul = document.createElement('ul');
  ul.className = 'cards-filter-list';
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-filter-card-image';
      else div.className = 'cards-filter-card-body';
    });
    // derive the card's category from its eyebrow (first paragraph in the body)
    const body = li.querySelector('.cards-filter-card-body');
    const eyebrow = body ? body.querySelector('p') : null;
    if (eyebrow) li.dataset.category = slug(eyebrow.textContent);
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimised = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimised);
  });

  // collect the distinct categories for the filter control
  const categories = [...new Set([...ul.querySelectorAll(':scope > li')]
    .map((li) => li.dataset.category).filter(Boolean))];

  block.textContent = '';

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
  const allChip = document.createElement('button');
  allChip.type = 'button';
  allChip.className = 'cards-filter-chip is-active';
  allChip.dataset.filter = 'all';
  allChip.textContent = 'All';
  panel.append(allChip);
  categories.forEach((cat) => {
    const label = [...ul.querySelectorAll(':scope > li')]
      .find((li) => li.dataset.category === cat)
      .querySelector('.cards-filter-card-body p').textContent.trim();
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'cards-filter-chip';
    chip.dataset.filter = cat;
    chip.textContent = label;
    panel.append(chip);
  });

  filterBtn.addEventListener('click', () => {
    const open = filterBtn.getAttribute('aria-expanded') === 'true';
    filterBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
    panel.hidden = open;
  });

  controls.append(filterBtn, panel);

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
    applyFilter(block, ul, loadMore, chip.dataset.filter);
  });

  loadMore.addEventListener('click', () => {
    const remaining = revealBatch(ul, BATCH_SIZE);
    loadMore.hidden = remaining === 0;
  });

  // initial paged view
  applyFilter(block, ul, loadMore, 'all');
}
