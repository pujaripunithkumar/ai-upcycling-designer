# RELOOP Backend (FastAPI + AI Vision)

Multimodal AI-powered FastAPI backend service for RELOOP AI Upcycling Designer.

## Features
- **Multimodal AI Vision Analysis (Gemini 2.5 Flash)**:
  - Inspects uploaded garment images in real-time.
  - Extracts garment type, primary color, material, condition score, visible damage, reusable components, and usable fabric percentage.
- **Rule-Based Fallback**:
  - Automatically falls back to internal PIL pixel analysis and heuristic rules if no API key is set, or if an API network/quota error occurs.
- **Upcycling Idea Generation**:
  - Generates custom transformation plans (target product, difficulty, time estimate, material utilization, step-by-step instructions, and waste reduction).
- **Feasibility Calculator**:
  - Computes dynamic score (0-100%) and practical checklist.
- **100% Backward Compatible**:
  - Zero breaking changes to the `POST /api/analyze` response contract. CORS enabled for seamless React integration.

---

## Setup & Execution Guide

### Step 1: Create a Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click **"Get API Key"** $\rightarrow$ **"Create API key"**.
4. Copy your generated API key string.

---

### Step 2: Configure Environment Variables
In the `backend/` directory, create a file named `.env` (or copy `.env.example`):
```bash
cp .env.example .env
```
Open `.env` and paste your Gemini API key:
```env
GEMINI_API_KEY=AIzaSy...YourKeyHere
```

> **Note**: `.env` is listed in `.gitignore` to keep your credentials secure.

---

### Step 3: Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

---

### Step 4: Run the FastAPI Backend Server
```bash
python main.py
```
Or with uvicorn:
```bash
uvicorn main:app --reload --port 8000
```

The server runs at `http://localhost:8000`:
- **API Health Check**: `GET http://localhost:8000/api/health`
- **Garment Analysis Endpoint**: `POST http://localhost:8000/api/analyze`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`

---

### Testing AI Vision & Fallback
- **With API Key in `.env`**: Uploading an image sends it to Gemini 2.5 Flash for multimodal vision analysis.
- **Without API Key / Offline**: The backend gracefully uses local PIL pixel color extraction and heuristic logic without crashing or returning errors.
