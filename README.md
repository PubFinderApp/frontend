## PubFinder

PubFinder is a full-stack pub discovery and reviews app. It lets the community explore curated pubs, read long-form details, and share authenticated reviews with live ratings.

### Core features

- **Browse pubs** – fetches live data from the PubFinder API (sorted by rating) and renders responsive cards with imagery, descriptions, and rating summaries.
- **Pub detail pages** – server-rendered views include hero media, the full story, crowd rating, and deep-link navigation.
- **Community reviews** – authenticated users can create, edit, and delete reviews with 0–5 ratings, long-form content, and optimistic feedback toasts. Guest users see guardrails prompting them to log in.
- **Account management** – lightweight auth context keeps track of the signed-in user, exposes guards for protected routes, and adds logout controls in the global navbar.
- **Robust API client** – shared `apiFetch` handles JSON payloads, attaches JWT bearer tokens when needed, and raises typed errors for UI hooks.

### Tech stack

- Next.js App Router, React Server Components, TypeScript
- React Hook Form, custom UI kit (shadcn-based)
- JWT session handling with browser storage + expiry awareness
- PubFinder REST API (`/auth`, `/pubs`, `/reviews` endpoints)

---

## Getting started

### 1. Install dependencies

```bash
pnpm install
# or yarn / npm / bun if preferred
```

### 2. Configure environment variables

Create a `.env.local` at the project root and point it at your PubFinder backend (defaults to `http://localhost:8080` when running the reference server):

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

This value is required by the shared API client; without it every network call will fail early.

### 3. Run the backend

Ensure the PubFinder API is running locally (or update the env variable to any reachable instance). The frontend expects all endpoints listed in the API integration docs:

- `POST /auth/register`, `POST /auth/login`
- `GET /pubs`, `GET /pubs/:id`
- `GET /reviews`, `GET /reviews/pub/:pubId`, plus review CRUD endpoints

### 4. Launch the app

```bash
pnpm dev
```

Open [`http://localhost:3000`](http://localhost:3000) to explore the UI. The page auto-updates during development.

### 5. Linting & quality checks

```bash
pnpm lint
```

Runs ESLint with the repo rules to catch type or hook violations before shipping changes.

---

## What you can do

1. **Sign up / log in**

   - Create an account via `/signup` (username, password, name, surname, email).
   - Log in via `/login`. Successful auth returns a JWT that the client stores (with expiry metadata) and reuses on every secure request.

2. **Browse and inspect pubs**

   - Landing page fetches all pubs with live star ratings.
   - Selecting a card navigates to `/pubs/[id]`, rendering detailed descriptions and aggregate rating data.

3. **Create and manage reviews**

   - Authenticated visitors can post reviews (0–5 rating, 10–5000 char content).
   - Authors can edit inline or delete their entries, with confirmation prompts and toast feedback.
   - Everyone can see community reviews, including username, timestamp, and rating stars.

4. **Account overview & logout**
   - `/account` shows a protected summary of the signed-in user.
   - Navbar exposes quick logout, which clears the local session immediately.

---

## Deployment

The Next.js app can be deployed to any environment supporting the App Router (Vercel is recommended). Ensure `NEXT_PUBLIC_API_BASE_URL` is set in the hosting provider’s environment variables and that the PubFinder API is reachable from the deployed frontend.
