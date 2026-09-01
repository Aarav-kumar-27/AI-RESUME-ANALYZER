from app.services.heuristic_service import analyze_heuristic, extract_keywords

def test_extract_keywords():
    text = "Experienced Python developer skilled in fastAPI, react, postgresql, aws, DOCKER, kubernetes, graphql, REST, rest api, ci/cd, javascript, typescript, node.js."
    keywords = extract_keywords(text)
    
    assert "FastAPI" in keywords
    assert "React" in keywords
    assert "PostgreSQL" in keywords
    assert "AWS" in keywords
    assert "Docker" in keywords
    assert "Kubernetes" in keywords
    assert "GraphQL" in keywords
    assert "REST" in keywords
    assert "REST API" in keywords
    assert "CI/CD" in keywords
    assert "JavaScript" in keywords
    assert "TypeScript" in keywords
    assert "Node.js" in keywords
    assert "Python" in keywords

def test_heuristic_analysis():
    resume = "Jane Doe\nEmail: jane@example.com\nExperience\nDeveloped Python microservices using FastAPI and React."
    jd = "Seeking Python Developer proficient in FastAPI, React, and Kubernetes with experience building REST APIs."
    
    result = analyze_heuristic(resume, jd)
    
    assert "Python" in result.matching_skills
    assert "FastAPI" in result.matching_skills
    assert "React" in result.matching_skills
    assert "Kubernetes" in result.missing_skills
    assert len(result.strengths) > 0
    assert len(result.actionable_suggestions) > 0
    assert "Consider adding" in result.actionable_suggestions[0]
    assert 0 <= result.scores.skills_match <= 100
