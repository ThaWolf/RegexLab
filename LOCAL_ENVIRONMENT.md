# Local Environment Setup

## Required Environment Variables for Local Development

Create a `.env.local` file in the root directory with these variables:

```bash
# Database Configuration (for local development)
DATABASE_URL=postgresql://postgres:password@localhost:5432/regexlab

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=kpeffQV6xTTcKwGqiBZG14ma7otJRua7zlr+gWl5W6s=

# Google OAuth (same as production)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# API Configuration (point to your Railway backend for now)
NEXT_PUBLIC_API_URL=https://passionate-courage-production.up.railway.app
```

## What You Need vs Don't Need Locally

### ✅ **Need for Local Development:**
- `DATABASE_URL` - Local PostgreSQL or Railway's URL
- `NEXTAUTH_URL` - Always `http://localhost:3000`
- `NEXTAUTH_SECRET` - Same as production
- `GOOGLE_CLIENT_ID` - Same as production
- `GOOGLE_CLIENT_SECRET` - Same as production
- `NEXT_PUBLIC_API_URL` - Can point to Railway backend

### ❌ **Don't Need Locally:**
- `VERCEL_TOKEN` - Only for GitHub Actions
- `VERCEL_ORG_ID` - Only for GitHub Actions
- `VERCEL_PROJECT_ID` - Only for GitHub Actions
- `RAILWAY_TOKEN` - Only for GitHub Actions
- `RAILWAY_SERVICE_ID` - Only for GitHub Actions

## Setup Options

### **Option 1: Use Railway Backend (Recommended)**
- Point `NEXT_PUBLIC_API_URL` to your Railway backend
- Use Railway's `DATABASE_URL` for local backend development
- This way you're using the same database as production

### **Option 2: Full Local Development**
- Set up local PostgreSQL
- Run backend locally with `npm run start:dev` in `backend/` directory
- Point `NEXT_PUBLIC_API_URL` to `http://localhost:3001`

## Google OAuth Setup for Local Development

Make sure your Google OAuth credentials include:
- **Authorized JavaScript origins**: `http://localhost:3000`
- **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`

## Running Locally

1. **Backend** (if running locally):
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Or use Docker** (recommended):
   ```bash
   docker-compose up --build
   ``` 