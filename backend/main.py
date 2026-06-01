"""
SindhSaga Backend - FastAPI Application

This is the main entry point for the SindhSaga backend API.
It provides endpoints for audio transcription, story generation, and artwork generation.
All routes are CORS-enabled for development.

Routes included:
- /transcribe: Audio transcription using OpenAI Whisper
- /generate-story: Story generation using GPT-4o
- /generate-art: Artwork generation using Stable Diffusion
- /pipeline: End-to-end pipeline orchestration
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="SindhSaga Backend",
    description="Backend API for SindhSaga - Sindhi oral tradition preservation platform",
    version="1.0.0"
)

# Enable CORS for all origins (configure appropriately for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include route modules
from routes import transcribe, generate_story, generate_art, pipeline

app.include_router(transcribe.router, prefix="/api", tags=["transcription"])
app.include_router(generate_story.router, prefix="/api", tags=["story"])
app.include_router(generate_art.router, prefix="/api", tags=["artwork"])
app.include_router(pipeline.router, prefix="/api", tags=["pipeline"])

# Root endpoint
@app.get("/")
async def root():
    return {"status": "SindhSaga backend running"}

# Health check endpoint
@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
