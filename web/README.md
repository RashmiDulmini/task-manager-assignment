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

`NEXT_PUBLIC_API_URL` is prepared for the task API integration and defaults in the example to http://localhost:3001. The current starter page does not fetch tasks yet.

Shared shadcn components live in `src/components/ui`, and the root layout mounts the toast container. Task-specific components will live in `src/features/tasks/components`.

To build and run in production:

```sh
npm run build
npm start
```
