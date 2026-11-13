# Task Manager frontend

Next.js App Router frontend with TypeScript, Tailwind CSS, and shadcn/ui.

See the [root README](../README.md) for prerequisites and instructions for running both applications.

From this directory:

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Open http://localhost:3000. On macOS/Linux, use `cp .env.example .env.local` instead of `Copy-Item`.

`NEXT_PUBLIC_API_URL` configures the task API service and defaults to http://localhost:3001 when omitted. Put overrides in `.env.local` and restart the dev server after changing them. Public environment variables are included in the browser bundle; production changes require a new build. Never put secrets in `NEXT_PUBLIC_` variables. The current starter page does not fetch tasks yet.

The typed task service is exported as `tasksApi` from `@/features/tasks/api`. It provides `findAll()`, `findOne(id)`, `create(input)`, `update(id, input)`, and `remove(id)`. The shared request helper in `src/lib/api.ts` throws `ApiError` with a `status` and `messages` array for HTTP failures; network failures use status `0`. Cancelled requests preserve the original `AbortError`. Delete requests resolve without a response body.

```ts
import { tasksApi } from "@/features/tasks/api";
import { ApiError } from "@/lib/api";

try {
  const tasks = await tasksApi.findAll();
  console.log(tasks);
} catch (error) {
  console.error(error instanceof ApiError ? error.message : "Request failed");
}
```

Shared shadcn components live in `src/components/ui`, and the root layout mounts the toast container. Task-specific components will live in `src/features/tasks/components`.

To build and run in production:

```sh
npm run build
npm start
```
