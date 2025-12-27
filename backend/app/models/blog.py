from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Comment(BaseModel):
    """Comment model"""
    user_id: str
    user_name: str
    text: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BlogPost(BaseModel):
    """Blog post model"""
    author_id: str
    author_name: str
    title: str
    content: str
    tags: List[str] = []
    comments: List[Comment] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class BlogPostInDB(BlogPost):
    """Blog post model with database ID"""
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True
