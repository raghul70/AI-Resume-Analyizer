from typing import List

def match_job_requirements(resume_text: str, job_description: str, missing_skills: List[str]) -> str:
    """Generate suggestions based on missing skills and job requirements"""
    suggestions = []
    
    if missing_skills:
        suggestions.append(f"Consider developing the following skills: {', '.join(missing_skills)}")
        suggestions.append("Look for online courses or certifications to fill these skill gaps.")
    
    # Check for experience level keywords
    experience_indicators = {
        'senior': '5+ years',
        'lead': '7+ years',
        'junior': '0-2 years',
        'mid': '3-5 years'
    }
    
    for level, years in experience_indicators.items():
        if level in job_description.lower():
            suggestions.append(f"Ensure you highlight {years} of relevant experience.")
            break
    
    # Education suggestions
    if 'phd' in job_description.lower():
        suggestions.append("Consider highlighting any advanced degrees or research experience.")
    elif 'master' in job_description.lower():
        suggestions.append("Highlight your master's degree and relevant coursework.")
    
    # Project suggestions
    if 'portfolio' in job_description.lower():
        suggestions.append("Include a link to your portfolio or GitHub repositories.")
    
    # If no specific suggestions, add general ones
    if not suggestions:
        suggestions = [
            "Tailor your resume to match the job description keywords.",
            "Quantify your achievements with specific numbers and results.",
            "Highlight relevant projects and accomplishments."
        ]
    
    return "\n".join(suggestions)