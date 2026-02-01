# 🚀 Quick Start Guide - CSE Quiz Platform

Welcome! This guide will get you up and running in under 5 minutes.

## ✅ Step 1: Prerequisites Check

Make sure you have these installed:
- ✅ Node.js 18 or higher
- ✅ pnpm 8 or higher
- ✅ PostgreSQL 14 or higher (or Docker)
- ✅ Git

Check versions:
```bash
node --version  # Should be v18+
pnpm --version  # Should be 8+
psql --version  # Should be 14+
```

Don't have pnpm? Install it:
```bash
npm install -g pnpm
```

## 📥 Step 2: Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd cse-quiz-platform

# Install dependencies (this may take a minute)
pnpm install
```

## ⚙️ Step 3: Environment Setup

### Option A: Using the Setup Script (Recommended)

```bash
chmod +x setup.sh
./setup.sh
```

This script will:
- Create environment files
- Build shared packages
- Start PostgreSQL (with Docker)
- Setup the database
- Seed sample data

### Option B: Manual Setup

1. **Create environment files:**
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

2. **Edit `apps/api/.env`:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cse_quiz?schema=public"
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=sk-your-openai-api-key-here
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

3. **Edit `apps/web/.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

4. **Start PostgreSQL:**

Using Docker:
```bash
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16-alpine
```

Or use your existing PostgreSQL installation.

## 🏗️ Step 4: Build & Setup Database

```bash
# Build shared packages
pnpm --filter @cse-quiz/shared build
pnpm --filter @cse-quiz/ai build

# Generate Prisma client
cd apps/api
pnpm prisma generate

# Push database schema
pnpm prisma db push

# Seed the database with sample data
pnpm prisma:seed

cd ../..
```

## 🎯 Step 5: Start Development Servers

```bash
pnpm dev
```

This starts:
- ✅ Backend API on http://localhost:4000
- ✅ Frontend on http://localhost:3000

## 🎉 Step 6: Login & Explore

Open http://localhost:3000 in your browser.

**Default Accounts:**

**Admin Account:**
- Email: `admin@csequiz.com`
- Password: `admin123`

**User Account:**
- Email: `user@csequiz.com`
- Password: `user123`

## 🧭 What to Do Next?

### As Admin:
1. Go to http://localhost:3000/login
2. Login with admin credentials
3. Navigate to "Categories" to view/create categories
4. Navigate to "Generate Questions" to create AI-powered questions
5. Check the dashboard for statistics

### As User:
1. Go to http://localhost:3000/login
2. Login with user credentials
3. Navigate to "Take Quiz"
4. Select category, difficulty, and number of questions
5. Start the quiz and test your knowledge!

## 🛠️ Useful Commands

```bash
# View database in UI
pnpm db:studio

# Check API is running
curl http://localhost:4000/api

# View logs
# Backend logs appear in terminal where you ran pnpm dev
# Frontend logs appear in browser console

# Restart servers
# Press Ctrl+C to stop, then pnpm dev again
```

## 🐛 Troubleshooting

### Database Connection Failed
```bash
# Check if PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Or with Docker
docker ps | grep postgres

# Restart PostgreSQL
docker restart postgres
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 4000
lsof -ti:4000 | xargs kill -9
```

### Build Errors
```bash
# Clean everything and start fresh
pnpm clean
rm -rf node_modules
pnpm install
pnpm --filter @cse-quiz/shared build
pnpm --filter @cse-quiz/ai build
```

### OpenAI API Errors
- Make sure you have a valid OpenAI API key
- Check your OpenAI account has credits
- The key should start with `sk-`

## 📚 Next Steps

- Read the [API Documentation](./API_DOCUMENTATION.md)
- Check out [Deployment Guide](./DEPLOYMENT.md)
- See [Contributing Guidelines](./CONTRIBUTING.md)
- Explore the codebase structure

## 💡 Tips

1. **Use Prisma Studio** to view/edit database:
   ```bash
   pnpm db:studio
   ```

2. **Format code before committing:**
   ```bash
   pnpm format
   ```

3. **Create your own admin user:**
   - Register a new account
   - Use Prisma Studio to change the `role` field to `ADMIN`

4. **Generate more questions:**
   - Login as admin
   - Go to "Generate Questions"
   - Select a category and generate 10-20 questions
   - Questions are saved to the database automatically

## 🆘 Need Help?

- Check the [Troubleshooting](#-troubleshooting) section above
- Open an issue on GitHub
- Read the full documentation
- Check existing issues for similar problems

## 🎊 You're All Set!

Congratulations! You now have a fully functional AI-powered quiz platform running locally.

Happy coding! 🚀
