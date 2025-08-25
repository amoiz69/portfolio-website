#!/bin/bash

# Portfolio Website Deployment Script
echo "🚀 Starting Portfolio Website Deployment..."
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project for production..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed! dist directory not found."
    exit 1
fi

echo "✅ Build completed successfully!"
echo ""
echo "📁 Your built files are in the 'dist' directory"
echo ""
echo "🌐 To deploy to Netlify:"
echo "   1. Push your code to GitHub"
echo "   2. Go to netlify.com and connect your repo"
echo "   3. Set build command: npm run build"
echo "   4. Set publish directory: dist"
echo ""
echo "⚡ To deploy to Vercel:"
echo "   1. Push your code to GitHub"
echo "   2. Go to vercel.com and import your repo"
echo "   3. Framework preset: Vite"
echo "   4. Build command: npm run build"
echo "   5. Output directory: dist"
echo ""
echo "🔧 Don't forget to deploy your backend API separately!"
echo "   Check DEPLOYMENT.md for detailed instructions."
echo ""
echo "🎉 Ready for deployment!"
