// LLM: Present the Task Manager workspace and API-connected task list.
import { TasksList } from "@/features/tasks/components/tasks-list";
import {
  CheckCheck,
  LayoutDashboard,
  ListTodo,
  ArrowUpRight,
  Sparkles,
  CircleUserRound,
  ShieldCheck,
} from "lucide-react";

export default function Home() {
  return (
    <div className="app-canvas min-h-screen lg:pl-60">
      <a
        href="#workspace"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded-md focus:bg-white focus:p-4"
      >
        Skip to tasks
      </a>
      <aside className="workspace-sidebar fixed inset-y-0 left-0 z-30 hidden w-60 flex-col p-6 lg:flex">
        <div className="mb-12 flex items-center gap-3">
          <span className="brand-mark flex size-10 items-center justify-center rounded-xl text-white">
            <CheckCheck aria-hidden="true" />
          </span>
          <div className="text-sm font-semibold text-white">
            LLM Task Manager
            <p className="mt-1 text-[11px] font-normal text-slate-400">
              Space to do great things
            </p>
          </div>
        </div>
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Your workspace
        </p>
        <nav aria-label="Workspace navigation" className="space-y-2">
          <a
            href="#overview"
            className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/15"
          >
            <LayoutDashboard
              aria-hidden="true"
              className="size-4 text-violet-300"
            />
            Overview
            <ArrowUpRight
              aria-hidden="true"
              className="ml-auto size-3.5 text-slate-400"
            />
          </a>
          <a
            href="#tasks-heading"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ListTodo aria-hidden="true" className="size-4" />
            My tasks
          </a>
        </nav>
        <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
          <Sparkles
            aria-hidden="true"
            className="mb-3 size-5 text-violet-300"
          />
          <p className="text-sm font-medium text-white">
            Small steps. Real progress.
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            Keep your day intentional. Focus on one task, then the next.
          </p>
        </div>
        <div className="mt-6 flex items-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck aria-hidden="true" className="size-3.5" />
          Your personal productivity space
        </div>
      </aside>
      <header className="sticky top-0 z-20 border-b border-white/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
              <CheckCheck aria-hidden="true" className="size-6" />
            </span>
            <span className="font-semibold tracking-tight">
              LLM Workspace
              <span className="mt-0.5 block text-xs font-normal tracking-normal text-muted-foreground">
                A little clarity for your everyday.
              </span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 sm:inline-flex">
              Let&apos;s make progress
            </span>
            <CircleUserRound
              aria-label="Personal workspace"
              className="size-8 text-slate-400"
            />
          </div>
        </div>
      </header>
      <main
        id="workspace"
        className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-8 sm:py-12"
      >
        <section
          id="overview"
          aria-labelledby="welcome-heading"
          className="hero-panel relative isolate overflow-hidden rounded-3xl px-6 py-9 sm:px-10 sm:py-11"
        >
          <div
            aria-hidden="true"
            className="hero-orbit absolute -right-12 -top-24 size-80 rounded-full border border-white/15 sm:right-0"
          >
            <div className="absolute inset-8 rounded-full border border-white/15" />
            <div className="absolute inset-16 rounded-full border border-white/15" />
            <div className="absolute inset-24 rounded-full bg-white/10" />
          </div>
          <div className="relative z-10 max-w-xl space-y-5">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-violet-100">
              <Sparkles aria-hidden="true" className="size-3" />A fresh
              perspective on your day
            </p>
            <h1
              id="welcome-heading"
              className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl xl:text-5xl"
            >
              LLM Less clutter.
              <br />
              <span className="text-violet-200">More momentum.</span>
            </h1>
            <p className="max-w-md text-sm leading-6 text-slate-200">
              A clear space for your next big idea and all the small steps that
              get you there.
            </p>
            <a
              href="#tasks-heading"
              className="inline-flex items-center gap-2 text-sm font-medium text-white underline-offset-4 hover:underline"
            >
              Find your next step
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          </div>
        </section>
        <TasksList />
        <footer className="flex flex-wrap justify-between gap-2 border-t pt-5 text-xs text-muted-foreground">
          <p>One task at a time. You&apos;ve got this.</p>
          <p>Tasks are saved for your current server session.</p>
        </footer>
      </main>
    </div>
  );
}
