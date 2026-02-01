# Contributing to CSE Quiz Platform

First off, thank you for considering contributing to CSE Quiz Platform! It's people like you that make this platform better for everyone.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Project Structure](#project-structure)

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Set up the development environment** (see below)
4. **Create a branch** for your contribution
5. **Make your changes**
6. **Test your changes** thoroughly
7. **Submit a pull request**

## 💻 Development Setup

### Prerequisites

- Node.js 18+ and pnpm 8+
- PostgreSQL 14+
- OpenAI API key (for AI features)

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/cse-quiz-platform.git
cd cse-quiz-platform

# Run setup script
chmod +x setup.sh
./setup.sh

# Or manually:
pnpm install
pnpm --filter @cse-quiz/shared build
pnpm --filter @cse-quiz/ai build
cd apps/api && pnpm prisma generate && pnpm prisma db push && cd ../..

# Seed the database
cd apps/api && pnpm prisma:seed && cd ../..

# Start development servers
pnpm dev
```

## 🎯 How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** for the enhancement
- **Proposed solution** (if you have one)
- **Alternative solutions** considered
- **Mockups or examples** (if applicable)

### Code Contributions

We welcome code contributions! Here are some areas where you can help:

#### Backend (NestJS)
- [ ] Implement additional authentication strategies (OAuth, Google, GitHub)
- [ ] Add more comprehensive error handling
- [ ] Implement caching with Redis
- [ ] Add email notifications
- [ ] Implement WebSocket for real-time quiz features
- [ ] Add more API endpoints for analytics
- [ ] Write unit and integration tests

#### Frontend (Next.js)
- [ ] Improve UI/UX design
- [ ] Add dark mode support
- [ ] Implement responsive design improvements
- [ ] Add animations and transitions
- [ ] Create more reusable components
- [ ] Improve accessibility (ARIA labels, keyboard navigation)
- [ ] Add loading skeletons
- [ ] Write E2E tests with Playwright or Cypress

#### AI Features
- [ ] Support for multiple AI providers (Claude, Gemini)
- [ ] Improve question quality with better prompts
- [ ] Add question difficulty calibration
- [ ] Implement adaptive learning (adjust difficulty based on performance)
- [ ] Add support for code execution in coding questions

#### DevOps
- [ ] Improve Docker setup
- [ ] Add Kubernetes deployment configs
- [ ] Set up monitoring and logging
- [ ] Implement automated backups
- [ ] Add performance profiling

## 🔄 Pull Request Process

1. **Update documentation** if needed
2. **Follow coding standards** (see below)
3. **Ensure tests pass** (when implemented)
4. **Update CHANGELOG.md** with your changes
5. **Request review** from maintainers

### PR Title Format

Use conventional commits format:

```
type(scope): description

Examples:
feat(quiz): add timer pause functionality
fix(auth): resolve token refresh issue
docs(api): update authentication endpoints
style(ui): improve button hover states
refactor(quiz): simplify question validation logic
test(auth): add login flow tests
chore(deps): update dependencies
```

## 📐 Coding Standards

### TypeScript/JavaScript

- Use **TypeScript** for all new code
- Follow **ESLint** and **Prettier** configurations
- Use **meaningful variable names**
- Write **JSDoc comments** for complex functions
- Prefer **functional programming** patterns
- Use **async/await** over promises

### React/Next.js

- Use **functional components** with hooks
- Follow **component composition** patterns
- Keep components **small and focused**
- Use **TypeScript interfaces** for props
- Implement **error boundaries**
- Use **client/server components** appropriately

### NestJS

- Follow **NestJS best practices**
- Use **dependency injection**
- Implement **proper error handling**
- Use **DTOs** for validation
- Write **modular code**
- Use **pipes, guards, and interceptors** appropriately

### Database

- Use **Prisma migrations** for schema changes
- Write **efficient queries**
- Use **transactions** where appropriate
- Add **proper indexes**
- Write **seed scripts** for test data

### Git Workflow

```bash
# Create feature branch
git checkout -b feat/your-feature-name

# Make changes and commit
git add .
git commit -m "feat(scope): description"

# Keep your branch updated
git fetch upstream
git rebase upstream/main

# Push to your fork
git push origin feat/your-feature-name
```

## 📁 Project Structure

```
cse-quiz-platform/
├── apps/
│   ├── api/              # NestJS backend
│   │   ├── src/
│   │   │   ├── auth/     # Authentication module
│   │   │   ├── user/     # User module
│   │   │   ├── admin/    # Admin module
│   │   │   ├── category/ # Category module
│   │   │   ├── question/ # Question module
│   │   │   ├── quiz/     # Quiz module
│   │   │   └── ai/       # AI service module
│   │   └── prisma/       # Database schema & migrations
│   │
│   └── web/              # Next.js frontend
│       ├── src/
│       │   ├── app/      # App router pages
│       │   ├── components/ # Reusable components
│       │   ├── lib/      # Utilities
│       │   └── store/    # State management
│       │
├── packages/
│   ├── shared/           # Shared types & schemas
│   ├── ai/               # AI service abstraction
│   └── config/           # Shared configs
│
└── docs/                 # Documentation
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run backend tests
pnpm --filter @cse-quiz/api test

# Run frontend tests
pnpm --filter @cse-quiz/web test

# Run tests in watch mode
pnpm test:watch

# Run E2E tests
pnpm test:e2e
```

### Writing Tests

- Write **unit tests** for utilities and services
- Write **integration tests** for API endpoints
- Write **E2E tests** for critical user flows
- Aim for **>80% code coverage**
- Mock external dependencies

## 📝 Documentation

- Update **README.md** for user-facing changes
- Update **API_DOCUMENTATION.md** for API changes
- Update **DEPLOYMENT.md** for deployment changes
- Add **JSDoc comments** for complex functions
- Write **inline comments** for complex logic

## 💬 Communication

- Use **GitHub Issues** for bugs and features
- Use **GitHub Discussions** for questions and ideas
- Be **respectful and constructive**
- Follow up on your PRs and issues

## 🎉 Recognition

Contributors will be added to the README.md file. Thank you for making CSE Quiz Platform better!

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## ❓ Questions?

Feel free to reach out by:
- Opening a **GitHub Discussion**
- Creating an **issue** with the `question` label
- Contacting the **maintainers**

Thank you for contributing! 🙏
