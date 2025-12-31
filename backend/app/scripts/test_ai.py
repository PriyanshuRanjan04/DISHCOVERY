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
    
    import google.generativeai as genai
    genai.configure(api_key=settings.gemini_api_key)
    
    print("\nListing ALL available models for your API key:")
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name} (Supports generateContent)")
            else:
                print(f"- {m.name}")
    except Exception as e:
        print(f"Could not list models: {str(e)}")

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
