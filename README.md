# RepoGuide

**A Legacy Codebase Onboarding Assistant, powered by IBM Bob.**

Built for the IBM Bob 2.0 Hackathon (lablab.ai, September 25–27, 2026).

## The Problem

Joining an unfamiliar codebase is slow. New developers, open-source contributors, and teams inheriting legacy projects often spend hours (or days) manually reading through files just to understand how a system fits together — before they can write a single line of productive code.

## What RepoGuide Does

Point RepoGuide at a GitHub repository, and it uses IBM Bob to read every source file and automatically generate a complete, structured onboarding package:

- **Tech stack summary** — frameworks, libraries, language versions
- **Annotated repository layout** — what every file/folder is for
- **Module-by-module breakdown** — responsibilities of each component
- **Data flow diagrams** — step-by-step flows for key operations (e.g. registration, login → JWT, authenticated requests)
- **API endpoint reference** — every route, its method, auth requirement, and purpose
- **Dependency wiring** — how core functions connect routes, auth, and the database
- **Database schema documentation**
- **Local setup checklist** — clone-to-running-server steps
- **"How to add a new module" guide** — following the repo's existing patterns
- **Known gaps** — technical debt and blockers, flagged automatically

## How It Works

1. A custom Bob mode, `onboarding-architect`, is configured with a role definition that specializes Bob toward this exact task (see `bob-integration/onboarding-architect-mode.yaml`)
2. A fixed prompt (see `bob-integration/prompts.md`) instructs Bob to analyze the target repo's structure, module responsibilities, and data flow
3. Bob reads every source file directly — no guessing, no external lookups — and produces a structured onboarding document
4. The output is converted into a structured JSON schema (`onboarding-package.json`, `onboarding-package-express.json`) for consumption by the frontend
5. The `repoguide-ui/` frontend renders this JSON into a readable, navigable onboarding dashboard, with a repo selector for each analyzed repository

See [`docs/how-bob-was-used.md`](docs/how-bob-was-used.md) for full details on the Bob workflow, and [`docs/problem-and-solution.md`](docs/problem-and-solution.md) for the full problem/solution statement.

## Repository Structure

```
repoguide/
├── bob-integration/
│   ├── onboarding-architect-mode.yaml   # Custom Bob mode definition
│   └── prompts.md                        # Prompts used to drive Bob
├── docs/
│   ├── how-bob-was-used.md
│   ├── problem-and-solution.md
│   └── bob-sessions/                     # Screenshots of Bob task sessions
├── repoguide-ui/                         # React (Vite) frontend — displays the onboarding guides
├── onboarding-package.json               # Bob output: Modular-FastAPI-starter-backend
├── onboarding-package-express.json       # Bob output: express-api-starter
├── .env.example
├── .gitignore
├── .bobignore
├── SECURITY.MD
└── README.md
```

## Running the Frontend

```
cd repoguide-ui
npm install
npm run dev
```

Open the local URL shown in the terminal (typically `http://localhost:5173/`).

## Team

- **Prakrati (prakrati1611-byte)** — Team owner. Bob integration, custom mode, onboarding-package generation and verification, data structuring, documentation
- **Anuhya** — Frontend (React/Vite UI in `repoguide-ui/`)

## Tested On

- [`ngusadeep/Modular-FastAPI-starter-backend`](https://github.com/ngusadeep/Modular-FastAPI-starter-backend) — a modular FastAPI + SQLAlchemy starter template with JWT auth and a user-management module
- [`HideInHere/express-api-starter`](https://github.com/HideInHere/express-api-starter) — a JWT + RBAC middleware template for Express.js

Both onboarding packages were manually verified against the actual source code (not taken at face value) — see `docs/how-bob-was-used.md` for details on what was checked and confirmed accurate.

## Known Limitations

- Currently a manual workflow — Bob is run inside its IDE panel with a fixed prompt, rather than triggered automatically via a script or API call
- The frontend uses a pre-selected list of analyzed repositories rather than accepting an arbitrary GitHub URL for live, on-demand analysis — this is the natural next step for the project
- Tested on two repositories so far (one Python/FastAPI, one JavaScript/Express); broader coverage across more languages and repo sizes is future work

## Security

This repository follows the IBM Hackathon GitHub template's security practices (`.gitignore`, `.bobignore`, `.env.example`) to prevent accidental credential commits. See [`SECURITY.MD`](SECURITY.MD) for details.

