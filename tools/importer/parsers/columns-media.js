/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns (media) (base: Columns). One row per merkle.com media teaser.
 *
 * Table structure (Columns convention): every row has the same 2 columns —
 *   cell 1 = text (eyebrow, heading, description, CTA link)
 *   cell 2 = image (left empty when a teaser has none, so the column count
 *            stays consistent across rows)
 * Options go in the block name, e.g. "Columns (media, hero)".
 */
import { block, imgClone, teaserNodes, teaserParts } from './merkle-parts.js';

export default function parse(document, teasers, { options = ['media'], headingTag, remap } = {}) {
  const rows = teasers.map((teaser, i) => {
    const text = teaserNodes(document, teaser, { tag: i === 0 && headingTag ? headingTag : 'h2', remap });
    const img = imgClone(document, teaserParts(teaser).img);
    return [text, img || ''];
  });
  return block(document, `Columns (${options.join(', ')})`, rows);
}
