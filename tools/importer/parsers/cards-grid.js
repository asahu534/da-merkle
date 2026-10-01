/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-grid (base: Cards). The block option (logos, text, stats,
 * people, promo) is written into the block name, e.g. "Cards Grid (stats)".
 *
 * Table structure (Cards convention):
 *   - cards with images (default icon, logos, people): 2 columns per row —
 *     cell 1 = image, cell 2 = text (heading/description/CTA)
 *   - cards without images (text, stats, promo): 1 column per row (the
 *     "no images" variant) — the single cell holds the text
 * Extractors below read each merkle.com component into { image, body }.
 */
import {
  block, heading, imgClone, linkPara, para, teaserNodes,
} from './merkle-parts.js';

export default function parse(document, option, cards) {
  const name = option ? `Cards Grid (${option})` : 'Cards Grid';
  const withImages = cards.some((c) => c.image);
  const rows = withImages
    ? cards.map((c) => [c.image || '', c.body]) // image cell + text cell
    : cards.map((c) => [c.body]); // single text cell
  return block(document, name, rows);
}

/** Infographics (.infographics li): number + label. */
export function statsCards(document, infographics) {
  return [...infographics.querySelectorAll('li')].map((li) => ({
    body: [
      para(document, (li.querySelector('.cmp-infographic__content-title') || {}).textContent),
      para(document, (li.querySelector('.cmp-infographic__content-text') || {}).textContent),
    ].filter(Boolean),
  }));
}

/** Text-only feature items: direct children holding a heading + text (+ button). */
export function textCards(document, container) {
  const grid = container.querySelector('.aem-Grid');
  return [...grid.children].map((item) => {
    const text = item.matches('.text') ? item : item.querySelector('.text');
    if (!text) return null;
    const h = text.querySelector('h1, h2, h3, h4, h5, h6');
    const body = [
      h ? heading(document, 'h5', h.textContent) : null,
      ...[...text.querySelectorAll('p')].map((p) => para(document, p.textContent)),
      ...[...item.querySelectorAll('a.cmp-button')].map((a) => linkPara(document, a)),
    ].filter(Boolean);
    return body.length ? { body } : null;
  }).filter(Boolean);
}

/** Award items (logo + "Leader<br><span>description</span>" + optional button). */
export function awardCards(document, items) {
  return items.map((item) => {
    const h = item.querySelector('h6, h5, h4');
    const label = h ? [...h.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' ') : '';
    const desc = h && h.querySelector('span') ? h.querySelector('span').textContent : '';
    const strong = document.createElement('strong');
    strong.textContent = label.replace(/\s+/g, ' ').trim();
    const labelP = document.createElement('p');
    labelP.append(strong);
    return {
      image: imgClone(document, item.querySelector('img')),
      body: [
        strong.textContent ? labelP : null,
        para(document, desc),
        ...[...item.querySelectorAll('a.cmp-button')].map((a) => linkPara(document, a)),
      ].filter(Boolean),
    };
  });
}

/** Partner logos (.image.logo-style): linked logo + caption. */
export function logoCards(document, logos) {
  return logos.map((logo) => {
    const src = logo.querySelector('a[href]');
    const img = imgClone(document, logo.querySelector('img'));
    let image = img;
    if (src && img) {
      image = document.createElement('a');
      image.href = src.getAttribute('href');
      image.append(img);
    }
    return {
      image,
      body: [para(document, (logo.querySelector('.cmp-image__title') || {}).textContent)].filter(Boolean),
    };
  });
}

/** Leadership people (image + "<b>Name</b><br>Role<br>Region"). */
export function peopleCards(document, items) {
  return items.map((item) => {
    const p = item.querySelector('.text p') || item.querySelector('.text');
    const lines = (p ? p.innerText || p.textContent : '').split('\n').map((l) => l.trim()).filter(Boolean);
    const name = document.createElement('strong');
    name.textContent = lines.shift() || '';
    const nameP = document.createElement('p');
    nameP.append(name);
    return {
      image: imgClone(document, item.querySelector('img')),
      body: [nameP, ...lines.map((l) => para(document, l))].filter(Boolean),
    };
  });
}

/** Promo teasers (.teaser.cmp-teaser-layout-card): eyebrow, heading, text, CTA. */
export function promoCards(document, teasers, remap) {
  return teasers.map((t) => ({ body: teaserNodes(document, t, { tag: 'h3', remap }) }));
}
