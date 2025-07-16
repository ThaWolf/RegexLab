#!/bin/bash

# Environment Validation Script
# This script validates all environment variables and configuration

set -e

echo "🔍 Environment Validation Script"
echo "================================"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found!"
    echo "   Please create .env.local with the required environment variables."
    echo "   See .env.example for reference."
    exit 1
fi

echo "✅ .env.local found"

# Load environment variables
set -a
source .env.local
set +a

# Required environment variables
declare -A required_vars=(
    ["DATABASE_URL"]="Database connection string"
    ["NEXTAUTH_SECRET"]="NextAuth secret for session encryption"
    ["GOOGLE_CLIENT_ID"]="Google OAuth client ID"
    ["GOOGLE_CLIENT_SECRET"]="Google OAuth client secret"
    ["NEXT_PUBLIC_API_URL"]="Public API URL for frontend"
    ["NEXTAUTH_URL"]="NextAuth URL (optional for local development)"
)

# Check each required variable
missing_vars=()
for var in "${!required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ $var is missing: ${required_vars[$var]}"
        missing_vars+=("$var")
    else
        echo "✅ $var is set"
    fi
done

if [ ${#missing_vars[@]} -gt 0 ]; then
    echo ""
    echo "❌ Missing required environment variables:"
    printf '%s\n' "${missing_vars[@]}"
    exit 1
fi

# Validate DATABASE_URL format
if [[ "$DATABASE_URL" =~ ^postgresql:// ]]; then
    echo "✅ DATABASE_URL has correct PostgreSQL format"
else
    echo "⚠️  DATABASE_URL doesn't match expected PostgreSQL format"
fi

# Validate NEXTAUTH_SECRET length
if [ ${#NEXTAUTH_SECRET} -ge 32 ]; then
    echo "✅ NEXTAUTH_SECRET has sufficient length"
else
    echo "⚠️  NEXTAUTH_SECRET should be at least 32 characters long"
fi

# Validate API URL format
if [[ "$NEXT_PUBLIC_API_URL" =~ ^https?:// ]]; then
    echo "✅ NEXT_PUBLIC_API_URL has correct URL format"
else
    echo "⚠️  NEXT_PUBLIC_API_URL doesn't match expected URL format"
fi

# Test database connection (if possible)
echo ""
echo "🗄️  Testing database connection..."
if command -v psql &> /dev/null; then
    if timeout 5 psql "$DATABASE_URL" -c "SELECT 1;" &> /dev/null; then
        echo "✅ Database connection successful"
    else
        echo "⚠️  Could not connect to database. Make sure it's running and accessible."
    fi
else
    echo "⚠️  psql not found. Cannot test database connection."
fi

# Test API endpoint (if possible)
echo ""
echo "🌐 Testing API endpoint..."
if command -v curl &> /dev/null; then
    if timeout 5 curl -f "$NEXT_PUBLIC_API_URL/api/health" &> /dev/null; then
        echo "✅ API endpoint is accessible"
    else
        echo "⚠️  Could not reach API endpoint. Make sure the backend is running."
    fi
else
    echo "⚠️  curl not found. Cannot test API endpoint."
fi

echo ""
echo "🎉 Environment validation completed!"
echo ""
echo "If you see any warnings, please address them before running the application." 