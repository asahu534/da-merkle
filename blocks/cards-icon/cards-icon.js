/**
 * The icon renditions are transparent Scene7 PNGs (fmt=png-alpha) meant to sit
 * on the dark section background. The DM auto-block / createOptimizedPicture
 * force webp|jpg, which flattens the alpha channel to a white box. To keep the
 * icons transparent we rewrite the Scene7 fmt back to png-alpha and drop the
 * webp/jpg <source> overrides.
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
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-icon-card-image';
      else div.className = 'cards-icon-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture').forEach((picture) => {
    // Drop webp/jpg source overrides so the transparent PNG <img> is used.
    picture.querySelectorAll('source').forEach((s) => s.remove());
    const img = picture.querySelector('img');
    if (img) {
      img.src = forcePngAlpha(img.currentSrc || img.src);
      img.loading = 'lazy';
    }
  });
  block.textContent = '';
  block.append(ul);
}
