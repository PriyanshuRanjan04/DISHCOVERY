import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

class Database:
    client: AsyncIOMotorClient = None
    db = None

db = Database()

async def connect_to_mongo():
    """Connect to MongoDB with SSL/TLS resilience for Render"""
    print("Connecting to MongoDB...")
    
    try:
        # Re-introducing certifi as it's often needed for specific Atlas/Render handshakes
        db.client = AsyncIOMotorClient(
            settings.mongodb_uri,
            tlsCAFile=certifi.where(),
            connectTimeoutMS=15000,
            serverSelectionTimeoutMS=15000,
            tls=True
        )
        db.db = db.client[settings.mongodb_db_name]
        
        # Verify connection - DO NOT RAISE on failure here so app can start
        # This allows the user to see the error in Render logs or /health
        try:
            await db.db.command("ping")
            print("Connected to MongoDB!")
        except Exception as ping_error:
            print(f"CRITICAL: MongoDB Ping failed: {str(ping_error)}")
            # We don't raise here, so the FastAPI app can still start
            
    except Exception as e:
        print(f"CRITICAL: Failed to initialize MongoDB client: {str(e)}")

async def close_mongo_connection():
    """Close MongoDB connection"""
    print("Closing MongoDB connection...")
    db.client.close()
    print("MongoDB connection closed!")

def get_database():
    """Get database instance"""
    return db.db
