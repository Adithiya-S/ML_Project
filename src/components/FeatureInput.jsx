import { useState } from "react";
import { HelpCircle } from "lucide-react";

/**
 * FeatureInput — A single numeric input field for a feature measurement.
 *
 * Props:
 *   feature   – feature config object from config.js (key, label, tooltip, min, max, step)
 *   value     – current numeric value (string or number)
 *   onChange   – callback(key, value)
 *   error     – optional error message string
 */
export default function FeatureInput({ feature, value, onChange, error }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      {/* Label row */}
      <div className="flex items-center gap-1.5">
        <label
          htmlFor={feature.key}
          className="text-sm font-medium text-slate-700 leading-tight"
        >
          {feature.label}
        </label>
        {/* Tooltip icon */}
        <div className="relative inline-flex items-center">
          <button
            type="button"
            className="text-slate-400 hover:text-medical-500 transition-colors"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            aria-label={`Info about ${feature.label}`}
            tabIndex={-1}
          >
            <HelpCircle size={14} />
          </button>
          {showTooltip && (
            <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-slate-800 rounded-lg shadow-elevated whitespace-pre-line max-w-xs animate-fade-in pointer-events-none">
              {feature.tooltip}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                <div className="border-4 border-transparent border-t-slate-800" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Number input */}
      <input
        type="number"
        id={feature.key}
        name={feature.key}
        value={value ?? ""}
        onChange={(e) => onChange(feature.key, e.target.value)}
        min={feature.min}
        max={feature.max}
        step={feature.step}
        placeholder={`e.g. ${((feature.min + feature.max) / 2).toFixed(2)}`}
        className={error ? "input-field-error" : "input-field"}
        aria-invalid={!!error}
        aria-describedby={error ? `${feature.key}-error` : undefined}
      />

      {/* Error message */}
      {error && (
        <p id={`${feature.key}-error`} className="text-xs text-malignant-600 mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
}
