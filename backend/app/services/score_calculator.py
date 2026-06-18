from typing import List, Set

def calculate_match_score(skills_found: List[str], job_skills: List[str]) -> float:
    """Calculate match score between resume and job description"""
    if not job_skills:
        return 0.0
    
    skills_found_set = set(skills_found)
    job_skills_set = set(job_skills)
    
    # Calculate intersection
    matched_skills = skills_found_set.intersection(job_skills_set)
    
    # Calculate score
    if job_skills_set:
        match_percentage = (len(matched_skills) / len(job_skills_set)) * 100
    else:
        match_percentage = 0
    
    # Round to 2 decimal places
    return round(match_percentage, 2)