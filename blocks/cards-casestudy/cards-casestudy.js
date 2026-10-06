import { createOptimizedPicture } from '../../scripts/aem.js';

function scrollByCard(list, direction) {
  const first = list.querySelector('li');
  if (!first) return;
  const gap = parseFloat(getComputedStyle(list).columnGap || '0') || 0;
  const step = first.getBoundingClientRect().width + gap;
  list.scrollBy({ left: step * direction, behavior: 'smooth' });
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-casestudy-card-image';
      else div.className = 'cards-casestudy-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  ul.classList.add('cards-casestudy-track');
  block.append(ul);

  // grid option: all cards visible in rows, no scrolling or arrows
  if (block.classList.contains('grid')) return;

  // prev/next arrow controls for the horizontal gallery
  const nav = document.createElement('div');
  nav.className = 'cards-casestudy-nav';
  nav.innerHTML = `
    <button type="button" class="cards-casestudy-prev" aria-label="Previous"></button>
    <button type="button" class="cards-casestudy-next" aria-label="Next"></button>
  `;
  const prev = nav.querySelector('.cards-casestudy-prev');
  const next = nav.querySelector('.cards-casestudy-next');
  prev.addEventListener('click', () => scrollByCard(ul, -1));
  next.addEventListener('click', () => scrollByCard(ul, 1));
  block.append(nav);

  // dim an arrow when the track can't scroll further that way
  const updateArrows = () => {
    const max = ul.scrollWidth - ul.clientWidth;
    prev.disabled = ul.scrollLeft <= 1;
    next.disabled = ul.scrollLeft >= max - 1;
  };
  ul.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows);
  ul.querySelectorAll('img').forEach((img) => img.addEventListener('load', updateArrows, { once: true }));
  requestAnimationFrame(updateArrows);
}
