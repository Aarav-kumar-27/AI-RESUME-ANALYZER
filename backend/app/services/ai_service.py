import logging
from typing import Optional
from google import genai
from google.genai import types
from pydantic import ValidationError

from app.config import settings
from app.schemas.analysis import AIAnalysisOutput

logger = logging.getLogger("ai_resume_analyzer.ai_service")

SYSTEM_INSTRUCTION = """
You are an expert ATS and HR Resume Analysis AI. Your task is to evaluate a candidate's Resume against a provided Job Description.

STRICT GROUNDING & ANTI-HALLUCINATION RULES:
1. Analyze ONLY the explicitly supplied RESUME text and JOB DESCRIPTION text.
2. NEVER invent, assume, or hallucinate skills, employers, job titles, years of experience, certifications, technologies, achievements, or metrics.
3. Do NOT claim the candidate has a skill merely because it is standard or common for the role.
4. Do NOT treat a recommendation as evidence that the candidate possesses a skill.
5. IF a skill or experience requested in the Job Description is missing from the Resume, phrase any suggestion strictly as:
   "Consider adding [Skill/Experience] if you have this experience."
   NEVER claim "Candidate has [Skill]" if it is absent from the resume text.

EVALUATION CRITERIA:
- ats_compatibility (0-100): Score based on standard headers, contact details presence, readable text structure, and bullet clarity.
- skills_match (0-100): Score based on explicit skill overlap between Resume and Job Description.
- experience_relevance (0-100): Score based on explicitly stated past roles, domains, and responsibilities aligning with the Job Description.
- achievement (0-100): Score based ONLY on explicitly stated quantifiable accomplishments (percentages, numbers, dollar metrics). If no metrics exist, score conservatively.
- clarity (0-100): Score based on action verbs, conciseness, and readability.

Your response MUST adhere strictly to the JSON schema provided.
"""

def analyze_resume_ai(resume_text: str, job_description: str) -> Optional[AIAnalysisOutput]:
    """
    Calls Google Gemini API using google-genai SDK to analyze resume against job description.
    Enforces structured JSON output matching AIAnalysisOutput schema.
    Returns AIAnalysisOutput if successful, or None if API key missing/quota error/validation failure.
    """
    if not settings.GEMINI_API_KEY or not settings.GEMINI_API_KEY.strip():
        logger.info("GEMINI_API_KEY is not configured. Skipping Gemini API call.")
        return None

    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        prompt = f"""
--- RESUME TEXT ---
{resume_text}

--- JOB DESCRIPTION ---
{job_description}
"""

        # Enforce structured output matching Pydantic schema
        config = types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            temperature=0.1,  # Low temperature for deterministic factual extraction
            response_mime_type="application/json",
            response_schema=AIAnalysisOutput,
        )

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
            config=config,
        )

        if not response or not response.text:
            logger.warning("Empty response received from Gemini API.")
            return None

        # Validate structured JSON response against Pydantic schema
        analysis = AIAnalysisOutput.model_validate_json(response.text)
        return analysis

    except ValidationError as ve:
        logger.error(f"Gemini output schema validation failed: {str(ve)}")
        return None
    except Exception as e:
        logger.error(f"Gemini API call failed: {str(e)}")
        return None
