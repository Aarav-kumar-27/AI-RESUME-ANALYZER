from pydantic import BaseModel, Field
from typing import List, Literal

class SubScores(BaseModel):
    ats_compatibility: int = Field(ge=0, le=100, description="ATS Compatibility score based on structure, headers, and readability.")
    skills_match: int = Field(ge=0, le=100, description="Skills match score based on explicit skill overlap.")
    experience_relevance: int = Field(ge=0, le=100, description="Experience relevance score based on past roles and responsibilities.")
    achievement: int = Field(ge=0, le=100, description="Achievement score based on explicit quantifiable metrics.")
    clarity: int = Field(ge=0, le=100, description="Resume clarity score based on conciseness and action verb usage.")

class AIAnalysisOutput(BaseModel):
    """Raw output schema requested from Gemini API or returned by heuristic fallback."""
    scores: SubScores
    matching_skills: List[str] = Field(default_factory=list, description="Skills explicitly present in both resume and job description.")
    missing_skills: List[str] = Field(default_factory=list, description="Key skills explicitly requested in JD but absent in resume.")
    strengths: List[str] = Field(default_factory=list, description="Candidate strengths grounded in provided resume text.")
    weaknesses: List[str] = Field(default_factory=list, description="Identified content or formatting gaps.")
    actionable_suggestions: List[str] = Field(default_factory=list, description="Grounded recommendations using 'Consider adding X if...' phrasing.")
    summary: str = Field(description="Concise summary of candidate alignment with the job description.")

class ResumeAnalysisResponse(BaseModel):
    """Final API response returned by POST /api/analyze."""
    overall_score: int = Field(ge=0, le=100, description="Deterministically calculated overall score.")
    analysis_source: Literal["gemini", "heuristic"] = Field(description="Indicates whether analysis was performed by Gemini AI or heuristic fallback.")
    scores: SubScores
    matching_skills: List[str]
    missing_skills: List[str]
    strengths: List[str]
    weaknesses: List[str]
    actionable_suggestions: List[str]
    summary: str
