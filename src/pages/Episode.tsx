import db from "../data/db.json";
import { getIntensity, getPainLevel } from "../utils/trackingUtils";
import HistoryVaultGate from "../components/HistoryVaultGate";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "../components/Navbar";
import type { HistoryEvaluation } from "../services/indexedDbService";
import { getEvaluationById, deleteEvaluation } from "../services/indexedDbService";

import "../styles/pages/episode.scss";

type DeleteProps = {
  onAccept: () => void;
  onRefuse: () => void;
};

function Delete({ onAccept, onRefuse }: DeleteProps) {



  return (
    <div id="delete-overlay" onClick={event => { if (event.target === event.currentTarget) onRefuse(); }}>
      <div className="delete-card" role="dialog" aria-modal="true" aria-labelledby="delete-title">
        <h2 id="delete-title">Supprimer l'épisode ?</h2>

        <p>
          Voulez-vous vraiment supprimer cet épisode  ?
        </p>

        <div className="delete-actions">
          <button type="button" onClick={onRefuse}>
            Annuler
          </button>

          <button type="button" onClick={onAccept}>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Episode() {
  return <><Navbar /><HistoryVaultGate showStatus={false}><EpisodeContent /></HistoryVaultGate></>;
}

function EpisodeContent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [episode, setEpisode] = useState<HistoryEvaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    let active = true;

    const loadEpisode = async () => {
      setLoading(true);
      setError("");
      setEpisode(null);

      try {
        if (!id) {
          if (active) {
            setError("Identifiant de l'épisode manquant.");
          }
          return;
        }

        let data: HistoryEvaluation | null = null;

        data = await getEvaluationById(id);

        if (active) {
          setEpisode(data);
        }

      } catch (err) {
        console.error("Erreur épisode :", err);

        if (active) {
          setError("Impossible de charger cet épisode.");
        }

      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadEpisode();

    return () => {
      active = false;
    };

  }, [id]);

  const handleDelete = async () => {
    if (!id || !episode || deleting) return;

    setDeleting(true);
    setError("");

    try {
      await deleteEvaluation(id);

      navigate("/Suivi?tab=historique", { replace: true });

    } catch (err) {
      console.error("Erreur suppression :", err);

      setError(err instanceof Error ? err.message : "Impossible de supprimer cet épisode.");
    } finally {
      setDeleting(false);
    }
  };

  const intensity = getIntensity(episode?.evaluation);
  const level = getPainLevel(episode?.evaluation);

  return (
    <>
      <main className="episode-page">
        <h1>Mon épisode</h1>

        {loading ? (
          <p role="status">
            Chargement de l'épisode...
          </p>
        ) : error && !episode ? (
          <p role="alert">{error}</p>
        ) : !episode ? (
          <p>Épisode introuvable.</p>
        ) : (
          <>
            <section aria-labelledby="episode-details-title">
              <h2 id="episode-details-title">Détails de mon évaluation</h2>
              <p>
                {level?.label ?? (intensity ? "Intensité déclarée" : "Intensité non renseignée")}
                {intensity && !intensity.estimated && (
                  <> ({intensity.label})</>
                )}
              </p>
              <p>Date : {new Date(episode.date).toLocaleDateString("fr-FR")}</p>
              <p>Localisation : {episode.evaluation?.localisations.join(", ") || "Non renseignée"}</p>
              <p>Contexte : {db.contextes.find(item => item.id === episode.evaluation?.contextes)?.label ?? episode.evaluation?.contextes ?? "Non renseigné"}</p>
              <p>Symptômes : {episode.evaluation?.symptomes.map(id => db.evaluation_douleur.symptomes.find(item => item.id === id)?.label ?? id).join(", ") || "aucun"}</p>
              <p>Caractéristique : {episode.evaluation?.option || "Non renseignée"}</p>
            </section>

            <section aria-labelledby="solutions-title">
              <h2 id="solutions-title">
                Gestes conseillés
              </h2>

              {episode.solutions.length > 0 ? (
                episode.solutions.map((solution) => (
                  <article key={solution.id}>
                    <h3>{solution.label}</h3>
                    <p>{solution.description}</p>
                  </article>
                ))
              ) : (
                <p>
                  Aucun conseil disponible sur cet appareil pour cet épisode.
                </p>
              )}
            </section>

            {error && (
              <p role="alert">{error}</p>
            )}


            <button type="button"
              onClick={() =>
                setShowDelete(true)
              }
              className="btn" disabled={deleting}
            >
              Supprimer cet épisode
            </button>
          </>
        )}

      
        {showDelete && (
          <Delete
            onRefuse={() =>
              setShowDelete(false)
            }
            onAccept={() => {
              handleDelete();
              setShowDelete(false);
            }}
          />
        )}

      </main>
    </>
  );
}