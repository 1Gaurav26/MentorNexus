# MentorNexus — Frontend

This folder contains a minimal React + Vite user interface for MentorNexus.

The frontend is a pure UI layer: all scoring, business rules and blockchain
interactions are performed by the backend. The frontend only calls the
backend HTTP API and displays results.

Prerequisites
- Node.js 18+ and npm (or pnpm/yarn)

Quick start
1. Copy the example env and set API base URL (optional):

```bash
cd frontend
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL if your backend runs elsewhere
```

2. Install dependencies and run dev server:

```bash
npm install
npm run dev
```

Build for production

```bash
npm run build
npm run preview
```

Notes
- Default API base: `http://localhost:8000`. The app reads `VITE_API_BASE_URL`.
- Do not commit `.env` (it is listed in `.gitignore`).
- The frontend expects the backend routes described in the project:
	- `GET /search/faculty`
	- `POST /match/research`
	- `POST /match/full`
	- `POST /student/upsert`
- Keep all integration API-only; do not add blockchain signing or direct
	Ethereum calls in the frontend.

Project layout

- `src/` — React entry, pages, components, and `api/` wrappers
- `.env.example` — example environment file
- `package.json` and `vite.config.js` — build and dev tools

If you want, I can start the dev server and verify calls to the backend.
