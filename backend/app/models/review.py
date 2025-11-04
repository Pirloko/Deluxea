from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReviewBase(BaseModel):
    profile_id: str
    rating: int  # 1-5
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    reviewer_id: str

class ReviewUpdate(BaseModel):
    rating: Optional[int] = None
    comment: Optional[str] = None

class Review(ReviewBase):
    id: str
    reviewer_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

