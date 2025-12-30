import os
# CRITICAL: This must be set BEFORE importing langchain_google_genai
os.environ["GOOGLE_API_VERSION"] = "v1"

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from ..config import settings
import json
import re

class LangChainService:
    """Service for LangChain LLM operations"""
    
    def __init__(self):
        # Initialize Gemini with explicit v1 API version via client_options
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=settings.gemini_api_key,
            temperature=0.7,
            client_options={"api_version": "v1"}
        )
    
    async def generate_recipe(self, query: str, servings: int = 4) -> dict:
        """Generate a recipe based on user query using LLM"""
        import time
        start_time = time.time()
        print(f"DEBUG: Starting recipe generation for '{query}'...")
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", """Chef AI: Generate a practical recipe in strict JSON.
Structure:
{{
  "title": str,
  "description": str (max 150 chars),
  "ingredients": [{{"name": str, "quantity": str, "unit": str}}],
  "instructions": [str],
  "cooking_time": int (mins),
  "servings": int,
  "cuisine": str,
  "difficulty": "easy/medium/hard",
  "tips": [str]
}}"""),
            ("human", "Create a recipe for: {query} for {servings} servings.")
        ])
        
        chain = prompt | self.llm
        
        try:
            print("DEBUG: Invoking Gemini...")
            invoke_start = time.time()
            response = await chain.ainvoke({"query": query, "servings": servings})
            print(f"DEBUG: Gemini responded in {time.time() - invoke_start:.2f} seconds.")
            
            # Extract JSON from response
            content = response.content
            
            # Try to find JSON in the response
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                recipe_data = json.loads(json_match.group())
            else:
                # Fallback: try to parse entire content
                recipe_data = json.loads(content)
            
            print(f"DEBUG: Total generation time: {time.time() - start_time:.2f} seconds.")
            return recipe_data
        except Exception as e:
            print(f"ERROR in AI generation: {str(e)}")
            raise e
    
    async def get_ingredient_alternatives(self, ingredient: str, recipe_context: str) -> list:
        """Get alternative ingredients using LLM"""
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a culinary expert specializing in ingredient substitutions.
Provide practical alternatives that maintain flavor and texture. Always respond in JSON format:
{{
  "alternatives": [
    {{
      "name": "alternative ingredient",
      "ratio": "substitution ratio",
      "notes": "how it affects the dish"
    }}
  ]
}}"""),
            ("human", "Find alternatives for '{ingredient}' in this recipe: {context}")
        ])
        
        chain = prompt | self.llm
        response = await chain.ainvoke({"ingredient": ingredient, "context": recipe_context})
        
        # Extract JSON from response
        content = response.content
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            data = json.loads(json_match.group())
        else:
            data = json.loads(content)
        
        return data.get("alternatives", [])
    
    def adjust_recipe_servings(self, recipe: dict, new_servings: int) -> dict:
        """Adjust recipe quantities for different serving sizes"""
        
        original_servings = recipe.get("servings", 4)
        ratio = new_servings / original_servings
        
        adjusted_recipe = recipe.copy()
        adjusted_recipe["servings"] = new_servings
        
        # Adjust ingredient quantities
        adjusted_ingredients = []
        for ingredient in recipe.get("ingredients", []):
            adjusted_ing = ingredient.copy()
            
            # Try to parse and adjust quantity
            quantity_str = ingredient.get("quantity", "")
            try:
                # Handle fractions and numbers
                if "/" in quantity_str:
                    # Handle fractions like "1/2"
                    parts = quantity_str.split("/")
                    quantity = float(parts[0]) / float(parts[1])
                else:
                    # Extract first number from string
                    numbers = re.findall(r'\d+\.?\d*', quantity_str)
                    if numbers:
                        quantity = float(numbers[0])
                    else:
                        quantity = 1.0
                
                new_quantity = quantity * ratio
                
                # Format the new quantity nicely
                if new_quantity % 1 == 0:
                    adjusted_ing["quantity"] = str(int(new_quantity))
                else:
                    adjusted_ing["quantity"] = f"{new_quantity:.1f}"
                    
            except Exception:
                # If parsing fails, keep original or mark as "to taste"
                adjusted_ing["quantity"] = quantity_str
            
            adjusted_ingredients.append(adjusted_ing)
        
        adjusted_recipe["ingredients"] = adjusted_ingredients
        
        # Adjust cooking time slightly (not linear)
        original_time = recipe.get("cooking_time", 30)
        if ratio > 1:
            # Increase time by 10-15% for larger batches
            time_adjustment = 1 + (ratio - 1) * 0.15
        else:
            # Decrease time by 5-10% for smaller batches
            time_adjustment = 1 - (1 - ratio) * 0.1
        
        adjusted_recipe["cooking_time"] = int(original_time * time_adjustment)
        
        return adjusted_recipe

# Singleton instance
langchain_service = LangChainService()
