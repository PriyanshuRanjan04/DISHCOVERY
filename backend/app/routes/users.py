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
    
    history_raw = await db.search_history.find(
        {"user_id": user_id}
    ).sort("searched_at", -1).limit(limit).to_list(length=limit)
    
    # Convert ObjectId to string for JSON serialization
    history = []
    for item in history_raw:
        item["id"] = str(item["_id"])
        del item["_id"]
        history.append(item)
    
    return {
        "success": True,
        "history": history
    }

@router.post("/save-recipe")
async def save_recipe(request: SaveRecipeRequest):
    """Save a recipe to user's collection, preventing duplicates by title"""
    db = get_database()
    
    # Check if a recipe with the same title is already saved by this user
    existing = await db.saved_recipes.find_one({
        "user_id": request.user_id,
        "recipe_data.title": request.recipe.get("title")
    })
    
    if existing:
        return {
            "success": True,
            "message": "Recipe already saved",
            "recipe_id": str(existing["_id"]),
            "already_saved": True
        }
    
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
    
    recipes_raw = await db.saved_recipes.find(
        {"user_id": user_id}
    ).sort("saved_at", -1).to_list(length=100)
    
    # Convert ObjectId to string
    recipes = []
    for item in recipes_raw:
        item["id"] = str(item["_id"])
        del item["_id"]
        recipes.append(item)
    
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
@router.get("/saved-recipes/{recipe_id}")
async def get_saved_recipe(recipe_id: str, user_id: str):
    """Get a single saved recipe by ID"""
    db = get_database()
    from bson import ObjectId
    
    recipe = await db.saved_recipes.find_one({
        "_id": ObjectId(recipe_id),
        "user_id": user_id
    })
    
    if not recipe:
        raise HTTPException(status_code=404, detail="Saved recipe not found")
    
    recipe["id"] = str(recipe["_id"])
    del recipe["_id"]
    
    return {
        "success": True,
        "recipe": recipe
    }

@router.delete("/history/{history_id}")
async def delete_history_item(history_id: str, user_id: str):
    """Delete a specific history item"""
    db = get_database()
    from bson import ObjectId
    
    result = await db.search_history.delete_one({
        "_id": ObjectId(history_id),
        "user_id": user_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="History item not found")
        
    return {"success": True, "message": "History item deleted"}

@router.delete("/history/clear")
async def clear_history(user_id: str):
    """Clear all history for a user"""
    db = get_database()
    
    result = await db.search_history.delete_many({"user_id": user_id})
    
    return {
        "success": True, 
        "message": f"Cleared {result.deleted_count} history items"
    }
