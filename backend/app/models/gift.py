from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class GiftBase(BaseModel):
    name: str
    icon: str
    value: float
    is_active: bool = True

class GiftCreate(GiftBase):
    pass

class GiftUpdate(BaseModel):
    name: Optional[str] = None
    icon: Optional[str] = None
    value: Optional[float] = None
    is_active: Optional[bool] = None

class Gift(GiftBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class GiftTransactionBase(BaseModel):
    gift_id: str
    from_user_id: str
    to_user_id: str
    quantity: int = 1
    message: Optional[str] = None

class GiftTransactionCreate(GiftTransactionBase):
    pass

class GiftTransaction(GiftTransactionBase):
    id: str
    total_value: float
    created_at: datetime
    
    class Config:
        from_attributes = True

