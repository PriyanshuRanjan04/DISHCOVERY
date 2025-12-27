# 🚀 Deployment Guide: Recipe AI

This guide explains how to host your application so others can use it.

## 📦 Hosting Strategy

Because this is a **Full Stack** app with separate Frontend and Backend, you generally deploy them in this order:

1.  **Database** (MongoDB Atlas) - *Already in the cloud! ✅*
2.  **Backend** (FastAPI) - Needs to be live first to provide a public API URL.
3.  **Frontend** (Next.js) - Needs the Backend's URL to retrieve data.

---

## Phase 1: Deploy Backend (FastAPI)

We recommend **Render** or **Railway** (easiest for Python/FastAPI).

### Option A: Deploy on Render (Free Tier available)
1.  Push your code to **GitHub**.
2.  create a new **Web Service** on [Render](https://render.com).
3.  Connect your GitHub repository.
4.  **Settings**:
    *   **Root Directory**: `backend`
    *   **Runtime**: Python 3
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5.  **Environment Variables** (Copy from your `.env`):
    *   `MONGODB_URI`
    *   `CLERK_SECRET_KEY`
    *   `GEMINI_API_KEY`
    *   `RESEND_API_KEY`
    *   `FRONTEND_URL` (You can update this mainly *after* you deploy frontend, or set to `*` temporarily)

Once deployed, Render will give you a URL like: `https://recipe-ai-backend.onrender.com`.  
**Save this URL!**

---

## Phase 2: Deploy Frontend (Next.js)

We recommend **Vercel** (Creators of Next.js).

1.  Go to [Vercel](https://vercel.com) and Sign Up/Login.
2.  Click **"Add New..."** -> **Project**.
3.  Import your GitHub repository.
4.  **Settings**:
    *   **Root Directory**: Click "Edit" and select `frontend`.
    *   **Framework Preset**: Next.js (should detect automatically).
5.  **Environment Variables**:
    *   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: (From Clerk)
    *   `CLERK_SECRET_KEY`: (From Clerk)
    *   `NEXT_PUBLIC_API_URL`: **Paste your Backend URL here** (e.g., `https://recipe-ai-backend.onrender.com`) - *Do not add a trailing slash `/`*
6.  Click **Deploy**.

---

## Phase 3: Final Configuration

1.  **Update Backend CORS**:
    *   Go back to your Backend hosting (Render/Railway).
    *   Update the `FRONTEND_URL` environment variable to your new Vercel URL (e.g., `https://recipe-ai.vercel.app`).
    *   Redeploy the backend if needed to apply changes.

2.  **Update Clerk Auth**:
    *   Go to your [Clerk Dashboard](https://dashboard.clerk.com).
    *   Navigate to **Production** settings (if you promoted to production) or keep using Dev keys if testing.
    *   If you deploy to a live domain, you might need to add that domain to Clerk's "Allowed Origins".

---

## 🏃‍♂️ How to Run Locally (To see it built up)

Before you host, you should definitely see it working on your own machine!

**1. Install Dependencies**
Open two terminals.

Terminal 1 (Frontend):
```bash
cd frontend
npm install
```

Terminal 2 (Backend):
```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate
pip install -r requirements.txt
```

**2. Get API Keys**
Follow the steps in `SETUP.md` to get keys for Google Gemini, Clerk, etc.

**3. Start Servers**
Terminal 1: `npm run dev`
Terminal 2: `uvicorn app.main:app --reload`

**4. View App**
Open `http://localhost:3000` in your browser.
