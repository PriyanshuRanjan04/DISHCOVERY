from pydantic import BaseModel, Field
from typing import List
from datetime import datetime

class DailyStory(BaseModel):
    """Model for specifically generated daily food stories"""
    id: str = Field(alias="_id")
    title: str
    intro: str  # 2-3 lines
    why_it_matters: str
    history_content: str
    recipe_ingredients: List[dict]  # List of {name, quantity, unit}
    recipe_instructions: List[str]
    tips_variations: List[str]
    conclusion: str
    image_url: str
    region: str
    author_name: str = "Dishcovery Gourmet"
    tags: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    date_key: str  # Format: YYYY-MM-DD for caching

    class Config:
        populate_by_name = True
