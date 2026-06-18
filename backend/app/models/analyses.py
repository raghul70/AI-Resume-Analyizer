from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Float, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database.db import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id"))
    job_description = Column(Text)
    match_score = Column(Float)
    skills_found = Column(JSON)  # Store as JSON array
    missing_skills = Column(JSON)  # Store as JSON array
    experience_years = Column(Float)
    education_level = Column(String(100))
    suggestions = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    resume = relationship("Resume", back_populates="analyses")