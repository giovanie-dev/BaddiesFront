import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import HistoryVaultGate from "../components/HistoryVaultGate";
import { HistoryList } from "../components/History";
import { PainChart } from "../components/PainChart";
import { useLocalHistory } from "../hooks/useLocalHistory";
import { filterHistory, formatHistoryDate, getIntensity } from "../utils/trackingUtils";
import "../styles/pages/tracking.scss";

export default function Tracking() {
    const [params, setParams] = useSearchParams();
    const tab = params.get("tab") === "historique" ? "historique" : "suivi";

    const setTab = (next: "suivi" | "historique") => {
        setParams(current => {
            const updated = new URLSearchParams(current);
            updated.set("tab", next);
            return updated;
        });
    };

    return (
        <>
            <Navbar />
            <main className="tracking tracking-simple">
                <h1>{tab === "suivi" ? "Mon suivi" : "Mon historique"}</h1>

                <HistoryVaultGate>
                    <nav className="btnSuivi" aria-label="Navigation du suivi">
                        <button
                            type="button"
                            className={`btn-fond${tab === "suivi" ? " active" : ""}`}
                            aria-current={tab === "suivi" ? "page" : undefined}
                            onClick={() => setTab("suivi")}
                        >
                            Suivi
                        </button>
                        <button
                            type="button"
                            className={`btn-fond${tab === "historique" ? " active" : ""}`}
                            aria-current={tab === "historique" ? "page" : undefined}
                            onClick={() => setTab("historique")}
                        >
                            Historique
                        </button>
                    </nav>

                    <TrackingContent tab={tab} />
                </HistoryVaultGate>
            </main>
        </>
    );
}

function TrackingContent({ tab }: { tab: "suivi" | "historique" }) {
    const { history, loading, error, reload } = useLocalHistory();
    const orderedHistory = filterHistory(history, "all");
    const points = [...orderedHistory].reverse().flatMap(item => {
        const intensity = getIntensity(item.evaluation);
        if (!intensity) return [];

        return [{
            date: new Date(item.date).toLocaleString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            }),
            fullDate: formatHistoryDate(item.date, true),
            intensite: intensity.value,
            intensityLabel: intensity.label,
            painLabel: intensity.painLabel,
            questionnaire: intensity.estimated
        }];
    });

    if (loading) return <p role="status">Chargement des évaluations…</p>;

    if (error) {
        return (
            <div className="tracking-simple-error" role="alert">
                <p>{error}</p>
                <button type="button" className="tracking-secondary" onClick={reload}>
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <>
            {tab === "suivi" && orderedHistory.length > 0 && (
                <div className="tracking-overview" aria-label="Résumé de mes évaluations">
                    <p><strong>{orderedHistory.length}</strong> évaluation{orderedHistory.length > 1 ? "s" : ""} enregistrée{orderedHistory.length > 1 ? "s" : ""}</p>
                    <p>
                        Dernière évaluation : <Link to={`/Historique/${encodeURIComponent(orderedHistory[0].id)}`}>
                            <time dateTime={orderedHistory[0].date}>{formatHistoryDate(orderedHistory[0].date, true)}</time>
                        </Link>
                    </p>
                </div>
            )}

            {tab === "suivi" && <section className="tracking-simple-chart" aria-labelledby="evolution-title">
                <h2 id="evolution-title">Évolution de ma douleur</h2>
                <PainChart evaluations={points} />
            </section>}

            {tab === "historique" && (
                <section className="tracking-simple-history" aria-labelledby="history-list-title">
                    <h2 id="history-list-title">Mon historique</h2>
                    {orderedHistory.length ? (
                        <HistoryList history={orderedHistory} />
                    ) : (
                        <p>Aucune évaluation enregistrée pour le moment.</p>
                    )}
                </section>
            )}
        </>
    );
}
