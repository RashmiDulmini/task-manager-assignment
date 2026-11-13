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

## Prerequisites

- Node.js 22 LTS (22.17.1 or newer in the 22.x release line)
- npm 10 or newer (included with Node.js)

## Run the backend

First clone the repository and open its root directory:

```sh
git clone https://github.com/RashmiDulmini/task-manager-assignment.git
cd task-manager-assignment
```

From the repository root:

```sh
cd api
npm ci
```

Copy the example environment file:

```powershell
# Windows PowerShell
Copy-Item .env.example .env
```

```sh
# macOS / Linux
cp .env.example .env
```

The environment settings are optional; the server uses these defaults:

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3001` | Backend HTTP port |
| `WEB_ORIGIN` | `http://localhost:3000` | Allowed browser frontend origin |

Start the development server with automatic reload:

```sh
npm run start:dev
```

Visit `http://localhost:3001/` to check that the server responds with `{"status":"ok"}`. No database setup is needed at this stage.

Server configuration lives in:

- `api/src/main.ts`: creates the application, checks the port, and starts listening.
- `api/src/app.module.ts`: registers the root controller, service, and environment configuration.
- `api/src/configure-app.ts`: enables CORS, shutdown hooks, and the global validation pipe.

The validation pipe transforms request objects into DTO instances and rejects fields that have no validation decorators. Task DTOs validate nonblank titles, string descriptions, supported status values, and ISO date strings. Optional fields can be omitted. PATCH accepts `dueDate: null` to clear an existing date; other explicit `null` values are rejected. Update requests validate only supplied fields. The service defaults new tasks to `TODO`.

Other backend commands (run inside `api`):

```sh
npm run build       # Compile TypeScript
npm run start:prod  # Start the compiled server after building
npm test           # Unit tests
npm run test:e2e   # HTTP integration tests
npm run lint       # ESLint checks with automatic fixes
```

## Run the frontend

Open a second terminal and run from the repository root:

```sh
cd web
npm ci
```

Create the local environment file:

```powershell
# Windows PowerShell
Copy-Item .env.example .env.local
```

```sh
# macOS / Linux
cp .env.example .env.local
```

`NEXT_PUBLIC_API_URL` configures the typed task API service and defaults to `http://localhost:3001`. Set it in `web/.env.local`; it must match the backend address. Restart the frontend after changing it, and rebuild for production changes. This is a public browser setting, so it must not contain secrets. If the frontend origin changes, update `WEB_ORIGIN` in `api/.env` too and restart the backend.

```sh
npm run dev
```

Open `http://localhost:3000`. Keep both backend and frontend terminals open. Click Create task to enter task details, or Edit on a table row to change an existing task. Successful saves close the dialog, refresh the list, and show a toast. Failed saves keep your input and display an error. Clear the date field when editing to remove a due date. Refresh reloads tasks created outside the app. Click Delete on a row and confirm to remove a task. Use the status filter and due-date sort controls to organize the table; undated tasks stay last in either direction.

The frontend uses TypeScript, the App Router, Tailwind CSS, and shadcn/ui. Shared UI component source lives in `web/src/components/ui`; `web/components.json` contains the shadcn configuration. Toast notifications are mounted in the root layout.

Installed UI components: button, badge, table, dialog, alert-dialog, input, textarea, label, select, skeleton, alert, and sonner. Framework versions and selected lint dependency overrides are pinned for reproducible installs; commit `web/package-lock.json` with the source.

For a production build, run `npm run build` followed by `npm start` inside `web`.

## Task API

Base URL: `http://localhost:3001` (or the configured `PORT`).

| Method | Path | Success response |
| --- | --- | --- |
| `GET` | `/tasks` | `200` with a task array (empty array when no tasks exist) |
| `GET` | `/tasks/:id` | `200` with the task |
| `POST` | `/tasks` | `201` with the created task |
| `PATCH` | `/tasks/:id` | `200` with the updated task |
| `DELETE` | `/tasks/:id` | `204` with no response body |

Example creation body:

```json
{
  "title": "Finish assignment",
  "description": "Build and test the task manager",
  "status": "IN_PROGRESS",
  "dueDate": "2026-12-01"
}
```

Only `title` is required on creation. If omitted, `status` defaults to `TODO`. PATCH accepts any subset of editable fields; an empty object leaves the task unchanged. IDs and creation timestamps are generated by the server. Responses serialize `createdAt` as an ISO timestamp.

Invalid bodies, invalid field values, unknown fields, and malformed JSON return `400 Bad Request`. Requests for missing tasks return `404 Not Found`. Errors use NestJS's standard JSON shape with `statusCode`, `message`, and `error`; DTO validation messages are an array of strings.

## Implementation status

The backend server, Task interface, status enum, create/update validation DTOs, and Tasks service are implemented. The service supports creating, listing, finding, updating, and deleting tasks. Tasks are stored in memory and are lost when the server restarts; no database setup is required. New tasks default to `TODO`, and finding, updating, or deleting a missing task raises a 404 error.

All five task HTTP endpoints are implemented and tested. The Next.js frontend includes an API-connected task table with status badges, loading/empty/error states, and a shared create/edit dialog with validation, save feedback, and success toasts. Deletion confirmation, success/error toasts, status filtering, and due-date sorting are implemented.

## How I used AI

I used OpenAI Codex to scaffold NestJS and Next.js, generate shadcn/ui components, and implement the task API, frontend interactions, and tests. The generated starters were adapted to use environment-based API configuration, strict DTO validation, in-memory storage, shared create/edit dialogs, deletion confirmation, toast feedback, status filtering, and due-date sorting. Default starter content and remote font downloads were removed. Builds, backend tests, and targeted frontend service/rendering/filtering checks were used to verify the generated code.

Codex also refined the interface with a consistent theme, responsive dashboard summaries, completion progress, task search, clearer empty states, and keyboard/reduced-motion accessibility improvements. Lint, production build, and targeted rendering checks were used during this refinement.
