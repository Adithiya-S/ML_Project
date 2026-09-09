// ═══════════════════════════════════════════════════════════════════════════
// config.js — Central configuration for the Breast Tumour Classification App
// ═══════════════════════════════════════════════════════════════════════════

// ── API Configuration ────────────────────────────────────────────────────
// TODO: Change this to your deployed API URL when ready (e.g. "https://your-api.onrender.com")
export const API_BASE_URL = "http://127.0.0.1:8000";

// ── Feature Definitions ─────────────────────────────────────────────────
// The 10 base measurements. Each has three variants: _mean, _se, _worst.
const BASE_MEASUREMENTS = [
  {
    key: "radius",
    label: "Radius",
    tooltip: "Mean distance from the centre of the cell nucleus to points on its perimeter.",
    min: 0, max: 40, step: 0.01,
  },
  {
    key: "texture",
    label: "Texture",
    tooltip: "Standard deviation of grey-scale pixel values — measures surface roughness of the nucleus.",
    min: 0, max: 50, step: 0.01,
  },
  {
    key: "perimeter",
    label: "Perimeter",
    tooltip: "Total length of the nucleus boundary (perimeter in µm-equivalent units).",
    min: 0, max: 260, step: 0.01,
  },
  {
    key: "area",
    label: "Area",
    tooltip: "Cross-sectional area of the cell nucleus (in µm²-equivalent units).",
    min: 0, max: 4300, step: 0.1,
  },
  {
    key: "smoothness",
    label: "Smoothness",
    tooltip: "Local variation in radius lengths — lower values mean a smoother nucleus boundary.",
    min: 0, max: 0.25, step: 0.0001,
  },
  {
    key: "compactness",
    label: "Compactness",
    tooltip: "Perimeter² / area − 1.0 — measures how compact (circular) the nucleus shape is.",
    min: 0, max: 1.5, step: 0.0001,
  },
  {
    key: "concavity",
    label: "Concavity",
    tooltip: "Severity of concave portions (indentations) in the nucleus contour.",
    min: 0, max: 1.5, step: 0.0001,
  },
  {
    key: "concave_points",
    label: "Concave Points",
    tooltip: "Number of concave portions (indentation points) on the nucleus boundary.",
    min: 0, max: 0.3, step: 0.0001,
  },
  {
    key: "symmetry",
    label: "Symmetry",
    tooltip: "How symmetric the nucleus is — lower values indicate more symmetric shapes.",
    min: 0, max: 0.7, step: 0.0001,
  },
  {
    key: "fractal_dimension",
    label: "Fractal Dimension",
    tooltip: "\"Coastline approximation\" — measures boundary complexity using fractal geometry.",
    min: 0, max: 0.15, step: 0.00001,
  },
];

// Build the full feature list with variant suffixes
const VARIANTS = [
  { suffix: "mean", label: "Mean", description: "Average value across all nuclei in the sample" },
  { suffix: "se", label: "Standard Error", description: "Standard error of the measurement" },
  { suffix: "worst", label: "Worst", description: "Largest (worst-case) value among the nuclei" },
];

/**
 * Full list of 30 features, each with:
 *   key, label, tooltip, min, max, step, variant, group
 */
export const FEATURES = VARIANTS.flatMap((variant) =>
  BASE_MEASUREMENTS.map((base) => ({
    key: `${base.key}_${variant.suffix}`,
    label: `${base.label} (${variant.label.toLowerCase()})`,
    labelShort: base.label,
    tooltip: `${base.tooltip}\n\n[${variant.label}] — ${variant.description}.`,
    min: base.min,
    max: variant.suffix === "se" ? base.max * 0.3 : base.max,  // SE values are smaller
    step: base.step,
    variant: variant.suffix,
    group: variant.label,
  }))
);

// Convenience: just the 10 "worst" feature keys
export const WORST_FEATURE_KEYS = FEATURES
  .filter((f) => f.variant === "worst")
  .map((f) => f.key);

// Convenience: all 30 feature keys
export const ALL_FEATURE_KEYS = FEATURES.map((f) => f.key);

// Feature lookup by key
export const FEATURE_MAP = Object.fromEntries(FEATURES.map((f) => [f.key, f]));

// ── Example Patients (Pre-fill Presets) ──────────────────────────────────
// TODO: Replace these placeholder values with real examples from your trained model / dataset.
// These should be actual or representative rows from the WDBC dataset.
export const EXAMPLE_PATIENTS = [
  {
    name: "Typical Benign Case",
    description: "Sample data — small, smooth, symmetric nuclei",
    values: {
      // Mean features
      radius_mean: 12.25, texture_mean: 17.48, perimeter_mean: 78.27,
      area_mean: 462.7, smoothness_mean: 0.0869, compactness_mean: 0.0647,
      concavity_mean: 0.0296, concave_points_mean: 0.0149, symmetry_mean: 0.1697,
      fractal_dimension_mean: 0.0610,
      // SE features
      radius_se: 0.2846, texture_se: 1.058, perimeter_se: 2.007,
      area_se: 21.67, smoothness_se: 0.0055, compactness_se: 0.0149,
      concavity_se: 0.0168, concave_points_se: 0.0074, symmetry_se: 0.0172,
      fractal_dimension_se: 0.0024,
      // Worst features
      radius_worst: 13.74, texture_worst: 22.84, perimeter_worst: 88.14,
      area_worst: 578.3, smoothness_worst: 0.1254, compactness_worst: 0.1362,
      concavity_worst: 0.1068, concave_points_worst: 0.0530, symmetry_worst: 0.2830,
      fractal_dimension_worst: 0.0769,
    },
  },
  {
    name: "Typical Malignant Case",
    description: "Sample data — large, irregular, highly concave nuclei",
    values: {
      // Mean features
      radius_mean: 19.81, texture_mean: 22.15, perimeter_mean: 130.0,
      area_mean: 1203.0, smoothness_mean: 0.1096, compactness_mean: 0.1599,
      concavity_mean: 0.1974, concave_points_mean: 0.1279, symmetry_mean: 0.2069,
      fractal_dimension_mean: 0.0598,
      // SE features
      radius_se: 0.8880, texture_se: 1.149, perimeter_se: 6.352,
      area_se: 105.4, smoothness_se: 0.0063, compactness_se: 0.0396,
      concavity_se: 0.0555, concave_points_se: 0.0175, symmetry_se: 0.0223,
      fractal_dimension_se: 0.0039,
      // Worst features
      radius_worst: 24.64, texture_worst: 30.57, perimeter_worst: 163.2,
      area_worst: 1856.0, smoothness_worst: 0.1522, compactness_worst: 0.3429,
      concavity_worst: 0.4744, concave_points_worst: 0.2254, symmetry_worst: 0.3598,
      fractal_dimension_worst: 0.0915,
    },
  },
  {
    name: "Borderline Case",
    description: "Sample data — intermediate measurements, near the decision boundary",
    values: {
      // Mean features
      radius_mean: 13.71, texture_mean: 20.83, perimeter_mean: 90.20,
      area_mean: 577.9, smoothness_mean: 0.1189, compactness_mean: 0.1645,
      concavity_mean: 0.0937, concave_points_mean: 0.0598, symmetry_mean: 0.2196,
      fractal_dimension_mean: 0.0663,
      // SE features
      radius_se: 0.4601, texture_se: 1.098, perimeter_se: 3.210,
      area_se: 39.47, smoothness_se: 0.0061, compactness_se: 0.0279,
      concavity_se: 0.0353, concave_points_se: 0.0138, symmetry_se: 0.0199,
      fractal_dimension_se: 0.0031,
      // Worst features
      radius_worst: 16.22, texture_worst: 25.26, perimeter_worst: 105.8,
      area_worst: 819.7, smoothness_worst: 0.1528, compactness_worst: 0.3179,
      concavity_worst: 0.2846, concave_points_worst: 0.1400, symmetry_worst: 0.3057,
      fractal_dimension_worst: 0.0840,
    },
  },
];

// ── Model Evaluation Metrics (Static) ────────────────────────────────────
// TODO: Replace ALL of these placeholder values with real metrics from your trained model.
export const MODEL_METRICS = {
  accuracy: 0.965,
  precision: 0.958,
  recall: 0.958,
  f1_score: 0.958,
  roc_auc: 0.993,
  // Confusion matrix: [[TN, FP], [FN, TP]]
  //   Row 0 = Actual Benign, Row 1 = Actual Malignant
  //   Col 0 = Predicted Benign, Col 1 = Predicted Malignant
  confusion_matrix: [
    [68, 3],   // Actual Benign:    68 correct, 3 false positives
    [2, 41],   // Actual Malignant: 41 correct, 2 false negatives
  ],
  dataset_size: 569,
  train_test_split: "80/20",
};
