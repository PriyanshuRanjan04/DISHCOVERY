from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Ingredient(BaseModel):
    """Ingredient model"""
    name: str
    quantity: str
    unit: Optional[str] = None

class Recipe(BaseModel):
    """Recipe model"""
    title: str
    description: Optional[str] = None
    ingredients: List[Ingredient]
    instructions: List[str]
    cooking_time: int  # in minutes
    servings: int
    cuisine: Optional[str] = None
    difficulty: str = "medium"
    tips: Optional[List[str]] = []

class SavedRecipe(BaseModel):
    """Saved recipe model"""
    user_id: str
    recipe_data: Recipe
    saved_at: datetime = Field(default_factory=datetime.utcnow)

class SearchHistory(BaseModel):
    """Search history model"""
    user_id: str
    query: str
    recipe_generated: Recipe
    searched_at: datetime = Field(default_factory=datetime.utcnow)

class RecipeInDB(SavedRecipe):
    """Recipe model with database ID"""
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True
