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

`NEXT_PUBLIC_API_URL` configures the task API service and defaults to http://localhost:3001 when omitted. Put overrides in `.env.local` and restart the dev server after changing them. Public environment variables are included in the browser bundle; production changes require a new build. Never put secrets in `NEXT_PUBLIC_` variables. The home page fetches and displays tasks from this API.

The table includes status badges and due dates, with loading placeholders, an empty state, and an error message with retry. Click Create task to open the form or Edit on a row to change its details. Title is required; description and due date are optional. The form defaults new tasks to TODO and preserves existing values when editing. Clearing a saved due date sends `dueDate: null`. While saving, duplicate submits and dismissal are blocked. Success closes the dialog, shows a toast, and refreshes the list; failure keeps your input and displays the error. Click Delete on a row to open a confirmation dialog. Cancel leaves the task unchanged; successful confirmation shows a toast and refreshes the list. Failed saves and deletes show an error toast and keep the dialog open for retry.

To check manually, run both apps, create a task, edit its status, and clear its due date. Verify each result in the refreshed table. Stop the backend and try saving again to check the error state and retained input; restart the backend and retry. Tasks are in memory, so restarting clears them.

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

Filter by status using All statuses, To do, In progress, or Done. Sort by due date using Creation order, Earliest first, or Latest first. Undated tasks remain last in both date directions, equal dates retain their order, and the original task list is not mutated. Filters and sorting stay active during refreshes and mutations for the current page session. The table shows the number of visible tasks.

The dashboard includes status summary cards, completion progress, title/description search, guided empty states, and responsive layouts. Search combines with status filtering and date sorting. Keyboard users can focus the scrollable table, and decorative animation respects reduced-motion settings.
