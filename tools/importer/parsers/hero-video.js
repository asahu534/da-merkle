/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero (video) (base: Hero).
 *
 * Table structure (Hero convention): 1 column, block name row + 2 rows —
 *   row 2 = background asset: the poster image and the link to the MP4
 *           (the video is part of the background; hero.js turns the link into
 *           a looping background video and hides it from the text)
 *   row 3 = title (heading), subheading text, call-to-action link
 * The video is the compressed copy uploaded to DA /media/ (the source streams
 * a Scene7 adaptive set that can't be embedded as a single file).
 */
import { block, teaserNodes } from './merkle-parts.js';

export default function parse(document, teaser, { videoUrl, posterUrl, remap }) {
  const poster = document.createElement('img');
  poster.src = posterUrl;
  poster.alt = '';
  const link = document.createElement('a');
  link.href = videoUrl;
  link.textContent = videoUrl;
  const linkP = document.createElement('p');
  linkP.append(link);
  return block(document, 'Hero (video)', [
    [[poster, linkP]], // background: poster + video link
    [teaserNodes(document, teaser, { tag: 'h1', remap })], // title, text, CTA
  ]);
}
