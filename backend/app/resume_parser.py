
import google.generativeai as genai
import os
import json
from pypdf import PdfReader
from io import BytesIO
from dotenv import load_dotenv
from pathlib import Path

# Load env variables (important for standalone usage or early imports)
# Path to backend/.env (assuming this file is in backend/app/)
env_path = Path(__file__).resolve().parent.parent.parent / 'backend' / '.env'
# Actually, since we run from root, backend/.env is what we want.
# But let's be relative to this file to be safe.
# File is: backend/app/resume_parser.py
# .env is: backend/.env
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

# Ensure API Key is set
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    # Fallback for manual check
    print(f"Warning: GEMINI_API_KEY not found in {env_path}")

genai.configure(api_key=api_key)
# gemini-1.5-flash was not found. Using a model from list_models.py
MODEL_NAME = "gemini-flash-latest"

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts text from a PDF file in memory."""
    try:
        reader = PdfReader(BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""

def parse_resume_with_ai(pdf_bytes: bytes) -> dict:
    """
    Extracts structured data (skills, interests) from a resume PDF using Gemini AI.
    Returns a dict: {"skills": [], "interests": ""}
    """
    resume_text = extract_text_from_pdf(pdf_bytes)
    
    if not resume_text:
        return {"skills": [], "interests": "Could not read PDF text."}

    # Prompt for Gemini
    prompt = f"""
    You are an expert resume parser for an academic project matching platform.
    Extract the candidate's technical SKILLS and Research INTERESTS from the following resume text.

    Resume Text:
    {resume_text[:4000]}  # Limit text to avoid token limits

    Output strictly valid JSON with this schema:
    {{
        "skills": ["List", "of", "technical", "skills"],
        "interests": "A short summary of research interests or project preferences"
    }}
    Do not add markdown formatting like ```json ... ```. Just return the raw JSON string.
    """

    try:
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content(prompt)
        content = response.text.strip()
        
        # Clean potential markdown
        if content.startswith("```json"):
            content = content[7:-3].strip()
        elif content.startswith("```"):
            content = content[3:-3].strip()

        data = json.loads(content)
        return data

    except Exception as e:
        print(f"AI Parse Error: {e}")
        # Fallback: simple keyword extraction could go here, but for now return empty
        return {"skills": [], "interests": "AI extraction failed. Please fill manually."}
