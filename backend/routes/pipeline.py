"""
Pipeline Route - LangGraph Multi-Agent Swarm Orchestration

This module orchestrates the complete SindhSaga pipeline using LangGraph's StateGraph.
It runs 5 specialized agents sequentially:
1. Transcription Agent: Converts audio to text using Whisper
2. PII Scrubbing Agent: Removes personal information with regex
3. Narrative Agent: Generates child-friendly stories using GPT-4o
4. Moderation Agent: Validates content safety using OpenAI Moderation
5. Artistic Agent: Creates Sindhi cultural artwork using Stable Diffusion

Endpoint: POST /api/run-pipeline
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from swarm.pipeline import run_pipeline

router = APIRouter()

@router.post("/run-pipeline")
async def run_swarm_pipeline(file: UploadFile = File(...)):
    """
    Run the complete SindhSaga multi-agent pipeline using LangGraph.
    
    The pipeline executes sequentially:
    transcription → pii_scrubbing → narrative → moderation → artistic
    
    Args:
        file: Audio file to process
    
    Returns:
        Complete StoryState with all pipeline results:
        - transcript: Raw transcription from Whisper
        - scrubbed_transcript: PII-scrubbed transcript
        - title: Generated story title
        - story_text: Generated story text
        - moral: Generated story moral
        - moderation_passed: Boolean flag for content safety
        - image_url: Base64 encoded artwork image
        - error: Error message if any step failed
    
    Raises:
        HTTPException: If pipeline execution fails
    """
    try:
        # Read audio file bytes
        audio_bytes = await file.read()
        
        # Run the LangGraph multi-agent pipeline
        result = run_pipeline(audio_bytes)
        
        # Return complete StoryState as JSON
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline execution failed: {str(e)}")
