# 🚀 Zero-to-Live: Deployment Guide

Follow these exact steps to make **Exam Trace** live on the internet.

---

## Part 1: Final Code Push
First, we need to push the "Cloud-Ready" changes I just made to GitHub.

1.  Open Terminal in VS Code.
2.  Run these commands:
    ```bash
    git add .
    git commit -m "Make backend cloud-ready for Render"
    git push
    ```

---

## Part 2: Deploy Backend (Render.com)

1.  Go to [dashboard.render.com](https://dashboard.render.com/) and create a free account.
2.  Click **"New +"** -> **"Web Service"**.
3.  Connect your GitHub account and select your `exam-trace` repository.
4.  **Configuration Settings:**
    *   **Name:** `exam-trace-api` (or similar)
    *   **Region:** Closest to you (e.g., Singapore/Frankfurt/US)
    *   **Branch:** `master`
    *   **Root Directory:** `backend` (Important! Type exactly `backend`)
    *   **Runtime:** `Python 3`
    *   **Build Command:** `pip install -r requirements.txt`
    *   **Start Command:** `uvicorn main:app --host 0.0.0.0 --port 10000`
    *   **Instance Type:** Free
5.  **Environment Variables (Crucial!):**
    *   Scroll down to "Environment Variables".
    *   Key: `GEMINI_API_KEY`
    *   Value: `Paste_Your_Actual_Google_Gemini_Key_Here`
    *   Key: `PYTHON_VERSION`
    *   Value: `3.10.0` (Recommended)
6.  Click **"Create Web Service"**.
7.  Wait 5 minutes. It will eventually give you a URL like: `https://exam-trace-api.onrender.com`.
    *   **Copy this URL.** You need it for the frontend.

---

## Part 3: Deploy Frontend (Vercel)

1.  Go to [vercel.com](https://vercel.com/) and create a free account.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `exam-trace` repository.
4.  **Framework Preset:** Next.js (Should auto-detect).
5.  **Root Directory:** Edit this! Select `exam-trace` (root) if not already selected.
6.  **Environment Variables:**
    *   We currently hardcoded `http://localhost:8000` in the frontend code.
    *   **STOP!** We need to update one file in your code before you deploy this.
    
    *I will explain this in the chat because we need to replace `localhost:8000` with your new Render URL in `src/lib/api.ts`.*

---

## Part 4: The Final Connection

Once you have your **Render Backend URL** (from Part 2), tell me immediately.
I will verify where `localhost:8000` is used in your frontend code and update it to point to your new live backend.
Then you can deploy the Vercel frontend.
