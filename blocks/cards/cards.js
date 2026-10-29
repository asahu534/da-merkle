import { createOptimizedPicture } from '../../scripts/aem.js';

const STORAGE_KEY = 'cards-block-variant';
const VARIANTS = [
  { id: 'cards', label: 'Cards' },
  { id: 'list', label: 'List' },
];

function buildCard(row) {
  const [imageCell, bodyCell] = [...row.children];

  const card = document.createElement('li');
  card.className = 'cards-card';

  const imageWrap = document.createElement('div');
  imageWrap.className = 'cards-card-image';
  if (imageCell) imageWrap.append(...imageCell.childNodes);

  const picture = imageWrap.querySelector('picture');
  const img = picture?.querySelector('img');
  if (picture && img) {
    picture.replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    );
  }

  const bodyWrap = document.createElement('div');
  bodyWrap.className = 'cards-card-body';
  if (bodyCell) bodyWrap.append(...bodyCell.childNodes);

  if (!imageWrap.hasChildNodes()) imageWrap.remove();
  card.append(...[imageWrap, bodyWrap].filter((el) => el.hasChildNodes()));
  return card;
}

function setVariant(block, variant) {
  block.classList.toggle('is-cards', variant === 'cards');
  block.classList.toggle('is-list', variant === 'list');

  block.querySelectorAll('.cards-switcher button').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.variant === variant));
  });

  try {
    localStorage.setItem(STORAGE_KEY, variant);
  } catch (e) {
    // Storage may be unavailable (private mode, etc.). The switcher still works.
  }
}

function buildSwitcher(block) {
  const switcher = document.createElement('div');
  switcher.className = 'cards-switcher';
  switcher.setAttribute('role', 'group');
  switcher.setAttribute('aria-label', 'Change layout');

  VARIANTS.forEach(({ id, label }) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.variant = id;
    button.textContent = label;
    button.setAttribute('aria-pressed', 'false');
    switcher.append(button);
  });

  switcher.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-variant]');
    if (button) setVariant(block, button.dataset.variant);
  });

  return switcher;
}

export default function decorate(block) {
  const list = document.createElement('ul');
  list.className = 'cards-list';
  [...block.children].forEach((row) => list.append(buildCard(row)));

  block.textContent = '';
  block.append(buildSwitcher(block), list);

  let saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    // ignore
  }
  setVariant(block, VARIANTS.some((v) => v.id === saved) ? saved : 'cards');
}
