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

# Include Routers
app.include_router(upload.router)

@app.get("/")
async def root():
    return {"message": "ExamTrace Backend Running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
