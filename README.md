# TRACKPILE

Job-application tracker with a Neo-Brutalist UI. Table + Kanban views, Google-only
auth, free/pro plans. Built from the Claude Design prototype (`Trackpile_v1.html`).

**Stack:** Next.js 15 (App Router) · TypeScript · Prisma · PostgreSQL · Auth.js (Google) · dnd-kit

## Getting started

```bash
# 1. Install deps
npm install

# 2. Configure environment
cp .env.example .env
#   → fill DATABASE_URL, AUTH_SECRET (npx auth secret), and Google OAuth creds

# 3. Create the database schema
npm run db:push

# 4. Run
npm run dev
```

Open http://localhost:3000.

### Google OAuth setup
1. Google Cloud Console → APIs & Services → Credentials → Create OAuth client ID (Web).
2. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
3. Copy the client ID/secret into `.env` as `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`.

## Project structure

```
src/
  app/
    page.tsx              landing
    pricing/page.tsx      plans
    login/page.tsx        google sign-in
    app/
      layout.tsx          sidebar shell (auth-gated)
      page.tsx            home (table/kanban) — server loads jobs
      actions.ts          job CRUD server actions (+ free-plan limit)
      profile/page.tsx
      settings/page.tsx
      settings-actions.ts
    api/auth/[...nextauth]/route.ts
  components/             UI primitives + feature components
  lib/
    tokens.ts             ← design tokens (colors, shadows, status map)
    auth.ts  prisma.ts  validation.ts  types.ts
  middleware.ts           protects /app/*
prisma/schema.prisma      User · Job · StatusHistory (+ Auth.js tables)
```

## What's implemented (MVP)
- Google login, auth-gated `/app`, auto user creation
- Home: table + kanban toggle, drag-and-drop between stages (optimistic)
- Job CRUD via modal, job detail view, delete
- Free-plan 15-job limit (enforced in the server action, not just UI)
- Calendar shown locked for free users
- Profile + settings (persisted toggles), logout
- StatusHistory audit trail on every status change (metrics foundation)

## Deferred (v1.1+)
Calendar view · Stripe checkout · interview email reminders · file attachments ·
metrics dashboard · inline table editing.
