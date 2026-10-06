import { CheckIcon } from "lucide-react";
import { useTranslation } from "@storyteller/common";
import styles from "./LoginSuccess.module.css";

export function LoginSuccess({ username }: { username: string }) {
  const { t } = useTranslation();
  return (
    <div className={styles.panel} role="status" aria-live="polite" aria-atomic="true">
      <div className={styles.badge} aria-hidden="true">
        <CheckIcon size={28} strokeWidth={2} />
      </div>
      <h2 className={styles.heading}>
        {t("login.loggedInAs")}
        <span className={styles.username}>{username}</span>
      </h2>
      <p className={styles.caption}>{t("login.readyToCreate")}</p>
    </div>
  );
}
