// LLM: Present the Task Manager workspace and API-connected task list.
import { TasksList } from "@/features/tasks/components/tasks-list";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-5 px-6 py-16 sm:px-10">
      <h1 className="text-4xl font-semibold tracking-tight">
        LLM Task Manager
      </h1>
      <p className="max-w-xl text-muted-foreground">
        Keep track of your tasks, progress, and upcoming due dates.
      </p>
      <TasksList />
    </main>
  );
}
