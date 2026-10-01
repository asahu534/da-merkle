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

  // tools/importer/import-capability.js
  var import_capability_exports = {};
  __export(import_capability_exports, {
    default: () => import_capability_default
  });

  // tools/importer/transformers/merkle-cleanup.js
  function transform(hookName, element) {
    if (hookName !== "beforeTransform") return;
    WebImporter.DOMUtils.remove(element, [
      "header",
      "footer",
      ".header",
      ".footer",
      "nav",
      "#onetrust-consent-sdk",
      "#onetrust-banner-sdk",
      ".ot-sdk-container",
      "script",
      "style",
      "noscript",
      "iframe",
      "link",
      ".cmp-experiencefragment--header",
      ".cmp-experiencefragment--footer",
      ".s7-video-viewer",
      ".s7container"
    ]);
    [...element.querySelectorAll(".aem-Grid > div")].forEach((el) => {
      const view = el.ownerDocument.defaultView;
      if (view && view.getComputedStyle(el).display === "none") el.remove();
    });
  }

  // tools/importer/transformers/merkle-dm-images.js
  var EMPTY_ALT = "Image without alt text";
  function dmUrlFor(img) {
    let src = img.currentSrc || img.src || img.getAttribute("src") || "";
    if (!/\/is\/image\//.test(src) || src.includes("{.width}")) {
      const holder = img.closest("[data-cmp-src]");
      const alt = holder && holder.getAttribute("data-cmp-src");
      if (alt && /\/is\/image\//.test(alt)) src = alt;
    }
    if (!/\/is\/image\//.test(src)) return null;
    try {
      const u = new URL(src, "https://assets.merkle.com");
      const keep = new URLSearchParams();
      ["op_sharpen", "op_usm"].forEach((k) => {
        if (u.searchParams.has(k)) keep.set(k, u.searchParams.get(k));
      });
      const q = keep.toString();
      return `${u.origin}${u.pathname}${q ? `?${q}` : ""}`;
    } catch (e) {
      return null;
    }
  }
  function dmify(root, document) {
    [...root.querySelectorAll("img")].forEach((img) => {
      const dm = dmUrlFor(img);
      if (!dm) return;
      const alt = (img.getAttribute("alt") || "").trim() || EMPTY_ALT;
      const target = img.closest("picture") || img;
      const link = img.closest("a[href]");
      if (link && link.contains(target) && !/\/is\/image\//.test(link.getAttribute("href"))) {
        link.setAttribute("title", dm);
        link.textContent = alt;
        return;
      }
      const a = document.createElement("a");
      a.href = dm;
      a.textContent = alt;
      target.replaceWith(a);
    });
  }
  function transform2(hookName, element, payload) {
    if (hookName === "afterTransform") dmify(element, payload.document);
  }

  // tools/importer/transformers/merkle-sections.js
  function transform3(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const { document, sections } = payload || {};
    if (!document || !Array.isArray(sections)) return;
    sections.forEach((section, i) => {
      if (i > 0) element.append(document.createElement("hr"));
      (section.nodes || []).filter(Boolean).forEach((n) => element.append(n));
      if (section.style) {
        element.append(WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        }));
      }
    });
  }

  // tools/importer/parsers/merkle-parts.js
  var clean = (t) => (t || "").replace(/[\u200b-\u200d\ufeff]/g, "").replace(/\s+/g, " ").trim();
  function linkText(a) {
    const label = a.getAttribute("aria-label") || (a.querySelector(".cmp-button__text, .mer-link-text, span") || {}).textContent || a.textContent;
    let text = clean(label);
    const half = text.length / 2;
    if (text.length > 1 && text.slice(0, Math.floor(half)).trim() === text.slice(Math.ceil(half)).trim()) {
      text = text.slice(0, Math.floor(half)).trim();
    }
    return text;
  }
  function linkPara(document, a, remap = {}) {
    if (!a) return null;
    const href = a.getAttribute("href") || "";
    const p = document.createElement("p");
    const link = document.createElement("a");
    link.href = remap[href] || href;
    link.textContent = linkText(a);
    p.append(link);
    return p;
  }
  function para(document, text) {
    const t = clean(text);
    if (!t) return null;
    const p = document.createElement("p");
    p.textContent = t;
    return p;
  }
  function heading(document, tag, text) {
    const t = clean(text);
    if (!t) return null;
    const h = document.createElement(tag);
    h.textContent = t;
    return h;
  }
  function paras(document, el) {
    if (!el) return [];
    const ps = [...el.querySelectorAll("p")].map((p) => para(document, p.textContent)).filter(Boolean);
    if (ps.length) return ps;
    const one = para(document, el.textContent);
    return one ? [one] : [];
  }
  function teaserParts(teaser) {
    const titleEl = teaser.querySelector(".cmp-teaser__title");
    return {
      eyebrow: clean((teaser.querySelector(".cmp-teaser__pretitle") || {}).textContent),
      title: clean(titleEl && titleEl.textContent),
      titleTag: titleEl && /^H[1-6]$/.test(titleEl.tagName) ? titleEl.tagName.toLowerCase() : "h2",
      desc: teaser.querySelector(".cmp-teaser__description"),
      links: [...teaser.querySelectorAll("a.cmp-teaser__action-link")],
      img: teaser.querySelector(".cmp-teaser__image img, img")
    };
  }
  function teaserNodes(document, teaser, { tag, remap } = {}) {
    const t = teaserParts(teaser);
    return [
      t.eyebrow ? para(document, t.eyebrow) : null,
      heading(document, tag || t.titleTag, t.title),
      ...paras(document, t.desc),
      ...t.links.map((a) => linkPara(document, a, remap))
    ].filter(Boolean);
  }
  function imgClone(document, img) {
    if (!img) return null;
    let src = img.currentSrc || img.src || img.getAttribute("src") || "";
    if (!/\/is\/image\//.test(src) || src.includes("{.width}")) {
      const holder = img.closest("[data-cmp-src]");
      const dm = holder && holder.getAttribute("data-cmp-src");
      if (dm && /\/is\/image\//.test(dm)) src = dm;
    }
    const out = document.createElement("img");
    out.src = src;
    out.alt = img.getAttribute("alt") || "";
    return out;
  }
  function block(document, name, rows) {
    return WebImporter.Blocks.createBlock(document, { name, cells: rows });
  }

  // tools/importer/parsers/cards-grid.js
  function parse(document, option, cards) {
    const name = option ? `Cards Grid (${option})` : "Cards Grid";
    const withImages = cards.some((c) => c.image);
    const rows = withImages ? cards.map((c) => [c.image || "", c.body]) : cards.map((c) => [c.body]);
    return block(document, name, rows);
  }
  function statsCards(document, infographics) {
    return [...infographics.querySelectorAll("li")].map((li) => ({
      body: [
        para(document, (li.querySelector(".cmp-infographic__content-title") || {}).textContent),
        para(document, (li.querySelector(".cmp-infographic__content-text") || {}).textContent)
      ].filter(Boolean)
    }));
  }
  function textCards(document, container) {
    const grid = container.querySelector(".aem-Grid");
    return [...grid.children].map((item) => {
      const text = item.matches(".text") ? item : item.querySelector(".text");
      if (!text) return null;
      const h = text.querySelector("h1, h2, h3, h4, h5, h6");
      const body = [
        h ? heading(document, "h5", h.textContent) : null,
        ...[...text.querySelectorAll("p")].map((p) => para(document, p.textContent)),
        ...[...item.querySelectorAll("a.cmp-button")].map((a) => linkPara(document, a))
      ].filter(Boolean);
      return body.length ? { body } : null;
    }).filter(Boolean);
  }
  function awardCards(document, items) {
    return items.map((item) => {
      const h = item.querySelector("h6, h5, h4");
      const label = h ? [...h.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(" ") : "";
      const desc = h && h.querySelector("span") ? h.querySelector("span").textContent : "";
      const strong = document.createElement("strong");
      strong.textContent = label.replace(/\s+/g, " ").trim();
      const labelP = document.createElement("p");
      labelP.append(strong);
      return {
        image: imgClone(document, item.querySelector("img")),
        body: [
          strong.textContent ? labelP : null,
          para(document, desc),
          ...[...item.querySelectorAll("a.cmp-button")].map((a) => linkPara(document, a))
        ].filter(Boolean)
      };
    });
  }
  function logoCards(document, logos) {
    return logos.map((logo) => {
      const src = logo.querySelector("a[href]");
      const img = imgClone(document, logo.querySelector("img"));
      let image = img;
      if (src && img) {
        image = document.createElement("a");
        image.href = src.getAttribute("href");
        image.append(img);
      }
      return {
        image,
        body: [para(document, (logo.querySelector(".cmp-image__title") || {}).textContent)].filter(Boolean)
      };
    });
  }

  // tools/importer/parsers/columns-media.js
  function parse2(document, teasers, { options = ["media"], headingTag, remap } = {}) {
    const rows = teasers.map((teaser, i) => {
      const text = teaserNodes(document, teaser, { tag: i === 0 && headingTag ? headingTag : "h2", remap });
      const img = imgClone(document, teaserParts(teaser).img);
      return [text, img || ""];
    });
    return block(document, `Columns (${options.join(", ")})`, rows);
  }

  // tools/importer/parsers/cards-casestudy.js
  function cardRows(document, list) {
    let items = [...list.querySelectorAll(".featuredcard")];
    if (!items.length) items = [...list.querySelectorAll("li.cmp-list__item")];
    return items.map((item) => {
      const wrapper = item.closest("a[href]") || item.querySelector("a[href]");
      const href = wrapper ? wrapper.getAttribute("href") : "";
      const cta = (item.querySelector(".mer-link-text, .cmp-teaser__action-text, .mer-teaser__action-container span") || {}).textContent;
      const body = [
        para(document, (item.querySelector(".cmp-teaser__pretitle") || {}).textContent),
        heading(document, "h3", (item.querySelector(".cmp-teaser__title") || {}).textContent)
      ].filter(Boolean);
      if (href) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = href;
        a.textContent = (cta || "").replace(/\s+/g, " ").trim() || "Learn more";
        p.append(a);
        body.push(p);
      }
      const img = imgClone(document, item.querySelector("img"));
      return img ? [img, body] : [body];
    });
  }
  function parse3(document, list, name = "Cards Casestudy") {
    return block(document, name, cardRows(document, list));
  }

  // tools/importer/import-capability.js
  var byText = (els, re) => [...els].find((el) => re.test(el.textContent));
  function targetPath(originalURL) {
    const p = new URL(originalURL).pathname.replace(/\.html?$/, "").replace(/\/$/, "");
    return WebImporter.FileUtils.sanitizePath(p.replace(/^\/en(?=\/)/, "") || "/index");
  }
  var import_capability_default = {
    transform: ({ document, url, params }) => {
      const body = document.body;
      transform("beforeTransform", body);
      const q = (s) => body.querySelector(s);
      const qa = (s) => [...body.querySelectorAll(s)];
      const found = [];
      const use = (name, node) => {
        if (node) found.push(name);
        return node;
      };
      const hero = q(".teaser.cmp-teaser-layout-media.mer-full-bleed");
      const intro = q(".teaser.cmp-teaser-layout-medium.cmp-teaser-dark");
      const [stats1, stats2] = qa(".infographics");
      const expertiseHead = byText(qa(".teaser.cmp-teaser-layout-large"), /areas of expertise/i);
      const textContainer = q(".container.white-background.full-bleed");
      const awards = qa(".container.text-center").filter((c) => c.querySelector("img") && c.querySelector("h6"));
      const success = q(".listcards.teasergallerylist");
      const partnersHead = q(".teaser.cmp-teaser-layout-large.cmp-teaser-blue-black");
      const logos = qa(".image.logo-style");
      const moreHead = byText(qa(".teaser.cmp-teaser-layout-medium"), /More on this topic/i);
      const ebook = q(".teaser.cmp-teaser-layout-media.cmp-teaser-blue-black");
      const related = qa(".teasergallerylist").find((l) => !l.matches(".listcards, .mer-featured-tgl"));
      const successTitle = success && (success.querySelector("h2") || {}).textContent;
      const sections = [
        { style: "navy", nodes: [hero && use("columns (media, hero)", parse2(document, [hero], { options: ["media", "hero"], headingTag: "h1" }))] },
        { style: "navy, split", nodes: [
          ...intro ? teaserNodes(document, intro, { tag: "h2" }) : [],
          stats1 && use("cards-grid (stats)", parse(document, "stats", statsCards(document, stats1)))
        ] },
        { style: "center", nodes: [
          ...expertiseHead ? teaserNodes(document, expertiseHead, { tag: "h2" }) : [],
          textContainer && use("cards-grid (text)", parse(document, "text", textCards(document, textContainer))),
          awards.length && use("cards-grid (logos) awards", parse(document, "logos", awardCards(document, awards)))
        ] },
        { style: "navy", nodes: [
          heading(document, "h2", successTitle),
          success && use("cards-casestudy (success)", parse3(document, success, "Cards Casestudy (rounded, heading-left)"))
        ] },
        { style: "dark, center", nodes: [
          ...partnersHead ? teaserNodes(document, partnersHead, { tag: "h2" }) : [],
          logos.length && use("cards-grid (logos) partners", parse(document, "logos", logoCards(document, logos))),
          stats2 && use("cards-grid (stats) partners", parse(document, "stats", statsCards(document, stats2)))
        ] },
        { style: null, nodes: [...moreHead ? teaserNodes(document, moreHead, { tag: "h2" }) : []] },
        { style: null, nodes: [ebook && use("columns (media, rounded) ebook", parse2(document, [ebook], { options: ["media", "rounded"] }))] },
        { style: null, nodes: [related && use("cards-casestudy (related)", parse3(document, related, "Cards Casestudy (rounded, arrows-right)"))] }
      ].map((s) => __spreadProps(__spreadValues({}, s), { nodes: s.nodes.filter(Boolean) })).filter((s) => s.nodes.length);
      const main = document.createElement("div");
      transform3("afterTransform", main, { document, sections });
      transform2("afterTransform", main, { document });
      main.append(document.createElement("hr"));
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      return [{
        element: main,
        path: targetPath(params.originalURL),
        report: { title: document.title, template: "capability", blocks: found }
      }];
    }
  };
  return __toCommonJS(import_capability_exports);
})();
