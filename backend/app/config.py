from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # MongoDB
    mongodb_uri: str = ""
    mongodb_db_name: str = "myfoods"

    # Clerk
    clerk_secret_key: str = "••••••••••••••••••••••••••••••••••••••••••••••••••"

    # LLM APIs
    gemini_api_key: str = ""
    openai_api_key: str = ""  # Optional

    # Email
    resend_api_key: str = ""

    # Frontend
    frontend_url: str = "http://localhost:3000"

    # App settings
    app_name: str = "Recipe AI"
    debug: bool = False

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
