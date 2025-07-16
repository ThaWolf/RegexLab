#!/bin/bash

# RegexLab Setup Script
# This script validates the environment and installs all dependencies

set -e

echo "🚀 RegexLab Setup Script"
echo "========================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm $(npm --version) detected"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
npx playwright install

# Check environment variables
echo "🔍 Checking environment variables..."

if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Please create it with the required environment variables."
    echo "   See .env.example for reference."
else
    echo "✅ .env.local found"
    
    # Check for required variables
    required_vars=("DATABASE_URL" "NEXTAUTH_SECRET" "GOOGLE_CLIENT_ID" "GOOGLE_CLIENT_SECRET" "NEXT_PUBLIC_API_URL")
    
    for var in "${required_vars[@]}"; do
        if grep -q "^${var}=" .env.local; then
            echo "✅ $var is set"
        else
            echo "⚠️  $var is missing from .env.local"
        fi
    done
fi

# Check if PostgreSQL is running (for local development)
echo "🗄️  Checking PostgreSQL connection..."
if command -v pg_isready &> /dev/null; then
    if pg_isready -h localhost -p 5432 &> /dev/null; then
        echo "✅ PostgreSQL is running on localhost:5432"
    else
        echo "⚠️  PostgreSQL is not running on localhost:5432"
        echo "   You can start it with: docker-compose up -d"
    fi
else
    echo "⚠️  pg_isready not found. Cannot check PostgreSQL status."
fi

# Build frontend to check for issues
echo "🔨 Building frontend..."
cd frontend
npm run build
cd ..

# Build backend to check for issues
echo "🔨 Building backend..."
cd backend
npm run build
cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Start PostgreSQL: docker-compose up -d"
echo "2. Start backend: cd backend && npm run start:dev"
echo "3. Start frontend: cd frontend && npm run dev"
echo "4. Run tests: npm test"
echo "5. Run E2E tests: npm run test:e2e" 