import asyncio
import httpx

async def test_blog_posts():
    url = "http://localhost:8000/api/blog/posts"
    async with httpx.AsyncClient() as client:
        # First call (should trigger generation)
        print("Fetching blog posts (First call - Generation)...")
        res1 = await client.get(url)
        print(f"Status: {res1.status_code}")
        data1 = res1.json()
        print(f"Source: {data1.get('source')}")
        print(f"Count: {data1.get('count')}")
        for post in data1.get('posts', []):
            print(f"- {post.get('title')} ({post.get('region')})")
        
        # Second call (should hit cache)
        print("\nFetching blog posts (Second call - Cache)...")
        res2 = await client.get(url)
        data2 = res2.json()
        print(f"Source: {data2.get('source')}")
        print(f"Count: {data2.get('count')}")

if __name__ == "__main__":
    asyncio.run(test_blog_posts())
