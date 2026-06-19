# CodeLens AI — AI-Powered Code Review Platform

<div align="center">

![CodeLens AI](https://img.shields.io/badge/CodeLens-AI-blueviolet?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlsaW5lIHBvaW50cz0iMTYgMTggMjIgMTIgMTYgNiI+PC9wb2x5bGluZT48cG9seWxpbmUgcG9pbnRzPSI4IDYgMiAxMiA4IDE4Ij48L3BvbHlsaW5lPjwvc3ZnPg==)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-7-green?style=for-the-badge&logo=mongodb)

**Detect bugs, security vulnerabilities, and performance issues with AI-powered code reviews.**

[Getting Started](#getting-started) · [Features](#features) · [Tech Stack](#tech-stack) · [API Docs](#api-endpoints)

</div>

---

## Features

- 🔐 **GitHub OAuth** — Connect your GitHub account with one click
- 🤖 **AI Code Review** — GPT-4o analyzes your PRs for bugs, security, and performance
- 📊 **Quality Scores** — Security, performance, maintainability, and readability scores (0-100)
- 📈 **Analytics Dashboard** — Track review trends, issue severity, and repository health
- 🎨 **Premium UI** — Dark/light mode, glassmorphism, micro-animations
- 🔄 **BullMQ Queues** — Background processing for review jobs
- 🐳 **Docker** — Full stack in one `docker-compose up`
- 🚀 **CI/CD** — GitHub Actions for lint, test, and deploy

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS v4, Shadcn UI |
| **State** | TanStack Query, Zustand |
| **Backend** | Express.js 5, TypeScript, Zod validation |
| **Database** | MongoDB 7 (Mongoose ODM) |
| **Queue** | BullMQ + Redis |
| **AI** | OpenAI GPT-4o (primary), Claude (optional) |
| **Auth** | JWT + GitHub OAuth |
| **DevOps** | Docker, GitHub Actions |

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- Redis
- GitHub OAuth App credentials
- OpenAI API key

### 1. Clone and install

```bash
git clone <repo-url> ai-code-review
cd ai-code-review

# Install backend
cd backend && npm install

# Install frontend
cd ../frontend && npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Start with Docker (recommended)

```bash
cd docker
docker-compose up -d
```

Or start manually:

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### 4. Open the app

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/health

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Email signup |
| POST | `/api/auth/login` | Email login |
| GET | `/api/auth/github` | GitHub OAuth URL |
| GET | `/api/auth/github/callback` | OAuth callback |
| GET | `/api/auth/me` | Current user |

### Repositories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/repositories` | List imported repos |
| GET | `/api/repositories/github` | List GitHub repos |
| POST | `/api/repositories/import` | Import repo |
| POST | `/api/repositories/:id/sync` | Sync with GitHub |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews` | List reviews |
| GET | `/api/reviews/:id` | Review details |
| POST | `/api/reviews/pull/:id/analyze` | Trigger AI review |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reviews/ai/explain` | Explain code |
| POST | `/api/reviews/ai/refactor` | Suggest refactoring |
| POST | `/api/reviews/ai/generate-tests` | Generate tests |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/overview` | Dashboard stats |
| GET | `/api/analytics/trends` | Review trends |
| GET | `/api/analytics/repositories` | Repo health |

## Project Structure

```
AI-Code-Review/
├── frontend/          # Next.js 15 app
│   └── src/
│       ├── app/       # Route pages
│       ├── components/# Reusable components
│       ├── store/     # Zustand stores
│       ├── lib/       # Utilities
│       └── types/     # TypeScript types
├── backend/           # Express.js API
│   └── src/
│       ├── controllers/
│       ├── services/
│       ├── models/
│       ├── routes/
│       ├── middleware/
│       └── config/
├── docker/            # Docker configs
└── .github/           # CI/CD workflows
```

## License

MIT
