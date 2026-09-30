/*
 * Hero — the video option (Hero (video)) plays a muted, looping background
 * video behind the hero text. Authored content:
 *   - an image (the poster, shown first and kept as the fallback)
 *   - the hero text (heading, paragraph, optional CTA)
 *   - a link to the MP4 (e.g. /media/ai-expertise-hero.mp4)
 * Without the video option the hero is left as authored.
 */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function findVideoLink(block) {
  return [...block.querySelectorAll('a[href]')]
    .find((a) => /\.mp4($|[?#])/i.test(new URL(a.href, window.location.href).pathname + new URL(a.href, window.location.href).search));
}

function addVideo(block, src, poster) {
  const video = document.createElement('video');
  video.className = 'hero-video-media';
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('aria-hidden', 'true');
  video.preload = 'auto';
  if (poster) video.poster = poster;
  const source = document.createElement('source');
  source.src = src;
  source.type = 'video/mp4';
  video.append(source);
  video.addEventListener('canplay', () => {
    block.classList.add('hero-video-playing');
    video.play().catch(() => { /* autoplay blocked: poster stays visible */ });
  }, { once: true });
  block.prepend(video);
}

export default function decorate(block) {
  if (!block.classList.contains('video')) return;

  const link = findVideoLink(block);
  if (!link) return;
  const src = link.href;
  // remove the link (and its now-empty paragraph/cell) from the visible text
  const holder = link.closest('p') || link;
  holder.remove();
  block.querySelectorAll(':scope > div').forEach((row) => {
    if (!row.textContent.trim() && !row.querySelector('picture')) row.remove();
  });

  const img = block.querySelector('picture img');
  const poster = img ? (img.currentSrc || img.src) : '';

  if (reducedMotion.matches) return; // poster only

  // load the video after the page has painted so it doesn't delay the hero
  const start = () => addVideo(block, src, poster);
  if (document.readyState === 'complete') setTimeout(start, 0);
  else window.addEventListener('load', start, { once: true });
}
