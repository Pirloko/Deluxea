from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime

MediaType = Literal["image", "video"]

class StoryBase(BaseModel):
    user_id: str
    media_url: str
    media_type: MediaType

class StoryCreate(StoryBase):
    pass

class Story(StoryBase):
    id: str
    created_at: datetime
    expires_at: datetime
    
    class Config:
        from_attributes = True

class ReelBase(BaseModel):
    user_id: str
    video_url: str
    caption: Optional[str] = None

class ReelCreate(ReelBase):
    pass

class Reel(ReelBase):
    id: str
    created_at: datetime
    likes_count: int = 0
    
    class Config:
        from_attributes = True

class PhotoBase(BaseModel):
    user_id: str
    image_url: str
    caption: Optional[str] = None

class PhotoCreate(PhotoBase):
    pass

class Photo(PhotoBase):
    id: str
    created_at: datetime
    likes_count: int = 0
    
    class Config:
        from_attributes = True

