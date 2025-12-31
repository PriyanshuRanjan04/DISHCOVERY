import os

from langchain_core.prompts import ChatPromptTemplate
from ..config import settings
import json
import re

class LangChainService:
    """Service for LangChain LLM operations using OpenAI (Primary) or Groq (Fallback)"""
    
    def __init__(self):
        self.llm = None
        # We'll initialize on demand or here, but carefully
        try:
            self.llm = self._initialize_llm()
        except Exception as e:
            print(f"CRITICAL: Failed to initialize LLM: {str(e)}")

    def _initialize_llm(self):
        # OpenAI is primary, Groq is secondary
        if settings.openai_api_key:
            from langchain_openai import ChatOpenAI
            print("DEBUG: Initializing OpenAI with model: gpt-4o-mini")
            return ChatOpenAI(
                model="gpt-4o-mini",
                api_key=settings.openai_api_key,
                temperature=0.7
            )
        elif settings.groq_api_key:
            try:
                from langchain_groq import ChatGroq
                print("DEBUG: Initializing Groq with model: llama-3.3-70b-versatile")
                return ChatGroq(
                    model="llama-3.3-70b-versatile",
                    api_key=settings.groq_api_key,
                    temperature=0.7
                )
            except ImportError:
                raise ImportError("langchain-groq is required for Groq provider.")
        else:
            print("WARNING: Neither OPENAI_API_KEY nor GROQ_API_KEY found.")
            return None
    
    async def generate_recipe(self, query: str, servings: int = 4) -> dict:
        """Generate a recipe based on user query using LLM"""
        if not self.llm:
            # Try to re-initialize in case it was a transient error or late config
            try:
                self.llm = self._initialize_llm()
            except Exception as e:
                raise RuntimeError(f"LLM could not be initialized: {str(e)}")
        
        if not self.llm:
            raise RuntimeError("LLM is not available. Please verify your OPENAI_API_KEY or GROQ_API_KEY.")

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
  "tips": [str],
  "image_keywords": "2-3 detailed keywords for a realistic food photo"
}}"""),
            ("human", "Create a recipe for: {query} for {servings} servings.")
        ])
        
        chain = prompt | self.llm
        
        try:
            print("DEBUG: Invoking AI...")
            invoke_start = time.time()
            response = await chain.ainvoke({"query": query, "servings": servings})
            print(f"DEBUG: AI responded in {time.time() - invoke_start:.2f} seconds.")
            
            # Extract JSON from response
            content = response.content
            
            # Try to find JSON in the response
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                recipe_data = json.loads(json_match.group())
            else:
                # Fallback: try to parse entire content
                recipe_data = json.loads(content)
            
            # Add realistic image URL using Unsplash
            keywords = recipe_data.get("image_keywords", query)
            recipe_data["image_url"] = f"https://source.unsplash.com/featured/1200x800?food,{keywords.replace(' ', ',')}"

            print(f"DEBUG: Total generation time: {time.time() - start_time:.2f} seconds.")
            return recipe_data
        except Exception as e:
            print(f"ERROR in AI generation: {str(e)}")
            raise e
    
    async def get_ingredient_alternatives(self, ingredient: str, recipe_context: str) -> list:
        """Get alternative ingredients using LLM"""
        if not self.llm:
            raise RuntimeError("LLM is not initialized.")
        
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

    async def generate_explore_results(self, country: str = None, state: str = None, festival: str = None, taste: str = None, query: str = None) -> list:
        """Discover dishes based on geography, festival, and taste"""
        if not self.llm:
            raise RuntimeError("LLM is not initialized.")

        # Construct filters string for the prompt
        filters = []
        if country: filters.append(f"Country: {country}")
        if state: filters.append(f"Indian State: {state}")
        if festival: filters.append(f"Festival: {festival}")
        if taste: filters.append(f"Taste Profile: {taste}")
        if query: filters.append(f"Additional Request: {query}")
        
        filter_str = ", ".join(filters) if filters else "General global cuisine"

        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a 'Smart Cuisine Explorer' for Dishcovery. 
Your goal is to suggest 5 specific, authentic dishes that match the user's filters perfectly.

Respond in strict JSON format:
{{
  "results": [
    {{
      "title": "Emoji + Dish Name",
      "intro": "Brief engaging intro (1 line)",
      "cultural_context": "Cultural or historical significance of this dish (1-2 lines)",
      "taste_profile": "Describe the flavors (e.g., Spicy & Tangy, Sweet & Creamy)",
      "highlights": ["Key ingredients or features"],
      "region": "Specific region/origin name",
      "image_keywords": "2-3 keywords for a realistic food photo search"
    }}
  ]
}}"""),
            ("human", f"Discover 5 unique dishes matching these criteria: {filter_str}")
        ])

        chain = prompt | self.llm
        response = await chain.ainvoke({})
        
        content = response.content
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            data = json.loads(json_match.group())
        else:
            data = json.loads(content)
        
        results = data.get("results", [])
        
        for dish in results:
            keywords = dish.get("image_keywords", "food")
            dish["image_url"] = f"https://source.unsplash.com/featured/800x600?food,{keywords.replace(' ', ',')}"
            
        return results

    async def generate_daily_stories(self) -> list:
        """Generate 5 daily food history stories from different regions with recipes"""
        if not self.llm:
            raise RuntimeError("LLM is not initialized.")

        # Define specific categories for exploration
        categories = [
            "A specific Country (non-India)", 
            "An Indian State (e.g., Punjab, Kerala, Nagaland) 🔥", 
            "A Festival-based food tradition (e.g., Diwali, Christmas, Eid, Lunar New Year)",
            "A unique Global Region (e.g., Caribbean, Balkan, Nordic)",
            "A historical or ancient cuisine (e.g., Aztec, Roman, Medieval Indian)"
        ]
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", f"""You are a culinary explorer and master chef for 'Dishcovery'. 
Generate exactly 5 fascinating regional food profiles. 
Each profile MUST represent one of these categories: {', '.join(categories)}.
At least ONE story MUST be about a specific Indian State.
At least ONE story MUST be about a Festival-based food tradition.

For each story, follow this EXACT structure:
1. Title: Emoji + Catchy Title
2. Short Intro: 2-3 lines engaging the reader.
3. Why this matters: The cultural or historical significance.
4. History Content: 1-2 paragraphs of deep history/fun facts.
5. Recipe: A full practical recipe for 4 people.
6. Tips & Variations: Pro tips or common regional twists.
7. Conclusion: A final thought.
8. Image Keywords: 2-3 keywords for a realistic food photo search.

Respond in strict JSON format:
{{
  "stories": [
    {{
      "title": "str",
      "intro": "str",
      "why_it_matters": "str",
      "history_content": "str",
      "recipe": {{
        "name": "str",
        "ingredients": [{{"name": "str", "quantity": "str", "unit": "str"}}],
        "instructions": ["str"]
      }},
      "tips_variations": ["str"],
      "conclusion": "str",
      "region": "str (Name of the Country, Indian State, or Festival)",
      "tags": ["str (e.g., 'Indian State', 'Festival', 'Country', 'Ancient Cuisine')"],
      "image_keywords": "str"
    }}
  ]
}}"""),
            ("human", "Generate today's 5 global food stories with recipes for 4 people.")
        ])
        
        chain = prompt | self.llm
        response = await chain.ainvoke({})
        
        content = response.content
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            data = json.loads(json_match.group())
        else:
            data = json.loads(content)
        
        stories = data.get("stories", [])
        
        # Add realistic image URLs using Unsplash
        for story in stories:
            keywords = story.get("image_keywords", "food")
            # Use unsplash source with keywords
            story["image_url"] = f"https://source.unsplash.com/featured/800x600?food,{keywords.replace(' ', ',')}"
            
        return stories

# Singleton instance
langchain_service = LangChainService()
