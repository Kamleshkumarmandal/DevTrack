# DevTrack

A modern project and task management workspace built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Project overview with progress, task totals, and due dates
- Kanban board with status lanes and interactive task creation
- Priority, assignee, and due-date metadata
- Project navigation and dashboard analytics
- Responsive layout for desktop and mobile
- Supabase-ready environment configuration (authentication and persistence require project credentials)

## Getting started

1. Install Node.js 20 or later.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Run `npm run dev` and open http://localhost:3000.

The starter runs with local demo data. To enable Supabase, create a project and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Do not commit secrets.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — ESLint

## Tech stack

Next.js App Router, React, TypeScript, Tailwind CSS, Lucide React, and optional Supabase.

## License

MIT
