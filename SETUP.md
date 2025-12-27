# 🚀 Quick Start Guide

This guide will help you set up and run your AI-Powered Recipe Discovery Platform.

## Prerequisites Checklist

Before starting, ensure you have:
- ✅ Node.js 18+ installed ([Download](https://nodejs.org/))
- ✅ Python 3.10+ installed ([Download](https://www.python.org/downloads/))
- ✅ Git installed (optional, for version control)

## Step 1: Get Your API Keys

### 1.1 Clerk (Authentication)
1. Visit [https://clerk.com](https://clerk.com)
2. Sign up for a free account
3. Create a new application
4. Go to **API Keys** in the dashboard
5. Copy your:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
6. Enable OAuth providers:
   - Go to **User & Authentication** → **Social Connections**
   - Enable **Google** and **GitHub**

### 1.2 Google Gemini (LLM)
1. Visit [https://ai.google.dev](https://ai.google.dev)
2. Click **Get API Key**
3. Accept terms and create API key
4. Copy your `GEMINI_API_KEY`
5. **Free tier**: 60 requests per minute

### 1.3 Resend (Email Service)
1. Visit [https://resend.com](https://resend.com)
2. Sign up for free account
3. Go to **API Keys**
4. Create a new API key
5. Copy your `RESEND_API_KEY`
6. **Free tier**: 100 emails/day

### 1.4 MongoDB Atlas (Database)
1. Visit [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account and cluster
3. Click **Connect** → **Connect your application**
4. Copy your connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/`)
5. Replace `<password>` with your actual password
6. Whitelist your IP: **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (for development)

## Step 2: Frontend Setup

Open a terminal and run:

```powershell
# Navigate to frontend directory
cd d:\DISH\frontend

# Install dependencies (this may take a few minutes)
npm install

# Create .env.local file
# Copy .env.example to .env.local
Copy-Item .env.example .env.local

# Open .env.local and add your Clerk keys
notepad .env.local
```

In `.env.local`, add:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Step 3: Backend Setup

Open a **NEW terminal** and run:

```powershell
# Navigate to backend directory
cd d:\DISH\backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# If you get execution policy error, run:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Install dependencies
pip install -r requirements.txt

# Create .env file
Copy-Item .env.example .env

# Open .env and add your API keys
notepad .env
```

In `.env`, add:
```env
MONGODB_URI=mongodb+srv://your_connection_string
CLERK_SECRET_KEY=sk_test_xxxxx
GEMINI_API_KEY=xxxxx
RESEND_API_KEY=re_xxxxx
FRONTEND_URL=http://localhost:3000
```

## Step 4: Run the Application

### Terminal 1 - Backend
```powershell
cd d:\DISH\backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

### Terminal 2 - Frontend
```powershell
cd d:\DISH\frontend
npm run dev
```

You should see:
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

## Step 5: Test the Application

1. Open your browser and go to **http://localhost:3000**
2. Click **Sign In** to test Clerk authentication
3. Try searching for a recipe: "Italian pasta for 4 people"
4. Test the features:
   - Save a recipe
   - Download as PDF
   - Email recipe (to your email)
   - Adjust servings

## API Documentation

Once the backend is running, you can access:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Troubleshooting

### PowerShell Script Execution Error
**Error**: `cannot be loaded because running scripts is disabled`

**Solution**: Run PowerShell as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port Already in Use
**Error**: `Port 3000/8000 is already in use`

**Solution**:
```powershell
# Find and kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change the port
# Frontend: npm run dev -- -p 3001
# Backend: uvicorn app.main:app --reload --port 8001
```

### MongoDB Connection Error
**Error**: `ServerSelectionTimeoutError`

**Solutions**:
1. Check your connection string is correct
2. Ensure your IP is whitelisted in MongoDB Atlas
3. Try: **Network Access** → **Add IP Address** → **0.0.0.0/0** (allow all)

### Gemini API Error
**Error**: `API key not valid`

**Solution**:
1. Generate a new API key at https://ai.google.dev
2. Make sure there are no extra spaces in your `.env` file
3. Restart the backend server after updating `.env`

### Email Not Sending
**Error**: Email fails to send

**Solutions**:
1. Verify your Resend API key
2. Check you're using the correct "from" email (default: `onboarding@resend.dev`)
3. For production, verify your own domain in Resend

## Next Steps

Now that your app is running:
1. ✅ Create an account using Clerk
2. ✅ Search for recipes
3. ✅ Explore the blog section
4. ✅ Test ingredient alternatives
5. ✅ Try adjusting serving sizes
6. ✅ Download a recipe as PDF
7. ✅ Email a recipe to yourself

## Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- **Frontend**: Changes to `.tsx` files reload automatically
- **Backend**: Changes to `.py` files reload automatically (with `--reload` flag)

### Database Management
View your MongoDB data:
1. Go to MongoDB Atlas
2. Click **Collections**
3. Browse your data in:
   - `users`
   - `saved_recipes`
   - `search_history`
   - `blog_posts`

### API Testing
Use the Swagger UI at http://localhost:8000/docs to:
- Test API endpoints directly
- View request/response schemas
- Debug API calls

## Need Help?

- **Clerk Docs**: https://clerk.com/docs
- **LangChain Docs**: https://python.langchain.com/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **Next.js Docs**: https://nextjs.org/docs

---

**Happy Coding! 🍽️**
