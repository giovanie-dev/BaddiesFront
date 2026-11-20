import { Navigate } from "react-router-dom";
import { useState, type ReactNode } from "react";
import { ChevronDown, LockKeyhole, ShieldCheck } from "lucide-react";
import { askHistoryAccess } from "../services/historyAccess";
import { ensureHistoryUnlocked, lockHistory } from "../services/indexedDbService";
import { useHistoryVault } from "../hooks/useHistoryVault";
import "../styles/components/historyVault.scss";

export default function HistoryVaultGate({ children, showStatus = true }: { children: ReactNode; showStatus?: boolean }) {
    const { status, error, recoveryAvailable } = useHistoryVault();
    const [message, setMessage] = useState("");
    const [busy, setBusy] = useState(false);

    const open = async (recovery = false) => {
        if (busy) return;
        setBusy(true);
        setMessage("");
        try {
            if (recovery) await askHistoryAccess("recovery");
            else await ensureHistoryUnlocked();
        } catch (failure) {
            setMessage(failure instanceof Error ? failure.message : "Déverrouillage impossible.");
        } finally {
            setBusy(false);
        }
    };

    if (error) return <p role="alert">{error}</p>;
    if (status === "loading") return <p role="status">Vérification de l’historique local…</p>;
    const unlocked = status === "unlocked";

    if (!showStatus) {
        return unlocked || status === "empty" ? <>{children}</> : <Navigate to="/Suivi?tab=historique" replace />;
    }

    return (
        <>
            <details className="history-vault-panel">
                <summary className="history-vault-summary">
                    {unlocked ? 
                    <ShieldCheck aria-hidden="true" /> 
                    : <LockKeyhole aria-hidden="true" />
                    }
                    <span>{unlocked ?
                     "Historique déverrouillé" 
                     : status === "legacy" 
                     ? "Protège ton ancien historique" 
                     : status === "empty" ? "Protection de l’historique" 
                     : "Historique verrouillé"}</span>
                    <ChevronDown className="history-vault-chevron" aria-hidden="true" />
                </summary>
                <div className="history-vault-content">
                <div className="history-vault-header">
                    <div className="history-vault-copy">
                        <p>{unlocked ? "Chiffrement local. Verrouillage automatique après 10 minutes d’inactivité." : status === "legacy" ? "Choisis un mot de passe local pour chiffrer les évaluations déjà enregistrées sans les perdre." : status === "empty" ? "Un mot de passe local protégera tes évaluations dès leur premier enregistrement." : "Saisis ton mot de passe local pour consulter tes évaluations."}</p>
                    </div>
                    <button type="button" className="history-vault-main-action" disabled={busy} onClick={unlocked ? lockHistory : () => open()}>
                        {unlocked ? "Verrouiller" : status === "locked" ? "Déverrouiller mon historique" : "Protéger mon historique"}
                    </button>
                </div>

                {unlocked && (
                    <div className="history-vault-recovery">
                        <p>
                            <strong>{recoveryAvailable ? "Récupération activée" : "Récupération à activer"}</strong>
                            <span>{recoveryAvailable ? "Conserve ton code dans un endroit sûr, séparément de ton historique." : "Crée ton code pour retrouver l’accès si tu oublies ton mot de passe local."}</span>
                        </p>
                        <button type="button" disabled={busy} onClick={() => open(true)}>
                            {recoveryAvailable ? "Renouveler mon code de récupération" : "Créer mon code de récupération"}
                        </button>
                    </div>
                )}
                {message && <p className="history-vault-message" role="status">{message}</p>}
                </div>
            </details>
            {(unlocked || status === "empty") && children}
        </>
    );
}
