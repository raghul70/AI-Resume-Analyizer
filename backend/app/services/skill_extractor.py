import re
from typing import List, Set

# Common programming and technical skills
TECHNICAL_SKILLS = {
    # Programming Languages
    "python", "java", "javascript", "typescript", "c++", "c#", "ruby", "go", "rust", "swift",
    "kotlin", "php", "html", "css", "sql", "nosql", "mongodb", "postgresql", "mysql", "redis",
    # Frameworks & Libraries
    "react", "angular", "vue", "django", "flask", "fastapi", "spring", "node.js", "express",
    "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy", "matplotlib",
    # Cloud & DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "git", "linux", "bash",
    # Other Technical
    "machine learning", "deep learning", "nlp", "computer vision", "data science",
    "agile", "scrum", "jira", "confluence", "rest api", "graphql", "microservices"
}

SOFT_SKILLS = {
    "leadership", "communication", "problem solving", "teamwork", "time management",
    "critical thinking", "adaptability", "creativity", "emotional intelligence",
    "conflict resolution", "decision making", "project management"
}

def extract_skills(text: str) -> List[str]:
    """Extract skills from text"""
    text = text.lower()
    found_skills = set()
    
    # Check for technical skills
    for skill in TECHNICAL_SKILLS:
        if skill in text:
            found_skills.add(skill)
    
    # Check for soft skills
    for skill in SOFT_SKILLS:
        if skill in text:
            found_skills.add(skill)
    
    # Extract additional skills using regex patterns
    skill_patterns = [
        r'(?:skill|expertise|proficient|knowledge|experience|familiar) in ([\w\s,]+)',
        r'(?:work|proficient|experienced) with ([\w\s,]+)'
    ]
    
    for pattern in skill_patterns:
        matches = re.finditer(pattern, text, re.IGNORECASE)
        for match in matches:
            skills = match.group(1).split(',')
            for skill in skills:
                skill = skill.strip()
                if len(skill) > 2 and len(skill) < 50:
                    found_skills.add(skill.lower())
    
    return list(found_skills)