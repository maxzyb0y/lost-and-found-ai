# Lost & Found AI

An AI-powered web app where authenticated users post **found** items and anyone
can browse or search them. Google Gemini Vision auto-tags every uploaded photo
(object, category, color, brand, distinguishing features, confidence), and a
natural-language search turns phrases like *"I lost a blue water bottle near the
library"* into database filters.

> School-project MVP — optimized for simplicity and a clean AI demo. There is
> intentionally **no** lost-item posting, claims, chat, or notifications.

## Stack

| Layer    | Tech |
|----------|------|
| Frontend | Next.js (App Router) · TypeScript · Tailwind CSS |
| Backend  | FastAPI · SQLAlchemy · Pydantic |
| Database | PostgreSQL |
| Auth     | JWT (bcrypt-hashed passwords) |
| Storage  | Cloudflare R2 / AWS S3 — with local-disk fallback |
| AI       | Google Gemini Vision + text |
| Deploy   | Docker Compose |

## Quick start (Docker — recommended)

```bash
cp .env.example .env          # optionally add GEMINI_API_KEY and S3/R2 creds
docker compose up --build
```

- Frontend → http://localhost:3000
- Backend API docs (Swagger) → http://localhost:8000/docs
- Health check → http://localhost:8000/health

The backend auto-creates its tables on startup, so no manual migration step is
needed. To load demo data (a demo user + sample items):

```bash
docker compose exec backend python -m app.seed
# demo login -> username: max   password: password123
```

### Works with zero credentials
- **No `GEMINI_API_KEY`?** Uploads still succeed; AI fields use a stub, and
  search falls back to a keyword/heuristic parser.
- **No S3/R2 creds?** Images are stored on the backend's local disk and served
  from `/uploads`.

Add the credentials to `.env` to switch on the real integrations — no code
changes required.

## Running locally without Docker

**Backend**
```bash
cd backend
python -m venv .venv && source .venv/Scripts/activate   # Windows; use bin/activate on macOS/Linux
pip install -r requirements.txt
# Point at a running Postgres instance:
export DATABASE_URL="postgresql+psycopg2://lostfound:lostfound@localhost:5432/lostfound"
uvicorn app.main:app --reload
```

**Frontend**
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

## Database migrations (optional)

The app bootstraps the schema automatically (`AUTO_CREATE_TABLES=true`). If you
prefer Alembic, set `AUTO_CREATE_TABLES=false` and run:

```bash
cd backend
alembic upgrade head
```

## API overview

| Method | Path                  | Auth | Purpose |
|--------|-----------------------|------|---------|
| POST   | `/auth/register`      | —    | Create account, returns JWT |
| POST   | `/auth/login`         | —    | Log in (username **or** email), returns JWT |
| GET    | `/auth/me`            | ✓    | Current user |
| POST   | `/found-items`        | ✓    | Upload found item (multipart) → runs Gemini analysis |
| GET    | `/found-items`        | —    | List/filter items (`category`, `q`, `uploader`, `limit`, `offset`) |
| GET    | `/found-items/{id}`   | —    | Item details |
| POST   | `/search`             | —    | Natural-language search → `{ extracted, results }` |

## Demo script

1. Register an account (or seed + log in as `max` / `password123`).
2. **Upload Item** → choose a photo, set a location → watch the AI tag it.
3. Back on the home page, browse the grid and filter by category chips.
4. Search *"I lost a blue water bottle near the library"* and see the extracted
   filters + matching results.
5. Open any card to view full details and AI metadata.

## Project structure

```
lost_and_found_ai/
├── docker-compose.yml
├── .env.example
├── backend/        # FastAPI app (routers, services, models, schemas, alembic)
└── frontend/       # Next.js app (App Router pages + components)
```
