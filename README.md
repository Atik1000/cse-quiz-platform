# CSE Quiz & Assessment Platform

A production-ready, AI-powered quiz platform for Computer Science students and professionals.

## 🚀 Tech Stack

- **Monorepo**: Turborepo
- **Frontend**: Next.js 14 (App Router, TypeScript, Tailwind CSS)
- **Backend**: NestJS (TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + Role-based Access Control
- **AI**: OpenAI integration for question generation

## 📁 Project Structure

```
cse-quiz-platform/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend
├── packages/
│   ├── shared/       # Shared types & DTOs
│   ├── ai/           # AI service abstraction
│   └── config/       # Shared configurations
└── docker-compose.yml
```

## 🏃 Quick Start

### Prerequisites

- Node.js >= 18
- pnpm >= 8
- PostgreSQL >= 14
- OpenAI API Key

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd cse-quiz-platform

# Run automated setup
chmod +x setup.sh
./setup.sh

# Or manually:
# Install dependencies
pnpm install

# Setup environment variables
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# Build shared packages
pnpm --filter @cse-quiz/shared build
pnpm --filter @cse-quiz/ai build

# Generate Prisma client
pnpm db:generate

# Push database schema
pnpm db:push

# Seed database with sample data
cd apps/api && pnpm prisma:seed && cd ../..

# Run development servers
pnpm dev
```

**Default Login Credentials:**
- Admin: `admin@csequiz.com` / `admin123`
- User: `user@csequiz.com` / `user123`

### Access Points
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api
- Prisma Studio: `pnpm db:studio`

### Environment Setup

**Backend (.env in apps/api/)**
```
DATABASE_URL="postgresql://user:password@localhost:5432/cse_quiz"
JWT_SECRET="your-secret-key"
OPENAI_API_KEY="your-openai-key"
PORT=4000
```

**Frontend (.env.local in apps/web/)**
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 📊 Features

### Admin Panel
- Create hierarchical question categories
- Configure AI question generation
- Manage difficulty levels
- Review generated questions

### User Panel
- Browse categories and quizzes
- Take timed assessments
- View detailed results and explanations
- Track performance history

### AI Question Generation
- Category-specific questions
- Multiple difficulty levels
- CSE/Interview focused content
- Structured JSON output with explanations

## 🔐 Security

- JWT-based authentication
- Role-based access control (ADMIN, USER)
- API rate limiting
- Input validation with Zod
- Secure password hashing

## 📦 Scripts

```bash
# Development
pnpm dev          # Start all development servers
pnpm build        # Build all applications
pnpm start        # Start production servers
pnpm lint         # Lint all packages
pnpm format       # Format code with Prettier

# Database
pnpm db:generate  # Generate Prisma client
pnpm db:push      # Push schema to database
pnpm db:studio    # Open Prisma Studio
pnpm db:migrate   # Run database migrations
cd apps/api && pnpm prisma:seed  # Seed database

# Cleanup
pnpm clean        # Remove all build artifacts and node_modules
```

## 🚢 Deployment

### Docker

```bash
docker-compose up -d
```

### Environment Variables

Ensure all required environment variables are set in production.

## 📝 License

MIT

## 👨‍💻 Author

Built for CSE students and professionals preparing for technical interviews.
