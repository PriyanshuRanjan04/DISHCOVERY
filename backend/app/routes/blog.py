from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from ..database import get_database
from ..models.blog import BlogPost, Comment
from datetime import datetime

router = APIRouter()

class CreatePostRequest(BaseModel):
    author_id: str
    author_name: str
    title: str
    content: str
    tags: List[str] = []

class AddCommentRequest(BaseModel):
    user_id: str
    user_name: str
    text: str

from ..services.langchain_service import langchain_service

@router.get("/posts")
async def get_blog_posts(limit: int = 5, skip: int = 0):
    """Get 5 daily dynamic food stories (cached for 24h)"""
    db = get_database()
    today_str = datetime.utcnow().strftime("%Y-%m-%d")
    
    # Fallback stories if DB or AI fails
    fallback = [
        {
            "_id": "fb1",
            "title": "🥘 The Story Behind Butter Chicken",
            "intro": "A dish that conquered the world from the heart of Delhi.",
            "why_it_matters": "It represents the resourcefulness of Indian chefs in reinventing leftovers into a global sensation.",
            "history_content": "Created by accident in the 1950s at Moti Mahal restaurant, cooks reused leftover tandoori chicken by simmering it in a rich tomato and butter sauce.",
            "recipe_ingredients": [
                {"name": "Chicken", "quantity": "1", "unit": "kg"},
                {"name": "Tomato Puree", "quantity": "2", "unit": "cups"},
                {"name": "Butter", "quantity": "100", "unit": "g"}
            ],
            "recipe_instructions": ["Marinate chicken", "Prepare sauce", "Simmer until tender"],
            "tips_variations": ["Use honey for sweetness", "Add more cream for richness"],
            "conclusion": "A timeless classic that never fails to satisfy.",
            "image_url": "https://images.unsplash.com/photo-1603894584202-7473796599b1?w=800&q=80",
            "region": "Asia",
            "author_name": "Dishcovery Team",
            "created_at": datetime.utcnow(),
            "tags": ["Indian", "History"]
        }
    ]

    if not db:
        return {"success": True, "posts": fallback, "count": 1, "note": "Database not connected"}

    # 1. Check if we already have today's stories
    try:
        existing_stories = await db.daily_stories.find({"date_key": today_str}).to_list(length=10)
    
        if existing_stories:
            # Convert _id to string for JSON serialization
            for s in existing_stories:
                s["_id"] = str(s["_id"])
            return {
                "success": True,
                "posts": existing_stories,
                "count": len(existing_stories),
                "source": "cache"
            }
        
        # 2. If not, generate new ones using AI
        new_stories_data = await langchain_service.generate_daily_stories()
        
        # Prepare for database
        db_stories = []
        for story in new_stories_data:
            story_doc = {
                "title": story["title"],
                "intro": story.get("intro", ""),
                "why_it_matters": story.get("why_it_matters", ""),
                "history_content": story.get("history_content", ""),
                "recipe_ingredients": story.get("recipe", {}).get("ingredients", []),
                "recipe_instructions": story.get("recipe", {}).get("instructions", []),
                "tips_variations": story.get("tips_variations", []),
                "conclusion": story.get("conclusion", ""),
                "image_url": story.get("image_url", ""),
                "region": story["region"],
                "tags": story["tags"],
                "author_name": "Dishcovery Team",
                "created_at": datetime.utcnow(),
                "date_key": today_str
            }
            db_stories.append(story_doc)
        
        # Insert and get IDs
        if db_stories:
            result = await db.daily_stories.insert_many(db_stories)
            # Re-fetch or manually add IDs to return
            for idx, doc_id in enumerate(result.inserted_ids):
                db_stories[idx]["_id"] = str(doc_id)
        
        return {
            "success": True,
            "posts": db_stories,
            "count": len(db_stories),
            "source": "generated"
        }
        
    except Exception as e:
        print(f"Error in blog posts: {str(e)}")
        return {
            "success": True,
            "posts": fallback,
            "count": len(fallback),
            "error": str(e)
        }

@router.get("/posts/{post_id}")
async def get_blog_post(post_id: str):
    """Get a single blog post"""
    db = get_database()
    from bson import ObjectId
    
    post = await db.blog_posts.find_one({"_id": ObjectId(post_id)})
    
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    return {
        "success": True,
        "post": post
    }

@router.post("/posts")
async def create_blog_post(request: CreatePostRequest):
    """Create a new blog post"""
    db = get_database()
    
    blog_post = BlogPost(
        author_id=request.author_id,
        author_name=request.author_name,
        title=request.title,
        content=request.content,
        tags=request.tags,
        comments=[],
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    result = await db.blog_posts.insert_one(blog_post.dict())
    
    return {
        "success": True,
        "message": "Blog post created successfully",
        "post_id": str(result.inserted_id)
    }

@router.post("/posts/{post_id}/comments")
async def add_comment(post_id: str, request: AddCommentRequest):
    """Add a comment to a blog post"""
    db = get_database()
    from bson import ObjectId
    
    comment = Comment(
        user_id=request.user_id,
        user_name=request.user_name,
        text=request.text,
        created_at=datetime.utcnow()
    )
    
    result = await db.blog_posts.update_one(
        {"_id": ObjectId(post_id)},
        {
            "$push": {"comments": comment.dict()},
            "$set": {"updated_at": datetime.utcnow()}
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    return {
        "success": True,
        "message": "Comment added successfully"
    }
