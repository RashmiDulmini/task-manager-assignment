// LLM: Present the Task Manager workspace and API-connected task list.
import { TasksList } from "@/features/tasks/components/tasks-list";
import { CheckCheck, Layers3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <a
        href="#workspace"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded-md focus:bg-white focus:p-4"
      >
        Skip to tasks
      </a>
      <header className="border-b bg-white/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
              <CheckCheck aria-hidden="true" className="size-6" />
            </span>
            <span className="font-semibold tracking-tight">
              LLM Task Manager
              <span className="mt-0.5 block text-xs font-normal tracking-normal text-muted-foreground">
                A little clarity for your everyday.
              </span>
            </span>
          </div>
          <span className="hidden items-center gap-2 rounded-full border bg-slate-50 px-3 py-1.5 text-xs text-muted-foreground sm:inline-flex">
            <Layers3 aria-hidden="true" className="size-3.5" />
            Personal workspace
          </span>
        </div>
      </header>
      <main
        id="workspace"
        className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-8 sm:py-12"
      >
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Your daily workspace
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            LLM Your work, in focus.
          </h1>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Make room for what matters. Organize your tasks, track progress, and
            take the next step.
          </p>
        </div>
        <TasksList />
        <footer className="flex flex-wrap justify-between gap-2 border-t pt-5 text-xs text-muted-foreground">
          <p>One task at a time. You&apos;ve got this.</p>
          <p>Tasks are saved for your current server session.</p>
        </footer>
      </main>
    </div>
  );
}
