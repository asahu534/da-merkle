/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-featured (the .teasergallerylist.mer-featured-tgl gallery).
 * Same card content as cards-casestudy: [image] [eyebrow, title, link].
 */
import casestudy from './cards-casestudy.js';

export default function parse(document, list) {
  return casestudy(document, list, 'Cards Featured');
}
