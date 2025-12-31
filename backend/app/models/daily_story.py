from pydantic import BaseModel, Field
from typing import List
from datetime import datetime

class DailyStory(BaseModel):
    """Model for specifically generated daily food stories"""
    id: str = Field(alias="_id")
    title: str
    content: str
    region: str
    author_name: str = "Dishcovery Gourmet"
    tags: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    date_key: str  # Format: YYYY-MM-DD for caching

    class Config:
        populate_by_name = True
