import type { Language } from "./languages";
import { HE_UI_PATTERNS, HE_UI_PHRASES } from "./locales/he-ui";

// Most of the app's text is written inline in components rather than through
// t() keys. While a non-English language is active, this translator watches
// the DOM and swaps any text node or label attribute whose text exactly
// matches a known English UI string (or template) for its translation. The
// original English is remembered so switching back to English restores it.
//
// Only exact, whole-string matches are replaced, so user content (prompts,
// titles, file names) is left alone. Opt a subtree out with
// `data-no-translate` or `translate="no"`; editable fields are always skipped.

interface Catalog {
  phrases: Map<string, string>;
  patterns: CompiledPattern[];
}

interface CompiledPattern {
  regex: RegExp;
  template: string;
}

const CATALOGS: Partial<Record<Language, Catalog>> = {
  he: compileCatalog(HE_UI_PHRASES, HE_UI_PATTERNS),
};

const TRANSLATED_ATTRIBUTES = ["placeholder", "title", "aria-label", "alt"];

// Subtrees never translated, attributes included.
const SKIPPED_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT"]);
// Elements whose text content is data (a field's value, code), though their
// placeholder / title attributes are still UI text.
const TEXT_SKIPPED_TAGS = new Set([
  "TEXTAREA",
  "INPUT",
  "CODE",
  "PRE",
  "CANVAS",
]);

// Original English per text node / attribute, and the translation we wrote,
// so we can tell our own writes apart from React's.
const textOriginals = new WeakMap<
  Text,
  { original: string; written: string }
>();
const attrOriginals = new WeakMap<
  Element,
  Map<string, { original: string; written: string }>
>();
const translatedTextNodes = new Set<WeakRef<Text>>();
const translatedElements = new Set<WeakRef<Element>>();
// Re-rendered labels leave dead refs behind; sweep them past this size.
const MAX_TRACKED_REFS = 5000;

let activeCatalog: Catalog | undefined;
let observer: MutationObserver | undefined;

/** Translate (or restore) the whole document for the given language. */
export function applyDomTranslation(language: Language) {
  if (
    typeof document === "undefined" ||
    typeof MutationObserver === "undefined"
  ) {
    return;
  }
  const catalog = CATALOGS[language];
  if (catalog === activeCatalog) return;

  restoreAll();
  observer?.disconnect();
  observer = undefined;
  activeCatalog = catalog;
  if (!catalog) return;

  const start = () => {
    if (activeCatalog !== catalog) return;
    translateSubtree(document.body);
    observer = new MutationObserver(handleMutations);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: TRANSLATED_ATTRIBUTES,
    });
  };
  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start, { once: true });
}

/** Translate a single English string with the active catalog, if any. */
export function translateUiText(text: string): string | undefined {
  return activeCatalog ? lookup(activeCatalog, text) : undefined;
}

function handleMutations(mutations: MutationRecord[]) {
  for (const mutation of mutations) {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node) => translateSubtree(node));
    } else if (mutation.type === "characterData") {
      translateTextNode(mutation.target as Text);
    } else if (mutation.type === "attributes" && mutation.attributeName) {
      translateAttribute(mutation.target as Element, mutation.attributeName);
    }
  }
}

function translateSubtree(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root as Text);
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE) return;
  const element = root as Element;
  if (isOptedOut(element)) return;

  translateAttributes(element);
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          isOptedOut(node as Element)
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    },
  );
  let node = walker.nextNode();
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) translateTextNode(node as Text);
    else translateAttributes(node as Element);
    node = walker.nextNode();
  }
}

function translateTextNode(node: Text) {
  if (!activeCatalog) return;
  const value = node.nodeValue ?? "";
  const record = textOriginals.get(node);
  // Our own write echoing back through the observer.
  if (record && record.written === value) return;
  if (!value.trim()) return;
  const parent = node.parentElement;
  if (
    !parent ||
    TEXT_SKIPPED_TAGS.has(parent.tagName.toUpperCase()) ||
    parent.closest("code,pre") !== null ||
    hasOptedOutAncestor(parent)
  ) {
    return;
  }

  const translated = translatePreservingWhitespace(activeCatalog, value);
  if (translated === undefined) {
    textOriginals.delete(node);
    return;
  }
  textOriginals.set(node, { original: value, written: translated });
  track(translatedTextNodes, node);
  node.nodeValue = translated;
}

function translateAttributes(element: Element) {
  for (const name of TRANSLATED_ATTRIBUTES) {
    if (element.hasAttribute(name)) translateAttribute(element, name);
  }
}

function translateAttribute(element: Element, name: string) {
  if (!activeCatalog) return;
  const value = element.getAttribute(name);
  if (!value) return;
  let records = attrOriginals.get(element);
  const record = records?.get(name);
  if (record && record.written === value) return;
  if (hasOptedOutAncestor(element)) return;

  const translated = lookup(activeCatalog, value.trim());
  if (translated === undefined) {
    records?.delete(name);
    return;
  }
  if (!records) {
    records = new Map();
    attrOriginals.set(element, records);
  }
  records.set(name, { original: value, written: translated });
  track(translatedElements, element);
  element.setAttribute(name, translated);
}

function track<T extends object>(refs: Set<WeakRef<T>>, target: T) {
  if (refs.size >= MAX_TRACKED_REFS) {
    refs.forEach((ref) => {
      const live = ref.deref();
      if (!live || !(live as unknown as Node).isConnected) refs.delete(ref);
    });
  }
  refs.add(new WeakRef(target));
}

function restoreAll() {
  for (const ref of translatedTextNodes) {
    const node = ref.deref();
    const record = node && textOriginals.get(node);
    if (node && record && node.nodeValue === record.written) {
      node.nodeValue = record.original;
    }
    if (node) textOriginals.delete(node);
  }
  translatedTextNodes.clear();

  for (const ref of translatedElements) {
    const element = ref.deref();
    const records = element && attrOriginals.get(element);
    if (!element || !records) continue;
    records.forEach((record, name) => {
      if (element.getAttribute(name) === record.written) {
        element.setAttribute(name, record.original);
      }
    });
    attrOriginals.delete(element);
  }
  translatedElements.clear();
}

function translatePreservingWhitespace(
  catalog: Catalog,
  value: string,
): string | undefined {
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  const core = value.trim().replace(/\s+/g, " ");
  const translated = lookup(catalog, core);
  return translated === undefined ? undefined : leading + translated + trailing;
}

function lookup(catalog: Catalog, text: string): string | undefined {
  const phrase = catalog.phrases.get(text);
  if (phrase !== undefined) return phrase;
  for (const pattern of catalog.patterns) {
    const match = pattern.regex.exec(text);
    if (match) {
      return pattern.template.replace(/\{(\d+)\}/g, (_, index: string) => {
        // Filled-in values are often UI words too ("Main Track").
        const value = match[Number(index) + 1] ?? "";
        return catalog.phrases.get(value) ?? value;
      });
    }
  }
  return undefined;
}

function isOptedOut(element: Element): boolean {
  if (SKIPPED_TAGS.has(element.tagName.toUpperCase())) return true;
  if (element.hasAttribute("data-no-translate")) return true;
  if (element.getAttribute("translate") === "no") return true;
  if ((element as HTMLElement).isContentEditable) return true;
  return false;
}

function hasOptedOutAncestor(element: Element): boolean {
  return (
    element.closest(
      "[data-no-translate],[translate='no'],[contenteditable='true'],[contenteditable=''],script,style,noscript",
    ) !== null
  );
}

function compileCatalog(
  phrases: Record<string, string>,
  patterns: Record<string, string>,
): Catalog {
  return {
    phrases: new Map(Object.entries(phrases)),
    patterns: Object.entries(patterns).map(([source, template]) => ({
      regex: new RegExp(
        "^" +
          source
            .split(/\{\d+\}/)
            .map(escapeRegExp)
            .join("(.+?)") +
          "$",
      ),
      template,
    })),
  };
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
