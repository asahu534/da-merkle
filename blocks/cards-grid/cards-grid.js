/*
 * Cards Grid — one card grid with several looks, picked by block options:
 *   Cards Grid            icon cards (default)
 *   Cards Grid (logos)    logo + label, optional text and link
 *   Cards Grid (text)     no image: heading + text + optional link
 *   Cards Grid (stats)    large number + label
 *   Cards Grid (people)   headshot + name + role + region
 *   Cards Grid (promo)    centered panel: eyebrow, heading, text, CTA
 * Each row is one card: an optional image cell and a text cell.
 */

/**
 * Icon and logo renditions are transparent Scene7 PNGs (fmt=png-alpha) meant to
 * sit on the section background. The DM auto-block / createOptimizedPicture
 * force webp|jpg, which flattens the alpha channel to a white box, so the
 * Scene7 fmt is rewritten back to png-alpha and the webp/jpg <source> overrides
 * are dropped.
 */
function forcePngAlpha(url) {
  try {
    const u = new URL(url, window.location.href);
    // Scene7 IS/Image: swap any fmt=... for fmt=png-alpha (add if missing).
    if (/[?&]fmt=/.test(u.search)) {
      u.search = u.search.replace(/([?&]fmt=)[^&]*/, '$1png-alpha');
    } else {
      u.searchParams.set('fmt', 'png-alpha');
    }
    return u.toString();
  } catch (e) {
    return url;
  }
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-grid-card-image';
      else if (!div.textContent.trim() && !div.querySelector('picture')) div.remove(); // empty cell
      else div.className = 'cards-grid-card-body';
    });
    ul.append(li);
  });

  // photos (people) keep their normal format; icons and logos stay transparent
  if (!block.classList.contains('people')) {
    ul.querySelectorAll('picture').forEach((picture) => {
      // Drop webp/jpg source overrides so the transparent PNG <img> is used.
      picture.querySelectorAll('source').forEach((s) => s.remove());
      const img = picture.querySelector('img');
      if (img) {
        img.src = forcePngAlpha(img.currentSrc || img.src);
        img.loading = 'lazy';
      }
    });
  }

  block.textContent = '';
  block.append(ul);
}
