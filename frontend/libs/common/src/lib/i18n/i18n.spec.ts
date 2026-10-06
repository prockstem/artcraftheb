import { act, renderHook } from "@testing-library/react";
import {
  getLanguage,
  isTranslationKey,
  setLanguage,
  translate,
  useTranslation,
} from "./i18n";
import { en } from "./locales/en";
import { he } from "./locales/he";

describe("i18n", () => {
  afterEach(() => {
    act(() => setLanguage("en"));
  });

  it("defaults to English, left-to-right", () => {
    expect(getLanguage()).toBe("en");
    expect(translate("topbar.settings")).toBe("Settings");
    expect(document.documentElement.dir).toBe("ltr");
  });

  it("switches to Hebrew, sets RTL and persists the choice", () => {
    setLanguage("he");
    expect(translate("topbar.settings")).toBe("הגדרות");
    expect(document.documentElement.lang).toBe("he");
    expect(document.documentElement.dir).toBe("rtl");
    expect(localStorage.getItem("st-language")).toBe("he");
  });

  it("interpolates variables", () => {
    expect(translate("login.copyright", { year: 2026 })).toBe(
      "2026 ArtCraft. All rights reserved.",
    );
  });

  it("re-renders hook consumers when the language changes", () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current.t("settings.title")).toBe("Settings");
    act(() => setLanguage("he"));
    expect(result.current.t("settings.title")).toBe("הגדרות");
    expect(result.current.dir).toBe("rtl");
  });

  it("narrows dynamic keys", () => {
    expect(isTranslationKey("apps.angles.label")).toBe(true);
    expect(isTranslationKey("apps.unknown.label")).toBe(false);
  });

  it("has a non-empty Hebrew string for every English key", () => {
    for (const key of Object.keys(en) as (keyof typeof en)[]) {
      expect(he[key]?.trim()).toBeTruthy();
    }
  });
});
