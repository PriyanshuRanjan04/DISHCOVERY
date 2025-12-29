from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # MongoDB
    mongodb_uri:mongodb+srv://priyanshuranjan11260_db_user:dbgolu@myfoods.ltgyyix.mongodb.net/?appName=myfoods
    mongodb_db_name: str = "myfoods"
    
    # Clerk
    clerk_secret_key:••••••••••••••••••••••••••••••••••••••••••••••••••
    
    # LLM APIs
    gemini_api_key:AIzaSyDAt5G1OpLkCe4X04UMlHDmGAWwbnne37Y
    openai_api_key: str = ""  # Optional
    
    # Email
    resend_api_key:re_BRhXoDRy_DF2e8aqt2ndq9rkc9YgqbMqy
    
    # Frontend
    frontend_url: str = "http://localhost:3000"
    
    # App settings
    app_name: str = "Recipe AI"
    debug: bool = False

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
