import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import Navbar from "./Navbar";
import HistoryVaultGate from "./HistoryVaultGate";
import { useLocalHistory } from "../hooks/useLocalHistory";
import type { HistoryEvaluation } from "../services/indexedDbService";
import { formatHistoryDate, getIntensity, getPainLevel } from "../utils/trackingUtils";
import "../styles/pages/tracking.scss";

export function History() {
    return (
        <>
            <Navbar />
            <main className="tracking tracking-simple">
                <h1>Mon historique</h1>
                <HistoryVaultGate>
                    <LocalHistory />
                </HistoryVaultGate>
            </main>
        </>
    );
}

function LocalHistory() {
    const { history, loading, error, reload } = useLocalHistory();
    if (loading) return <p role="status">Chargement de l’historique…</p>;
    if (error) return <div role="alert"><p>{error}</p><button type="button" onClick={reload}>Réessayer</button></div>;
    return <HistoryList history={history} />;
}

export function HistoryList({ history }: { history: HistoryEvaluation[] }) {
    const [filter, setFilter] = useState("recent");
    const filtered = [...history]
        .filter(item => {
            if (filter === "recent" || filter === "ancien") return true;
            const level = getPainLevel(item.evaluation);
            return level?.id.normalize("NFD").replace(/[\u0300-\u036f]/g, "") === filter;
        })
        .sort((a, b) => filter === "ancien"
            ? Date.parse(a.date) - Date.parse(b.date)
            : Date.parse(b.date) - Date.parse(a.date));

    return (
        <>
            <section className="filtreArt" aria-label="Tri des évaluations">
                <label htmlFor="history-filter">Trier les évaluations</label>
                <div className="historyFilters">
                    <select id="history-filter" value={filter} onChange={event => setFilter(event.target.value)}>
                        <option value="recent">Plus récentes</option>
                        <option value="ancien">Plus anciennes</option>
                        <option value="intense">Douleur intense</option>
                        <option value="moderee">Douleur modérée</option>
                        <option value="legere">Douleur légère</option>
                    </select>
                </div>
            </section>

            {!history.length ? (
                <p>Aucune évaluation actuellement. Enregistre une évaluation pour la retrouver ici.</p>
            ) : !filtered.length ? (
                <p>Aucune évaluation ne correspond à ce filtre.</p>
            ) : (
                <div className="historyList">
                    {filtered.map(item => {
                        const intensity = getIntensity(item.evaluation);
                        const level = getPainLevel(item.evaluation);
                        return (
                            <article key={item.id} className="historyArticle">
                                <div className="historyContent">
                                    <div className="blocHistory">
                                        <p className="date"><time dateTime={item.date}>{formatHistoryDate(item.date)}</time></p>
                                        <p className="paraHistory">{level?.label ?? "Intensité non renseignée"}</p>
                                    </div>
                                    <div className="zone">
                                        <MapPin className="map" size={20} aria-hidden="true" />
                                        <p>{item.evaluation?.localisations.join(", ") || "Non renseignée"}</p>
                                    </div>
                                    {intensity && !intensity.estimated && <p className="intensity">{intensity.label}</p>}
                                </div>
                                <Link
                                    className="btnEpisode"
                                    to={`/Historique/${encodeURIComponent(item.id)}`}
                                    aria-label={`Voir l’épisode du ${formatHistoryDate(item.date, true)}`}
                                >
                                    Voir l’épisode
                                </Link>
                            </article>
                        );
                    })}
                </div>
            )}
        </>
    );
}
