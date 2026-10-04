// media query match that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 1280px)');

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
  const expanded = forceExpanded !== null
    ? forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';

  const button = nav.querySelector('.nav-hamburger button');

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';

  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');

  toggleAllNavSections(navSections, false);

  if (button) {
    button.setAttribute(
      'aria-label',
      expanded ? 'Open navigation' : 'Close navigation',
    );
  }
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

  const brandImage = `<svg width="142" height="18" viewBox="0 0 142 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 8.1001L9.7625 18.0001V8.1001H0Z" fill="#F23A1D"/>
<path d="M30.5275 0L23.0714 7.52338L15.6209 0H13.6083V18H17.3955V7.3076L23.0742 13.04L28.7544 7.3076V18H32.5416V0H30.5275Z" fill="#12295D"/>
<path d="M37.275 0V18H54.7292V14.3925H41.1056V10.2872H49.5637V6.67965H41.1056V3.7114H53.9913V0H37.275Z" fill="#12295D"/>
<path d="M73.2064 5.28977C73.2205 5.06688 73.1837 4.84371 73.0989 4.63749C73.0142 4.43127 72.8837 4.24751 72.7177 4.1004C72.2134 3.80738 71.6355 3.66975 71.055 3.70443H62.9321V7.01724H71.055C71.8376 7.01724 72.3765 6.8722 72.7177 6.57196C73.0262 6.2159 73.1995 5.76037 73.2064 5.28687M78.1 17.9913H73.8443L69.1472 10.6317H62.9321V18H59.1666V0H71.1037C72.8667 0 74.2356 0.445286 75.3121 1.28509C76.4874 2.22401 77.0751 3.5589 77.0751 5.28977C77.0818 6.42272 76.7391 7.52957 76.0947 8.45608C75.424 9.38367 74.4832 10.0755 73.4042 10.4345L78.1 17.9913Z" fill="#12295D"/>
<path d="M94.6532 0L86.6981 6.72823V0H82.8334V18H86.6894V11.3226L89.4086 9L96.0822 18H100.583L92.1799 6.62371L99.9889 0H94.6532Z" fill="#12295D"/>
<path d="M104.725 0V18H120.7V14.3925H108.523V0H104.725Z" fill="#12295D"/>
<path d="M124.842 0V18H142V14.3925H128.564V10.2886H136.873V6.6811H128.564V3.7114H141.271V0H124.842Z" fill="#12295D"/>
</svg>`;

  const searchsvg = `<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#1f1f1f">
<path d="M792-120.67 532.67-380q-30 25.33-69.67 39.67Q423.33-326 378.67-326q-108.34 0-183.5-75.17Q120-476.33 120-583.33t75.17-182.17q75.16-75.17 182.83-75.17 107 0 181.83 75.17 74.84 75.17 74.84 182.17 0 43.33-14 83-14 39.66-40.67 73l260 258.66-48 48Zm-414-272q79 0 134.5-55.83T568-583.33q0-79-55.5-134.84Q457-774 378-774q-79.67 0-135.5 55.83-55.83 55.84-55.83 134.84T242.5-448.5q55.83 55.83 135.5 55.83Z"/>
</svg>`;

  // label the three sections: brand, primary nav, tools
  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // brand: unwrap the logo link/paragraph
  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const logoImage = navBrand.querySelector('picture');

    const pageName = window.location.pathname
      .split('/')
      .filter(Boolean)
      .pop() || '';

    const logoLink = document.createElement('a');
    logoLink.href = '/';
    logoLink.setAttribute('aria-label', 'Merkle Home');

    if (pageName === 'merkle-now') {
    // Use your custom SVG on Merkle Now page
      logoLink.innerHTML = brandImage;
    } else if (logoImage) {
    // Use the normal authored logo on other pages
      logoLink.append(logoImage);
    }

    navBrand.textContent = '';
    navBrand.append(logoLink);
  }

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

    const pageName = window.location.pathname
      .split('/')
      .filter(Boolean)
      .pop() || '';

    // search: make the authored search icon clickable
    const searchBlock = nav.querySelector('.search');

    if (searchBlock) {
      const searchContent = searchBlock.querySelector(':scope > div');
      const searchPath = searchContent
        ?.querySelector(':scope > div:first-child')
        ?.textContent.trim();

      const searchImage = searchBlock.querySelector('img');

      if (searchPath) {
        const searchLink = document.createElement('a');

        searchLink.href = searchPath.startsWith('/')
          ? searchPath
          : `/${searchPath}`;

        searchLink.setAttribute('aria-label', 'Search');
        searchLink.className = 'nav-search-link';

        if (pageName === 'merkle-now') {
          // Use custom inline SVG on Merkle Now
          searchLink.innerHTML = searchsvg;
        } else if (searchImage) {
          // Keep existing authored icon on other pages
          searchLink.append(searchImage);
        }

        searchBlock.textContent = '';
        searchBlock.append(searchLink);
      }
    }

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
    // last link styled as the Contact CTA
    const toolLinks = navTools.querySelectorAll(':scope > p a');

    if (toolLinks.length) {
      const cta = toolLinks[toolLinks.length - 1];

      cta.classList.add('nav-cta');

      const text = cta.textContent.trim();

      const currentText = document.createElement('span');
      currentText.className = 'nav-cta-text nav-cta-text-current';
      currentText.textContent = text;

      const hoverText = document.createElement('span');
      hoverText.className = 'nav-cta-text nav-cta-text-hover';
      hoverText.textContent = text;

      cta.textContent = '';
      cta.append(currentText, hoverText);
    }
  }

  // hamburger for mobile
  // const hamburger = document.createElement('div');
  // hamburger.classList.add('nav-hamburger');
  // hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
  //     <span class="nav-hamburger-icon"></span>
  //   </button>`;
  // hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  // nav.prepend(hamburger);
  // nav.setAttribute('aria-expanded', 'false');

  // Mobile actions: search + hamburger
  // Mobile actions: search + hamburger
  const mobileActions = document.createElement('div');
  mobileActions.className = 'nav-mobile-actions';

  const searchBlock = nav.querySelector('.search');

  // Create hamburger only for mobile
  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';

  hamburger.innerHTML = `
  <button
    type="button"
    aria-controls="nav"
    aria-label="Open navigation"
  >
    <span class="nav-hamburger-icon"></span>
  </button>
`;

  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));

  // Add search + hamburger to the mobile wrapper
  mobileActions.append(searchBlock, hamburger);

  const setupMobileActions = () => {
    if (!isDesktop.matches) {
    // Mobile:
    // Move search + hamburger into one wrapper
      if (!mobileActions.parentElement) {
        nav.append(mobileActions);
      }
    } else {
    // Desktop:
    // Move search back to nav-tools
      if (searchBlock && searchBlock.parentElement === mobileActions) {
        navTools.insertBefore(searchBlock, navTools.firstChild);
      }

      // Remove mobile-only wrapper and hamburger
      if (mobileActions.parentElement) {
        mobileActions.remove();
      }
    }
  };

  setupMobileActions();

  nav.setAttribute('aria-expanded', 'false');
  // keep brand ahead of hamburger visually via CSS; reset menu state on breakpoint change
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => {
    setupMobileActions();
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
