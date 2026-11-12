# Task Manager

A Task Manager assignment using a NestJS REST API and a Next.js App Router frontend with shadcn/ui.

## Project structure

```text
api/
  src/
    tasks/
      dto/                 # Request validation DTOs
      entities/            # Task data model
  test/                    # API end-to-end tests
web/
  public/                  # Static assets
  src/
    app/                   # App Router pages, layouts, and global styles
    components/
      ui/                  # Shared shadcn/ui components
    features/
      tasks/
        components/        # Task table, form dialog, and delete confirmation
        types/             # Frontend task types
    lib/                   # Shared utilities and API configuration
```

The API will keep task routes, business logic, validation, and the data model together in the `tasks` module. The frontend will keep task-specific code under `features/tasks` and reusable UI under `components/ui`.

## Setup status

Only the folder structure has been created. Neither application is scaffolded yet, and there are no dependencies to install or start commands to run. Prerequisites, environment variables, and exact setup commands will be documented when the applications are initialized.

## How I used AI

I used OpenAI Codex to create the initial folder structure and Git ignore rules. No application code has been generated or modified yet.
