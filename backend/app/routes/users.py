from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from ..database import get_database
from ..models.recipe import SavedRecipe, Recipe
from datetime import datetime

router = APIRouter()

class SaveRecipeRequest(BaseModel):
    user_id: str
    recipe: dict

@router.get("/me")
async def get_user_profile(user_id: str):
    """Get user profile"""
    db = get_database()
    
    user = await db.users.find_one({"clerk_user_id": user_id})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"success": True, "user": user}

@router.get("/history")
async def get_user_history(user_id: str, limit: int = 20):
    """Get user's recipe search history"""
    db = get_database()
    
    history = await db.search_history.find(
        {"user_id": user_id}
    ).sort("searched_at", -1).limit(limit).to_list(length=limit)
    
    return {
        "success": True,
        "history": history
    }

@router.post("/save-recipe")
async def save_recipe(request: SaveRecipeRequest):
    """Save a recipe to user's collection"""
    db = get_database()
    
    saved_recipe = SavedRecipe(
        user_id=request.user_id,
        recipe_data=Recipe(**request.recipe),
        saved_at=datetime.utcnow()
    )
    
    result = await db.saved_recipes.insert_one(saved_recipe.dict())
    
    return {
        "success": True,
        "message": "Recipe saved successfully",
        "recipe_id": str(result.inserted_id)
    }

@router.get("/saved-recipes")
async def get_saved_recipes(user_id: str):
    """Get user's saved recipes"""
    db = get_database()
    
    recipes = await db.saved_recipes.find(
        {"user_id": user_id}
    ).sort("saved_at", -1).to_list(length=100)
    
    return {
        "success": True,
        "recipes": recipes
    }

@router.delete("/saved-recipes/{recipe_id}")
async def delete_saved_recipe(recipe_id: str, user_id: str):
    """Delete a saved recipe"""
    db = get_database()
    
    from bson import ObjectId
    
    result = await db.saved_recipes.delete_one({
        "_id": ObjectId(recipe_id),
        "user_id": user_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    return {
        "success": True,
        "message": "Recipe deleted successfully"
    }
