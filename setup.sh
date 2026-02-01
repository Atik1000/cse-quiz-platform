#!/bin/bash

# CSE Quiz Platform - Development Setup Script

echo "🚀 Setting up CSE Quiz Platform..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Installing..."
    npm install -g pnpm
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Setup environment files
echo "🔧 Setting up environment files..."

if [ ! -f "apps/api/.env" ]; then
    cp apps/api/.env.example apps/api/.env
    echo "✅ Created apps/api/.env"
fi

if [ ! -f "apps/web/.env.local" ]; then
    cp apps/web/.env.example apps/web/.env.local
    echo "✅ Created apps/web/.env.local"
fi

# Build shared packages
echo "🏗️ Building shared packages..."
pnpm --filter @cse-quiz/shared build
pnpm --filter @cse-quiz/ai build

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
cd apps/api && pnpm prisma generate && cd ../..

# Check if PostgreSQL is running
echo "🐘 Checking PostgreSQL..."
if command -v docker &> /dev/null; then
    echo "Starting PostgreSQL with Docker..."
    docker-compose up -d postgres
else
    echo "⚠️  Docker not found. Please ensure PostgreSQL is running on localhost:5432"
fi

# Wait for PostgreSQL
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Push database schema
echo "📊 Pushing database schema..."
cd apps/api && pnpm prisma db push && cd ../..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update your .env files with your OpenAI API key and other credentials"
echo "2. Run 'pnpm dev' to start development servers"
echo "3. Access the frontend at http://localhost:3000"
echo "4. Access the API at http://localhost:4000/api"
echo ""
echo "🎯 Create an admin user:"
echo "   - Register at http://localhost:3000/register"
echo "   - Update the user role in the database to 'ADMIN'"
echo ""
echo "Happy coding! 🎉"
