from pydantic import BaseModel
from typing import Literal
from datetime import datetime

MembershipType = Literal["weekly", "monthly"]

class MembershipBase(BaseModel):
    user_id: str
    type: MembershipType
    
class MembershipCreate(MembershipBase):
    pass

class Membership(MembershipBase):
    id: str
    start_date: datetime
    end_date: datetime
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

