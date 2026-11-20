import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "../styles/components/painChart.scss";

export type ChartEvaluation = {
    date: string;
    fullDate: string;
    intensite: number;
    intensityLabel: string;
    painLabel: string;
    questionnaire: boolean;
};

export function PainChart({ evaluations }: { evaluations: ChartEvaluation[] }) {
    if (!evaluations.length) {
        return <p>Aucune évaluation disponible pour afficher votre évolution.</p>;
    }

    return (
        <div className="Pain-chart">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evaluations} margin={{ top: 10, right: 10, left: 0, bottom: 5 }} accessibilityLayer>
                    <CartesianGrid strokeDasharray="3 3" className="chart-grid" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} allowDecimals={false} width={28} />
                    <Tooltip content={({ active, payload }) => {
                        const point = payload?.[0]?.payload as ChartEvaluation | undefined;
                        if (!active || !point) return null;
                        return (
                            <div className="pain-chart-tooltip">
                                <strong>{point.fullDate}</strong>
                                <span>{point.painLabel}</span>
                                {!point.questionnaire && <span>Intensité : {point.intensityLabel}</span>}
                                {point.questionnaire && <small>Niveau déclaré au questionnaire</small>}
                            </div>
                        );
                    }} />
                    <Line
                        type="monotone"
                        dataKey="intensite"
                        stroke="var(--color-accent)"
                        strokeWidth={3}
                        dot={{ r: 5, fill: "var(--color-accent)" }}
                        activeDot={{ r: 7 }}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
