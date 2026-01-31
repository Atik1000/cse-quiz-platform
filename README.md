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
# Install dependencies
pnpm install

# Setup environment variables
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Generate Prisma client
pnpm db:generate

# Push database schema
pnpm db:push

# Run development servers
pnpm dev
```

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
pnpm dev          # Start development servers
pnpm build        # Build all applications
pnpm start        # Start production servers
pnpm lint         # Lint all packages
pnpm db:studio    # Open Prisma Studio
pnpm db:migrate   # Run database migrations
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
