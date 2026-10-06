/* eslint-disable */
/* global WebImporter */

/**
 * Parser: video-centered. One cell: poster image + link to the MP4.
 */
import { block } from './merkle-parts.js';

export default function parse(document, videoComponent) {
  const video = videoComponent.querySelector('video');
  if (!video) return null;
  const src = video.currentSrc || video.getAttribute('src')
    || (video.querySelector('source') || {}).src || '';
  if (!src || src.startsWith('blob:')) return null;
  const cell = [];
  if (video.poster) {
    const poster = document.createElement('img');
    poster.src = video.poster;
    poster.alt = '';
    cell.push(poster);
  }
  const a = document.createElement('a');
  a.href = src;
  a.textContent = src;
  cell.push(a);
  return block(document, 'Video Centered', [[cell]]);
}
