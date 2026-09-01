from app.schemas.analysis import SubScores
from app.services.scoring_service import calculate_overall_score

def test_scoring_all_100():
    scores = SubScores(
        ats_compatibility=100,
        skills_match=100,
        experience_relevance=100,
        achievement=100,
        clarity=100
    )
    assert calculate_overall_score(scores) == 100

def test_scoring_all_zero():
    scores = SubScores(
        ats_compatibility=0,
        skills_match=0,
        experience_relevance=0,
        achievement=0,
        clarity=0
    )
    assert calculate_overall_score(scores) == 0

def test_scoring_mixed_weights():
    # 85*0.20 + 80*0.30 + 85*0.25 + 90*0.15 + 80*0.10
    # = 17 + 24 + 21.25 + 13.5 + 8 = 83.75 -> round -> 84
    scores = SubScores(
        ats_compatibility=85,
        skills_match=80,
        experience_relevance=85,
        achievement=90,
        clarity=80
    )
    assert calculate_overall_score(scores) == 84

def test_scoring_rounding_half():
    # 70*0.20 + 70*0.30 + 70*0.25 + 70*0.15 + 70*0.10 = 70.0
    scores = SubScores(
        ats_compatibility=70,
        skills_match=70,
        experience_relevance=70,
        achievement=70,
        clarity=70
    )
    assert calculate_overall_score(scores) == 70
