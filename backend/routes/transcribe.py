"""
Transcription Route - Audio to Text

This module handles audio file uploads and transcribes them using OpenAI's Whisper API.
It accepts multipart audio files and returns the transcribed text.

Endpoint: POST /api/transcribe
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from openai import OpenAI
import os

router = APIRouter()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Transcribe an audio file using OpenAI Whisper API.
    
    Args:
        file: Audio file (supports mp3, mp4, mpeg, mpga, m4a, wav, webm)
    
    Returns:
        JSON with the transcribed text
    
    Raises:
        HTTPException: If transcription fails or API key is missing
    """
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured")
    
    try:
        # Read file content
        audio_content = await file.read()
        
        # Create a temporary file for OpenAI API
        import tempfile
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file.filename.split('.')[-1]}") as temp_file:
            temp_file.write(audio_content)
            temp_file_path = temp_file.name
        
        # Transcribe using Whisper
        with open(temp_file_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                language="sd",  # Sindhi language hint
                response_format="text"
            )
        
        # Clean up temporary file
        os.unlink(temp_file_path)
        
        return {"transcript": transcription}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")
