from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database.db import get_db
from ..models.resumes import Resume
from ..models.analyses import Analysis
from ..models.users import User
from ..schemas.analysis_schema import (
    AnalysisRequest, 
    AnalysisResponse, 
    AnalysisCreate
)
from ..schemas.user_schema import UserResponse
from ..utils.security import get_current_user
from ..services.skill_extractor import extract_skills
from ..services.score_calculator import calculate_match_score
from ..services.job_matcher import match_job_requirements

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResponse)
def analyze_resume(
    analysis_request: AnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get resume
    resume = db.query(Resume).filter(
        Resume.id == analysis_request.resume_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    if not resume.parsed_text:
        raise HTTPException(status_code=400, detail="Resume text not extracted")
    
    # Extract skills from resume
    skills_found = extract_skills(resume.parsed_text)
    
    # Extract skills from job description
    job_skills = extract_skills(analysis_request.job_description)
    
    # Calculate match score
    match_score = calculate_match_score(skills_found, job_skills)
    
    # Find missing skills
    missing_skills = [skill for skill in job_skills if skill not in skills_found]
    
    # Match job requirements
    suggestions = match_job_requirements(
        resume.parsed_text,
        analysis_request.job_description,
        missing_skills
    )
    
    # Save analysis
    analysis = Analysis(
        resume_id=resume.id,
        job_description=analysis_request.job_description,
        match_score=match_score,
        skills_found=skills_found,
        missing_skills=missing_skills,
        suggestions=suggestions
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    
    return analysis

@router.get("/history", response_model=List[AnalysisResponse])
def get_analysis_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analyses = db.query(Analysis).join(Resume).filter(
        Resume.user_id == current_user.id
    ).order_by(Analysis.created_at.desc()).all()
    return analyses

@router.get("/{analysis_id}", response_model=AnalysisResponse)
def get_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analysis = db.query(Analysis).join(Resume).filter(
        Analysis.id == analysis_id,
        Resume.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return analysis