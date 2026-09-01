import pytest
from pydantic import ValidationError
from app.schemas.analysis import SubScores, AIAnalysisOutput, ResumeAnalysisResponse

def test_subscores_valid():
    scores = SubScores(
        ats_compatibility=80,
        skills_match=90,
        experience_relevance=85,
        achievement=75,
        clarity=95
    )
    assert scores.ats_compatibility == 80
    assert scores.skills_match == 90

def test_subscores_score_below_zero_rejected():
    with pytest.raises(ValidationError):
        SubScores(
            ats_compatibility=-5,
            skills_match=90,
            experience_relevance=85,
            achievement=75,
            clarity=95
        )

def test_subscores_score_above_100_rejected():
    with pytest.raises(ValidationError):
        SubScores(
            ats_compatibility=105,
            skills_match=90,
            experience_relevance=85,
            achievement=75,
            clarity=95
        )

def test_ai_analysis_output_valid():
    output = AIAnalysisOutput(
        scores=SubScores(ats_compatibility=80, skills_match=85, experience_relevance=80, achievement=70, clarity=90),
        matching_skills=["Python", "FastAPI"],
        missing_skills=["Kubernetes"],
        strengths=["Clear experience"],
        weaknesses=["No Kubernetes"],
        actionable_suggestions=["Consider adding Kubernetes experience if you have it."],
        summary="Solid candidate alignment."
    )
    assert output.matching_skills == ["Python", "FastAPI"]
    assert output.summary == "Solid candidate alignment."

def test_resume_analysis_response_valid():
    response = ResumeAnalysisResponse(
        overall_score=83,
        analysis_source="gemini",
        scores=SubScores(ats_compatibility=80, skills_match=85, experience_relevance=80, achievement=70, clarity=90),
        matching_skills=["Python"],
        missing_skills=["Docker"],
        strengths=["Good code"],
        weaknesses=["Small team"],
        actionable_suggestions=["Consider adding Docker if experienced."],
        summary="Good candidate."
    )
    assert response.overall_score == 83
    assert response.analysis_source == "gemini"
