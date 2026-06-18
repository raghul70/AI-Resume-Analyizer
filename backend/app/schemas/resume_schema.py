from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ResumeBase(BaseModel):
    filename: str
    file_size: Optional[int] = None

class ResumeCreate(ResumeBase):
    user_id: int
    file_path: str

class ResumeResponse(ResumeBase):
    id: int
    user_id: int
    uploaded_at: datetime
    parsed_text: Optional[str] = None
    
    class Config:
        from_attributes = True

class ResumeUploadResponse(BaseModel):
    message: str
    resume_id: int
    filename: str