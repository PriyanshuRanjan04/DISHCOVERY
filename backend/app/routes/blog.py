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

@router.get("/posts")
async def get_blog_posts(limit: int = 20, skip: int = 0):
    """Get all blog posts"""
    db = get_database()
    
    posts = await db.blog_posts.find().sort(
        "created_at", -1
    ).skip(skip).limit(limit).to_list(length=limit)
    
    return {
        "success": True,
        "posts": posts,
        "count": len(posts)
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
