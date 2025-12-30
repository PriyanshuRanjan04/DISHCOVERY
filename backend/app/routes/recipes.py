from fastapi import APIRouter, HTTPException
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

@router.post("/search")
async def search_recipes(request: SearchRequest):
    """Search for recipes using AI"""
    try:
        # Generate recipe using LangChain
        recipe_data = await langchain_service.generate_recipe(
            query=request.query,
            servings=request.servings
        )
        
        # Save to search history if user_id provided
        if request.user_id:
            db = get_database()
            history_entry = SearchHistory(
                user_id=request.user_id,
                query=request.query,
                recipe_generated=Recipe(**recipe_data),
                searched_at=datetime.utcnow()
            )
            await db.search_history.insert_one(history_entry.dict())
        
        return {
            "success": True,
            "recipe": recipe_data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recipe generation failed: {str(e)}")

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
