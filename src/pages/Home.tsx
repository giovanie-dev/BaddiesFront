import HistoryVaultGate from "../components/HistoryVaultGate";
import { useHistoryVault } from "../hooks/useHistoryVault";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


import Navbar from "../components/Navbar";
import Collapse from "../components/Collapse";
import { getEvaluations } from "../services/indexedDbService";
import type { HistoryEvaluation } from "../services/indexedDbService";

import "../styles/components/navbar.scss";
import "../styles/pages/home.scss";
import { useEvaluation } from "../evaluation/useEvaluation";
import { DataPrivacy } from "../components/Dataprivacy";
import { ArrowRight } from "lucide-react";



export default function Home() {
  const { resetEvaluation } = useEvaluation();
  const vault = useHistoryVault();
  const [evaluations, setEvaluations] = useState<HistoryEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyError, setHistoryError] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false)

  const navigate = useNavigate()



  useEffect(() => {
    let active = true;

    const loadHistory = async () => {
      setLoading(true);
      setHistoryError(false);

      try {
        const data = await getEvaluations();

        if (active) {
          setEvaluations(data);
        }
      } catch (error) {
        console.error("Erreur historique accueil :", error);

        if (active) {
          setHistoryError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    if (vault.status === "unlocked" || vault.status === "empty") void loadHistory();

    return () => {
      active = false;
    };
  }, [vault.status, vault.revision]);

  const age = localStorage.getItem("baddies-age");
  const canEvaluate = age === "+15ans";

  const hasHistory = evaluations.length > 0;



  return (
    <>
      <Navbar />
      {showPrivacy && (
        <DataPrivacy
          onAccept={() => {
            setShowPrivacy(false);
            resetEvaluation();
            navigate("/analyse");
          }}
          onRefuse={() =>
            setShowPrivacy(false)
          }
        />
      )}

      <main className="home-page">
        <Collapse />

        <section className="home-intro" aria-labelledby="home-title">

          <h1 id="home-title">
            Votre assistant de premiers gestes pour les
            douleurs menstruelles, utilisable même hors ligne.
          </h1>

          <p className="home-description">
            {canEvaluate
              ? "Évaluez vos douleurs en quelques minutes et découvrez des gestes adaptés pour vous soulager."
              : "Découvrez des premiers gestes simples pour soulager vos douleurs menstruelles, sans compte ni évaluation."}
          </p>

          {canEvaluate && (
            <Link to="/Analyse" onClick={resetEvaluation} className="home-btn">
              Commencer mon évaluation
            </Link>
          )}

          <div className="home-immediate-help">
            <div className="home-immediate-help-content">
              <h2>Besoin d'aide tout de suite ?</h2>

              <p>
                Découvrez des premiers gestes pour soulager vos douleurs
                menstruelles, sans compte ni évaluation.
              </p>

              <Link to="/ImmediateHelp" className="home-immediate-help-link">
                Voir les premiers gestes
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {canEvaluate && (

          <HistoryVaultGate>
          <section className="historyHome" aria-labelledby="history-title">
            <div className="historyHome-header">
              <h2 id="history-title">Mes évaluations</h2>
              <p>Retrouvez vos évaluations enregistrées sur cet appareil. Elles ne sont pas synchronisées avec votre compte.</p>
            </div>

            {loading ? (
              <p role="status">
                Chargement des évaluations...
              </p>
            ) : historyError ? (
              <p role="alert">
                Impossible de charger vos évaluations pour le moment.
              </p>
            ) : hasHistory ? (
              <>
                <div className="historyHome-summary">
                  <span className="historyHome-count">
                    {evaluations.length}
                  </span>

                  <div>
                    <strong>
                      {evaluations.length > 1
                        ? "Évaluations enregistrées"
                        : "Évaluation enregistrée"}
                    </strong>

                    <p>
                      Consultez vos précédentes évaluations
                      et les gestes associés.
                    </p>
                  </div>
                </div>

                <Link to="/Suivi?tab=suivi" className="historyLink">
                  Voir mon évaluation
                  <ArrowRight size={20} strokeWidth={1.8} aria-hidden="true" />
                </Link>
              </>
            ) : (
              <div className="historyHome-empty">
                <p>
                  Aucune évaluation enregistrée pour le moment.
                </p>

                <Link to="/Analyse" onClick={resetEvaluation} className="historyLink">
                  Faire ma première évaluation
                  <ArrowRight size={20} strokeWidth={1.8} aria-hidden="true" />
                </Link>

              </div>

            )}
          </section>
          </HistoryVaultGate>
        )

        }
      </main>
    </>
  );
}