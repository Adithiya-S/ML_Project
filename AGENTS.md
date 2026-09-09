# AGENTS.md — Project Context for AI Coding Agents

> **Last updated**: 2026-09-10
>
> Read this file first when starting work on this project. It contains all context
> needed to understand the codebase, API contract, design decisions, and remaining TODOs.

---

## Project Purpose

A **student ML course project** that classifies breast tumours as **benign** or **malignant**
using **logistic regression** on the **Wisconsin Diagnostic Breast Cancer (WDBC) dataset**
(569 samples, 30 numeric features).

This repository contains the **frontend** only — a React single-page application that talks
to a separately-deployed backend REST API.

### Current State

- ✅ Frontend fully built (three-tab SPA: Predict, Results, Model Info)
- ⏳ Backend API not yet connected (placeholder `API_BASE_URL` set to `http://localhost:5000`)
- ⏳ Model not yet trained — all evaluation metrics and example patient values use **placeholder
  values** marked with `// TODO` comments in `src/config.js`

---

## Tech Stack

| Layer          | Technology                         |
| -------------- | ---------------------------------- |
| Framework      | React 19 (via Vite)                |
| Styling        | Tailwind CSS v3                    |
| Charts         | Recharts                           |
| Icons          | Lucide React                       |
| Build tool     | Vite                               |
| Package mgr    | npm                                |

---

## Backend API Contract

The frontend talks to a single endpoint. The backend is built and deployed separately.

### `POST {API_BASE_URL}/predict`

**Request body (JSON):**

```json
{
  "mode": "simple" | "advanced",
  "features": {
    // In "simple" mode: only the 10 "_worst" feature keys
    // In "advanced" mode: all 30 feature keys (_mean, _se, _worst)
    "radius_worst": number,
    "texture_worst": number,
    // ...etc
  }
}
```

**Simple mode** (10 features): Backend fills the remaining 20 features with precomputed
dataset averages before predicting.

**Advanced mode** (30 features): All features supplied by the user; nothing is estimated.

**Response body (JSON):**

```json
{
  "prediction": "Malignant" | "Benign",
  "probability_malignant": number,   // 0 to 1
  "z_value": number,                 // raw logit w·x + b (before sigmoid)
  "confidence": number               // 0 to 1
}
```

### The 30 Feature Keys

10 base measurements × 3 variants (_mean, _se, _worst):

- `radius`, `texture`, `perimeter`, `area`, `smoothness`
- `compactness`, `concavity`, `concave_points`, `symmetry`, `fractal_dimension`

Full key list example: `radius_mean`, `radius_se`, `radius_worst`, `texture_mean`, etc.

---

## File / Folder Structure

```
Codebase/
├── AGENTS.md               ← You are here
├── package.json
├── vite.config.js
├── tailwind.config.js       ← Custom color palette (medical/benign/malignant)
├── postcss.config.js
├── index.html               ← Google Fonts (Inter), SEO meta tags
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx             ← React entry point
    ├── App.jsx              ← Top-level layout, tab state, prediction state
    ├── index.css            ← Tailwind directives + custom component classes
    ├── config.js            ← ⭐ Central config: API_BASE_URL, feature metadata,
    │                             example patients, model evaluation metrics
    └── components/
        ├── FeatureInput.jsx  ← Reusable numeric input with label + tooltip
        ├── PredictTab.jsx    ← Input form (Simple/Advanced toggle, examples, classify)
        ├── ResultsTab.jsx    ← Prediction display (badge, gauge, sigmoid, table)
        ├── ModelInfoTab.jsx  ← Static model evaluation (metrics, confusion matrix, about)
        └── SigmoidChart.jsx  ← Recharts sigmoid curve with prediction point
```

---

## Key Design Decisions

### 1. Simple / Advanced Mode Split

- **Simple mode** shows 10 fields (worst-case measurements only). The backend fills in
  the remaining 20 using dataset averages. This makes the tool approachable for quick demos.
- **Advanced mode** shows all 30 fields, grouped into three visual sections (Mean, SE, Worst)
  to keep them scannable.
- Both modes POST to the same `/predict` endpoint with a `"mode"` field.
- Switching modes preserves any already-entered values (the state object holds all 30 keys).

### 2. Sigmoid Visualization

- A recharts `LineChart` plots σ(z) = 1/(1+e^-z) for z ∈ [-10, 10].
- The current prediction's `z_value` is shown as a highlighted dot on the curve.
- A horizontal reference line at y=0.5 shows the decision threshold.
- A vertical dashed line drops from the prediction point to the x-axis.

### 3. Centralized Configuration

- `src/config.js` is the single file to edit when updating:
  - `API_BASE_URL` (localhost vs deployed)
  - Example patient values
  - Model evaluation metrics
  - Feature metadata (labels, tooltips, min/max/step ranges)

### 4. Static Model Evaluation

- The Model Info tab reads from `MODEL_METRICS` in config.js — no API call needed.
- This keeps the frontend deployable independently of the backend.

### 5. Tailwind v3 Custom Palette

- Medical blue-teal primary palette (`medical-50` through `medical-950`)
- Semantic colors: `benign` (green shades) and `malignant` (red shades)
- Surface grays for backgrounds, cards, and borders
- Font: Inter from Google Fonts

---

## TODOs / Placeholder Data

All placeholder values are in `src/config.js` and marked with `// TODO` comments:

| Item                        | Location in config.js       | What to replace                           |
| --------------------------- | --------------------------- | ----------------------------------------- |
| API base URL                | `API_BASE_URL`              | Change to deployed backend URL            |
| Example patient values      | `EXAMPLE_PATIENTS`          | Replace with real rows from WDBC dataset  |
| Model accuracy              | `MODEL_METRICS.accuracy`    | Real test-set accuracy                    |
| Model precision             | `MODEL_METRICS.precision`   | Real test-set precision                   |
| Model recall                | `MODEL_METRICS.recall`      | Real test-set recall                      |
| Model F1                    | `MODEL_METRICS.f1_score`    | Real test-set F1 score                    |
| Model ROC AUC               | `MODEL_METRICS.roc_auc`     | Real test-set ROC AUC                     |
| Confusion matrix            | `MODEL_METRICS.confusion_matrix` | Real [[TN,FP],[FN,TP]] values       |
| Dataset/split info          | `MODEL_METRICS.dataset_size`, `train_test_split` | Confirm or update     |

---

## Development Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (usually http://localhost:5173)
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
```
