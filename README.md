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

The validation pipe transforms request objects into DTO instances and rejects fields that have no validation decorators. Field-specific rules will be added with the task DTOs.

Other backend commands (run inside `api`):

```sh
npm run build       # Compile TypeScript
npm run start:prod  # Start the compiled server after building
npm test           # Unit tests
npm run test:e2e   # HTTP integration tests
npm run lint       # ESLint checks with automatic fixes
```

## Implementation status

The backend server is initialized. Task CRUD endpoints and DTOs will be added in the next step. The `web` folder contains the planned frontend directories; the Next.js application has not been initialized yet.

## How I used AI

I used OpenAI Codex to create the initial folder structure and initialize the backend using the official NestJS CLI. Codex adapted the starter to configure environment variables, frontend CORS access, and global request validation, and documented the setup commands. The task endpoints and frontend are still to be implemented.
