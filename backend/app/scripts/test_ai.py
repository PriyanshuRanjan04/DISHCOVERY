import asyncio
import os
import sys
from dotenv import load_dotenv

# Add the backend directory to sys.path so we can import 'app'
sys.path.append(os.getcwd())

from app.services.langchain_service import LangChainService
from app.config import settings

async def test_ai_connection():
    print(f"--- AI Connection Test ---")
    print(f"Provider: {settings.llm_provider}")
    
    # Check if key exists for the chosen provider
    key_found = False
    if settings.llm_provider == "gemini" and settings.gemini_api_key:
        key_found = True
        print("Gemini API Key: [FOUND]")
    elif settings.llm_provider == "openai" and settings.openai_api_key:
        key_found = True
        print("OpenAI API Key: [FOUND]")
    elif settings.llm_provider == "groq" and settings.groq_api_key:
        key_found = True
        print("Groq API Key: [FOUND]")
    
    if not key_found:
        print(f"ERROR: API key for {settings.llm_provider} is missing!")
        return

    service = LangChainService()
    
    try:
        print(f"Attempting to generate a sample recipe...")
        recipe = await service.generate_recipe("Quick Scrambled Eggs")
        print("SUCCESS! Recipe generated:")
        print(f"Title: {recipe.get('title')}")
        print(f"Ingredients: {len(recipe.get('ingredients', []))} items")
    except Exception as e:
        print(f"FAILURE: {str(e)}")

if __name__ == "__main__":
    # Load environment variables just for this test
    load_dotenv()
    asyncio.run(test_ai_connection())
