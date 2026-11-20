import { useCallback, useEffect, useState } from "react";
import { getEvaluations, HISTORY_VAULT_CHANGED, type HistoryEvaluation } from "../services/indexedDbService";

// Une seule lecture locale pour le suivi, les compteurs et la liste d’historique.
export function useLocalHistory() {
  const [history, setHistory] = useState<HistoryEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const reload = useCallback(() => setRevision(value => value + 1), []);
  useEffect(() => {
    let active = true;
    setLoading(true); setError("");
    getEvaluations().then(data => {
      if (active) setHistory(data);
    }).catch(failure => {
      if (active) {
        setHistory([]);
        setError(failure instanceof Error ? failure.message : "Impossible de lire l’historique sur cet appareil.");
      }
    }).finally(() => { if (active) setLoading(false); });
    window.addEventListener(HISTORY_VAULT_CHANGED, reload);
    return () => { active = false; window.removeEventListener(HISTORY_VAULT_CHANGED, reload); };
  }, [revision, reload]);
  return { history, loading, error, reload };
}
