from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import connect_to_mongo, close_mongo_connection
from .routes import recipes, users, blog

app = FastAPI(
    title=settings.app_name,
    description="AI-Powered Recipe Discovery Platform API",
    version="1.0.0",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000"],
    allow_origin_regex="https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Event handlers
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# Include routers
app.include_router(recipes.router, prefix="/api/recipes", tags=["recipes"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(blog.router, prefix="/api/blog", tags=["blog"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to Recipe AI API",
        "version": "1.0.0",
        "docs": "/docs",
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
