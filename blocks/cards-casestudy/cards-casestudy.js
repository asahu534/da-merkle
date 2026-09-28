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

  // prev/next arrow controls for the horizontal gallery
  const nav = document.createElement('div');
  nav.className = 'cards-casestudy-nav';
  nav.innerHTML = `
    <button type="button" class="cards-casestudy-prev" aria-label="Previous"></button>
    <button type="button" class="cards-casestudy-next" aria-label="Next"></button>
  `;
  nav.querySelector('.cards-casestudy-prev').addEventListener('click', () => scrollByCard(ul, -1));
  nav.querySelector('.cards-casestudy-next').addEventListener('click', () => scrollByCard(ul, 1));
  block.append(nav);
}
