// Summarize task progress with accessible status cards and a completion indicator.
import { CheckCircle2, Circle, Layers3, Timer } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Task } from "../types/task";

export function TaskOverview({
  tasks,
  loading,
  unavailable,
}: {
  tasks: Task[];
  loading: boolean;
  unavailable: boolean;
}) {
  const done = tasks.filter((task) => task.status === "DONE").length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const cards = [
    {
      label: "Total Tasks",
      count: tasks.length,
      icon: Layers3,
      color: "bg-indigo-50 text-indigo-600",
      hint: "Everything on your list",
    },
    {
      label: "To Do",
      count: tasks.filter((task) => task.status === "TODO").length,
      icon: Circle,
      color: "bg-slate-100 text-slate-600",
      hint: "Ready when you are",
    },
    {
      label: "In Progress",
      count: tasks.filter((task) => task.status === "IN_PROGRESS").length,
      icon: Timer,
      color: "bg-amber-50 text-amber-700",
      hint: "Keep the momentum",
    },
    {
      label: "Completed",
      count: done,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-700",
      hint: "A step forward, every time",
    },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-4">
        {cards.map(({ label, count, icon: Icon, color, hint }) => (
          <div
            key={label}
            className="stat-card relative overflow-hidden rounded-2xl border border-white bg-white/90 p-4 sm:p-5"
          >
            <div className="mb-4 flex items-start justify-between gap-2">
              <h2 className="text-xs font-medium text-muted-foreground sm:text-sm">
                {label}
              </h2>
              <span className={`rounded-xl p-2.5 ring-4 ring-white ${color}`}>
                <Icon aria-hidden="true" className="size-4" />
              </span>
            </div>
            {loading ? (
              <Skeleton className="mb-2 h-8 w-12" />
            ) : (
              <p className="mb-1 text-4xl font-semibold tracking-tight tabular-nums">
                {unavailable ? "—" : count}
              </p>
            )}
            <p className="text-xs leading-5 text-muted-foreground">{hint}</p>
          </div>
        ))}
      </div>
      {!loading && !unavailable && tasks.length > 0 && (
        <div className="flex items-center gap-3 px-1 text-xs text-muted-foreground">
          <span className="shrink-0">Overall progress</span>
          <div
            role="progressbar"
            aria-label="Task completion"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200"
          >
            <div
              className="h-full rounded-full bg-emerald-500 motion-safe:transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="shrink-0 tabular-nums">{progress}% complete</span>
        </div>
      )}
    </div>
  );
}
