"""
Story Generation Route - Transcript to Narrative

This module generates child-friendly stories from transcripts using OpenAI's GPT-4o.
It preserves Sindhi cultural context and idioms while creating polished narratives.

Endpoint: POST /api/generate-story
"""

from fastapi import APIRouter, HTTPException
from openai import OpenAI
import os
import json

router = APIRouter()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@router.post("/generate-story")
async def generate_story(payload: dict):
    """
    Generate a child-friendly story from a transcript using GPT-4o.
    
    Args:
        payload: JSON body with "transcript" field
    
    Returns:
        JSON with keys: title, storyText, moral
    
    Raises:
        HTTPException: If generation fails or API key is missing
    """
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured")
    
    transcript = payload.get("transcript", "")
    if not transcript:
        raise HTTPException(status_code=400, detail="transcript field is required")
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "You are a narrative agent preserving Sindhi oral traditions. Convert the transcript into a child-friendly 3-act story. Preserve Sindhi cultural idioms and context. Return ONLY valid JSON with keys: title, storyText, moral."
                },
                {
                    "role": "user",
                    "content": f"Transcript: {transcript}"
                }
            ],
            temperature=0.7,
            max_tokens=900
        )
        
        content = response.choices[0].message.content
        
        # Parse JSON response
        try:
            story_data = json.loads(content)
        except json.JSONDecodeError:
            # Try to extract JSON from markdown code blocks
            import re
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                story_data = json.loads(json_match.group(0))
            else:
                raise HTTPException(status_code=500, detail="Failed to parse GPT response as JSON")
        
        return story_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Story generation failed: {str(e)}")
