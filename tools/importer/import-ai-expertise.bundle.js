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

  // tools/importer/import-ai-expertise.js
  var import_ai_expertise_exports = {};
  __export(import_ai_expertise_exports, {
    default: () => import_ai_expertise_default
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
  function peopleCards(document, items) {
    return items.map((item) => {
      const p = item.querySelector(".text p") || item.querySelector(".text");
      const lines = (p ? p.innerText || p.textContent : "").split("\n").map((l) => l.trim()).filter(Boolean);
      const name = document.createElement("strong");
      name.textContent = lines.shift() || "";
      const nameP = document.createElement("p");
      nameP.append(name);
      return {
        image: imgClone(document, item.querySelector("img")),
        body: [nameP, ...lines.map((l) => para(document, l))].filter(Boolean)
      };
    });
  }
  function promoCards(document, teasers, remap) {
    return teasers.map((t) => ({ body: teaserNodes(document, t, { tag: "h3", remap }) }));
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

  // tools/importer/parsers/hero-video.js
  function parse3(document, teaser, { videoUrl, posterUrl, remap }) {
    const poster = document.createElement("img");
    poster.src = posterUrl;
    poster.alt = "";
    const link = document.createElement("a");
    link.href = videoUrl;
    link.textContent = videoUrl;
    const linkP = document.createElement("p");
    linkP.append(link);
    return block(document, "Hero (video)", [
      [[poster, linkP]],
      // background: poster + video link
      [teaserNodes(document, teaser, { tag: "h1", remap })]
      // title, text, CTA
    ]);
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
  function parse4(document, list, name = "Cards Casestudy") {
    return block(document, name, cardRows(document, list));
  }

  // tools/importer/parsers/cards-featured.js
  function parse5(document, list) {
    return parse4(document, list, "Cards Featured");
  }

  // tools/importer/parsers/video-centered.js
  function parse6(document, videoComponent) {
    const video = videoComponent.querySelector("video");
    if (!video) return null;
    const src = video.currentSrc || video.getAttribute("src") || (video.querySelector("source") || {}).src || "";
    if (!src || src.startsWith("blob:")) return null;
    const cell = [];
    if (video.poster) {
      const poster = document.createElement("img");
      poster.src = video.poster;
      poster.alt = "";
      cell.push(poster);
    }
    const a = document.createElement("a");
    a.href = src;
    a.textContent = src;
    cell.push(a);
    return block(document, "Video Centered", [[cell]]);
  }

  // tools/importer/import-ai-expertise.js
  var HERO_VIDEO = "/media/ai-expertise-hero.mp4";
  var HERO_POSTER = "https://s7d1.scene7.com/is/image/merkle/Merkle-GTM-Motion_Vignette-01-AVS";
  var REMAP = {
    "#insights": "#ai-essentials-for-business-leaders",
    "#enterprise": "#ai-for-enterprise",
    "#customer": "#ai-for-customer-experience"
  };
  var byText = (els, re) => [...els].find((el) => re.test(el.textContent));
  function targetPath(originalURL) {
    const p = new URL(originalURL).pathname.replace(/\.html?$/, "").replace(/\/$/, "");
    return WebImporter.FileUtils.sanitizePath(p.replace(/^\/en(?=\/)/, "") || "/index");
  }
  function peopleGroups(document, body, startAfter) {
    const grid = startAfter && startAfter.parentElement;
    if (!grid) return [];
    const kids = [...grid.children];
    const groups = [];
    kids.slice(kids.indexOf(startAfter) + 1).forEach((el) => {
      if (el.matches(".title")) {
        groups.push({ title: el.textContent, items: [] });
      } else if (el.matches(".container") && el.querySelector("img") && el.querySelector(".text") && groups.length) {
        groups[groups.length - 1].items.push(el);
      }
    });
    return groups.filter((g) => g.items.length);
  }
  var import_ai_expertise_default = {
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
      const hero = q(".teaser.cmp-teaser-layout-hero");
      const promos = qa(".teaser.cmp-teaser-layout-card");
      const largeHeads = qa(".teaser.cmp-teaser-layout-large");
      const entHead = byText(largeHeads, /AI for Enterprise/i);
      const cxHead = byText(largeHeads, /AI for Customer Experience/i);
      const insightsHead = byText(largeHeads, /AI Essentials/i);
      const partnersHead = byText(largeHeads, /Better together/i);
      const teamHead = largeHeads.find((t) => /Meet our team/.test(t.textContent));
      const mediaBlack = qa(".teaser.cmp-teaser-layout-media.cmp-teaser-blue-black");
      const forbes = byText(mediaBlack, /Forbes/i);
      const enterprise = mediaBlack.filter((t) => t !== forbes);
      const customer = qa(".teaser.cmp-teaser-layout-media.grey-background");
      const gallery = q(".teasergallerylist.mer-featured-tgl");
      const video = qa(".video").find((v) => !v.closest(".teaser"));
      const groups = peopleGroups(document, body, teamHead);
      const sections = [
        { style: null, nodes: [hero && use("hero (video)", parse3(document, hero, { videoUrl: HERO_VIDEO, posterUrl: HERO_POSTER, remap: REMAP }))] },
        { style: null, nodes: [promos.length && use("cards-grid (promo, rounded)", parse(document, "promo, rounded", promoCards(document, promos, REMAP)))] },
        // heading bands are full-width colour sections; the case studies below
        // them are rounded cards on white (as on the source)
        { style: "dark, center", nodes: [...entHead ? teaserNodes(document, entHead, { tag: "h2" }) : []] },
        { style: null, nodes: [enterprise.length && use("columns (media, rounded) enterprise", parse2(document, enterprise, { options: ["media", "rounded"] }))] },
        { style: "grey, center", nodes: [...cxHead ? teaserNodes(document, cxHead, { tag: "h2" }) : []] },
        { style: null, nodes: [customer.length && use("columns (media, rounded, grey) customer", parse2(document, customer, { options: ["media", "rounded", "grey"] }))] },
        { style: "navy, center", nodes: [...insightsHead ? teaserNodes(document, insightsHead, { tag: "h2" }) : []] },
        { style: null, nodes: [gallery && use("cards-featured", parse5(document, gallery))] },
        { style: null, nodes: [forbes && use("columns (media, rounded) forbes", parse2(document, [forbes], { options: ["media", "rounded"] }))] },
        { style: "navy, center", nodes: [...partnersHead ? teaserNodes(document, partnersHead, { tag: "h2" }) : []] },
        { style: null, nodes: [video && use("video-centered", parse6(document, video))] },
        { style: "navy, center", nodes: [...teamHead ? teaserNodes(document, teamHead, { tag: "h2" }) : []] },
        { style: null, nodes: groups.flatMap((g) => [
          heading(document, "h3", g.title),
          use(`cards-grid (people) ${g.title.trim()}`, parse(document, "people", peopleCards(document, g.items)))
        ]) }
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
        report: { title: document.title, template: "ai-expertise", blocks: found }
      }];
    }
  };
  return __toCommonJS(import_ai_expertise_exports);
})();
