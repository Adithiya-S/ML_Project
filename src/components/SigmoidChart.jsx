import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ReferenceDot,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/**
 * SigmoidChart — Plots the logistic sigmoid σ(z) = 1 / (1 + e^(-z))
 * and highlights the current prediction's z-value on the curve.
 *
 * Props:
 *   zValue              – the logit (w·x + b) from the model
 *   probabilityMalignant – σ(zValue), the model output
 *   prediction          – "Benign" | "Malignant"
 */
export default function SigmoidChart({ zValue, probabilityMalignant, prediction }) {
  // Generate sigmoid curve data points
  const data = useMemo(() => {
    const points = [];
    for (let z = -10; z <= 10; z += 0.2) {
      points.push({
        z: parseFloat(z.toFixed(1)),
        probability: 1 / (1 + Math.exp(-z)),
      });
    }
    return points;
  }, []);

  const isMalignant = prediction === "Malignant";
  const dotColor = isMalignant ? "#dc2626" : "#16a34a";

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-surface-200 rounded-lg shadow-card px-3 py-2">
          <p className="text-xs text-slate-500">z = {payload[0].payload.z.toFixed(1)}</p>
          <p className="text-sm font-medium text-slate-800">
            P(malignant) = {(payload[0].value * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 20, right: 30, bottom: 30, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

          <XAxis
            dataKey="z"
            type="number"
            domain={[-10, 10]}
            tickCount={11}
            tick={{ fontSize: 12, fill: "#64748b" }}
            label={{
              value: "z (logit)",
              position: "insideBottom",
              offset: -15,
              style: { fontSize: 13, fill: "#475569", fontWeight: 500 },
            }}
          />

          <YAxis
            domain={[0, 1]}
            tickCount={6}
            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            tick={{ fontSize: 12, fill: "#64748b" }}
            label={{
              value: "P(malignant)",
              angle: -90,
              position: "insideLeft",
              offset: 5,
              style: { fontSize: 13, fill: "#475569", fontWeight: 500 },
            }}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Decision threshold line at y = 0.5 */}
          <ReferenceLine
            y={0.5}
            stroke="#94a3b8"
            strokeDasharray="6 4"
            label={{
              value: "Threshold (50%)",
              position: "right",
              style: { fontSize: 11, fill: "#94a3b8", fontWeight: 500 },
            }}
          />

          {/* Vertical line at current z-value */}
          <ReferenceLine
            x={zValue}
            stroke={dotColor}
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{
              value: `z = ${zValue.toFixed(2)}`,
              position: "top",
              style: { fontSize: 11, fill: dotColor, fontWeight: 600 },
            }}
          />

          {/* Sigmoid curve */}
          <Line
            type="monotone"
            dataKey="probability"
            stroke="#0084c9"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, fill: "#0084c9" }}
          />

          {/* Highlighted prediction point */}
          <ReferenceDot
            x={zValue}
            y={probabilityMalignant}
            r={7}
            fill={dotColor}
            stroke="white"
            strokeWidth={2}
            isFront
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
