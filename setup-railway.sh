#!/bin/bash

echo "🚂 Setting up Railway project for RegexLab..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Login to Railway
echo "🔐 Logging into Railway..."
railway login

# Create new project
echo "📦 Creating new Railway project..."
railway init --name "regexlab-backend"

# Add PostgreSQL service
echo "🗄️ Adding PostgreSQL database..."
railway add

# Set environment variables
echo "🔧 Setting up environment variables..."
railway variables set NEXTAUTH_SECRET=$(openssl rand -base64 32)

echo "✅ Railway setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Add your Google OAuth credentials:"
echo "   railway variables set GOOGLE_CLIENT_ID=your-google-client-id"
echo "   railway variables set GOOGLE_CLIENT_SECRET=your-google-client-secret"
echo ""
echo "2. Get your Railway token:"
echo "   railway whoami"
echo ""
echo "3. Get your service ID:"
echo "   railway status"
echo ""
echo "4. Add these to GitHub secrets:"
echo "   - RAILWAY_TOKEN (from railway whoami)"
echo "   - RAILWAY_SERVICE_ID (from railway status)" 