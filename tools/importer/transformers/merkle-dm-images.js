/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Dynamic Media / Scene7 images → carrier links.
 *
 * Scene7 images (/is/image/...) must not be copied into the media bus, or their
 * Scene7 renditions are lost. Each one is written as a link the site's DM
 * auto-block (scripts/scripts.js) turns back into a responsive <picture>:
 *   - plain image:   <a href="SCENE7-URL">alt text</a>
 *   - linked image:  <a href="LINK-TARGET" title="SCENE7-URL">alt text</a>
 * Non-Scene7 images are left untouched.
 */

const EMPTY_ALT = 'Image without alt text';

/** Clean Scene7 URL for an <img>: drop per-request params, keep the asset + smart crop. */
function dmUrlFor(img) {
  let src = img.currentSrc || img.src || img.getAttribute('src') || '';
  if (!/\/is\/image\//.test(src) || src.includes('{.width}')) {
    const holder = img.closest('[data-cmp-src]');
    const alt = holder && holder.getAttribute('data-cmp-src');
    if (alt && /\/is\/image\//.test(alt)) src = alt;
  }
  if (!/\/is\/image\//.test(src)) return null;
  try {
    const u = new URL(src, 'https://assets.merkle.com');
    // keep only sharpening params; width/format are chosen at render time
    const keep = new URLSearchParams();
    ['op_sharpen', 'op_usm'].forEach((k) => { if (u.searchParams.has(k)) keep.set(k, u.searchParams.get(k)); });
    const q = keep.toString();
    return `${u.origin}${u.pathname}${q ? `?${q}` : ''}`;
  } catch (e) {
    return null;
  }
}

/** Replace every Scene7 <img> (and its <picture>) under root with a carrier link. */
function dmify(root, document) {
  [...root.querySelectorAll('img')].forEach((img) => {
    const dm = dmUrlFor(img);
    if (!dm) return;
    const alt = (img.getAttribute('alt') || '').trim() || EMPTY_ALT;
    const target = img.closest('picture') || img;
    const link = img.closest('a[href]');
    if (link && link.contains(target) && !/\/is\/image\//.test(link.getAttribute('href'))) {
      // linked image: keep the link target, carry the DM URL in title
      link.setAttribute('title', dm);
      link.textContent = alt;
      return;
    }
    const a = document.createElement('a');
    a.href = dm;
    a.textContent = alt;
    target.replaceWith(a);
  });
}

export default function transform(hookName, element, payload) {
  if (hookName === 'afterTransform') dmify(element, payload.document);
}
