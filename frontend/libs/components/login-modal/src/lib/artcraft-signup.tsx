import React, { useState, useEffect } from "react";
import { Input } from "@storyteller/ui-input";
import { Button } from "@storyteller/ui-button";
import { EyeIcon, EyeOffIcon, LoaderCircleIcon, TriangleAlertIcon } from "lucide-react";
import { DynamicIcon } from "@storyteller/icons";
import { useTranslation } from "@storyteller/common";

interface ArtCraftSignUpProps {
  onSubmit: (
    username: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  ) => void;
  isSignUp: boolean;
  onToggleMode: () => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
  errorMessage?: string;
  isLoading?: boolean;
}

const FIELD_LABEL =
  "block font-mono text-[11px] font-semibold leading-4 uppercase tracking-[0.12em] text-white/70";
const FIELD_INPUT =
  "h-10 w-full rounded-[3px] border border-white/15 bg-white/5 px-4 py-2 text-sm font-normal leading-5 text-white placeholder-white/20 outline-none transition-colors focus:border-white/40";

export const ArtCraftSignUp = ({
  onSubmit,
  isSignUp,
  onToggleMode,
  formRef,
  errorMessage,
  isLoading = false,
}: ArtCraftSignUpProps) => {
  const { t } = useTranslation();
  const [localError, setLocalError] = useState<string | undefined>(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setLocalError(
        errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1),
      );
    } else {
      setLocalError(undefined);
    }
  }, [errorMessage]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (isSignUp) {
      const username = (form.elements.namedItem("username") as HTMLInputElement)
        .value;
      const email = (form.elements.namedItem("email") as HTMLInputElement)
        .value;
      const password = (form.elements.namedItem("password") as HTMLInputElement)
        .value;
      const confirmPassword = (
        form.elements.namedItem("confirmPassword") as HTMLInputElement
      ).value;
      if (password !== confirmPassword) {
        setLocalError(t("login.form.passwordsDoNotMatch"));
        return;
      }
      onSubmit(username, email, password, confirmPassword);
    } else {
      const usernameOrEmail = (
        form.elements.namedItem("usernameOrEmail") as HTMLInputElement
      ).value;
      const password = (form.elements.namedItem("password") as HTMLInputElement)
        .value;
      onSubmit(usernameOrEmail, "", password, "");
    }
  };

  return (
    <form
      className="flex w-full flex-col gap-4"
      onSubmit={handleSubmit}
      ref={formRef}
    >
      {localError && (
        <div className="flex items-center justify-center gap-2 border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-500">
          <TriangleAlertIcon />
          {localError}
        </div>
      )}

      {isSignUp ? (
        <>
          <div className="space-y-2">
            <label className={FIELD_LABEL}>{t("login.form.username")}</label>
            <Input
              name="username"
              placeholder={t("login.form.username")}
              required
              autoComplete="off"
              inputClassName={FIELD_INPUT}
            />
          </div>
          <div className="space-y-2">
            <label className={FIELD_LABEL}>{t("login.form.email")}</label>
            <Input
              name="email"
              type="email"
              placeholder={t("login.form.emailPlaceholder")}
              required
              autoComplete="off"
              inputClassName={FIELD_INPUT}
            />
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <label className={FIELD_LABEL}>{t("login.form.emailOrUsername")}</label>
          <Input
            name="usernameOrEmail"
            placeholder={t("login.form.emailOrUsernamePlaceholder")}
            required
            autoComplete="off"
            inputClassName={FIELD_INPUT}
          />
        </div>
      )}

      <div className="space-y-2">
        <label className={FIELD_LABEL}>{t("login.form.password")}</label>
        <div className="relative">
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder={t("login.form.passwordPlaceholder")}
            required
            autoComplete="off"
            inputClassName={`${FIELD_INPUT} pe-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute end-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white/60"
            tabIndex={-1}
          >
            <DynamicIcon icon={showPassword ? EyeOffIcon : EyeIcon} />
          </button>
        </div>
      </div>

      {isSignUp && (
        <div className="space-y-2">
          <label className={FIELD_LABEL}>{t("login.form.confirmPassword")}</label>
          <div className="relative">
            <Input
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder={t("login.form.confirmPasswordPlaceholder")}
              required
              autoComplete="off"
              inputClassName={`${FIELD_INPUT} pe-12`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute end-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white/60"
              tabIndex={-1}
            >
              <DynamicIcon icon={showConfirm ? EyeOffIcon : EyeIcon} />
            </button>
          </div>
        </div>
      )}

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="h-10 w-full justify-center rounded-[3px] border-none bg-white font-mono text-xs font-semibold uppercase tracking-[0.12em] text-black shadow-none hover:bg-white/90"
        >
          {isLoading ? (
            <LoaderCircleIcon className="animate-spin" />
          ) : isSignUp ? (
            t("login.form.signUp")
          ) : (
            t("login.form.logIn")
          )}
        </Button>
      </div>

      <div className="mt-4 text-center text-sm text-white/60">
        {isSignUp ? t("login.form.haveAccount") : t("login.form.noAccount")}{" "}
        <button
          type="button"
          onClick={onToggleMode}
          className="font-semibold text-primary transition-colors hover:text-primary-400"
        >
          {isSignUp ? t("login.form.logIn") : t("login.form.signUp")}
        </button>
      </div>
    </form>
  );
};
