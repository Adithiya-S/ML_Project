# 🩺 Breast Cancer Tumour Classification System

An interactive machine learning web application for classifying breast tumours as **Benign** or **Malignant** using **Logistic Regression** trained on the **Wisconsin Diagnostic Breast Cancer (WDBC)** dataset (569 samples, 30 fine-needle aspirate cell nucleus features).

---

## 📋 Features

- **Dual Input Modes**:
  - **Simple Mode**: Enter only the 10 most informative worst-case measurements (`_worst`); the backend automatically imputes the remaining 20 features using precomputed dataset means.
  - **Advanced Mode**: Enter all 30 features grouped into **Mean**, **Standard Error (SE)**, and **Worst** measurement categories.
- **Interactive Quick-Load Presets**: Load real patient cases from the WDBC dataset with a single click (Benign, Malignant, Borderline cases).
- **Mathematical Visualizations**:
  - Probability meter and classification confidence gauge.
  - Interactive **Sigmoid Activation Curve** ($\sigma(z) = \frac{1}{1 + e^{-z}}$) displaying the exact calculated logit ($z$-score), decision threshold ($0.5$), and prediction point.
- **Model Evaluation Dashboard**: Comprehensive metrics breakdown (Accuracy, Precision, Recall, F1 Score, ROC-AUC) along with an interactive Confusion Matrix and methodology notes.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (via [Vite](https://vite.dev/))
- **Styling**: Tailwind CSS v3 (Custom medical theme palette)
- **Charts & Graphs**: Recharts
- **Icons**: Lucide React

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.9+)
- **ASGI Server**: [Uvicorn](https://www.uvicorn.org/)
- **Machine Learning**: Scikit-learn, NumPy, Joblib
- **Data Validation**: Pydantic

---

## 📁 Repository Structure

```text
Codebase/
├── backend/
│   ├── backend_main.py       # FastAPI application and prediction endpoint
│   ├── requirements.txt      # Python backend dependencies
│   ├── model.pkl             # Trained Logistic Regression model
│   ├── scaler.pkl            # Fitted StandardScaler
│   ├── feature_defaults.pkl  # Dataset means for simple mode imputation
│   └── feature_order.pkl     # Feature column ordering expected by model
├── src/
│   ├── components/
│   │   ├── FeatureInput.jsx  # Numerical input with min/max and tooltips
│   │   ├── ModelInfoTab.jsx  # Model metrics & confusion matrix view
│   │   ├── PredictTab.jsx    # Input form (Simple/Advanced + Presets)
│   │   ├── ResultsTab.jsx    # Prediction badges, gauge & result summary
│   │   └── SigmoidChart.jsx  # Interactive Sigmoid curve visualization
│   ├── App.jsx               # Main layout and state management
│   ├── config.js             # API URLs, sample patients, feature metadata
│   ├── index.css             # Tailwind styling & component utilities
│   └── main.jsx              # Application entry point
├── package.json              # Node.js dependencies and scripts
├── tailwind.config.js        # Theme color tokens & configuration
├── vite.config.js            # Vite build configuration
└── README.md                 # Project documentation
```

---

## 🚀 Quick Start Guide

To run the application locally, you will start the **Backend API server** and the **Frontend development server** in two separate terminal windows.

### Prerequisites

- **Python 3.9+** and `pip`
- **Node.js 18+** and `npm`

---

### Step 1: Start the Backend Server

The backend loads model pickle files from its local folder, so make sure to run the command from the `backend/` directory.

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. *(Recommended)* Create and activate a Python virtual environment:
   - **Windows (PowerShell):**
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - **macOS / Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
   *(Or manually: `pip install fastapi uvicorn scikit-learn joblib pydantic numpy`)*

4. Start the FastAPI server with Uvicorn:
   ```bash
   uvicorn backend_main:app --reload --port 8000
   ```

5. Verify the backend is running:
   - API Status: [http://127.0.0.1:8000](http://127.0.0.1:8000)
   - Interactive Swagger API Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### Step 2: Start the Frontend Application

1. Open a second terminal and navigate to the project root (`Codebase/`):
   ```bash
   cd Codebase
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

## 📡 API Specification

### Health Check
- **Endpoint**: `GET /`
- **Response**:
  ```json
  {
    "status": "ok",
    "message": "Breast tumour classifier API is running"
  }
  ```

### Prediction Endpoint
- **Endpoint**: `POST /predict`
- **Request Body**:
  ```json
  {
    "mode": "simple",
    "features": {
      "radius_worst": 17.99,
      "texture_worst": 10.38,
      "perimeter_worst": 122.8,
      "area_worst": 1001.0,
      "smoothness_worst": 0.1184,
      "compactness_worst": 0.2776,
      "concavity_worst": 0.3001,
      "concave_points_worst": 0.1471,
      "symmetry_worst": 0.4601,
      "fractal_dimension_worst": 0.1189
    }
  }
  ```
- **Response Body**:
  ```json
  {
    "prediction": "Malignant",
    "probability_malignant": 0.9842,
    "z_value": 4.125,
    "confidence": 0.9842
  }
  ```

---

## ⚙️ Configuration

- **Backend API URL**: Configured in [`src/config.js`](file:///c:/Users/thisi/Stuff/College/Machine%20Learning/Project/Codebase/src/config.js):
  ```javascript
  export const API_BASE_URL = "http://127.0.0.1:8000";
  ```
  Change this when deploying the backend to a remote server (e.g., Render, Railway, AWS).

---

## 🧪 Production Build

To test or build the frontend for production deployment:

```bash
# Generate production bundle in dist/
npm run build

# Preview production build locally
npm run preview
```
