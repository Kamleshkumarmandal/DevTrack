# DevTrack — Project Management & Team Collaboration Platform

**A focused workspace to plan projects, coordinate teams, manage tasks and move delivery forward.**

DevTrack is a project and team collaboration platform built as a portfolio project. It gives a small product team one place to see project health, organize work on a Kanban board, assign ownership, track priorities and understand what has been completed.

## Demo links

- **Streamlit demo: https://devtrack-zkmocpqzvbcifuju3ktgwt.streamlit.app/
- **GitHub repository:** https://github.com/Kamleshkumarmandal/DevTrack

After Streamlit creates the public app, add the generated `https://....streamlit.app` address here. The public demo URL cannot be known until the app is deployed.

### Streamlit Cloud deployment

1. Sign in to [Streamlit Community Cloud](https://share.streamlit.io) with GitHub.
2. Choose **Create app** and select an existing repository.
3. Repository: `Kamleshkumarmandal/DevTrack`.
4. Branch: `main`.
5. Main file path: `streamlit_app.py`.
6. Click **Deploy** and wait for the app to finish building.
7. Copy the generated public URL into the **Streamlit demo** link above.

## What DevTrack does

DevTrack supports a practical team workflow from planning through delivery:

- **Workspace overview:** Task totals, completion rate, work in progress and items awaiting review.
- **Project tracking:** Separate Website Redesign and Mobile App workstreams, each with owners and progress indicators.
- **Kanban workflow:** Move tasks through Todo, In progress, In review and Done.
- **Task ownership:** Assign every task to a teammate and make responsibility visible.
- **Priority and due dates:** Highlight urgent work and keep upcoming deadlines in view.
- **Task discovery:** Search by task, project or teammate; filter by project, status, priority and owner.
- **Team workload:** Compare assigned and completed tasks by teammate.
- **Reporting:** Export the current task list as a CSV file.

## Two ways to explore the project

### Streamlit demo

The Streamlit edition is a Python dashboard designed for quick portfolio exploration. It reuses the shared task records and validation/analytics helpers from `devtrack_engine.py`. It includes the overview, Kanban board, project and team pages, task creation, task status updates and CSV export.

The Streamlit version stores changes in session state. They are sample workspace changes and reset when the session restarts. It is not connected to an authenticated multi-user database.

### Next.js application

The original Next.js application remains in the repository and is unchanged by the addition of Streamlit. It provides the interactive React workspace UI.

## Run the Streamlit demo locally

Use Python 3.12 or newer.

Windows PowerShell:

```powershell
py -3.12 -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
streamlit run streamlit_app.py
```

macOS / Linux:

```bash
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
streamlit run streamlit_app.py
```

## Run the Next.js application locally

Requirements: Node.js 20 or newer and npm.

```bash
git clone https://github.com/Kamleshkumarmandal/DevTrack.git
cd DevTrack
npm install
npm run dev
```

Open http://localhost:3000.

## Technology

| Area | Technology |
| --- | --- |
| Web application | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Python demo | Streamlit, Pandas |
| Shared domain logic | Python task filtering, validation and summaries |
| Quality checks | Python unittest, Streamlit AppTest, GitHub Actions |

## Data and security notes

The current demo uses illustrative team members, projects and tasks. The Next.js UI stores demo changes in React state; the Streamlit UI stores them in session state. Neither app currently persists changes to Supabase. A starter Supabase environment template exists for future development.

Never commit passwords, access tokens, service-role keys or other secrets.

## Roadmap

- [ ] Supabase authentication and persistent PostgreSQL storage
- [ ] Team invitations and role-based permissions
- [ ] Persistent projects, tasks and task activity history
- [ ] Comments, file attachments and notifications
- [ ] Calendar and sprint planning views
- [ ] Audit log and richer project analytics
- [ ] Integration and end-to-end tests

## License

MIT. See [LICENSE](LICENSE).
