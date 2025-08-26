#!/bin/bash

# Supabase Setup Script for Portfolio Website
echo "🚀 Setting up Supabase for Portfolio Website..."
echo "================================================"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    
    # Install Supabase CLI
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install supabase/tap/supabase
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -fsSL https://supabase.com/install.sh | sh
    else
        echo "❌ Unsupported OS. Please install Supabase CLI manually:"
        echo "   https://supabase.com/docs/guides/cli"
        exit 1
    fi
else
    echo "✅ Supabase CLI already installed"
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "✅ Docker is running"

# Initialize Supabase project if not already done
if [ ! -d "supabase" ]; then
    echo "📁 Initializing Supabase project..."
    supabase init
fi

# Start Supabase services
echo "🚀 Starting Supabase services..."
supabase start

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Get service URLs
echo "📋 Supabase services are running at:"
supabase status

echo ""
echo "🎯 Next steps:"
echo "1. Open Supabase Studio: http://localhost:54323"
echo "2. Go to SQL Editor and run the migration from:"
echo "   supabase/migrations/001_initial_schema.sql"
echo "3. Go to Storage and create 'portfolio-images' bucket"
echo "4. Update your .env.local with the local URLs"
echo ""
echo "🔧 To stop Supabase: supabase stop"
echo "🔧 To reset database: supabase db reset"
echo ""
echo "📚 Check SUPABASE_DEPLOYMENT.md for detailed instructions"
