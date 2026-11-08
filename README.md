# Exam Trace

**An AI-powered exam analysis and prediction tool.**

Exam Trace helps students decide what to study. Upload a syllabus PDF and the app asks Google Gemini to estimate which topics are most likely to appear in an upcoming exam, with a probability, a frequency estimate and sample questions.

> Status: early-stage hackathon MVP (EurekaHacks, Dec 2025). See [Current limitations](#current-limitations).

## Features

- **Dark glassmorphism UI**: animated upload cards, particle backgrounds and a results dashboard.
- **AI topic analysis**: sends a PDF to Google Gemini and returns structured topics (name, probability 0-100, frequency, reasoning, sample questions).
- **Model fallback**: tries `gemini-3-flash-preview`, then `gemini-2.5-flash`, then `gemini-2.5-flash-lite`.
- **Results dashboard**: sortable table and prediction view showing "High Yield" topics.

## Tech stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS, Framer Motion, Three.js (`@react-three/fiber`), Zustand
- **Backend**: Python, FastAPI
- **AI**: Google Generative AI (Gemini Flash family)
- **Hosting**: Vercel (frontend), Render (backend)

## Run locally

### Prerequisites
- Node.js 18+
- Python 3.10+
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

### 1. Clone
```bash
git clone https://github.com/Water9977/exam-trace.git
cd exam-trace
```

### 2. Backend
```bash
cd backend
python -m venv venv
# Windows: .\venv\Scripts\activate    macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
echo "GEMINI_API_KEY=your_key_here" > .env
python -m uvicorn main:app --reload --port 8000
```

The API is served under `/api` (for example `POST /api/upload`).

### 3. Frontend
In a new terminal, from the repo root:
```bash
cp .env.example .env.local   # sets NEXT_PUBLIC_API_URL=http://localhost:8000/api
npm install
npm run dev
```

Open http://localhost:3000.

Alternatively, run both services together with the Vercel CLI (`vercel dev`) and skip `.env.local`.

## Deploy (Vercel, one project)

[`vercel.json`](vercel.json) deploys two services in a single Vercel project: the Next.js app (`app`) at `/` and the FastAPI backend (`backend`) at `/api/*`.

1. Import the repo in Vercel and keep the root directory as `.`.
2. Add the environment variable `GEMINI_API_KEY` (it is read by the backend service).
3. Deploy. Leave `NEXT_PUBLIC_API_URL` unset: the app calls `/api` on its own domain.

Limits to know about: Vercel Functions reject request bodies over 4.5 MB, so PDFs larger than that fail with a 413.

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for details.

## Current limitations

- **Only one PDF is analyzed.** The backend sends the file in the syllabus slot to Gemini. Uploaded past papers are currently only counted (to scale the "X/N Years" frequency), not read, so frequency and probability are model estimates and not counts taken from the papers.
- **Demo fallback.** If the backend is unreachable or returns nothing usable, the frontend shows built-in sample results (`src/lib/mock-data.ts`) instead of an error. Treat results as real only when the backend is up.
- **No scanned-PDF support.** There is no OCR step.
- No automated tests and no license file yet.

## Screenshots

_Not added yet._
