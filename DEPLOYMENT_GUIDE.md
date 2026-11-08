# Deployment Guide

Exam Trace deploys to Vercel as one project with two services, defined in [`vercel.json`](vercel.json):

| Service   | Root       | Framework | Public path |
|-----------|------------|-----------|-------------|
| `app`     | `.`        | Next.js   | `/*`        |
| `backend` | `backend/` | FastAPI   | `/api/*`    |

Vercel sends the original request path to a service without stripping the prefix, so the backend mounts all routes under `/api` (`backend/main.py`). The browser calls `/api/upload` on the same domain, so no CORS or backend URL setup is needed in production.

## Deploy

1. Push the repo to GitHub and import it in Vercel (root directory `.`).
2. In Project Settings, add the environment variable `GEMINI_API_KEY`.
3. Deploy, then open the production URL.

## Verify

- `GET https://<your-domain>/api/health` returns `{"status":"ok"}`.
- Upload a PDF in the app. If you always see the same sample topics, the frontend is falling back to built-in mock data because `/api/upload` failed. Check the Network tab and the backend function logs.

## Limits

- Request bodies are capped at 4.5 MB per Vercel Function, so larger PDFs get a 413 error.
- Function duration defaults to 300 s on the Hobby plan, which is enough for a Gemini analysis.

## Local development

- `vercel dev` runs both services together (`vercel dev -L` works without logging in).
- Or run them separately: `uvicorn main:app --reload --port 8000` in `backend/`, and `npm run dev` with `NEXT_PUBLIC_API_URL=http://localhost:8000/api` in `.env.local`.
