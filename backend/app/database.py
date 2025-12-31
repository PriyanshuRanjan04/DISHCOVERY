import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

class Database:
    client: AsyncIOMotorClient = None
    db = None

db = Database()

async def connect_to_mongo():
    """Connect to MongoDB"""
    print("Connecting to MongoDB...")
    # For mongodb+srv strings, certifi is best used as a fallback if system certs fail
    db.client = AsyncIOMotorClient(
        settings.mongodb_uri,
        tlsCAFile=certifi.where(),
        connectTimeoutMS=10000,
        serverSelectionTimeoutMS=10000
    )
    db.db = db.client[settings.mongodb_db_name]
    # Verify connection
    await db.db.command("ping")
    print("Connected to MongoDB!")

async def close_mongo_connection():
    """Close MongoDB connection"""
    print("Closing MongoDB connection...")
    db.client.close()
    print("MongoDB connection closed!")

def get_database():
    """Get database instance"""
    return db.db
