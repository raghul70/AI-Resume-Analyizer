from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class AnalysisBase(BaseModel):
    job_description: str

class AnalysisCreate(AnalysisBase):
    resume_id: int

class AnalysisResponse(BaseModel):
    id: int
    resume_id: int
    match_score: float
    skills_found: List[str]
    missing_skills: List[str]
    experience_years: Optional[float] = None
    education_level: Optional[str] = None
    suggestions: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class AnalysisRequest(BaseModel):
    resume_id: int
    job_description: str 