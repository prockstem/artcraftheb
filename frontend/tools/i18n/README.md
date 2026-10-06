# Translations (Hebrew)

ArtCraft supports English and Hebrew. Users switch under
**Settings → General → Language**; the choice is stored in `localStorage`
(`st-language`) and Hebrew switches the whole app to right-to-left.

Everything lives in `libs/common/src/lib/i18n` (exported from
`@storyteller/common`).

## How text gets translated

There are two layers:

| Layer          | Where                                   | Used for                                     |
| -------------- | --------------------------------------- | -------------------------------------------- |
| Keyed strings  | `locales/en.ts`, `locales/he.ts`        | Text rendered with `useTranslation().t(key)` |
| DOM translator | `dom-translator.ts`, `locales/he-ui.ts` | All other inline English text in components  |

**Keyed strings** are type-checked: every key in `en.ts` must exist in
`he.ts`. Prefer them for new UI and anything with grammar that depends on
values (plurals, word order):

```tsx
import { useTranslation } from "@storyteller/common";

const { t } = useTranslation();
<Button>{t("common.retry")}</Button>;
```

Outside React use `translate("common.retry")`.

**The DOM translator** covers the rest of the app without touching each
component. While Hebrew is active it watches the page and replaces any text
node or `placeholder` / `title` / `aria-label` / `alt` attribute whose text
_exactly_ matches an English entry in `he-ui.ts`. Templates such as
`"Uploading {0} / {1}..."` are matched too. Switching back to English restores
the original text. Because only exact matches are replaced, user content
(prompts, titles, file names) is never translated.

To keep a subtree out of translation, add `data-no-translate` (or
`translate="no"`). Text fields and `contenteditable` regions are always
skipped.

## Adding or changing UI text

After adding English UI text, run:

```sh
node tools/i18n/extract-ui-strings.cjs
```

It lists visible English strings that have no Hebrew yet, with the file each
came from. Then either:

- add the Hebrew to `libs/common/src/lib/i18n/locales/he-ui.ts`, or
- add the string to `tools/i18n/keep-english.json` if it should stay in
  English (model names, brands, keyboard keys, preset/asset names).

`--all` prints every candidate string instead.

## Right-to-left layout

- Use logical Tailwind classes (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`,
  `text-start`, `border-s`, `rounded-s`) rather than `ml-`/`left-`/`text-left`.
  They behave identically in English and mirror in Hebrew.
- Keep physical `left`/`right` for things positioned by coordinates (timeline
  playheads, canvas overlays, centered `left-1/2 -translate-x-1/2`).
- The video editor timeline is pinned to `dir="ltr"`: time runs left to right
  in both languages.
- Left/right arrow and chevron icons mirror automatically in RTL
  (`apps/artcraft/app/src/styles/base.css`).
