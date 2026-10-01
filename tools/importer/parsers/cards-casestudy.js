/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-casestudy (also used for cards-featured, which has the same
 * card content). One row per card: [image] [eyebrow, title, link].
 * merkle.com wraps the whole card in a link; the visible CTA is a span
 * ("Read case" / "Learn more"), so a real link is built from the wrapper href.
 */
import { block, heading, imgClone, para } from './merkle-parts.js';

export function cardRows(document, list) {
  let items = [...list.querySelectorAll('.featuredcard')];
  if (!items.length) items = [...list.querySelectorAll('li.cmp-list__item')];
  return items.map((item) => {
    const wrapper = item.closest('a[href]') || item.querySelector('a[href]');
    const href = wrapper ? wrapper.getAttribute('href') : '';
    const cta = (item.querySelector('.mer-link-text, .cmp-teaser__action-text, .mer-teaser__action-container span') || {}).textContent;
    const body = [
      para(document, (item.querySelector('.cmp-teaser__pretitle') || {}).textContent),
      heading(document, 'h3', (item.querySelector('.cmp-teaser__title') || {}).textContent),
    ].filter(Boolean);
    if (href) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = href;
      a.textContent = (cta || '').replace(/\s+/g, ' ').trim() || 'Learn more';
      p.append(a);
      body.push(p);
    }
    const img = imgClone(document, item.querySelector('img'));
    return img ? [img, body] : [body];
  });
}

export default function parse(document, list, name = 'Cards Casestudy') {
  return block(document, name, cardRows(document, list));
}
