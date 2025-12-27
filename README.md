# 🍽️ AI-Powered Recipe Discovery Platform

A modern, responsive recipe discovery platform with AI-powered recipe generation, ingredient substitution, and personalized user experiences.

## 🚀 Features

- **AI-Powered Recipe Generation**: Get personalized recipes using Gemini LLM
- **Smart Search**: Natural language recipe search
- **Ingredient Alternatives**: Can't find an ingredient? Get smart substitutions
- **Serving Size Adjustment**: Scale recipes for any number of people
- **User Authentication**: Secure login via Clerk (Gmail, GitHub, Email/Password)
- **Recipe History**: Track all your recipe searches
- **Save & Share**: Save favorites, download as PDF, or email recipes
- **Blog Section**: Community recipes and cooking tips
- **Fully Responsive**: Works perfectly on mobile, tablet, and desktop

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Shadcn/UI Components**
- **Clerk** (Authentication)

### Backend
- **FastAPI** (Python)
- **LangChain** (AI Orchestration)
- **Google Gemini** (LLM)
- **MongoDB** (Database)
- **Resend** (Email Service)

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** 18+ and npm
- **Python** 3.10+
- **MongoDB Atlas** account (free tier)
- **API Keys** for:
  - Clerk (https://clerk.com)
  - Google Gemini (https://ai.google.dev)
  - Resend (https://resend.com)

## 🔧 Installation

### 1. Clone the repository
```bash
cd d:\DISH
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
```

Create `backend/.env`:
```env
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
GEMINI_API_KEY=your_gemini_api_key
RESEND_API_KEY=your_resend_api_key
FRONTEND_URL=http://localhost:3000
```

## 🚀 Running the Application

### Start Backend (Terminal 1)
```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload
```
Backend runs on: http://localhost:8000

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:3000

## 📁 Project Structure

```
DISH/
├── frontend/              # Next.js frontend
│   ├── app/              # App router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities
│   └── styles/           # Global styles
│
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── routes/      # API endpoints
│   │   ├── services/    # Business logic
│   │   ├── models/      # Database models
│   │   └── middleware/  # Auth & CORS
│   └── requirements.txt
│
└── README.md
```

## 🔑 Getting API Keys

### Clerk (Authentication)
1. Go to https://clerk.com
2. Create a new application
3. Enable Gmail and GitHub OAuth providers
4. Copy your API keys from the dashboard

### Google Gemini (LLM)
1. Visit https://ai.google.dev
2. Click "Get API Key"
3. Create a new API key (free tier available)

### Resend (Email)
1. Sign up at https://resend.com
2. Navigate to API Keys
3. Create a new API key

### MongoDB Atlas (Database)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Whitelist your IP address

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🎨 Features Walkthrough

### Recipe Search
1. Enter any dish name or cuisine
2. AI generates a complete recipe with ingredients and instructions
3. Get cooking time estimates and difficulty levels

### Ingredient Alternatives
1. Click "Find Alternatives" on any ingredient
2. Get 3-5 suitable substitutions with ratios
3. Learn how each substitution affects the dish

### Serving Size Adjustment
1. Select number of servings (2, 4, 6, 8+)
2. All ingredient quantities automatically adjust
3. Cooking time suggestions update accordingly

### Blog & Community
1. Share your cooking tips and tricks
2. Post ingredient substitutions you've discovered
3. Comment on others' posts

## 🐛 Troubleshooting

### PowerShell Execution Policy Error
If you get a script execution error, run PowerShell as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port Already in Use
- Frontend: Change port in `package.json` or kill process on port 3000
- Backend: Change port in `uvicorn` command to `--port 8001`

### MongoDB Connection Issues
- Ensure your IP is whitelisted in MongoDB Atlas
- Check connection string format
- Verify network access settings

## 📝 License

MIT License - Feel free to use this project for learning and development!

## 🤝 Contributing

Contributions welcome! This is a learning project, so feel free to experiment and improve.

## 📧 Support

For issues or questions, please open a GitHub issue or contact the maintainer.

---

**Built with ❤️ using Next.js, FastAPI, and LangChain**
