#!/bin/bash

PROJECT_ID="fa63aad0-996c-4459-9112-afd648146eac"

echo "🚂 Setting up existing Railway project for RegexLab..."
echo "Project ID: $PROJECT_ID"

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

echo "🔐 Please login to Railway first:"
echo "railway login"
echo ""
echo "Then run this script again, or continue manually:"
echo ""
echo "📋 Manual steps:"
echo "1. Link to your project:"
echo "   railway link -p $PROJECT_ID"
echo ""
echo "2. Add PostgreSQL service (if not already added):"
echo "   railway add"
echo ""
echo "3. Set environment variables:"
echo "   railway variables --set \"NEXTAUTH_SECRET=\$(openssl rand -base64 32)\""
echo "   railway variables --set \"GOOGLE_CLIENT_ID=your-google-client-id\""
echo "   railway variables --set \"GOOGLE_CLIENT_SECRET=your-google-client-secret\""
echo ""
echo "4. Get your credentials for GitHub secrets:"
echo "   railway whoami    # Get RAILWAY_TOKEN"
echo "   railway status    # Get RAILWAY_SERVICE_ID"
echo ""
echo "5. Deploy your backend:"
echo "   railway up" 