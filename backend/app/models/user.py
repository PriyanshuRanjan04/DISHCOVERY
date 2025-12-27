from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class User(BaseModel):
    """User model"""
    clerk_user_id: str
    email: str
    name: str
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    preferences: Optional[dict] = None

class UserInDB(User):
    """User model with database ID"""
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True
