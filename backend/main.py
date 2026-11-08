from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import upload
import uvicorn
import os

app = FastAPI()


# CORS Configuration
# Allow ALL origins for Hackathon/Demo flexibility
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Vercel routes /api/* to this service WITHOUT stripping the prefix, so every
# route is mounted under /api (e.g. POST /api/upload).
API_PREFIX = "/api"

# Include Routers
app.include_router(upload.router, prefix=API_PREFIX)

@app.get("/")
async def root():
    return {"message": "ExamTrace Backend Running"}

@app.get(f"{API_PREFIX}/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
