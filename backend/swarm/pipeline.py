"""
LangGraph Multi-Agent Swarm Pipeline

This module implements a multi-agent workflow using LangGraph's StateGraph.
It orchestrates 5 specialized agents for the SindhSaga pipeline:
1. Transcription Agent: Converts audio to text using Whisper
2. PII Scrubbing Agent: Removes personal information with regex
3. Narrative Agent: Generates child-friendly stories using GPT-4o
4. Moderation Agent: Validates content safety using OpenAI Moderation
5. Artistic Agent: Creates Sindhi cultural artwork using Stable Diffusion

The graph executes sequentially: transcription → pii_scrubbing → narrative → moderation → artistic
"""

from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END
from openai import OpenAI
import requests
import os
import re
import json
import tempfile

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Define shared state for all agents
class StoryState(TypedDict):
    audio_bytes: bytes
    transcript: str
    scrubbed_transcript: str
    title: str
    story_text: str
    moral: str
    moderation_passed: bool
    image_url: str
    error: str

# ============================================================================
# Agent 1: Transcription Node
# ============================================================================
def transcription_node(state: StoryState) -> StoryState:
    """
    Transcribe audio bytes to text using OpenAI Whisper API.
    
    Args:
        state: Current workflow state with audio_bytes
    
    Returns:
        Updated state with transcript or error
    """
    try:
        audio_bytes = state["audio_bytes"]
        
        # Create temporary file for Whisper API
        with tempfile.NamedTemporaryFile(delete=False, suffix=".m4a") as temp_file:
            temp_file.write(audio_bytes)
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
        
        state["transcript"] = transcription
        state["error"] = ""
        return state
    
    except Exception as e:
        state["error"] = f"Transcription failed: {str(e)}"
        return state

# ============================================================================
# Agent 2: PII Scrubbing Node
# ============================================================================
def pii_scrubbing_node(state: StoryState) -> StoryState:
    """
    Remove personally identifiable information from transcript using regex patterns.
    
    Removes:
    - Pakistani phone numbers
    - Email addresses
    - CNIC numbers
    - Name patterns (English and Sindhi)
    - Address patterns (House, Plot, Block, Sector)
    
    Args:
        state: Current workflow state with transcript
    
    Returns:
        Updated state with scrubbed_transcript
    """
    transcript = state["transcript"]
    scrubbed = transcript
    
    # Pakistani phone numbers
    scrubbed = re.sub(r'0[3][0-9]{9}', '[PHONE REMOVED]', scrubbed)
    scrubbed = re.sub(r'\+92[0-9]{10}', '[PHONE REMOVED]', scrubbed)
    
    # Email addresses
    scrubbed = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', '[EMAIL REMOVED]', scrubbed)
    
    # CNIC format: XXXXX-XXXXXXX-X
    scrubbed = re.sub(r'[0-9]{5}-[0-9]{7}-[0-9]', '[CNIC REMOVED]', scrubbed)
    
    # Name patterns
    scrubbed = re.sub(r'my name is \w+', '[NAME REMOVED]', scrubbed, flags=re.IGNORECASE)
    scrubbed = re.sub(r'mera naam \w+', '[NAME REMOVED]', scrubbed, flags=re.IGNORECASE)
    
    # Address patterns
    scrubbed = re.sub(r'house\s+\w+', '[ADDRESS REMOVED]', scrubbed, flags=re.IGNORECASE)
    scrubbed = re.sub(r'plot\s+\w+', '[ADDRESS REMOVED]', scrubbed, flags=re.IGNORECASE)
    scrubbed = re.sub(r'block\s+\w+', '[ADDRESS REMOVED]', scrubbed, flags=re.IGNORECASE)
    scrubbed = re.sub(r'sector\s+\w+', '[ADDRESS REMOVED]', scrubbed, flags=re.IGNORECASE)
    
    state["scrubbed_transcript"] = scrubbed
    return state

# ============================================================================
# Agent 3: Narrative Node
# ============================================================================
def narrative_node(state: StoryState) -> StoryState:
    """
    Generate child-friendly story from scrubbed transcript using GPT-4o.
    
    Args:
        state: Current workflow state with scrubbed_transcript
    
    Returns:
        Updated state with title, story_text, moral or error
    """
    try:
        scrubbed_transcript = state["scrubbed_transcript"]
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "You are a Sindhi cultural narrative agent. Convert this transcript into a child-friendly story in 3 acts. Preserve Sindhi idioms. Return ONLY JSON with keys: title, storyText, moral."
                },
                {
                    "role": "user",
                    "content": f"Transcript: {scrubbed_transcript}"
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
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                story_data = json.loads(json_match.group(0))
            else:
                state["error"] = "Failed to parse GPT response as JSON"
                return state
        
        state["title"] = story_data.get("title", "")
        state["story_text"] = story_data.get("storyText", "")
        state["moral"] = story_data.get("moral", "")
        return state
    
    except Exception as e:
        state["error"] = f"Narrative generation failed: {str(e)}"
        return state

# ============================================================================
# Agent 4: Moderation Node
# ============================================================================
def moderation_node(state: StoryState) -> StoryState:
    """
    Validate content safety using OpenAI Moderation API.
    
    Args:
        state: Current workflow state with story_text
    
    Returns:
        Updated state with moderation_passed flag or error
    """
    try:
        story_text = state["story_text"]
        
        response = client.moderations.create(
            model="omni-moderation-latest",
            input=story_text
        )
        
        result = response.results[0]
        
        if result.flagged:
            state["moderation_passed"] = False
            state["error"] = "Story flagged by moderation"
        else:
            state["moderation_passed"] = True
        
        return state
    
    except Exception as e:
        state["error"] = f"Moderation check failed: {str(e)}"
        return state

# ============================================================================
# Agent 5: Artistic Node
# ============================================================================
def artistic_node(state: StoryState) -> StoryState:
    """
    Generate Sindhi cultural artwork using Stable Diffusion API.
    
    Only executes if moderation_passed is True.
    
    Args:
        state: Current workflow state with title and story_text
    
    Returns:
        Updated state with image_url or unchanged if moderation failed
    """
    # Skip if moderation failed
    if not state["moderation_passed"]:
        return state
    
    try:
        api_url = os.getenv("STABLE_DIFFUSION_API_URL")
        api_key = os.getenv("STABLE_DIFFUSION_API_KEY")
        
        if not api_url or not api_key:
            state["error"] = "Stable Diffusion credentials not configured"
            return state
        
        title = state["title"]
        story_text = state["story_text"]
        
        # Build prompt with Sindhi cultural elements
        story_summary = " ".join(story_text.split(". ")[:2])
        prompt = f"Children's book illustration in Sindhi folk art style. Ajrak block print patterns, Ralli quilt textures, traditional Sindhi clothing, indigo red gold earthen tones, village scenery. Story: {title}. {story_summary}"
        
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
        
        # Extract image data from response
        artifact = data.get("artifacts", [{}])[0]
        base64_image = artifact.get("base64") or artifact.get("b64_json") or artifact.get("base64_image")
        
        if not base64_image:
            state["error"] = "No image data in Stable Diffusion response"
            return state
        
        # For now, return base64 data. In production, upload to storage
        state["image_url"] = f"data:image/png;base64,{base64_image}"
        return state
    
    except Exception as e:
        state["error"] = f"Artwork generation failed: {str(e)}"
        return state

# ============================================================================
# Build and Compile the Graph
# ============================================================================

# Initialize the StateGraph
workflow = StateGraph(StoryState)

# Add all 5 nodes
workflow.add_node("transcription", transcription_node)
workflow.add_node("pii_scrubbing", pii_scrubbing_node)
workflow.add_node("narrative", narrative_node)
workflow.add_node("moderation", moderation_node)
workflow.add_node("artistic", artistic_node)

# Set entry point
workflow.set_entry_point("transcription")

# Add sequential edges
workflow.add_edge("transcription", "pii_scrubbing")
workflow.add_edge("pii_scrubbing", "narrative")
workflow.add_edge("narrative", "moderation")
workflow.add_edge("moderation", "artistic")
workflow.add_edge("artistic", END)

# Compile the graph
app = workflow.compile()

# ============================================================================
# Export Pipeline Function
# ============================================================================

def run_pipeline(audio_bytes: bytes) -> StoryState:
    """
    Run the complete SindhSaga multi-agent pipeline.
    
    Args:
        audio_bytes: Raw audio file bytes
    
    Returns:
        Complete StoryState with all pipeline results
    """
    # Initialize state
    initial_state: StoryState = {
        "audio_bytes": audio_bytes,
        "transcript": "",
        "scrubbed_transcript": "",
        "title": "",
        "story_text": "",
        "moral": "",
        "moderation_passed": False,
        "image_url": "",
        "error": ""
    }
    
    # Run the graph
    final_state = app.invoke(initial_state)
    
    return final_state
