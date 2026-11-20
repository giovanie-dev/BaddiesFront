import { useEffect, useState } from "react";
import { getHistoryVaultStatus, hasHistoryRecovery, HISTORY_VAULT_CHANGED, type HistoryVaultStatus } from "../services/indexedDbService";

export function useHistoryVault() {
  const [status, setStatus] = useState<HistoryVaultStatus | "loading">("loading");
  const [recoveryAvailable, setRecoveryAvailable] = useState(false);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    let sequence = 0;

    const refresh = async () => {
      const current = ++sequence;

      try {
        const next = await getHistoryVaultStatus();
        const hasRecovery = await hasHistoryRecovery();
        
        if (active && current === sequence) { setStatus(next); setRecoveryAvailable(hasRecovery); setError(""); setRevision(value => value + 1); }

      } catch (failure) {
        if (active && current === sequence){
          setError(failure instanceof Error ? failure.message : "Stockage local indisponible.");

        }
      }
    };
    void refresh();
    window.addEventListener(HISTORY_VAULT_CHANGED, refresh);

    return () => { 
      active = false;
      window.removeEventListener(HISTORY_VAULT_CHANGED, refresh); 
    };

  }, []);

  return { status, error, revision, recoveryAvailable };
}
