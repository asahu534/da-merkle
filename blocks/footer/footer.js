// Inline SVG icons for the social networks (keyed by hostname keyword).
const SOCIAL_ICONS = {
  instagram: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.2.4-.3 1-.4 2.1C2.6 8.5 2.6 8.9 2.6 12s0 3.5.1 4.7c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.3-.4-.4-.8-.6-1.3-.8-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1zm0 3.1a4.9 4.9 0 100 9.8 4.9 4.9 0 000-9.8zm0 8.1a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zm6.3-8.3a1.1 1.1 0 11-2.3 0 1.1 1.1 0 012.3 0z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor"><path d="M23 7.5s-.2-1.6-.9-2.3c-.9-.9-1.8-.9-2.3-1C16.7 4 12 4 12 4h0s-4.7 0-7.8.2c-.4 0-1.4.1-2.3 1-.7.7-.9 2.3-.9 2.3S.8 9.4.8 11.3v1.4c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.8.2 7.6.2 7.6.2s4.7 0 7.8-.2c.4-.1 1.4-.1 2.3-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8v-1.4c0-1.9-.2-3.8-.2-3.8zM9.7 15.2V8.9l6.1 3.2-6.1 3.1z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor"><path d="M20.4 3H3.6C3.3 3 3 3.3 3 3.6v16.8c0 .3.3.6.6.6h16.8c.3 0 .6-.3.6-.6V3.6c0-.3-.3-.6-.6-.6zM8.3 18.3H5.4V9.4h2.9v8.9zM6.9 8.2c-.9 0-1.7-.8-1.7-1.7 0-.9.8-1.7 1.7-1.7.9 0 1.7.8 1.7 1.7 0 .9-.8 1.7-1.7 1.7zm11.4 10.1h-2.9v-4.3c0-1 0-2.4-1.4-2.4s-1.6 1.1-1.6 2.3v4.4H9.5V9.4h2.8v1.2h.1c.4-.7 1.3-1.4 2.6-1.4 2.8 0 3.3 1.9 3.3 4.3v4.8z"/></svg>',
};

function iconFor(href) {
  const h = (href || '').toLowerCase();
  if (h.includes('instagram')) return { key: 'instagram', label: 'Instagram' };
  if (h.includes('youtube') || h.includes('youtu.be')) return { key: 'youtube', label: 'YouTube' };
  if (h.includes('linkedin')) return { key: 'linkedin', label: 'LinkedIn' };
  return null;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // metadata-independent dual-fetch: /content first (localhost), then root (DA/EDS prod)
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');

  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer-content';

  if (resp.ok) {
    const html = await resp.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    while (doc.body.firstElementChild) footer.append(doc.body.firstElementChild);
  }

  // label the four sections
  const classes = ['brand', 'social', 'disclosure', 'legal-bottom'];
  classes.forEach((c, i) => {
    const section = footer.children[i];
    if (section) section.classList.add(`footer-${c}`);
  });

  // turn the social link list into icon links
  const socialSection = footer.querySelector('.footer-social');
  if (socialSection) {
    socialSection.querySelectorAll('a').forEach((a) => {
      const info = iconFor(a.getAttribute('href'));
      if (info) {
        a.setAttribute('aria-label', info.label);
        a.setAttribute('title', info.label);
        a.innerHTML = SOCIAL_ICONS[info.key];
        a.classList.add('footer-social-icon');
        if (a.getAttribute('href').startsWith('http')) {
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener');
        }
      }
    });
  }

  // dentsu logo opens in a new tab
  const bottom = footer.querySelector('.footer-legal-bottom');
  if (bottom) {
    const dentsu = bottom.querySelector('a');
    if (dentsu && (dentsu.getAttribute('href') || '').startsWith('http')) {
      dentsu.setAttribute('target', '_blank');
      dentsu.setAttribute('rel', 'noopener');
    }
  }

  // external links in the disclosure open in a new tab
  const disclosure = footer.querySelector('.footer-disclosure');
  if (disclosure) {
    disclosure.querySelectorAll('a[href^="http"]').forEach((a) => {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    });
  }

  block.append(footer);
}
