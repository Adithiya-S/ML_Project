import {
  Target,
  CheckCircle2,
  BarChart3,
  Database,
  BookOpen,
} from "lucide-react";
import { MODEL_METRICS } from "../config";

/**
 * ModelInfoTab — Static model evaluation display with metrics, confusion matrix,
 * metric explanations, and project information.
 */
export default function ModelInfoTab() {
  const {
    accuracy,
    precision,
    recall,
    f1_score,
    roc_auc,
    confusion_matrix,
    dataset_size,
    train_test_split,
  } = MODEL_METRICS;

  // Confusion matrix labels
  const cm = confusion_matrix;
  const TN = cm[0][0], FP = cm[0][1];
  const FN = cm[1][0], TP = cm[1][1];
  const total = TN + FP + FN + TP;

  const metrics = [
    {
      label: "Accuracy",
      value: accuracy,
      icon: Target,
    },
    {
      label: "Precision",
      value: precision,
      icon: CheckCircle2,
    },
    {
      label: "Recall",
      value: recall,
      icon: BarChart3,
    },
    {
      label: "F1 Score",
      value: f1_score,
      icon: Target,
    },
    {
      label: "ROC AUC",
      value: roc_auc,
      icon: BarChart3,
    },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      {/* ── Metrics card grid ── */}
      <div>
        <h3 className="section-heading flex items-center gap-2">
          <BarChart3 size={20} className="text-medical-500" />
          Test Set Performance
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="metric-card group">
              <m.icon
                size={22}
                className="text-medical-400 mb-1 group-hover:text-medical-600 transition-colors"
              />
              <span className="metric-value">{(m.value * 100).toFixed(1)}%</span>
              <span className="metric-label">{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Confusion Matrix ── */}
      <div className="card p-6">
        <h3 className="section-heading flex items-center gap-2">
          <Database size={20} className="text-medical-500" />
          Confusion Matrix
        </h3>
        <p className="text-sm text-slate-600 mb-5">
          Evaluated on {total} test samples ({train_test_split} train/test split).
        </p>

        <div className="max-w-md mx-auto">
          {/* Column headers */}
          <div className="grid grid-cols-[120px_1fr_1fr] gap-2 mb-2">
            <div /> {/* empty top-left */}
            <p className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Predicted Benign
            </p>
            <p className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Predicted Malignant
            </p>
          </div>

          {/* Row 1: Actual Benign */}
          <div className="grid grid-cols-[120px_1fr_1fr] gap-2 mb-2">
            <div className="flex items-center justify-end pr-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Actual Benign
              </span>
            </div>
            <div className="cm-cell bg-benign-100 text-benign-800 hover:scale-105">
              <span className="text-2xl font-bold">{TN}</span>
              <span className="text-xs mt-1 opacity-75">True Negative</span>
            </div>
            <div className="cm-cell bg-malignant-50 text-malignant-600 hover:scale-105">
              <span className="text-2xl font-bold">{FP}</span>
              <span className="text-xs mt-1 opacity-75">False Positive</span>
            </div>
          </div>

          {/* Row 2: Actual Malignant */}
          <div className="grid grid-cols-[120px_1fr_1fr] gap-2">
            <div className="flex items-center justify-end pr-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Actual Malignant
              </span>
            </div>
            <div className="cm-cell bg-malignant-50 text-malignant-600 hover:scale-105">
              <span className="text-2xl font-bold">{FN}</span>
              <span className="text-xs mt-1 opacity-75">False Negative</span>
            </div>
            <div className="cm-cell bg-benign-100 text-benign-800 hover:scale-105">
              <span className="text-2xl font-bold">{TP}</span>
              <span className="text-xs mt-1 opacity-75">True Positive</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Metric Explanations ── */}
      <div className="card p-6">
        <h3 className="section-heading flex items-center gap-2">
          <BookOpen size={20} className="text-medical-500" />
          What Do These Metrics Mean?
        </h3>
        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <div>
            <p>
              <strong className="text-slate-800">Accuracy</strong> — The percentage of all predictions
              (both benign and malignant) that were correct. An accuracy of{" "}
              {(accuracy * 100).toFixed(1)}% means the model correctly classified that many samples
              out of the test set.
            </p>
          </div>
          <div>
            <p>
              <strong className="text-slate-800">Precision</strong> — Of all the tumours the model
              labelled as malignant, what percentage actually were malignant? High precision means
              fewer false alarms (healthy patients incorrectly flagged).
            </p>
          </div>
          <div>
            <p>
              <strong className="text-slate-800">Recall (Sensitivity)</strong> — Of all the tumours
              that truly were malignant, what percentage did the model catch? High recall is critical
              in medical contexts — missing a malignant tumour (false negative) can be dangerous.
            </p>
          </div>
          <div>
            <p>
              <strong className="text-slate-800">F1 Score</strong> — The harmonic mean of precision
              and recall, providing a single balanced metric. Useful when you care equally about
              avoiding false positives and false negatives.
            </p>
          </div>
          <div>
            <p>
              <strong className="text-slate-800">ROC AUC</strong> — Area Under the Receiver Operating
              Characteristic curve. Measures the model&apos;s ability to distinguish between classes
              across all possible thresholds. A value of 1.0 is perfect; 0.5 is no better than random.
            </p>
          </div>
        </div>
      </div>

      {/* ── About This Project ── */}
      <div className="card p-6">
        <h3 className="section-heading flex items-center gap-2">
          <Database size={20} className="text-medical-500" />
          About This Project
        </h3>
        <div className="text-sm text-slate-700 leading-relaxed space-y-3">
          <p>
            This application classifies breast tumours as <strong>benign</strong> or{" "}
            <strong>malignant</strong> using <strong>logistic regression</strong>, trained on the{" "}
            <strong>Wisconsin Diagnostic Breast Cancer (WDBC) dataset</strong>.
          </p>
          <p>
            The dataset contains <strong>{dataset_size} samples</strong> of digitised images of fine
            needle aspirates (FNA) of breast masses. Each sample has 30 numeric features describing
            characteristics of cell nuclei — 10 base measurements (radius, texture, perimeter, area,
            smoothness, compactness, concavity, concave points, symmetry, and fractal dimension),
            each computed as a mean, standard error, and worst (largest) value.
          </p>
          <p>
            In <strong>Simple mode</strong>, only the 10 worst-case measurements are required. The
            backend estimates the remaining 20 features using precomputed dataset averages before
            running the prediction. In <strong>Advanced mode</strong>, the user provides all 30
            features for a more precise result.
          </p>
          <p className="text-xs text-slate-500 italic">
            Dataset source: UCI Machine Learning Repository — Breast Cancer Wisconsin (Diagnostic).
            This is a student ML course project for educational purposes only and is not intended for
            clinical use.
          </p>
        </div>
      </div>
    </div>
  );
}
