from app.schemas.analysis import SubScores

def calculate_overall_score(scores: SubScores) -> int:
    """
    Calculate deterministic overall score using fixed category weights:
    - ATS Compatibility: 20%
    - Skills Match: 30%
    - Experience Relevance: 25%
    - Achievement: 15%
    - Clarity: 10%
    
    Formula:
    overall_score = round(
        ats * 0.20 +
        skills * 0.30 +
        exp * 0.25 +
        achieve * 0.15 +
        clarity * 0.10
    )
    Clamped between 0 and 100.
    """
    weighted_sum = (
        scores.ats_compatibility * 0.20 +
        scores.skills_match * 0.30 +
        scores.experience_relevance * 0.25 +
        scores.achievement * 0.15 +
        scores.clarity * 0.10
    )
    
    overall = round(weighted_sum)
    return max(0, min(100, int(overall)))
