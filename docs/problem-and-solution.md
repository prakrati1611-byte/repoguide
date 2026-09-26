## The Problem
Every developer has faced it: joining a project and staring at an unfamiliar codebase with no map. Existing documentation is often outdated, incomplete, or missing entirely. The result is hours (sometimes days) spent manually tracing through files just to understand how a system fits together before a single line of productive code can be written.

This isn't a rare edge case — it happens every time a new hire joins a team, a developer picks up a legacy project, an open-source contributor tackles their first issue, or a team inherits code from someone who's left. The cost compounds across every handoff, every onboarding, every context switch.

## Our Solution
**RepoGuide** is a Legacy Codebase Onboarding Assistant. Point it at any GitHub repository, and it uses IBM Bob to read every source file and automatically generate a complete, structured onboarding package — no manual documentation-writing required.

The generated package includes:
- A tech-stack summary and annotated repository layout
- Module-by-module responsibility breakdowns
- Step-by-step data-flow explanations for key operations
- A full API endpoint reference (for backend projects)
- Dependency wiring — how key functions and modules connect
- Database schema documentation
- A local setup checklist to get the project running
- A guide for extending the codebase following its existing patterns
- A list of known gaps and technical debt, flagged automatically

## Who It's For
- New developers joining an existing team or project
- Open-source contributors trying to understand a repo before their first PR
- Teams inheriting legacy code with little or no documentation
- Anyone who wants a fast, accurate first orientation to an unfamiliar codebase

## Why It Matters
Instead of a new developer spending their first day (or week) manually reading through files, RepoGuide compresses that process into minutes — turning what's normally a slow, error-prone, manual task into a fast, repeatable, automated one.
