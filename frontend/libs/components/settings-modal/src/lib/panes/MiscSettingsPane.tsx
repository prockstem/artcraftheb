import { CheckIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Label } from "@storyteller/ui-label";
import { Switch } from "@storyteller/ui-switch";
import { useEnterToGenerateStore } from "@storyteller/ui-promptbox";
import { useModelPickerStyleStore } from "@storyteller/ui-popover";
import { useKeybindsStore } from "@storyteller/keybinds";
import { LANGUAGES, useTranslation } from "@storyteller/common";

interface MiscSettingsPaneProps {}

export const MiscSettingsPane = (args: MiscSettingsPaneProps) => {
  const { t, language, setLanguage } = useTranslation();

  const enterToGenerate = useEnterToGenerateStore((s) => s.enabled);
  const setEnterToGenerate = useEnterToGenerateStore((s) => s.setEnabled);

  const modelPickerStyle = useModelPickerStyleStore((s) => s.style);
  const setModelPickerStyle = useModelPickerStyleStore((s) => s.setStyle);

  const cheatsheetSticky = useKeybindsStore((s) => s.cheatsheetSticky);
  const setCheatsheetSticky = useKeybindsStore((s) => s.setCheatsheetSticky);

  return (
    <div className="space-y-4 text-base-fg">
      <div className="flex flex-col gap-2 pt-3">
        <div className="flex flex-col gap-0.5">
          <Label>{t("settings.language.label")}</Label>
          <p className="text-xs opacity-70">
            {t("settings.language.description")}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {LANGUAGES.map((option) => {
            const isSelected = language === option.id;
            return (
              <button
                key={option.id}
                lang={option.id}
                dir={option.dir}
                className={twMerge(
                  "flex items-center gap-3 border p-2 text-start transition-colors duration-100",
                  isSelected
                    ? "border-base-fg/70 bg-base-fg/10"
                    : "border-ui-panel-border bg-base-fg/[0.03] hover:border-base-fg/30 hover:bg-base-fg/[0.06]",
                )}
                onClick={() => setLanguage(option.id)}
                aria-pressed={isSelected}
              >
                <span className="flex-1 text-sm font-semibold">
                  {option.nativeName}
                </span>
                {isSelected && (
                  <CheckIcon aria-hidden className="me-1 h-3.5 w-3.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-2 pt-3">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="enter-to-generate">
            {t("settings.general.enterToGenerate")}
          </Label>
          <p className="text-xs opacity-70">
            {t("settings.general.enterToGenerateDescription")}
          </p>
        </div>
        <Switch enabled={enterToGenerate} setEnabled={setEnterToGenerate} />
      </div>
      <div className="flex flex-col gap-2 pt-3">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="group-models-by-family">
            {t("settings.general.groupModels")}
          </Label>
          <p className="text-xs opacity-70">
            {t("settings.general.groupModelsDescription")}
          </p>
        </div>
        <Switch
          enabled={modelPickerStyle === "grouped"}
          setEnabled={(on) => setModelPickerStyle(on ? "grouped" : "flat")}
        />
      </div>
      <div className="flex flex-col gap-2 pt-3">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="cheatsheet-sticky">
            {t("settings.general.cheatsheetSticky")}
          </Label>
          <p className="text-xs opacity-70">
            {t("settings.general.cheatsheetStickyDescription")}
          </p>
        </div>
        <Switch enabled={cheatsheetSticky} setEnabled={setCheatsheetSticky} />
      </div>
    </div>
  );
};
