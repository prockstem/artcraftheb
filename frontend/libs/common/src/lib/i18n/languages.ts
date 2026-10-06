export type Language = "en" | "he";

export type TextDirection = "ltr" | "rtl";

export interface LanguageDescriptor {
  id: Language;
  /** The language's name written in that language, e.g. "עברית". */
  nativeName: string;
  /** The language's name in English, e.g. "Hebrew". */
  englishName: string;
  dir: TextDirection;
}

export const DEFAULT_LANGUAGE: Language = "en";

export const LANGUAGES: LanguageDescriptor[] = [
  { id: "en", nativeName: "English", englishName: "English", dir: "ltr" },
  { id: "he", nativeName: "עברית", englishName: "Hebrew", dir: "rtl" },
];

export const isLanguage = (value: unknown): value is Language =>
  LANGUAGES.some((language) => language.id === value);

export const getLanguageDirection = (language: Language): TextDirection =>
  LANGUAGES.find((l) => l.id === language)?.dir ?? "ltr";
