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
    
    if settings.openai_api_key:
        print("Provider: OpenAI [DETECTED]")
    elif settings.groq_api_key:
        print("Provider: Groq [DETECTED]")
    else:
        print("Provider: NONE [ERROR: Missing API Keys]")
        return

    service = LangChainService()
    # ... rest of the script
    
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
