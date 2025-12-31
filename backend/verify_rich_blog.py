import asyncio
import httpx
import json

async def check_blog():
    url = "http://localhost:8001/api/blog/posts"
    async with httpx.AsyncClient() as client:
        print("Fetching today's stories...")
        res = await client.get(url, timeout=60.0)
        print(f"Status: {res.status_code}")
        data = res.json()
        print(f"Source: {data.get('source')}")
        print(f"Count: {data.get('count')}")
        
        if data.get('posts'):
            post = data['posts'][0]
            print("\nFirst Post Preview:")
            print(f"Title: {post.get('title')}".encode('ascii', 'ignore').decode('ascii'))
            print(f"Intro: {post.get('intro')}")
            print(f"History: {post.get('history_content')[:100]}...")
            print(f"Recipe Ingredients Count: {len(post.get('recipe_ingredients', []))}")
            print(f"Image URL: {post.get('image_url')}")

if __name__ == "__main__":
    asyncio.run(check_blog())
