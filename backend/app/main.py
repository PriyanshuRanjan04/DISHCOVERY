from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import connect_to_mongo, close_mongo_connection, get_database
from .routes import recipes, users, blog
import traceback
import sys

app = FastAPI(
    title=settings.app_name,
    description="AI-Powered Recipe Discovery Platform API",
    version="1.0.0",
)

# Global Exception Handler for better debugging in Render logs
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"CRITICAL ERROR: {str(exc)}", file=sys.stderr)
    traceback.print_exc()
    return {
        "success": False,
        "detail": f"Internal Server Error: {str(exc)}",
        "type": type(exc).__name__
    }

# Specific handler for HTTPException to keep their custom status codes
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return {
        "success": False,
        "detail": exc.detail
    }

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Note: Using allow_origins=["*"] with allow_credentials=True is technically broad, 
# but FastAPI handles it by echoing the Origin header. 
# Alternatively, use allow_origin_regex for security in production.

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
    health_status = {"status": "healthy", "mongodb": "unknown"}
    try:
        db = get_database()
        if db is not None:
            # Try a simple command to check connectivity
            await db.command("ping")
            health_status["mongodb"] = "connected"
        else:
            health_status["mongodb"] = "not_initialized"
    except Exception as e:
        health_status["mongodb"] = f"error: {str(e)}"
        health_status["status"] = "unhealthy"
        
    return health_status
