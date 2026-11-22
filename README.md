# DevTrack

**A calm, modern workspace for teams to plan projects and move work forward.**

DevTrack is a portfolio project management app built with Next.js, React, TypeScript, Tailwind CSS, and Lucide icons.

## Features in this starter

- Workspace dashboard with task totals and completion progress
- Project overview for Website redesign and Mobile app
- Kanban board with Todo, In progress, In review, and Done stages
- Create tasks with a project, priority, due date, and assignee
- Move tasks between stages from each task card
- Search tasks and filter by project
- Responsive sidebar and dashboard layout
- Demo data works without any external credentials

> Current data is held in React state for demonstration. Refreshing the page restores sample tasks. Supabase authentication and persistent database storage are planned for the next phase.

## Getting started

### Requirements

- Node.js 20 or later
- npm

### Run locally

```bash
git clone https://github.com/Kamleshkumarmandal/DevTrack.git
cd DevTrack
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment setup

Copy `.env.example` to `.env.local` when preparing for the Supabase phase.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

The current demo does not require Supabase credentials. Never commit service-role keys, passwords, or other secrets.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint through Next.js |

## Tech stack

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- Lucide React icons

## Roadmap

- [ ] Supabase authentication
- [ ] PostgreSQL schema and row-level security
- [ ] Persistent projects and tasks
- [ ] Team invitations and role-based permissions
- [ ] Activity feed and richer analytics
- [ ] Automated tests and CI workflow

## License

MIT
