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
  // ── Benign Cases ──────────────────────────────────────────────────────────
  {
    name: "Typical Benign Case",
    type: "Benign",
    description: "Sample preset — small, smooth, symmetric nuclei",
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
    name: "Clear Low-Risk Benign",
    type: "Benign",
    description: "WDBC #864033 — very small, uniform cells with minimal indentation",
    values: {
      // Mean features
      radius_mean: 9.777, texture_mean: 16.99, perimeter_mean: 62.50,
      area_mean: 290.2, smoothness_mean: 0.1037, compactness_mean: 0.08404,
      concavity_mean: 0.04334, concave_points_mean: 0.01778, symmetry_mean: 0.1584,
      fractal_dimension_mean: 0.07065,
      // SE features
      radius_se: 0.4030, texture_se: 1.424, perimeter_se: 2.747,
      area_se: 22.87, smoothness_se: 0.01385, compactness_se: 0.02932,
      concavity_se: 0.02722, concave_points_se: 0.01023, symmetry_se: 0.03281,
      fractal_dimension_se: 0.004638,
      // Worst features
      radius_worst: 11.05, texture_worst: 21.47, perimeter_worst: 71.68,
      area_worst: 367.0, smoothness_worst: 0.1467, compactness_worst: 0.1765,
      concavity_worst: 0.1300, concave_points_worst: 0.05334, symmetry_worst: 0.2533,
      fractal_dimension_worst: 0.08468,
    },
  },
  {
    name: "Moderate Benign (Fibroadenoma)",
    type: "Benign",
    description: "WDBC #8510426 — moderate mass size with regular, benign margins",
    values: {
      // Mean features
      radius_mean: 13.54, texture_mean: 14.36, perimeter_mean: 87.46,
      area_mean: 566.3, smoothness_mean: 0.09779, compactness_mean: 0.08129,
      concavity_mean: 0.06664, concave_points_mean: 0.04781, symmetry_mean: 0.1885,
      fractal_dimension_mean: 0.05766,
      // SE features
      radius_se: 0.2699, texture_se: 0.7886, perimeter_se: 2.058,
      area_se: 23.56, smoothness_se: 0.008462, compactness_se: 0.01460,
      concavity_se: 0.02387, concave_points_se: 0.01315, symmetry_se: 0.01980,
      fractal_dimension_se: 0.002300,
      // Worst features
      radius_worst: 15.11, texture_worst: 19.26, perimeter_worst: 99.70,
      area_worst: 711.2, smoothness_worst: 0.1440, compactness_worst: 0.1773,
      concavity_worst: 0.2390, concave_points_worst: 0.1288, symmetry_worst: 0.2977,
      fractal_dimension_worst: 0.07259,
    },
  },

  // ── Malignant Cases ───────────────────────────────────────────────────────
  {
    name: "Typical Malignant Case",
    type: "Malignant",
    description: "Sample preset — large, irregular, highly concave nuclei",
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
    name: "Early / Subtle Malignant",
    type: "Malignant",
    description: "WDBC #87556202 — moderately enlarged perimeter with elevated concavity",
    values: {
      // Mean features
      radius_mean: 14.86, texture_mean: 23.21, perimeter_mean: 100.4,
      area_mean: 671.4, smoothness_mean: 0.1044, compactness_mean: 0.1980,
      concavity_mean: 0.1697, concave_points_mean: 0.08878, symmetry_mean: 0.1737,
      fractal_dimension_mean: 0.06672,
      // SE features
      radius_se: 0.2796, texture_se: 0.9622, perimeter_se: 3.591,
      area_se: 25.20, smoothness_se: 0.008081, compactness_se: 0.05122,
      concavity_se: 0.05551, concave_points_se: 0.01883, symmetry_se: 0.02545,
      fractal_dimension_se: 0.004312,
      // Worst features
      radius_worst: 16.08, texture_worst: 27.78, perimeter_worst: 118.6,
      area_worst: 784.7, smoothness_worst: 0.1316, compactness_worst: 0.4648,
      concavity_worst: 0.4589, concave_points_worst: 0.1727, symmetry_worst: 0.3000,
      fractal_dimension_worst: 0.08701,
    },
  },
  {
    name: "Advanced High-Grade Malignant",
    type: "Malignant",
    description: "WDBC #88649001 — pronounced nuclear pleomorphism & large irregular contour",
    values: {
      // Mean features
      radius_mean: 19.55, texture_mean: 28.77, perimeter_mean: 133.6,
      area_mean: 1207.0, smoothness_mean: 0.0926, compactness_mean: 0.2063,
      concavity_mean: 0.1784, concave_points_mean: 0.1144, symmetry_mean: 0.1893,
      fractal_dimension_mean: 0.06232,
      // SE features
      radius_se: 0.8426, texture_se: 1.199, perimeter_se: 7.158,
      area_se: 106.4, smoothness_se: 0.006356, compactness_se: 0.04765,
      concavity_se: 0.03863, concave_points_se: 0.01519, symmetry_se: 0.01936,
      fractal_dimension_se: 0.005252,
      // Worst features
      radius_worst: 25.05, texture_worst: 36.27, perimeter_worst: 178.6,
      area_worst: 1926.0, smoothness_worst: 0.1281, compactness_worst: 0.5329,
      concavity_worst: 0.4251, concave_points_worst: 0.1941, symmetry_worst: 0.2818,
      fractal_dimension_worst: 0.1005,
    },
  },

  // ── Borderline Cases ──────────────────────────────────────────────────────
  {
    name: "Borderline Case",
    type: "Borderline",
    description: "Sample preset — intermediate measurements, near the decision boundary",
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
  {
    name: "Equivocal Borderline (p ≈ 50%)",
    type: "Borderline",
    description: "WDBC #9112085 — right on the 0.5 boundary with elevated nuclear texture",
    values: {
      // Mean features
      radius_mean: 13.38, texture_mean: 30.72, perimeter_mean: 86.34,
      area_mean: 557.2, smoothness_mean: 0.09245, compactness_mean: 0.07426,
      concavity_mean: 0.02819, concave_points_mean: 0.03264, symmetry_mean: 0.1375,
      fractal_dimension_mean: 0.06016,
      // SE features
      radius_se: 0.3408, texture_se: 1.924, perimeter_se: 2.287,
      area_se: 28.93, smoothness_se: 0.005841, compactness_se: 0.01246,
      concavity_se: 0.007936, concave_points_se: 0.009128, symmetry_se: 0.01564,
      fractal_dimension_se: 0.002985,
      // Worst features
      radius_worst: 15.05, texture_worst: 41.61, perimeter_worst: 96.69,
      area_worst: 705.6, smoothness_worst: 0.1172, compactness_worst: 0.1421,
      concavity_worst: 0.07003, concave_points_worst: 0.07763, symmetry_worst: 0.2196,
      fractal_dimension_worst: 0.07675,
    },
  },
  {
    name: "Suspicious Atypical Borderline",
    type: "Borderline",
    description: "WDBC #879523 — overlapping morphological features near decision threshold",
    values: {
      // Mean features
      radius_mean: 15.12, texture_mean: 16.68, perimeter_mean: 98.78,
      area_mean: 716.6, smoothness_mean: 0.08876, compactness_mean: 0.09588,
      concavity_mean: 0.0755, concave_points_mean: 0.04079, symmetry_mean: 0.1594,
      fractal_dimension_mean: 0.05986,
      // SE features
      radius_se: 0.2711, texture_se: 0.3621, perimeter_se: 1.974,
      area_se: 26.44, smoothness_se: 0.005472, compactness_se: 0.01919,
      concavity_se: 0.02039, concave_points_se: 0.00826, symmetry_se: 0.01523,
      fractal_dimension_se: 0.002881,
      // Worst features
      radius_worst: 17.77, texture_worst: 20.24, perimeter_worst: 117.7,
      area_worst: 989.5, smoothness_worst: 0.1491, compactness_worst: 0.3331,
      concavity_worst: 0.3327, concave_points_worst: 0.1252, symmetry_worst: 0.3415,
      fractal_dimension_worst: 0.0974,
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
