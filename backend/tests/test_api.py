from unittest.mock import patch
from fastapi.testclient import TestClient
from app.main import app
from app.schemas.analysis import AIAnalysisOutput, SubScores
from tests.test_parser import create_sample_pdf_bytes, create_sample_docx_bytes

client = TestClient(app)

SAMPLE_JD = "We are seeking a Senior Software Engineer with 5+ years of experience in Python, FastAPI, React, and cloud deployments."

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"

# 1. API Analysis Test with Mocked Gemini AI Success
@patch("app.api.routes.analyze_resume_ai")
def test_analyze_gemini_path(mock_ai):
    mock_ai.return_value = AIAnalysisOutput(
        scores=SubScores(
            ats_compatibility=85,
            skills_match=80,
            experience_relevance=85,
            achievement=90,
            clarity=80
        ),
        matching_skills=["Python", "FastAPI", "React"],
        missing_skills=["Kubernetes"],
        strengths=["Strong technical alignment with FastAPI."],
        weaknesses=["No container orchestration mentioned."],
        actionable_suggestions=["Consider adding Kubernetes experience if you have it."],
        summary="Excellent alignment."
    )

    pdf_bytes = create_sample_pdf_bytes("Jane Developer\nPython FastAPI React Engineer")
    response = client.post(
        "/api/analyze",
        files={"file": ("resume.pdf", pdf_bytes, "application/pdf")},
        data={"job_description": SAMPLE_JD}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["analysis_source"] == "gemini"
    # 85*0.20 + 80*0.30 + 85*0.25 + 90*0.15 + 80*0.10 = 17 + 24 + 21.25 + 13.5 + 8 = 83.75 -> 84
    assert data["overall_score"] == 84
    assert "Python" in data["matching_skills"]

# 2. API Analysis Test with Gemini Failure -> Heuristic Fallback
@patch("app.api.routes.analyze_resume_ai")
def test_analyze_heuristic_fallback_path(mock_ai):
    mock_ai.return_value = None  # Simulate Gemini API missing key or failure

    pdf_bytes = create_sample_pdf_bytes("Jane Developer\nPython FastAPI React Engineer with 5 years experience.")
    response = client.post(
        "/api/analyze",
        files={"file": ("resume.pdf", pdf_bytes, "application/pdf")},
        data={"job_description": SAMPLE_JD}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["analysis_source"] == "heuristic"
    assert "overall_score" in data
    # Verify mathematical formula overall_score matches the 5 subscores
    sc = data["scores"]
    expected_overall = round(
        sc["ats_compatibility"] * 0.20 +
        sc["skills_match"] * 0.30 +
        sc["experience_relevance"] * 0.25 +
        sc["achievement"] * 0.15 +
        sc["clarity"] * 0.10
    )
    assert data["overall_score"] == expected_overall

# 3. Invalid File Extension
def test_analyze_invalid_file():
    response = client.post(
        "/api/analyze",
        files={"file": ("test.txt", b"plain text", "text/plain")},
        data={"job_description": SAMPLE_JD}
    )
    assert response.status_code == 400

# 4. Short Job Description (< 20 chars)
def test_analyze_short_jd():
    pdf_bytes = create_sample_pdf_bytes("Jane Developer")
    response = client.post(
        "/api/analyze",
        files={"file": ("resume.pdf", pdf_bytes, "application/pdf")},
        data={"job_description": "Short JD"}
    )
    assert response.status_code == 422
