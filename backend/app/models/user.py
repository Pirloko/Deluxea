from pydantic import BaseModel, EmailStr
from typing import Optional, Literal
from datetime import datetime

UserRole = Literal["admin", "profile_user", "visitor"]

class UserBase(BaseModel):
    email: EmailStr
    role: UserRole

class UserCreate(UserBase):
    password: str
    is_active: bool = True
    must_change_password: bool = False

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    must_change_password: Optional[bool] = None

class User(UserBase):
    id: str
    is_active: bool
    must_change_password: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class ProfileBase(BaseModel):
    name: str
    age: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[list[str]] = None
    category: Optional[str] = None
    contact_number: Optional[str] = None

class ProfileCreate(ProfileBase):
    user_id: str

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[list[str]] = None
    category: Optional[str] = None
    contact_number: Optional[str] = None
    avatar_url: Optional[str] = None

class Profile(ProfileBase):
    id: str
    user_id: str
    avatar_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

