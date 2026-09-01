import time
import logging
from fastapi import APIRouter, File, Form, UploadFile, HTTPException, status
from app.config import settings
from app.schemas.analysis import ResumeAnalysisResponse
from app.services.parser_service import (
    extract_resume_text,
    ParserError
)
from app.services.ai_service import analyze_resume_ai
from app.services.heuristic_service import analyze_heuristic
from app.services.scoring_service import calculate_overall_score

logger = logging.getLogger("ai_resume_analyzer.routes")

router = APIRouter()

MIN_JOB_DESCRIPTION_LENGTH = 20

@router.get("/health", tags=["System"])
async def health_check():
    """Health check endpoint to verify backend service operational status."""
    return {
        "status": "ok",
        "version": settings.VERSION,
        "service": settings.PROJECT_NAME
    }

@router.post("/analyze", response_model=ResumeAnalysisResponse, tags=["Analysis"])
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    """
    Analyzes resume against job description:
    1. Validates inputs & extracts clean text from uploaded PDF/DOCX.
    2. Runs Gemini AI structured analysis (or fails over to Heuristic engine).
    3. Calculates deterministic overall match score.
    4. Returns ResumeAnalysisResponse with analysis_source ("gemini" | "heuristic").
    """
    start_time = time.time()

    # 1. Validate Job Description Input
    if not job_description or not job_description.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Job description field is required and cannot be empty."
        )

    trimmed_jd = job_description.strip()
    if len(trimmed_jd) < MIN_JOB_DESCRIPTION_LENGTH:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Job description is too short ({len(trimmed_jd)} characters). Minimum {MIN_JOB_DESCRIPTION_LENGTH} characters required."
        )

    # 2. Validate File Upload Presence
    if not file or not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No uploaded file provided."
        )

    # 3. Read File Bytes in Memory & Extract Clean Text
    try:
        file_bytes = await file.read()
        extracted_text = extract_resume_text(
            file_bytes=file_bytes,
            filename=file.filename,
            content_type=file.content_type
        )
    except ParserError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An unexpected error occurred while parsing the document."
        )

    # 4. Perform AI Analysis with Heuristic Fallback
    ai_output = analyze_resume_ai(extracted_text, trimmed_jd)
    if ai_output:
        analysis_source = "gemini"
    else:
        logger.info("Falling back to local heuristic analysis engine.")
        ai_output = analyze_heuristic(extracted_text, trimmed_jd)
        analysis_source = "heuristic"

    # 5. Calculate Deterministic Overall Score
    overall_score = calculate_overall_score(ai_output.scores)

    duration = time.time() - start_time
    logger.info(f"Resume analysis completed successfully via '{analysis_source}' in {duration:.2f}s.")

    # 6. Construct Final Response
    return ResumeAnalysisResponse(
        overall_score=overall_score,
        analysis_source=analysis_source,
        scores=ai_output.scores,
        matching_skills=ai_output.matching_skills,
        missing_skills=ai_output.missing_skills,
        strengths=ai_output.strengths,
        weaknesses=ai_output.weaknesses,
        actionable_suggestions=ai_output.actionable_suggestions,
        summary=ai_output.summary
    )
