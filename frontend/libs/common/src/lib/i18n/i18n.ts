import { useCallback, useSyncExternalStore } from "react";
import {
  DEFAULT_LANGUAGE,
  getLanguageDirection,
  isLanguage,
  type Language,
  type TextDirection,
} from "./languages";
import {
  en,
  type TranslationDictionary,
  type TranslationKey,
} from "./locales/en";
import { he } from "./locales/he";
import { applyDomTranslation } from "./dom-translator";

const LANGUAGE_STORAGE_KEY = "st-language";

const DICTIONARIES: Record<Language, TranslationDictionary> = { en, he };

type TranslationVars = Record<string, string | number>;

export type TranslateFn = (
  key: TranslationKey,
  vars?: TranslationVars,
) => string;

let currentLanguage: Language = readStoredLanguage();
const listeners = new Set<() => void>();

applyDocumentLanguage(currentLanguage);

export const getLanguage = (): Language => currentLanguage;

export const setLanguage = (language: Language) => {
  if (language === currentLanguage) return;
  currentLanguage = language;
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Storage can be unavailable (private mode, tests); the choice still
    // applies for this session.
  }
  applyDocumentLanguage(language);
  listeners.forEach((listener) => listener());
};

export const subscribeLanguage = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** Narrows a dynamically built key (e.g. from an id) to a known key. */
export const isTranslationKey = (key: string): key is TranslationKey =>
  Object.prototype.hasOwnProperty.call(en, key);

/** Translate outside React (stores, toasts, module-level helpers). */
export const translate: TranslateFn = (key, vars) =>
  interpolate(DICTIONARIES[currentLanguage][key] ?? en[key] ?? key, vars);

/** Translate inside React; re-renders the component when the language changes. */
export const useTranslation = () => {
  const language = useSyncExternalStore(
    subscribeLanguage,
    getLanguage,
    () => DEFAULT_LANGUAGE,
  );
  const t = useCallback<TranslateFn>(
    (key, vars) =>
      interpolate(DICTIONARIES[language][key] ?? en[key] ?? key, vars),
    [language],
  );
  const dir: TextDirection = getLanguageDirection(language);
  return { t, language, dir, setLanguage };
};

function interpolate(template: string, vars?: TranslationVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

function readStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isLanguage(stored) ? stored : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

function applyDocumentLanguage(language: Language) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.lang = language;
  root.dir = getLanguageDirection(language);
  applyDomTranslation(language);
}
