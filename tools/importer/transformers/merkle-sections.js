/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: assemble the output page from an ordered list of sections.
 * payload.sections = [{ style, nodes: [...] }] — each section's nodes (default
 * content or blocks) are appended to the element, followed by a Section
 * Metadata block when the section has a style. Sections are separated by <hr>,
 * which the importer turns into section breaks.
 */
export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;
  const { document, sections } = payload || {};
  if (!document || !Array.isArray(sections)) return;
  sections.forEach((section, i) => {
    if (i > 0) element.append(document.createElement('hr'));
    (section.nodes || []).filter(Boolean).forEach((n) => element.append(n));
    if (section.style) {
      element.append(WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      }));
    }
  });
}
