// media query match that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Fetch the nav fragment. Metadata-independent dual-fetch:
 * /content first (localhost / aem up), then root (DA/EDS production).
 * @returns {Promise<Document|null>}
 */
async function fetchNav() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  const html = await resp.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc;
}

/**
 * Collapse every open dropdown in the primary nav.
 * @param {Element} sections
 * @param {Boolean} expanded
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll(':scope .nav-drop').forEach((drop) => {
    drop.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggle the whole mobile drawer.
 * @param {Element} nav
 * @param {Element} navSections
 * @param {Boolean|null} forceExpanded
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, false);
  if (button) button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const doc = await fetchNav();
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  if (doc) {
    while (doc.body.firstElementChild) nav.append(doc.body.firstElementChild);
  }

  // label the three sections: brand, primary nav, tools
  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // brand: unwrap the logo link/paragraph
  const navBrand = nav.querySelector('.nav-brand');

  // primary nav: mark items with sub-lists as dropdowns
  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) {
        navSection.classList.add('nav-drop');
        navSection.setAttribute('aria-expanded', 'false');
      }
      // toggle sub-lists: hover opens on desktop, tap toggles on mobile
      const link = navSection.querySelector(':scope > a');
      if (link && navSection.classList.contains('nav-drop')) {
        // a dedicated chevron toggles the sub-list without following the link
        const chevron = document.createElement('button');
        chevron.className = 'nav-drop-toggle';
        chevron.setAttribute('type', 'button');
        chevron.setAttribute('aria-label', `Toggle ${link.textContent.trim()} submenu`);
        navSection.insertBefore(chevron, link.nextSibling);
        chevron.addEventListener('click', (e) => {
          e.preventDefault();
          const open = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', open ? 'false' : 'true');
        });
      }
    });

    // desktop hover open/close for dropdowns
    navSections.querySelectorAll(':scope > ul > li.nav-drop').forEach((drop) => {
      drop.addEventListener('mouseenter', () => {
        if (isDesktop.matches) drop.setAttribute('aria-expanded', 'true');
      });
      drop.addEventListener('mouseleave', () => {
        if (isDesktop.matches) drop.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // tools: mark the language list and treat trailing links as actions
  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    const langList = navTools.querySelector('ul');
    if (langList) {
      langList.classList.add('nav-lang');
      // build a language toggle button showing the current locale
      const langWrap = document.createElement('div');
      langWrap.className = 'nav-lang-wrap';
      const langBtn = document.createElement('button');
      langBtn.type = 'button';
      langBtn.className = 'nav-lang-toggle';
      langBtn.setAttribute('aria-expanded', 'false');
      langBtn.setAttribute('aria-label', 'Select language');
      langBtn.textContent = 'en';
      langList.parentNode.insertBefore(langWrap, langList);
      langWrap.append(langBtn, langList);
      langBtn.addEventListener('click', () => {
        const open = langBtn.getAttribute('aria-expanded') === 'true';
        langBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
      });
    }
    // last link styled as the Contact CTA
    const toolLinks = navTools.querySelectorAll(':scope > p a');
    if (toolLinks.length) toolLinks[toolLinks.length - 1].classList.add('nav-cta');
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  // keep brand ahead of hamburger visually via CSS; reset menu state on breakpoint change
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => {
    toggleMenu(nav, navSections, isDesktop.matches);
    toggleAllNavSections(navSections, false);
    const hb = nav.querySelector('.nav-hamburger button');
    if (hb) hb.setAttribute('aria-label', 'Open navigation');
  });

  if (navBrand) { /* brand kept as-is; styling handled in CSS */ }

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
