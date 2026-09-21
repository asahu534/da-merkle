/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-about-us.js
  var import_about_us_exports = {};
  __export(import_about_us_exports, {
    default: () => import_about_us_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    let slides = Array.from(element.querySelectorAll(".cmp-carousel__item"));
    if (!slides.length) {
      slides = Array.from(element.querySelectorAll(".teaser, .cmp-teaser"));
    }
    const cells = [];
    slides.forEach((slide) => {
      const image = slide.querySelector(
        ".cmp-teaser__image img, .cmp-teaser__image-group img, .cmp-image img, img"
      );
      const contentCell = [];
      const pretitle = slide.querySelector(".cmp-teaser__pretitle");
      const title = slide.querySelector('.cmp-teaser__title, h1, h2, h3, [class*="title"]');
      const description = slide.querySelector(".cmp-teaser__description, .cmp-teaser__content p:not(.cmp-teaser__pretitle)");
      const ctaLinks = Array.from(
        slide.querySelectorAll(".cmp-teaser__action-link, .cmp-teaser__action-container a, a.cta-primary, a.cta-secondary")
      ).slice(0, 2);
      if (pretitle) contentCell.push(pretitle);
      if (title) contentCell.push(title);
      if (description) contentCell.push(description);
      ctaLinks.forEach((cta) => contentCell.push(cta));
      if (!image && !contentCell.length) return;
      cells.push([image || "", contentCell.length ? contentCell : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-featured.js
  function parse2(element, { document }) {
    let cards = Array.from(element.querySelectorAll(".featuredcard"));
    if (!cards.length) cards = Array.from(element.querySelectorAll("li.cmp-list__item"));
    const cells = [];
    cards.forEach((card) => {
      const image = card.querySelector(".mer-fc-img_wrapper img, .cmp-teaser__image img, .cmp-image img, img");
      const bodyCell = [];
      const eyebrow = card.querySelector(".cmp-teaser__pretitle");
      const title = card.querySelector(".cmp-teaser__title, h1, h2, h3, h4");
      if (eyebrow) bodyCell.push(eyebrow);
      if (title) bodyCell.push(title);
      const wrapper = card.querySelector("a.mer-clickabkle-wrapper, a[href]");
      const ctaText = card.querySelector(".mer-link-text, .mer-teaser__action-container span, .cmp-teaser__action-link");
      if (wrapper && wrapper.getAttribute("href")) {
        const link = document.createElement("a");
        link.href = wrapper.getAttribute("href");
        link.textContent = ctaText && ctaText.textContent.trim() || title && title.textContent.trim() || "Learn more";
        bodyCell.push(link);
      } else if (ctaText && ctaText.matches("a[href]")) {
        bodyCell.push(ctaText);
      }
      if (!image && !bodyCell.length) return;
      cells.push([image || "", bodyCell.length ? bodyCell : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-featured", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-icon.js
  function parse3(element, { document }) {
    let textBlocks = Array.from(element.querySelectorAll(".text .cmp-text, .cmp-text, .text"));
    textBlocks = textBlocks.filter((tb) => !textBlocks.some((other) => other !== tb && other.contains(tb)));
    const cells = [];
    textBlocks.forEach((textBlock) => {
      const item = textBlock.closest(".aem-Grid, .cmp-container, .container") || element;
      const image = item.querySelector(".image img, .cmp-image img, img");
      const bodyCell = [];
      const title = textBlock.querySelector("h1, h2, h3, h4, h5, h6");
      const description = Array.from(textBlock.querySelectorAll("p"));
      if (title) bodyCell.push(title);
      description.forEach((p) => bodyCell.push(p));
      if (!bodyCell.length) bodyCell.push(...textBlock.childNodes);
      if (!image && !bodyCell.length) return;
      cells.push([image || "", bodyCell.length ? bodyCell : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-icon", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/video-centered.js
  function parse4(element, { document }) {
    const player = element.querySelector(".cmp-video, .cmp-video__player") || element;
    const source = player.querySelector(".cmp-video-source, source[src], video[src]");
    let videoSrc = source ? source.getAttribute("src") || source.querySelector("source") && source.querySelector("source").getAttribute("src") : null;
    let poster = player.querySelector(".cmp-video__player__controls img, img");
    if (!videoSrc || !poster) {
      const dataEl = player.closest("[data-video-desktop]") || player.querySelector("[data-video-desktop]") || element.querySelector("[data-video-desktop], [data-video-tablet], [data-video-mobile]");
      const raw = dataEl && (dataEl.getAttribute("data-video-desktop") || dataEl.getAttribute("data-video-tablet") || dataEl.getAttribute("data-video-mobile"));
      if (raw) {
        try {
          const arr = JSON.parse(raw);
          if (!videoSrc && arr[0]) videoSrc = arr[0];
          if (!poster && arr[1]) {
            const img = document.createElement("img");
            img.src = arr[1];
            img.alt = "";
            poster = img;
          }
        } catch (e) {
        }
      }
    }
    const contentCell = [];
    if (poster) contentCell.push(poster);
    if (videoSrc) {
      const link = document.createElement("a");
      link.href = videoSrc;
      link.textContent = videoSrc;
      contentCell.push(link);
    }
    if (!contentCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[contentCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "video-centered", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-casestudy.js
  function parse5(element, { document }) {
    let cards = Array.from(element.querySelectorAll(".featuredcard"));
    if (!cards.length) cards = Array.from(element.querySelectorAll("li.cmp-list__item"));
    const cells = [];
    cards.forEach((card) => {
      const image = card.querySelector(".mer-fc-img_wrapper img, .cmp-teaser__image img, .cmp-image img, img");
      const bodyCell = [];
      const eyebrow = card.querySelector(".cmp-teaser__pretitle");
      const title = card.querySelector(".cmp-teaser__title, h1, h2, h3, h4");
      if (eyebrow) bodyCell.push(eyebrow);
      if (title) bodyCell.push(title);
      const wrapper = card.querySelector("a.mer-clickabkle-wrapper, a[href]");
      const ctaText = card.querySelector(".mer-link-text, .mer-teaser__action-container span, .cmp-teaser__action-link");
      if (wrapper && wrapper.getAttribute("href")) {
        const link = document.createElement("a");
        link.href = wrapper.getAttribute("href");
        link.textContent = ctaText && ctaText.textContent.trim() || title && title.textContent.trim() || "Read case";
        bodyCell.push(link);
      } else if (ctaText && ctaText.matches("a[href]")) {
        bodyCell.push(ctaText);
      }
      if (!image && !bodyCell.length) return;
      cells.push([image || "", bodyCell.length ? bodyCell : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-casestudy", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion.js
  function parse6(element, { document }) {
    const rows = [["Accordion"]];
    const items = [...element.querySelectorAll(".cmp-accordion__item")];
    if (items.length > 0) {
      items.forEach((item) => {
        const btn = item.querySelector(".cmp-accordion__button, .cmp-accordion__header, button");
        const panel = item.querySelector('.cmp-accordion__panel, [role="region"]');
        const title = btn ? btn.textContent.trim() : "";
        const titleEl = document.createElement("p");
        titleEl.textContent = title;
        const bodyEl = document.createElement("div");
        if (panel) bodyEl.append(panel.cloneNode(true));
        if (title) rows.push([titleEl, bodyEl]);
      });
    } else {
      const headings = [...element.querySelectorAll("h4, h3, .cmp-accordion__header")];
      headings.forEach((h) => {
        const title = h.textContent.trim();
        let body = h.nextElementSibling;
        while (body && body.textContent.trim() === "" && body.querySelector && body.querySelector("img")) {
          body = body.nextElementSibling;
        }
        const titleEl = document.createElement("p");
        titleEl.textContent = title;
        const bodyEl = document.createElement("div");
        if (body) bodyEl.append(body.cloneNode(true));
        if (title) rows.push([titleEl, bodyEl]);
      });
    }
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }

  // tools/importer/transformers/merkle-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        ".grecaptcha-badge",
        // search page: runtime-only filter/result/pagination scaffolding (hidden
        // <template>-style markup) that belongs to the search block's JS, not to
        // authored content — drop it so it doesn't leak in as default content.
        ".searchfilters",
        ".cmp-searchfilters",
        ".mer-search-filters-results-wrapper"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        ".mer-header-space",
        ".screenreader-header",
        ".grecaptcha-response",
        "textarea",
        "iframe",
        "noscript",
        "source",
        "link",
        '[id^="batBeacon"]'
      ]);
    }
  }

  // tools/importer/transformers/merkle-dm-images.js
  function detectDynamicMediaUrl(urlStr) {
    let u;
    try {
      u = new URL(urlStr, "https://x/");
    } catch (e) {
      return false;
    }
    if (u.pathname.startsWith("/is/image/")) {
      return "scene7";
    }
    if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname) && u.pathname.startsWith("/adobe/assets/urn:")) {
      return "dm-openapi";
    }
    return false;
  }
  var LINKED_DM_INLINE_WRAPPER_TAGS = /* @__PURE__ */ new Set(["PICTURE"]);
  var LINKED_DM_WRAPPER_SIBLING_TAGS = /* @__PURE__ */ new Set(["SOURCE"]);
  function findLinkedDmCarrier(img) {
    if (!img || !img.parentElement) return null;
    let node = img;
    let parent = img.parentElement;
    while (parent && LINKED_DM_INLINE_WRAPPER_TAGS.has(parent.tagName)) {
      let foundNode = false;
      for (const child of parent.children) {
        if (child === node) {
          foundNode = true;
        } else if (!LINKED_DM_WRAPPER_SIBLING_TAGS.has(child.tagName)) {
          return null;
        }
      }
      if (!foundNode) return null;
      node = parent;
      parent = parent.parentElement;
    }
    if (!parent || parent.tagName !== "A") return null;
    if (parent.children.length !== 1 || parent.children[0] !== node) return null;
    if (parent.textContent.trim() !== "") return null;
    return parent;
  }
  var EMPTY_ALT_SENTINEL = "Image without alt text";
  function altToLinkText(alt) {
    return alt || EMPTY_ALT_SENTINEL;
  }
  function transform2(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const doc = element.ownerDocument;
    element.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!detectDynamicMediaUrl(src)) return;
      const alt = img.getAttribute("alt") || "";
      const linkedAnchor = findLinkedDmCarrier(img);
      if (linkedAnchor) {
        linkedAnchor.setAttribute("title", src);
        linkedAnchor.textContent = altToLinkText(alt);
        return;
      }
      const parent = img.parentElement;
      if (parent && parent.tagName === "A") {
        console.warn("DM image inside mixed-content anchor, skipped:", src);
        return;
      }
      const a = doc.createElement("a");
      a.href = src;
      a.textContent = altToLinkText(alt);
      img.replaceWith(a);
    });
  }

  // tools/importer/transformers/merkle-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform3(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = element.ownerDocument.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || querySection(element, section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(element.ownerDocument, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-about-us.js
  var parsers = {
    "carousel-hero": parse,
    "cards-featured": parse2,
    "cards-icon": parse3,
    "video-centered": parse4,
    "cards-casestudy": parse5,
    accordion: parse6
  };
  var PAGE_TEMPLATE = {
    name: "about-us",
    description: "Merkle marketing / about pages: rotating hero carousel, featured editorial card galleries, icon-led feature grid, centered video, and case-study gallery.",
    urls: [
      "https://www.merkle.com/",
      "https://www.merkle.com/en/about-us/history.html"
    ],
    blocks: [
      {
        name: "carousel-hero",
        instances: [".teasercarousel.carousel"]
      },
      {
        name: "cards-featured",
        instances: [".teasergallerylist.mer-featured-tgl"]
      },
      {
        name: "cards-icon",
        instances: [".container.responsivegrid.text-left"]
      },
      {
        name: "video-centered",
        instances: [".video.centered"]
      },
      {
        name: "cards-casestudy",
        instances: [".listcards.teasergallerylist"]
      },
      {
        name: "accordion",
        instances: [".accordion.panelcontainer"]
      }
    ],
    sections: [
      {
        id: "rc2",
        name: "hero",
        selector: [
          ".container.blue-black-background.full-bleed:has(.teasercarousel)"
        ],
        style: null,
        blocks: ["carousel-hero"],
        defaultContent: []
      },
      {
        id: "rc3",
        name: "latest-and-greatest",
        selector: [".container.responsivegrid:has(.mer-featured-tgl)"],
        style: null,
        blocks: ["cards-featured"],
        defaultContent: []
      },
      {
        id: "rc4",
        name: "experience-economy",
        selector: [
          ".container.blue-black-background.full-bleed:has(.listcards)",
          ".container.blue-black-background.full-bleed:has(.video.centered)"
        ],
        style: "dark",
        blocks: ["cards-icon", "video-centered", "cards-casestudy"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    transform2,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform3] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    const seen = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          if (seen.has(element)) return;
          seen.add(element);
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_about_us_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_about_us_exports);
})();
