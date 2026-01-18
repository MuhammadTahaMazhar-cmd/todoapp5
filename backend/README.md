# TodoApp - Full Stack Application

This is a full-stack todo application with a Next.js frontend and FastAPI backend.

## Overview

This project consists of two main parts:
1. **Frontend**: Next.js application with Tailwind CSS
2. **Backend**: FastAPI server with PostgreSQL database

## Frontend Features

- **Next.js 14** with App Router
- **Tailwind CSS** for styling
- **Better Auth** for authentication
- **TypeScript** for type safety
- **Responsive Design**
- **Modern UI/UX**

### Frontend Tech Stack
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Better Auth
- Sonner (notifications)

## Backend Features

- **FastAPI** backend with JWT authentication and SQLModel ORM for task management.
- **Three-Layer Security Architecture**
  1. JWT token verification (HS256 with Better Auth shared secret)
  2. Path parameter validation (user_id must match JWT claim)
  3. Database query filtering (all queries filter by authenticated user_id)
- **RESTful API** with full CRUD + PATCH operations
- **User Isolation** enforced at every layer
- **Type-Safe** with Pydantic validation and SQLModel ORM
- **Production-Ready** with connection pooling, migrations, and comprehensive testing

### Backend Tech Stack
- **Python 3.13+**
- **FastAPI** - Modern async web framework
- **SQLModel** - SQL database ORM with Pydantic integration
- **PostgreSQL** - Production database (Neon Serverless)
- **Alembic** - Database migrations
- **python-jose** - JWT token verification
- **pytest** - Testing framework

## Getting Started

### Prerequisites

#### Frontend
- Node.js 18+
- pnpm (recommended)

#### Backend
- Python 3.13+
- PostgreSQL 16+ (via Docker or Neon)
- UV package manager (optional but recommended)

### Installation

#### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment:
```bash
cp .env.example .env.local
```

4. Update `NEXT_PUBLIC_API_URL` in `.env.local` to point to your backend server

5. Start the development server:
```bash
pnpm run dev
```

#### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Dependencies
Using UV (recommended):
```bash
uv sync
```

Or using pip:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -e .
pip install -e ".[dev]"
```

3. Start Database
Using Docker:
```bash
cd ..
docker-compose up -d postgres
```

Or use your own PostgreSQL instance and update `DATABASE_URL` in `.env`

4. Configure Environment
Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

**CRITICAL**: Set `BETTER_AUTH_SECRET` to match your Better Auth frontend configuration.

5. Run Migrations
```bash
alembic upgrade head
```

6. Start Server
```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

Server will start at: http://localhost:8000

## API Endpoints

All endpoints require `Authorization: Bearer <jwt_token>` header.

### Tasks

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/{user_id}/tasks` | Create new task | 201 |
| GET | `/api/{user_id}/tasks` | List all user's tasks | 200 |
| GET | `/api/{user_id}/tasks/{id}` | Get single task | 200 |
| PUT | `/api/{user_id}/tasks/{id}` | Update task (full) | 200 |
| PATCH | `/api/{user_id}/tasks/{id}` | Patch task (partial) | 200 |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete task | 204 |

### Health Check

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/health` | Health check (no auth) | 200 |

## Security Architecture

### Three-Layer Security

Every protected endpoint enforces:

1. **JWT Verification** (Middleware)
   - Validates token signature using `BETTER_AUTH_SECRET`
   - Checks token expiration
   - Extracts `user_id` from `sub` or `userId` claim

2. **Path Validation** (Route Handler)
   - Verifies `user_id` in path matches JWT claim
   - Returns 403 if mismatch detected

3. **Query Filtering** (Service Layer)
   - All database queries MUST filter by authenticated `user_id`
   - Prevents cross-user data access

### Anti-Enumeration

Returns 404 (not 403) when accessing another user's resources to prevent enumeration attacks.

## Environment Variables

### Frontend
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |
| `BETTER_AUTH_URL` | Better Auth base URL | `http://localhost:3000` |
| `BETTER_AUTH_SECRET` | JWT signing secret (MUST match backend) | Min 32 characters |

### Backend
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `BETTER_AUTH_SECRET` | JWT signing secret (MUST match frontend) | Min 32 characters |
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) | `http://localhost:3000` |
| `ENVIRONMENT` | Environment name | `development`, `production` |
| `LOG_LEVEL` | Logging level | `INFO`, `DEBUG`, `WARNING` |

## Development

### Frontend Development
- Run in development mode: `pnpm run dev`
- Build for production: `pnpm run build`
- Run tests: `pnpm run test`

### Backend Development
- Run all tests: `pytest`
- Run with coverage: `pytest --cov=src --cov-report=html`
- Format code: `ruff format src/ tests/`
- Lint code: `ruff check src/ tests/`
- Type check: `mypy src/`

## Deployment

### Frontend Deployment
The frontend can be deployed to Vercel, Netlify, or any platform supporting Next.js applications.

### Backend Deployment
- Deploy to platforms like Heroku, Railway, or AWS
- Ensure environment variables are properly set
- Run database migrations after deployment

## License

MIT