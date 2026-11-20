import type { Evaluation } from "../evaluation/EvalContext";
import type { HistoryEvaluation } from "../services/indexedDbService";
import db from "../data/db.json";

export type TrackingPeriod = "all" | "30" | "90";

// Reprendre le niveau enregistré, avec compatibilité des anciens identifiants sans accent.
export function getPainLevel(evaluation?: Evaluation) {
  const levels = db.evaluation_douleur.echelle_intensite.niveaux;
  const id = evaluation?.intensiteNiveau?.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const declared = levels.find(item => item.id.normalize("NFD").replace(/[\u0300-\u036f]/g, "") === id);
  if (declared) return declared;
  const score = evaluation?.intensiteValeur;
  return typeof score === "number" && Number.isFinite(score)
    ? levels.find(item => score >= item.min && score <= item.max)
    : undefined;
}

// Une catégorie donne un repère sur le graphique, pas une note exacte sur 10.
export function getIntensity(evaluation?: Evaluation) {
  const score = evaluation?.intensiteValeur;
  const level = getPainLevel(evaluation);
  if (typeof score === "number" && Number.isFinite(score) && score >= 0 && score <= 10) {
    return { value: score, label: `${score}/10`, painLabel: level?.label ?? "Intensité déclarée", estimated: false };
  }
  return level ? { value: Math.floor((level.min + level.max) / 2), label: level.label, painLabel: level.label, estimated: true } : null;
}

export function filterHistory(history: HistoryEvaluation[], period: TrackingPeriod, now = new Date()) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  if (period !== "all") start.setDate(start.getDate() - (Number(period) - 1));
  return history.filter(item => {
    const date = Date.parse(item.date);
    return Number.isFinite(date) && (period === "all" || date >= start.getTime());
  }).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

export function formatHistoryDate(date: string, withTime = false) {
  return new Date(date).toLocaleString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {})
  });
}
