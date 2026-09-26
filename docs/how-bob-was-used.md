## The Problem
Onboarding a new developer onto an unfamiliar codebase is slow and manual — someone has to read through every file, trace how modules connect, and write up an explanation, or the new developer has to do this themselves with no guide. This is exactly the kind of repetitive, mechanical analysis an AI agent should be able to automate.

## Our Solution: Legacy Codebase Onboarding Assistant
RepoGuide points IBM Bob at an unfamiliar repository and has it generate a complete onboarding package — an architecture overview, data-flow explanations, API reference, and a list of known gaps — without a human having to manually read every file first.

## How Bob Was Used

**1. Custom Mode**
We created a custom Bob mode, `onboarding-architect`, with the following role definition:
> "You are a codebase onboarding architect. You analyze unfamiliar repositories and produce a clear architecture overview and data-flow explanation for developers new to the codebase. You identify major modules, how they connect, key entry points, and dependencies between components. Output should be structured, concise, and suitable for a new developer's first day."

This specializes Bob's general-purpose capabilities toward one repeatable task, rather than relying on ad-hoc prompting each time.

**2. Prompt**
With the mode selected, we ran:
> "I'd like an onboarding package for the project in my current working directory. Please: analyze the repository structure and summarize the purpose of each major folder/module; explain how the components connect (data flow); identify key entry points; and produce this as a structured document I can use to onboard a new developer."

**3. Bob's Process**
Bob used its built-in file-reading tools to directly inspect every source file in the target repository (rather than relying on external lookups or guessing), then produced a structured onboarding document covering:
- Project tech stack at a glance
- Annotated repository layout
- Module-by-module responsibility breakdown
- Step-by-step data flow diagrams (registration, login→JWT, authenticated requests, password reset)
- Full API endpoint reference
- Dependency wiring (how key functions connect routes to the DB and auth layer)
- Database model documentation
- A local setup checklist
- A "how to add a new module" recipe
- A list of concrete known gaps/technical debt in the codebase

**4. Verification**
We didn't take Bob's output at face value. We manually checked two specific claims against the actual source code:
- That `user/routes.py` calls `verify_token()` inline rather than using the `get_current_user()` dependency — **confirmed accurate**
- That password-hashing logic is duplicated across `user/models.py` and `auth/services.py` — **confirmed accurate**

Both held up, giving us confidence Bob's analysis was grounded in the real code rather than hallucinated.

**5. Structured Output for the Frontend**
We converted Bob's output into a structured JSON schema so it could be consumed by our React frontend, separating presentation (UI) from the analysis logic (Bob).
