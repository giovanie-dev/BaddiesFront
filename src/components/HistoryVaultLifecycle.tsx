import { useEffect } from "react";
import { HISTORY_VAULT_CHANGED, isHistoryUnlocked, lockHistory } from "../services/indexedDbService";

export default function HistoryVaultLifecycle() {

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const activity = () => {
      clearTimeout(timer);

      if (isHistoryUnlocked()) 
        timer = setTimeout(lockHistory, 10 * 60 * 1000);
    };
    const storageChanged = (event: StorageEvent) => {
      if (event.key === "user" || event.key === "token" || event.key === null) lockHistory();
    };

    window.addEventListener(HISTORY_VAULT_CHANGED, activity);
    window.addEventListener("pointerdown", activity, { passive: true });
    window.addEventListener("keydown", activity);
    window.addEventListener("scroll", activity, { passive: true });
    window.addEventListener("pagehide", lockHistory);
    window.addEventListener("storage", storageChanged);
    activity();
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener(HISTORY_VAULT_CHANGED, activity);
      window.removeEventListener("pointerdown", activity);
      window.removeEventListener("keydown", activity);
      window.removeEventListener("scroll", activity);
      window.removeEventListener("pagehide", lockHistory);
      window.removeEventListener("storage", storageChanged);
    };
  }, []);
  return null;
}
