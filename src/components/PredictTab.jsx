import { useState, useMemo } from "react";
import {
  FlaskConical,
  ChevronDown,
  Loader2,
  AlertCircle,
  Beaker,
} from "lucide-react";
import FeatureInput from "./FeatureInput";
import {
  FEATURES,
  WORST_FEATURE_KEYS,
  ALL_FEATURE_KEYS,
  FEATURE_MAP,
  EXAMPLE_PATIENTS,
  API_BASE_URL,
} from "../config";

/**
 * PredictTab — Input form with Simple/Advanced toggle, example loader, and classify button.
 *
 * Props:
 *   onResult  – callback(resultData, mode, submittedFeatures) when prediction succeeds
 */
export default function PredictTab({ onResult }) {
  const [mode, setMode] = useState("simple"); // "simple" | "advanced"
  const [values, setValues] = useState({}); // { feature_key: string_value }
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [exampleOpen, setExampleOpen] = useState(false);

  // Which features to show based on mode
  const visibleKeys = mode === "simple" ? WORST_FEATURE_KEYS : ALL_FEATURE_KEYS;

  // Group features by variant for Advanced mode
  const featureGroups = useMemo(() => {
    if (mode === "simple") return null;
    return [
      { label: "Mean Values", variant: "mean", description: "Average across all cell nuclei in the sample" },
      { label: "Standard Error", variant: "se", description: "Measurement variability across nuclei" },
      { label: "Worst (Largest) Values", variant: "worst", description: "Largest value among all nuclei — most extreme measurement" },
    ].map((group) => ({
      ...group,
      features: FEATURES.filter((f) => f.variant === group.variant),
    }));
  }, [mode]);

  // ── Handlers ──────────────────────────────────────────────

  const handleValueChange = (key, val) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    // Clear error on edit
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
    setApiError(null);
  };

  const loadExample = (example) => {
    const stringValues = {};
    for (const [k, v] of Object.entries(example.values)) {
      stringValues[k] = String(v);
    }
    setValues(stringValues);
    setErrors({});
    setApiError(null);
    setExampleOpen(false);
  };

  const validate = () => {
    const newErrors = {};
    for (const key of visibleKeys) {
      const raw = values[key];
      if (raw === undefined || raw === null || raw === "") {
        newErrors[key] = "This field is required.";
        continue;
      }
      const num = parseFloat(raw);
      if (isNaN(num)) {
        newErrors[key] = "Enter a valid number.";
      } else if (num < 0) {
        newErrors[key] = "Value cannot be negative.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError(null);

    // Build features object (only the keys relevant to the mode)
    const features = {};
    for (const key of visibleKeys) {
      features[key] = parseFloat(values[key]);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, features }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`API error ${res.status}: ${errBody}`);
      }

      const data = await res.json();
      onResult(data, mode, features);
    } catch (err) {
      setApiError(err.message || "Failed to connect to the API.");
    } finally {
      setLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="animate-fade-in">
      <form onSubmit={handleSubmit} noValidate>
        {/* ── Header: Mode toggle + Example loader ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {/* Mode toggle */}
          <div>
            <div className="mode-toggle">
              <button
                type="button"
                className={mode === "simple" ? "mode-toggle-btn-active" : "mode-toggle-btn"}
                onClick={() => setMode("simple")}
              >
                Simple (10 features)
              </button>
              <button
                type="button"
                className={mode === "advanced" ? "mode-toggle-btn-active" : "mode-toggle-btn"}
                onClick={() => setMode("advanced")}
              >
                Advanced (30 features)
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2 max-w-md">
              {mode === "simple"
                ? "Enter only the 10 worst-case measurements. The remaining 20 features will be estimated using dataset averages."
                : "Enter all 30 measurements (mean, standard error, and worst) for a more precise prediction."}
            </p>
          </div>

          {/* Example loader dropdown */}
          <div className="relative">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setExampleOpen(!exampleOpen)}
            >
              <FlaskConical size={16} />
              Load Example
              <ChevronDown
                size={14}
                className={`transition-transform ${exampleOpen ? "rotate-180" : ""}`}
              />
            </button>
            {exampleOpen && (
              <>
                {/* Backdrop to close dropdown */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setExampleOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-elevated border border-surface-200 z-50 animate-fade-in overflow-hidden">
                  <div className="px-3 py-2 border-b border-surface-100">
                    <p className="text-xs text-slate-500 font-medium">
                      Sample data — not real patients
                    </p>
                  </div>
                  {EXAMPLE_PATIENTS.map((ex) => (
                    <button
                      key={ex.name}
                      type="button"
                      className="w-full text-left px-4 py-3 hover:bg-surface-50 transition-colors border-b border-surface-100 last:border-b-0"
                      onClick={() => loadExample(ex)}
                    >
                      <p className="text-sm font-medium text-slate-800">{ex.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{ex.description}</p>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Feature fields ── */}
        {mode === "simple" ? (
          /* Simple mode: flat grid of 10 "worst" features */
          <div className="card p-6 mb-6">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Beaker size={16} className="text-medical-500" />
              Worst-Case Nucleus Measurements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              {FEATURES.filter((f) => f.variant === "worst").map((feature) => (
                <FeatureInput
                  key={feature.key}
                  feature={{ ...feature, label: feature.labelShort }}
                  value={values[feature.key]}
                  onChange={handleValueChange}
                  error={errors[feature.key]}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Advanced mode: three grouped sections */
          <div className="space-y-4 mb-6">
            {featureGroups.map((group) => (
              <div key={group.variant} className="card p-6">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-1 flex items-center gap-2">
                  <Beaker size={16} className="text-medical-500" />
                  {group.label}
                </h3>
                <p className="text-xs text-slate-500 mb-4">{group.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                  {group.features.map((feature) => (
                    <FeatureInput
                      key={feature.key}
                      feature={{ ...feature, label: feature.labelShort }}
                      value={values[feature.key]}
                      onChange={handleValueChange}
                      error={errors[feature.key]}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── API error ── */}
        {apiError && (
          <div className="flex items-start gap-2 p-4 mb-4 rounded-lg bg-malignant-50 border border-malignant-200 animate-fade-in">
            <AlertCircle size={18} className="text-malignant-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-malignant-800">Prediction failed</p>
              <p className="text-xs text-malignant-600 mt-0.5">{apiError}</p>
            </div>
          </div>
        )}

        {/* ── Submit button ── */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Classifying…
            </>
          ) : (
            <>
              <FlaskConical size={18} />
              Classify Tumour
            </>
          )}
        </button>
      </form>
    </div>
  );
}
