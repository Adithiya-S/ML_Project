# ============================================================
# Backend API — serves the trained logistic regression model.
#
# SETUP:
#   1. Put model.pkl, scaler.pkl, feature_defaults.pkl, feature_order.pkl
#      (from train_model.py) in the same folder as this file.
#   2. pip install fastapi uvicorn scikit-learn joblib pydantic
#   3. Run:  uvicorn backend_main:app --reload
#   4. Test: open http://localhost:8000/docs for an interactive test UI
# ============================================================

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Literal
import numpy as np
import joblib

app = FastAPI(title="Breast Tumour Classifier API")

# Allow the frontend (running on a different port/domain) to call this API.
# For the class project, "*" is fine. Tighten this to your actual frontend
# URL before/if you ever deploy this somewhere public long-term.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("model.pkl")
scaler = joblib.load("scaler.pkl")
feature_defaults = joblib.load("feature_defaults.pkl")   # dict: {col_name: mean_value} for the 20 non-worst cols
feature_order = joblib.load("feature_order.pkl")         # list of all 30 column names, in training order


class PredictRequest(BaseModel):
    mode: Literal["simple", "advanced"]
    features: Dict[str, float]


@app.get("/")
def health_check():
    return {"status": "ok", "message": "Breast tumour classifier API is running"}


def normalize_keys(features: Dict[str, float]) -> Dict[str, float]:
    """The frontend sends underscore-only keys (e.g. concave_points_worst),
    but the trained model's columns use a space (e.g. 'concave points_worst').
    Convert incoming keys to match before doing anything else."""
    return {k.replace("concave_points", "concave points"): v for k, v in features.items()}


@app.post("/predict")
def predict(req: PredictRequest):
    req.features = normalize_keys(req.features)

    if req.mode == "simple":
        # Start from the dataset-average defaults, then overlay the user's
        # 10 submitted "_worst" values on top.
        full_features = dict(feature_defaults)
        full_features.update(req.features)
    else:
        full_features = dict(req.features)

    # Make sure every column the model expects is present.
    missing = [c for c in feature_order if c not in full_features]
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing features: {missing}")

    # Build the input row in the EXACT column order the model was trained on.
    x = np.array([[full_features[col] for col in feature_order]])
    x_scaled = scaler.transform(x)

    z = float(model.decision_function(x_scaled)[0])
    prob_malignant = float(model.predict_proba(x_scaled)[0][1])
    prediction = "Malignant" if prob_malignant >= 0.5 else "Benign"
    confidence = max(prob_malignant, 1 - prob_malignant)

    return {
        "prediction": prediction,
        "probability_malignant": prob_malignant,
        "z_value": z,
        "confidence": confidence,
    }
