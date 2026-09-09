import { useMemo } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Activity,
  ArrowLeft,
  Info,
} from "lucide-react";
import SigmoidChart from "./SigmoidChart";
import { FEATURE_MAP, WORST_FEATURE_KEYS } from "../config";

/**
 * ResultsTab — Displays prediction results with badge, gauge, sigmoid chart, and input table.
 *
 * Props:
 *   result    – { prediction, probability_malignant, z_value, confidence }
 *   mode      – "simple" | "advanced"
 *   features  – { feature_key: number } submitted values
 *   onBack    – callback to go back to the Predict tab
 */
export default function ResultsTab({ result, mode, features, onBack }) {
  const { prediction, probability_malignant, z_value, confidence } = result;
  const isMalignant = prediction === "Malignant";
  const probPercent = (probability_malignant * 100).toFixed(1);
  const confPercent = (confidence * 100).toFixed(1);

  // Build input values table
  const featureRows = useMemo(() => {
    return Object.entries(features).map(([key, value]) => ({
      key,
      label: FEATURE_MAP[key]?.label ?? key,
      value,
      isUserEntered: mode === "advanced" || WORST_FEATURE_KEYS.includes(key),
    }));
  }, [features, mode]);

  // Auto-generated summary
  const summary = useMemo(() => {
    const thresholdWord = probability_malignant >= 0.5 ? "exceeds" : "falls below";
    return `The model computed a logit (z) of ${z_value.toFixed(4)}, which the sigmoid function maps to a ${probPercent}% probability of malignancy. Since this ${thresholdWord} the 0.5 decision threshold, the tumour is classified as ${prediction}.`;
  }, [z_value, probPercent, probability_malignant, prediction]);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="btn-secondary text-sm"
      >
        <ArrowLeft size={16} />
        New Prediction
      </button>

      {/* ── Prediction Badge + Probability ── */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Badge */}
          <div className="flex items-center gap-3">
            {isMalignant ? (
              <div className="w-14 h-14 rounded-full bg-malignant-100 flex items-center justify-center">
                <ShieldAlert size={28} className="text-malignant-600" />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-benign-100 flex items-center justify-center">
                <ShieldCheck size={28} className="text-benign-600" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                Classification Result
              </p>
              <div className="mt-1">
                <span className={isMalignant ? "badge-malignant text-lg" : "badge-benign text-lg"}>
                  {prediction}
                </span>
              </div>
            </div>
          </div>

          {/* Confidence */}
          <div className="sm:ml-auto text-right">
            <p className="text-sm text-slate-500">Model Confidence</p>
            <p className="text-2xl font-bold text-slate-800">{confPercent}%</p>
          </div>
        </div>

        {/* Probability gauge */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-benign-700">Benign</span>
            <span className="text-sm font-medium text-slate-600">
              {probPercent}% probability of malignancy
            </span>
            <span className="text-sm font-medium text-malignant-700">Malignant</span>
          </div>
          <div className="gauge-track">
            <div
              className="gauge-fill"
              style={{
                width: `${Math.max(2, probability_malignant * 100)}%`,
                background: isMalignant
                  ? "linear-gradient(90deg, #fca5a5, #dc2626)"
                  : "linear-gradient(90deg, #86efac, #16a34a)",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Summary ── */}
      <div className="card p-6">
        <div className="flex items-start gap-3">
          <Activity size={20} className="text-medical-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
              Interpretation
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
          </div>
        </div>
      </div>

      {/* ── Sigmoid Chart ── */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
          Sigmoid Decision Curve
        </h3>
        <SigmoidChart
          zValue={z_value}
          probabilityMalignant={probability_malignant}
          prediction={prediction}
        />
        <p className="text-xs text-slate-500 mt-3 text-center">
          The sigmoid function σ(z) = 1 / (1 + e<sup>−z</sup>) maps the logit to a probability.
          The dashed line shows the 50% decision threshold.
        </p>
      </div>

      {/* ── Input Features Table ── */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
          Submitted Input Features
        </h3>

        {mode === "simple" && (
          <div className="flex items-start gap-2 p-3 mb-4 rounded-lg bg-medical-50 border border-medical-100">
            <Info size={16} className="text-medical-600 shrink-0 mt-0.5" />
            <p className="text-xs text-medical-800">
              This prediction was made in <strong>Simple mode</strong>. You entered the 10 worst-case
              measurements below. The remaining 20 features (mean and standard error values) were
              estimated using precomputed dataset averages by the backend.
            </p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200">
                <th className="text-left py-2 px-3 font-medium text-slate-500">Feature</th>
                <th className="text-right py-2 px-3 font-medium text-slate-500">Value</th>
                {mode === "simple" && (
                  <th className="text-center py-2 px-3 font-medium text-slate-500">Source</th>
                )}
              </tr>
            </thead>
            <tbody>
              {featureRows.map((row) => (
                <tr
                  key={row.key}
                  className="border-b border-surface-100 hover:bg-surface-50 transition-colors"
                >
                  <td className="py-2 px-3 text-slate-700">{row.label}</td>
                  <td className="py-2 px-3 text-right font-mono text-slate-800">
                    {typeof row.value === "number" ? row.value.toFixed(4) : row.value}
                  </td>
                  {mode === "simple" && (
                    <td className="py-2 px-3 text-center">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          row.isUserEntered
                            ? "bg-medical-100 text-medical-700"
                            : "bg-surface-100 text-slate-500"
                        }`}
                      >
                        {row.isUserEntered ? "User input" : "Estimated"}
                      </span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
