/* eslint-disable */
/* global WebImporter */

/**
 * Import script — "capability" template
 * (https://www.merkle.com/en/capabilities/platforms-engineering.html).
 * Builds the page section by section from the source components.
 */
import cleanup from './transformers/merkle-cleanup.js';
import dmImages from './transformers/merkle-dm-images.js';
import sectionsTransformer from './transformers/merkle-sections.js';
import cardsGrid, {
  statsCards, textCards, awardCards, logoCards,
} from './parsers/cards-grid.js';
import columnsMedia from './parsers/columns-media.js';
import cardsCasestudy from './parsers/cards-casestudy.js';
import { heading, teaserNodes } from './parsers/merkle-parts.js';

const byText = (els, re) => [...els].find((el) => re.test(el.textContent));

function targetPath(originalURL) {
  const p = new URL(originalURL).pathname.replace(/\.html?$/, '').replace(/\/$/, '');
  return WebImporter.FileUtils.sanitizePath(p.replace(/^\/en(?=\/)/, '') || '/index');
}

export default {
  transform: ({ document, url, params }) => {
    const body = document.body;
    cleanup('beforeTransform', body);
    const q = (s) => body.querySelector(s);
    const qa = (s) => [...body.querySelectorAll(s)];
    const found = [];
    const use = (name, node) => { if (node) found.push(name); return node; };

    const hero = q('.teaser.cmp-teaser-layout-media.mer-full-bleed');
    const intro = q('.teaser.cmp-teaser-layout-medium.cmp-teaser-dark');
    const [stats1, stats2] = qa('.infographics');
    const expertiseHead = byText(qa('.teaser.cmp-teaser-layout-large'), /areas of expertise/i);
    const textContainer = q('.container.white-background.full-bleed');
    const awards = qa('.container.text-center').filter((c) => c.querySelector('img') && c.querySelector('h6'));
    const success = q('.listcards.teasergallerylist');
    const partnersHead = q('.teaser.cmp-teaser-layout-large.cmp-teaser-blue-black');
    const logos = qa('.image.logo-style');
    const moreHead = byText(qa('.teaser.cmp-teaser-layout-medium'), /More on this topic/i);
    const ebook = q('.teaser.cmp-teaser-layout-media.cmp-teaser-blue-black');
    const related = qa('.teasergallerylist').find((l) => !l.matches('.listcards, .mer-featured-tgl'));

    const successTitle = success && (success.querySelector('h2') || {}).textContent;

    const sections = [
      { style: 'navy', nodes: [hero && use('columns (media, hero)', columnsMedia(document, [hero], { options: ['media', 'hero'], headingTag: 'h1' }))] },
      { style: 'navy, split', nodes: [
        ...(intro ? teaserNodes(document, intro, { tag: 'h2' }) : []),
        stats1 && use('cards-grid (stats)', cardsGrid(document, 'stats', statsCards(document, stats1))),
      ] },
      { style: 'center', nodes: [
        ...(expertiseHead ? teaserNodes(document, expertiseHead, { tag: 'h2' }) : []),
        textContainer && use('cards-grid (text)', cardsGrid(document, 'text', textCards(document, textContainer))),
        awards.length && use('cards-grid (logos) awards', cardsGrid(document, 'logos', awardCards(document, awards))),
      ] },
      { style: 'navy', nodes: [
        heading(document, 'h2', successTitle),
        success && use('cards-casestudy (success)', cardsCasestudy(document, success, 'Cards Casestudy (rounded, heading-left)')),
      ] },
      { style: 'dark, center', nodes: [
        ...(partnersHead ? teaserNodes(document, partnersHead, { tag: 'h2' }) : []),
        logos.length && use('cards-grid (logos) partners', cardsGrid(document, 'logos', logoCards(document, logos))),
        stats2 && use('cards-grid (stats) partners', cardsGrid(document, 'stats', statsCards(document, stats2))),
      ] },
      { style: null, nodes: [...(moreHead ? teaserNodes(document, moreHead, { tag: 'h2' }) : [])] },
      { style: null, nodes: [ebook && use('columns (media, rounded) ebook', columnsMedia(document, [ebook], { options: ['media', 'rounded'] }))] },
      { style: null, nodes: [related && use('cards-casestudy (related)', cardsCasestudy(document, related, 'Cards Casestudy (rounded, arrows-right)'))] },
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
      report: { title: document.title, template: 'capability', blocks: found },
    }];
  },
};
