// Inline SVG icons for the social networks (keyed by hostname keyword).
const SOCIAL_ICONS = {
  instagram: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 1.80723C12.6506 1.80723 13.012 1.80723 14.0964 1.80723C15.0602 1.80723 15.5422 2.04819 15.9036 2.16868C16.3855 2.40964 16.747 2.53012 17.1084 2.89157C17.4699 3.25301 17.7108 3.61446 17.8313 4.09639C17.9518 4.45783 18.0723 4.93976 18.1928 5.90362C18.1928 6.98795 18.1928 7.22892 18.1928 10C18.1928 12.7711 18.1928 13.012 18.1928 14.0964C18.1928 15.0602 17.9518 15.5422 17.8313 15.9036C17.5904 16.3855 17.4699 16.747 17.1084 17.1084C16.747 17.4699 16.3855 17.7108 15.9036 17.8313C15.5422 17.9518 15.0602 18.0723 14.0964 18.1928C13.012 18.1928 12.7711 18.1928 10 18.1928C7.22892 18.1928 6.98795 18.1928 5.90362 18.1928C4.93976 18.1928 4.45783 17.9518 4.09639 17.8313C3.61446 17.5904 3.25301 17.4699 2.89157 17.1084C2.53012 16.747 2.28916 16.3855 2.16868 15.9036C2.04819 15.5422 1.92771 15.0602 1.80723 14.0964C1.80723 13.012 1.80723 12.7711 1.80723 10C1.80723 7.22892 1.80723 6.98795 1.80723 5.90362C1.80723 4.93976 2.04819 4.45783 2.16868 4.09639C2.40964 3.61446 2.53012 3.25301 2.89157 2.89157C3.25301 2.53012 3.61446 2.28916 4.09639 2.16868C4.45783 2.04819 4.93976 1.92771 5.90362 1.80723C6.98795 1.80723 7.3494 1.80723 10 1.80723ZM10 0C7.22892 0 6.98795 0 5.90362 0C4.81928 0 4.09639 0.240965 3.49398 0.481928C2.89157 0.722892 2.28916 1.08434 1.68675 1.68675C1.08434 2.28916 0.843374 2.77109 0.481928 3.49398C0.240965 4.09639 0.120482 4.81928 0 5.90362C0 6.98795 0 7.3494 0 10C0 12.7711 0 13.012 0 14.0964C0 15.1807 0.240965 15.9036 0.481928 16.506C0.722892 17.1084 1.08434 17.7108 1.68675 18.3133C2.28916 18.9157 2.77109 19.1566 3.49398 19.5181C4.09639 19.759 4.81928 19.8795 5.90362 20C6.98795 20 7.3494 20 10 20C12.6506 20 13.012 20 14.0964 20C15.1807 20 15.9036 19.759 16.506 19.5181C17.1084 19.2771 17.7108 18.9157 18.3133 18.3133C18.9157 17.7108 19.1566 17.2289 19.5181 16.506C19.759 15.9036 19.8795 15.1807 20 14.0964C20 13.012 20 12.6506 20 10C20 7.3494 20 6.98795 20 5.90362C20 4.81928 19.759 4.09639 19.5181 3.49398C19.2771 2.89157 18.9157 2.28916 18.3133 1.68675C17.7108 1.08434 17.2289 0.843374 16.506 0.481928C15.9036 0.240965 15.1807 0.120482 14.0964 0C13.012 0 12.7711 0 10 0Z" fill="white"/><path d="M10 4.81928C7.10844 4.81928 4.81928 7.10844 4.81928 10C4.81928 12.8916 7.10844 15.1807 10 15.1807C12.8916 15.1807 15.1807 12.8916 15.1807 10C15.1807 7.10844 12.8916 4.81928 10 4.81928ZM10 13.3735C8.19277 13.3735 6.62651 11.9277 6.62651 10C6.62651 8.19277 8.07229 6.62651 10 6.62651C11.8072 6.62651 13.3735 8.07229 13.3735 10C13.3735 11.8072 11.8072 13.3735 10 13.3735Z" fill="white"/><path d="M15.3012 5.90362C15.9666 5.90362 16.506 5.3642 16.506 4.6988C16.506 4.03339 15.9666 3.49398 15.3012 3.49398C14.6358 3.49398 14.0964 4.03339 14.0964 4.6988C14.0964 5.3642 14.6358 5.90362 15.3012 5.90362Z" fill="white"/></svg>',
  youtube: '<svg width="26" height="18" viewBox="0 0 26 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.6729 0.327393C23.9938 0.327393 25.8641 2.3799 25.8643 4.90454V13.095C25.8737 15.63 23.9939 17.6721 21.6729 17.6721H4.32715C2.00613 17.6721 0.135742 15.6198 0.135742 13.095V4.90454C0.135897 2.36963 2.01562 0.327393 4.32715 0.327393H21.6729ZM10.2539 13.0793L17.5508 8.87134L10.2539 4.66333V13.0793Z" fill="white"/></svg>',
  linkedin: '<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 8.7444V14.2601H11.7713V9.08072C11.7713 7.80269 11.3004 6.92825 10.157 6.92825C9.28251 6.92825 8.74439 7.53363 8.5426 8.07175C8.47534 8.27354 8.40807 8.5426 8.40807 8.87892V14.2601H5.17937C5.17937 14.2601 5.24664 5.5157 5.17937 4.64126H8.40807V5.98655C8.81166 5.3139 9.61883 4.3722 11.3004 4.3722C13.3856 4.3722 15 5.78475 15 8.7444ZM1.81614 0C0.739908 0 0 0.73991 0 1.68161C0 2.62332 0.672645 3.36323 1.74888 3.36323C2.89238 3.36323 3.56502 2.62332 3.56502 1.68161C3.63229 0.672646 2.95964 0 1.81614 0ZM0.201793 14.2601H3.43049V4.64126H0.201793V14.2601Z" fill="white"/></svg>',
};

const mVectorImage = `<svg width="499" height="460" viewBox="0 0 499 460" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M446.365 1H498V477H400.2V194.027V191.583L398.487 193.326L249.5 344.867L100.513 193.326L98.8 191.583V194.027V477H1V1H52.639L250.05 201.795L250.768 202.525L251.481 201.791L446.365 1Z" stroke="url(#paint0_linear_23899_2985)" stroke-width="2"/>
<path d="M446.365 1H498V477H400.2V194.027V191.583L398.487 193.326L249.5 344.867L100.513 193.326L98.8 191.583V194.027V477H1V1H52.639L250.05 201.795L250.768 202.525L251.481 201.791L446.365 1Z" stroke="url(#paint1_linear_23899_2985)" stroke-width="2"/>
<defs>
<linearGradient id="paint0_linear_23899_2985" x1="16.5" y1="395.5" x2="439.271" y2="-11.2179" gradientUnits="userSpaceOnUse">
<stop/>
<stop offset="0.42913" stop-color="#041677"/>
<stop offset="1" stop-color="#0391F2"/>
</linearGradient>
<linearGradient id="paint1_linear_23899_2985" x1="390.5" y1="289.5" x2="455" y2="412" gradientUnits="userSpaceOnUse">
<stop stop-opacity="0"/>
<stop offset="1"/>
</linearGradient>
</defs>
</svg>`;

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

  footer.style.setProperty(
    '--footer-vector-image',
    `url("data:image/svg+xml,${encodeURIComponent(mVectorImage)}")`,
  );

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
