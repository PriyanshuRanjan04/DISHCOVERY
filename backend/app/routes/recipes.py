from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
from ..services.langchain_service import langchain_service
from ..services.email_service import send_recipe_email
from ..services.pdf_service import generate_recipe_pdf
from ..database import get_database
from ..models.recipe import Recipe, SearchHistory
from datetime import datetime

router = APIRouter()

class SearchRequest(BaseModel):
    query: str
    servings: Optional[int] = 4
    user_id: Optional[str] = None

class AlternativeRequest(BaseModel):
    ingredient: str
    recipe_context: str

class AdjustServingsRequest(BaseModel):
    recipe: dict
    new_servings: int

class EmailRecipeRequest(BaseModel):
    recipe: dict
    email: str

async def generate_recipe_task(query: str, normalized_query: str, servings: int, user_id: Optional[str]):
    """Background task to generate recipe and update cache"""
    try:
        print(f"BACKGROUND DEBUG: Starting AI generation for '{query}'")
        recipe_data = await langchain_service.generate_recipe(
            query=query,
            servings=servings
        )
        
        db = get_database()
        # Save to cache
        await db.recipe_cache.update_one(
            {"query": normalized_query},
            {
                "$set": {
                    "recipe_data": recipe_data,
                    "status": "completed",
                    "updated_at": datetime.utcnow()
                }
            },
            upsert=True
        )
        
        # Save to history if user_id provided
        if user_id:
            history_entry = SearchHistory(
                user_id=user_id,
                query=query,
                recipe_generated=Recipe(**recipe_data),
                searched_at=datetime.utcnow()
            )
            await db.search_history.insert_one(history_entry.dict())
            
        print(f"BACKGROUND DEBUG: Completed AI generation for '{query}'")
    except Exception as e:
        print(f"BACKGROUND ERROR: Failed for '{query}': {str(e)}")
        db = get_database()
        await db.recipe_cache.update_one(
            {"query": normalized_query},
            {"$set": {"status": "error", "error_message": str(e)}}
        )

@router.post("/search")
async def search_recipes(request: SearchRequest, background_tasks: BackgroundTasks):
    """Search for recipes using AI with async background processing"""
    try:
        db = get_database()
        normalized_query = request.query.lower().strip()
        
        # Check cache
        cached_recipe = await db.recipe_cache.find_one({"query": normalized_query})
        
        if cached_recipe:
            if cached_recipe.get("status") == "completed":
                return {
                    "success": True,
                    "recipe": cached_recipe["recipe_data"],
                    "status": "completed"
                }
            elif cached_recipe.get("status") == "processing":
                return {
                    "success": True,
                    "status": "processing",
                    "message": "Recipe is being cooked in the background..."
                }

        # If not in cache or was error, start new background task
        await db.recipe_cache.update_one(
            {"query": normalized_query},
            {
                "$set": {
                    "query": normalized_query,
                    "status": "processing",
                    "created_at": datetime.utcnow()
                }
            },
            upsert=True
        )
        
        background_tasks.add_task(
            generate_recipe_task, 
            request.query, 
            normalized_query, 
            request.servings, 
            request.user_id
        )
        
        return {
            "success": True,
            "status": "processing",
            "message": "AI started working on your recipe!"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search initialization failed: {str(e)}")

@router.get("/status/{query}")
async def get_search_status(query: str):
    """Check the status of a specific recipe generation"""
    try:
        db = get_database()
        normalized_query = query.lower().strip()
        
        cached_recipe = await db.recipe_cache.find_one({"query": normalized_query})
        
        if not cached_recipe:
            return {"status": "not_found"}
            
        return {
            "status": cached_recipe.get("status"),
            "recipe": cached_recipe.get("recipe_data") if cached_recipe.get("status") == "completed" else None,
            "error": cached_recipe.get("error_message") if cached_recipe.get("status") == "error" else None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/alternatives")
async def get_ingredient_alternatives(request: AlternativeRequest):
    """Get alternative ingredients"""
    try:
        alternatives = await langchain_service.get_ingredient_alternatives(
            ingredient=request.ingredient,
            recipe_context=request.recipe_context
        )
        
        return {
            "success": True,
            "alternatives": alternatives
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get alternatives: {str(e)}")

@router.post("/adjust-servings")
async def adjust_recipe_servings(request: AdjustServingsRequest):
    """Adjust recipe for different serving sizes"""
    try:
        adjusted_recipe = langchain_service.adjust_recipe_servings(
            recipe=request.recipe,
            new_servings=request.new_servings
        )
        
        return {
            "success": True,
            "recipe": adjusted_recipe
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to adjust servings: {str(e)}")

@router.post("/download")
async def download_recipe_pdf(recipe: dict):
    """Download recipe as PDF"""
    try:
        pdf_buffer = generate_recipe_pdf(recipe)
        
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={recipe.get('title', 'recipe').replace(' ', '_')}.pdf"
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

@router.post("/email")
async def email_recipe(request: EmailRecipeRequest):
    """Email recipe to user"""
    try:
        result = await send_recipe_email(
            to_email=request.email,
            recipe_data=request.recipe
        )
        
        return {
            "success": True,
            "message": "Recipe sent successfully",
            "email_id": result.get("id")
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Email sending failed: {str(e)}")

@router.get("/popular")
async def get_popular_recipes():
    """Get popular recipes (curated)"""
    return {
        "success": True,
        "recipes": [
            {
                "title": "Classic Margherita Pizza",
                "description": "Authentic Neapolitan pizza with fresh basil and mozzarella.",
                "image": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
                "cooking_time": 30,
                "servings": 4,
                "difficulty": "medium",
                "cuisine": "Italian"
            },
            {
                "title": "Creamy Mushroom Risotto",
                "description": "Rich and creamy Italian rice dish with wild mushrooms.",
                "image": "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80",
                "cooking_time": 45,
                "servings": 4,
                "difficulty": "hard",
                "cuisine": "Italian"
            },
            {
                "title": "Spicy Chicken Curry",
                "description": "Aromatic Indian curry with tender chicken pieces.",
                "image": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80",
                "cooking_time": 40,
                "servings": 4,
                "difficulty": "medium",
                "cuisine": "Indian"
            },
            {
                "title": "Japanese Ramen Bowl",
                "description": "Comforting noodle soup with rich broth and toppings.",
                "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
                "cooking_time": 60,
                "servings": 2,
                "difficulty": "hard",
                "cuisine": "Japanese"
            }
        ]
    }
