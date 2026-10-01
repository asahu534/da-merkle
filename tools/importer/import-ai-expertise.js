/* eslint-disable */
/* global WebImporter */

/**
 * Import script — "ai-expertise" template
 * (https://www.merkle.com/en/ai-expertise.html).
 * Builds the page section by section from the source components.
 */
import cleanup from './transformers/merkle-cleanup.js';
import dmImages from './transformers/merkle-dm-images.js';
import sectionsTransformer from './transformers/merkle-sections.js';
import cardsGrid, { promoCards, peopleCards } from './parsers/cards-grid.js';
import columnsMedia from './parsers/columns-media.js';
import heroVideo from './parsers/hero-video.js';
import cardsFeatured from './parsers/cards-featured.js';
import videoCentered from './parsers/video-centered.js';
import { heading, teaserNodes } from './parsers/merkle-parts.js';

// hero background video: compressed copy in DA /media/, Scene7 poster
const HERO_VIDEO = '/media/ai-expertise-hero.mp4';
const HERO_POSTER = 'https://s7d1.scene7.com/is/image/merkle/Merkle-GTM-Motion_Vignette-01-AVS';

// source jump links -> ids EDS generates for the matching headings
const REMAP = {
  '#insights': '#ai-essentials-for-business-leaders',
  '#enterprise': '#ai-for-enterprise',
  '#customer': '#ai-for-customer-experience',
};

const byText = (els, re) => [...els].find((el) => re.test(el.textContent));

function targetPath(originalURL) {
  const p = new URL(originalURL).pathname.replace(/\.html?$/, '').replace(/\/$/, '');
  return WebImporter.FileUtils.sanitizePath(p.replace(/^\/en(?=\/)/, '') || '/index');
}

/** Leadership: regional <h3> headings, each followed by its people. */
function peopleGroups(document, body, startAfter) {
  const grid = startAfter && startAfter.parentElement;
  if (!grid) return [];
  const kids = [...grid.children];
  const groups = [];
  kids.slice(kids.indexOf(startAfter) + 1).forEach((el) => {
    if (el.matches('.title')) {
      groups.push({ title: el.textContent, items: [] });
    } else if (el.matches('.container') && el.querySelector('img') && el.querySelector('.text') && groups.length) {
      groups[groups.length - 1].items.push(el);
    }
  });
  return groups.filter((g) => g.items.length);
}

export default {
  transform: ({ document, url, params }) => {
    const body = document.body;
    cleanup('beforeTransform', body);
    const q = (s) => body.querySelector(s);
    const qa = (s) => [...body.querySelectorAll(s)];
    const found = [];
    const use = (name, node) => { if (node) found.push(name); return node; };

    const hero = q('.teaser.cmp-teaser-layout-hero');
    const promos = qa('.teaser.cmp-teaser-layout-card');
    const largeHeads = qa('.teaser.cmp-teaser-layout-large');
    const entHead = byText(largeHeads, /AI for Enterprise/i);
    const cxHead = byText(largeHeads, /AI for Customer Experience/i);
    const insightsHead = byText(largeHeads, /AI Essentials/i);
    const partnersHead = byText(largeHeads, /Better together/i);
    const teamHead = largeHeads.find((t) => /Meet our team/.test(t.textContent));
    const mediaBlack = qa('.teaser.cmp-teaser-layout-media.cmp-teaser-blue-black');
    const forbes = byText(mediaBlack, /Forbes/i);
    const enterprise = mediaBlack.filter((t) => t !== forbes);
    const customer = qa('.teaser.cmp-teaser-layout-media.grey-background');
    const gallery = q('.teasergallerylist.mer-featured-tgl');
    const video = qa('.video').find((v) => !v.closest('.teaser'));
    const groups = peopleGroups(document, body, teamHead);

    const sections = [
      { style: null, nodes: [hero && use('hero (video)', heroVideo(document, hero, { videoUrl: HERO_VIDEO, posterUrl: HERO_POSTER, remap: REMAP }))] },
      { style: null, nodes: [promos.length && use('cards-grid (promo, rounded)', cardsGrid(document, 'promo, rounded', promoCards(document, promos, REMAP)))] },
      // heading bands are full-width colour sections; the case studies below
      // them are rounded cards on white (as on the source)
      { style: 'dark, center', nodes: [...(entHead ? teaserNodes(document, entHead, { tag: 'h2' }) : [])] },
      { style: null, nodes: [enterprise.length && use('columns (media, rounded) enterprise', columnsMedia(document, enterprise, { options: ['media', 'rounded'] }))] },
      { style: 'grey, center', nodes: [...(cxHead ? teaserNodes(document, cxHead, { tag: 'h2' }) : [])] },
      { style: null, nodes: [customer.length && use('columns (media, rounded, grey) customer', columnsMedia(document, customer, { options: ['media', 'rounded', 'grey'] }))] },
      { style: 'navy, center', nodes: [...(insightsHead ? teaserNodes(document, insightsHead, { tag: 'h2' }) : [])] },
      { style: null, nodes: [gallery && use('cards-featured', cardsFeatured(document, gallery))] },
      { style: null, nodes: [forbes && use('columns (media, rounded) forbes', columnsMedia(document, [forbes], { options: ['media', 'rounded'] }))] },
      { style: 'navy, center', nodes: [...(partnersHead ? teaserNodes(document, partnersHead, { tag: 'h2' }) : [])] },
      { style: null, nodes: [video && use('video-centered', videoCentered(document, video))] },
      { style: 'navy, center', nodes: [...(teamHead ? teaserNodes(document, teamHead, { tag: 'h2' }) : [])] },
      { style: null, nodes: groups.flatMap((g) => [
        heading(document, 'h3', g.title),
        use(`cards-grid (people) ${g.title.trim()}`, cardsGrid(document, 'people', peopleCards(document, g.items))),
      ]) },
    ].map((s) => ({ ...s, nodes: s.nodes.filter(Boolean) })).filter((s) => s.nodes.length);

    const main = document.createElement('div');
    sectionsTransformer('afterTransform', main, { document, sections });

    dmImages('afterTransform', main, { document });
    main.append(document.createElement('hr')); // metadata in its own section
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    return [{
      element: main,
      path: targetPath(params.originalURL),
      report: { title: document.title, template: 'ai-expertise', blocks: found },
    }];
  },
};
