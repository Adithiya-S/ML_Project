import { useState } from "react";
import { FlaskConical, BarChart3, BookOpen, Microscope } from "lucide-react";
import PredictTab from "./components/PredictTab";
import ResultsTab from "./components/ResultsTab";
import ModelInfoTab from "./components/ModelInfoTab";

const TABS = [
  { id: "predict", label: "Predict", icon: FlaskConical },
  { id: "results", label: "Results", icon: BarChart3 },
  { id: "model",   label: "Model Info", icon: BookOpen },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("predict");
  const [result, setResult] = useState(null);     // API response
  const [resultMode, setResultMode] = useState(null); // "simple" | "advanced"
  const [resultFeatures, setResultFeatures] = useState(null); // submitted features

  // Called by PredictTab on successful prediction
  const handleResult = (data, mode, features) => {
    setResult(data);
    setResultMode(mode);
    setResultFeatures(features);
    setActiveTab("results"); // Auto-switch to results tab
  };

  // Called by ResultsTab "New Prediction" button
  const handleBack = () => {
    setActiveTab("predict");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Header ── */}
      <header className="bg-white border-b border-surface-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo / title */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-medical-500 to-medical-700 flex items-center justify-center shadow-sm">
                <Microscope size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-800 leading-tight">
                  Breast Tumour Classifier
                </h1>
                <p className="text-xs text-slate-500 leading-tight hidden sm:block">
                  Logistic Regression · WDBC Dataset
                </p>
              </div>
            </div>

            {/* Tab navigation */}
            <nav className="flex items-center gap-1 bg-surface-50 rounded-lg p-1">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const isDisabled = tab.id === "results" && !result;
                return (
                  <button
                    key={tab.id}
                    onClick={() => !isDisabled && setActiveTab(tab.id)}
                    disabled={isDisabled}
                    className={`
                      ${isActive ? "tab-btn-active" : "tab-btn"}
                      ${isDisabled ? "opacity-40 cursor-not-allowed" : ""}
                      flex items-center gap-1.5
                    `}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <tab.icon size={16} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === "predict" && (
            <PredictTab onResult={handleResult} />
          )}
          {activeTab === "results" && result && (
            <ResultsTab
              result={result}
              mode={resultMode}
              features={resultFeatures}
              onBack={handleBack}
            />
          )}
          {activeTab === "model" && (
            <ModelInfoTab />
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-surface-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-xs text-slate-400 text-center">
            ML Course Project · For educational purposes only · Not for clinical diagnosis
          </p>
        </div>
      </footer>
    </div>
  );
}
