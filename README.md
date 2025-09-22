# Memory Lanes

A Next.js application for collecting and sharing "memory lanes"—chronological collections of memories with photos. Editors log in with a shared password to manage lanes, memories, and images; everyone else can browse published lanes without credentials.

## Live Demo
- App: https://planned-assessment-mario-bitar.vercel.app/lanes
- Editor login: use the password stored in `ADMIN_PASSWORD` (no username required)

## Features
- Shared admin login backed by `iron-session`; anonymous visitors stay read-only
- CRUD flows for memory lanes and memories, including Supabase-backed image uploads
- Clipboard-ready share links and responsive UI built with Tailwind-style utilities
- Prisma data layer targeting Supabase Postgres, with cascading deletes for related records

## Tech Stack
- Next.js 15 App Router (TypeScript & React server components)
- Prisma ORM + Supabase Postgres
- Supabase Storage via `@supabase/supabase-js`
- iron-session for credential gating
- CSS utility styling with a handful of lucide-react icons

## Project Structure Highlights
- `app/lanes/page.tsx` – dashboard listing lanes + create/delete UI
- `app/lanes/[id]/page.tsx` – single lane view with memory & image management
- `app/login/page.tsx` – shared admin login form
- `app/api/*` – API routes for lanes, memories, images, and session management
- `lib/` – Prisma client, session settings, and Supabase client
- `prisma/schema.prisma` – relational model for lanes, memories, and images

## Getting Started
1. **Prerequisites**
   - Node.js 22+
   - npm 10+
   - Supabase project (Postgres + Storage bucket named `memory-images` with public access enabled)

2. **Clone & Install**
   ```bash
   git clone https://github.com/mario-z-bitar/planned-assessment-mario-bitar.git
   cd planned-assessment-mario-bitar
   npm install
   ```


3. **Database Migration**
   ```bash
   npx prisma migrate deploy   # or migrate dev in local development
   ```

4. **Run Locally**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000/lanes and use the admin password to enable editing.

5. **Lint & Build**
   ```bash
   npm run lint
   npm run build
   ```

## Authentication Flow
- Successful login stores session data via `iron-session`; protected API routes gate write operations by checking `session.isLoggedIn`.
- Logout clears the session and redirects back to `/lanes`.

## Deployment Notes
- Vercel deploys run `npm run build`; ensure Supabase credentials & session secrets are set as environment variables.
- Supabase Storage expects objects under `memory-images/<memoryId>/<uuid>.<ext>`; deletion removes both the DB row and stored file.

## Future Enhancements
- Add rate limiting and audit logging for admin actions
- Optional multi-user auth with role-based access
- Automated image optimization and thumbnail generation

---
Questions or feedback? Open an issue or reach out via the deploy link above.
