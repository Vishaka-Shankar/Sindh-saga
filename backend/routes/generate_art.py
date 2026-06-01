"""
Artwork Generation Route - Story to Image

This module generates Sindhi cultural artwork from story text using Stable Diffusion.
It creates children's book illustrations with traditional Sindhi folk art styling.

Endpoint: POST /api/generate-art
"""

from fastapi import APIRouter, HTTPException
import requests
import os

router = APIRouter()

@router.post("/generate-art")
async def generate_art(payload: dict):
    """
    Generate artwork from story text using Stable Diffusion API.
    
    Args:
        payload: JSON body with "title" and "storyText" fields
    
    Returns:
        JSON with "image_url" field
    
    Raises:
        HTTPException: If generation fails or API credentials are missing
    """
    api_url = os.getenv("STABLE_DIFFUSION_API_URL")
    api_key = os.getenv("STABLE_DIFFUSION_API_KEY")
    
    if not api_url:
        raise HTTPException(status_code=500, detail="STABLE_DIFFUSION_API_URL not configured")
    if not api_key:
        raise HTTPException(status_code=500, detail="STABLE_DIFFUSION_API_KEY not configured")
    
    title = payload.get("title", "")
    story_text = payload.get("storyText", "")
    
    if not title or not story_text:
        raise HTTPException(status_code=400, detail="title and storyText fields are required")
    
    # Build prompt with Sindhi cultural elements
    story_summary = " ".join(story_text.split(". ")[:2])
    prompt = f"Children's book illustration in Sindhi folk art style. Ajrak block print patterns, Ralli quilt textures, traditional Sindhi clothing, indigo red gold earthen tones, village scenery. Story: {title}. {story_summary}"
    
    try:
        # Call Stable Diffusion API
        endpoint = f"{api_url.rstrip('/')}/v1/generation/stable-diffusion-v1-5/text-to-image"
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        body = {
            "text_prompts": [{"text": prompt}],
            "cfg_scale": 7,
            "height": 768,
            "width": 768,
            "samples": 1,
            "steps": 30
        }
        
        response = requests.post(endpoint, headers=headers, json=body)
        response.raise_for_status()
        
        data = response.json()
        
        # Extract image data from response (format varies by provider)
        artifact = data.get("artifacts", [{}])[0]
        base64_image = artifact.get("base64") or artifact.get("b64_json") or artifact.get("base64_image")
        
        if not base64_image:
            raise HTTPException(status_code=500, detail="No image data in Stable Diffusion response")
        
        # For now, return base64 data. In production, you'd upload to storage and return URL
        return {"image_base64": base64_image}
    
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Stable Diffusion API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Artwork generation failed: {str(e)}")
