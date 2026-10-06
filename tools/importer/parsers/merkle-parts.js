/* eslint-disable */
/* global WebImporter */

/**
 * Shared helpers for reading merkle.com AEM components (teasers, buttons,
 * text) into plain default-content nodes.
 */

const clean = (t) => (t || '').replace(/[\u200b-\u200d\ufeff]/g, '').replace(/\s+/g, ' ').trim();

/** Visible text of a link. merkle.com repeats button text in two spans. */
export function linkText(a) {
  const label = a.getAttribute('aria-label')
    || (a.querySelector('.cmp-button__text, .mer-link-text, span') || {}).textContent
    || a.textContent;
  let text = clean(label);
  const half = text.length / 2;
  if (text.length > 1 && text.slice(0, Math.floor(half)).trim() === text.slice(Math.ceil(half)).trim()) {
    text = text.slice(0, Math.floor(half)).trim(); // "Learn more Learn more" -> "Learn more"
  }
  return text;
}

/** <p><a href>text</a></p> for a source link, with optional href remapping. */
export function linkPara(document, a, remap = {}) {
  if (!a) return null;
  const href = a.getAttribute('href') || '';
  const p = document.createElement('p');
  const link = document.createElement('a');
  link.href = remap[href] || href;
  link.textContent = linkText(a);
  p.append(link);
  return p;
}

export function para(document, text) {
  const t = clean(text);
  if (!t) return null;
  const p = document.createElement('p');
  p.textContent = t;
  return p;
}

export function heading(document, tag, text) {
  const t = clean(text);
  if (!t) return null;
  const h = document.createElement(tag);
  h.textContent = t;
  return h;
}

/** Paragraphs of a rich-text container, falling back to its text. */
export function paras(document, el) {
  if (!el) return [];
  const ps = [...el.querySelectorAll('p')].map((p) => para(document, p.textContent)).filter(Boolean);
  if (ps.length) return ps;
  const one = para(document, el.textContent);
  return one ? [one] : [];
}

/** Read a merkle.com teaser into its parts. */
export function teaserParts(teaser) {
  const titleEl = teaser.querySelector('.cmp-teaser__title');
  return {
    eyebrow: clean((teaser.querySelector('.cmp-teaser__pretitle') || {}).textContent),
    title: clean(titleEl && titleEl.textContent),
    titleTag: titleEl && /^H[1-6]$/.test(titleEl.tagName) ? titleEl.tagName.toLowerCase() : 'h2',
    desc: teaser.querySelector('.cmp-teaser__description'),
    links: [...teaser.querySelectorAll('a.cmp-teaser__action-link')],
    img: teaser.querySelector('.cmp-teaser__image img, img'),
  };
}

/** Teaser as default-content nodes: eyebrow, heading, text, CTA links. */
export function teaserNodes(document, teaser, { tag, remap } = {}) {
  const t = teaserParts(teaser);
  return [
    t.eyebrow ? para(document, t.eyebrow) : null,
    heading(document, tag || t.titleTag, t.title),
    ...paras(document, t.desc),
    ...t.links.map((a) => linkPara(document, a, remap)),
  ].filter(Boolean);
}

/** Clone of a source <img> suitable for a block cell (the DM transformer converts it). */
export function imgClone(document, img) {
  if (!img) return null;
  let src = img.currentSrc || img.src || img.getAttribute('src') || '';
  if (!/\/is\/image\//.test(src) || src.includes('{.width}')) {
    // runtime src not resolved: fall back to the component's Scene7 source
    const holder = img.closest('[data-cmp-src]');
    const dm = holder && holder.getAttribute('data-cmp-src');
    if (dm && /\/is\/image\//.test(dm)) src = dm;
  }
  const out = document.createElement('img');
  out.src = src;
  out.alt = img.getAttribute('alt') || '';
  return out;
}

export function block(document, name, rows) {
  return WebImporter.Blocks.createBlock(document, { name, cells: rows });
}
