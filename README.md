
# RepoGuide

**A Legacy Codebase Onboarding Assistant, powered by IBM Bob.**

Built for IBM Bob Hackathon 2.0.

## The Problem

Joining an unfamiliar codebase is slow. New developers, open-source contributors, and teams inheriting legacy projects often spend hours (or days) manually reading through files just to understand how a system fits together — before they can write a single line of productive code.

## What RepoGuide Does

Point RepoGuide at any GitHub repository, and it uses IBM Bob to read every source file and automatically generate a complete, structured onboarding package:

- **Tech stack summary** — frameworks, libraries, language versions
- **Annotated repository layout** — what every file/folder is for
- **Module-by-module breakdown** — responsibilities of each component
- **Data flow diagrams** — step-by-step flows for key operations (e.g. login → JWT, registration)
- **API endpoint reference** — every route, its method, auth requirement, and purpose
- **Dependency wiring** — how core functions connect routes, auth, and the database
- **Database schema documentation**
- **Local setup checklist** — clone-to-running-server steps
- **"How to add a new module" guide** — following the repo's existing patterns
- **Known gaps** — technical debt and TODOs, flagged automatically

## How It Works

1. A custom Bob mode, `onboarding-architect`, is configured with a role definition that specializes Bob toward this exact task (see `bob-integration/onboarding-architect-mode.yaml`)
2. A fixed prompt (see `bob-integration/prompts.md`) instructs Bob to analyze the target repo's structure, module responsibilities, and data flow
3. Bob reads every source file directly — no guessing, no external lookups — and produces a structured onboarding document
4. The output is converted into a structured JSON schema (`onboarding-package.json`) for consumption by the frontend
5. The frontend renders this JSON into a readable, navigable onboarding page

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
├── onboarding-package.json               # Sample structured output
├── frontend/                             # React UI (in progress)
├── backend/                              # Node/Express API (in progress)
├── .env.example
├── .gitignore
└── README.md
```

## Team

- **Prakrati (prakrati1611-byte)** — Bob integration, onboarding-package logic, data structuring
- **Anuhya** — Frontend (React) and backend (Node.js/Express)

## Tested On

- [`ngusadeep/Modular-FastAPI-starter-backend`](https://github.com/ngusadeep/Modular-FastAPI-starter-backend) — a modular FastAPI + SQLAlchemy starter template used as our primary test repository

## Known Limitations

- Currently a manual workflow (prompt run inside Bob's IDE panel), not yet wired into an automated pipeline
- Tested primarily on one repository so far; broader generalization across repo types is an area for future work

---

Adjust the `frontend/`/`backend/` folder status once Anuhya confirms progress, and add a second tested repo once you run that. Want me to draft `bob-integration/prompts.md` next (the actual prompt text file), since the README references it?
