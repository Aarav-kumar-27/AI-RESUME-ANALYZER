import re
from typing import List, Set
from app.schemas.analysis import AIAnalysisOutput, SubScores

# Canonical mapping of lowercase keyword -> standard display case
DISPLAY_CASE_MAP = {
    # Core Languages & Frameworks
    "fastapi": "FastAPI",
    "python": "Python",
    "javascript": "JavaScript",
    "typescript": "TypeScript",
    "react": "React",
    "vue": "Vue",
    "angular": "Angular",
    "node.js": "Node.js",
    "nodejs": "Node.js",
    "express": "Express",
    "django": "Django",
    "flask": "Flask",
    "java": "Java",
    "c++": "C++",
    "c#": "C#",
    "ruby": "Ruby",
    "php": "PHP",
    "go": "Go",
    "rust": "Rust",
    "swift": "Swift",
    "kotlin": "Kotlin",
    "spring": "Spring",
    "dotnet": ".NET",

    # Cloud & DevOps
    "aws": "AWS",
    "azure": "Azure",
    "gcp": "GCP",
    "docker": "Docker",
    "kubernetes": "Kubernetes",
    "terraform": "Terraform",
    "ci/cd": "CI/CD",
    "git": "Git",

    # APIs & Databases
    "rest api": "REST API",
    "rest": "REST",
    "graphql": "GraphQL",
    "microservices": "Microservices",
    "sql": "SQL",
    "postgresql": "PostgreSQL",
    "postgres": "PostgreSQL",
    "mysql": "MySQL",
    "mongodb": "MongoDB",
    "redis": "Redis",
    "dynamodb": "DynamoDB",

    # AI / ML & Data
    "machine learning": "Machine Learning",
    "deep learning": "Deep Learning",
    "nlp": "NLP",
    "pandas": "Pandas",
    "numpy": "NumPy",
    "pytorch": "PyTorch",
    "tensorflow": "TensorFlow",
    "scikit-learn": "Scikit-Learn",

    # Management & Soft Skills
    "agile": "Agile",
    "scrum": "Scrum",
    "leadership": "Leadership",
    "communication": "Communication",
    "project management": "Project Management",
    "problem solving": "Problem Solving"
}

def extract_keywords(text: str) -> Set[str]:
    """
    Extract known technical/professional keywords from text,
    normalizing input variations to canonical display casing.
    """
    lower_text = text.lower()
    found = set()
    for kw, canonical_name in DISPLAY_CASE_MAP.items():
        pattern = r'\b' + re.escape(kw) + r'\b'
        if re.search(pattern, lower_text):
            found.add(canonical_name)
    return found

def analyze_heuristic(resume_text: str, job_description: str) -> AIAnalysisOutput:
    """
    Perform deterministic heuristic analysis when Gemini API is unavailable.
    Compares canonical keywords, evaluates structure and metrics, and returns AIAnalysisOutput.
    """
    resume_lower = resume_text.lower()
    jd_lower = job_description.lower()

    # 1. Skill Overlap Calculation using Canonical Skill Representations
    resume_skills = extract_keywords(resume_text)
    jd_skills = extract_keywords(job_description)

    matching_skills = sorted(list(resume_skills.intersection(jd_skills)))
    missing_skills = sorted(list(jd_skills - resume_skills))

    if jd_skills:
        skills_score = int(round((len(matching_skills) / len(jd_skills)) * 100))
    else:
        skills_score = 70

    skills_score = max(20, min(100, skills_score))

    # 2. ATS Compatibility Score (Heuristic based on standard section headings & contact info clues)
    ats_score = 70
    standard_sections = ["experience", "education", "skills", "projects", "summary"]
    section_count = sum(1 for sec in standard_sections if sec in resume_lower)
    ats_score += section_count * 5  # up to +25

    if re.search(r'[\w\.-]+@[\w\.-]+\.\w+', resume_text):
        ats_score += 5  # contact email found

    ats_score = max(30, min(100, ats_score))

    # 3. Experience Relevance Score
    exp_score = max(30, min(100, int((skills_score * 0.7) + (section_count * 5))))

    # 4. Achievement Score (Look for numbers, percentages, dollar signs)
    metrics_count = len(re.findall(r'\b\d+%\b|\$\d+|\b\d+\s*(?:years?|users?|projects?|clients?)\b', resume_lower))
    if metrics_count >= 5:
        achievement_score = 85
    elif metrics_count >= 2:
        achievement_score = 70
    elif metrics_count == 1:
        achievement_score = 55
    else:
        achievement_score = 40

    # 5. Clarity Score (Check bullet points, line lengths, action verbs)
    action_verbs = ["developed", "built", "designed", "managed", "created", "led", "optimized", "implemented"]
    verb_count = sum(1 for v in action_verbs if v in resume_lower)
    clarity_score = min(100, 60 + verb_count * 5)

    # 6. Strengths
    strengths = []
    if matching_skills:
        strengths.append(f"Matching technical skills identified: {', '.join(matching_skills[:5])}.")
    if section_count >= 4:
        strengths.append("Resume contains clear standard section organization (Experience, Education, Skills).")
    if metrics_count > 0:
        strengths.append("Includes quantifiable impact metrics in experience descriptions.")
    if not strengths:
        strengths.append("Resume contains readable structural text.")

    # 7. Weaknesses
    weaknesses = []
    if missing_skills:
        weaknesses.append(f"Missing key skills requested in job description: {', '.join(missing_skills[:5])}.")
    if metrics_count == 0:
        weaknesses.append("Few or no explicit numerical metrics or percentages found in project accomplishments.")
    if section_count < 3:
        weaknesses.append("Resume layout may lack standard section headings.")

    # 8. Actionable Suggestions (STRICTLY Grounded in 'Consider adding X if...' format)
    suggestions = []
    for skill in missing_skills[:4]:
        suggestions.append(f"Consider adding {skill} experience if you have worked with this technology.")
    if metrics_count == 0:
        suggestions.append("Consider quantifying past achievements with specific percentage gains, team sizes, or metrics if applicable.")

    summary = (
        f"Heuristic analysis evaluated {len(matching_skills)} matching skills and {len(missing_skills)} missing skills. "
        "Conservative structural scores were calculated based on text overlap."
    )

    return AIAnalysisOutput(
        scores=SubScores(
            ats_compatibility=ats_score,
            skills_match=skills_score,
            experience_relevance=exp_score,
            achievement=achievement_score,
            clarity=clarity_score
        ),
        matching_skills=matching_skills,
        missing_skills=missing_skills,
        strengths=strengths,
        weaknesses=weaknesses,
        actionable_suggestions=suggestions,
        summary=summary
    )
