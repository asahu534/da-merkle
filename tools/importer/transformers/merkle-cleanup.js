/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: remove merkle.com page chrome and hidden components before the
 * page is assembled (header, footer, cookie banner, hidden fragments).
 */
export default function transform(hookName, element) {
  if (hookName !== 'beforeTransform') return;
  WebImporter.DOMUtils.remove(element, [
    'header', 'footer', '.header', '.footer', 'nav',
    '#onetrust-consent-sdk', '#onetrust-banner-sdk', '.ot-sdk-container',
    'script', 'style', 'noscript', 'iframe', 'link',
    '.cmp-experiencefragment--header', '.cmp-experiencefragment--footer',
    '.s7-video-viewer', '.s7container',
  ]);
  // components hidden on the page (e.g. an unused "Meet Our Global Team" list)
  [...element.querySelectorAll('.aem-Grid > div')].forEach((el) => {
    const view = el.ownerDocument.defaultView;
    if (view && view.getComputedStyle(el).display === 'none') el.remove();
  });
}
