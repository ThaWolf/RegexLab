# Environment Variables Configuration

## Required Environment Variables

### Database Configuration
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/regexlab
```

### NextAuth Configuration
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here
```

### Google OAuth
```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### API Configuration
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Production Deployment Variables

### Vercel (Frontend)
```bash
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id
```

### Railway (Backend)
```bash
RAILWAY_TOKEN=your-railway-token
RAILWAY_SERVICE_ID=your-railway-service-id
```

## How to Set Up

### Local Development
1. Copy the variables above to a `.env` file in the root directory
2. Replace the placeholder values with your actual credentials

### GitHub Secrets (for CI/CD)
1. Go to your GitHub repository → Settings → Secrets and variables → Actions
2. Add each variable as a repository secret
3. Use the exact names listed above

### Vercel Environment Variables
1. Go to your Vercel project → Settings → Environment Variables
2. Add the frontend-specific variables:
   - `NEXT_PUBLIC_API_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

### Railway Environment Variables (CLI Method - Recommended)
1. Install Railway CLI: `npm install -g @railway/cli`
2. Run the setup script: `./setup-railway.sh`
3. Or manually:
   ```bash
   railway login
   railway init --name "regexlab-backend"
   railway add  # Add PostgreSQL
   railway variables --set "NEXTAUTH_SECRET=$(openssl rand -base64 32)"
   railway variables --set "GOOGLE_CLIENT_ID=your-google-client-id"
   railway variables --set "GOOGLE_CLIENT_SECRET=your-google-client-secret"
   ```

### Railway Environment Variables (Web Interface)
1. Go to your Railway project → Variables
2. Add the backend-specific variables:
   - `DATABASE_URL` (automatically set by Railway PostgreSQL)
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET` 