
import { createContext } from "react";

// types réponses
export type Evaluation = {
    intensiteNiveau: string | null;
    intensiteValeur: number | null;
    localisations: string[];
    contextes: string | null;
    symptomes: string[];
    option: string | null;
};

// les elements partagés
export type EvaluationContextType = {
    // décrit ce qui partagé
    evaluation: Evaluation;
    setEvaluation: React.Dispatch<React.SetStateAction<Evaluation>>;
    resetEvaluation: () => void;
};

// Création du contexte
export const EvalContext = createContext<EvaluationContextType | null>(null);
