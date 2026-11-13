// Render task rows, loading placeholders, and the empty state.
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  ClipboardList,
  Pencil,
  Trash2,
  Plus,
  CalendarDays,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Task } from "../types/task";
import { TaskStatusBadge } from "./task-status-badge";

function formatDueDate(value: string): string {
  // Keep date-only values on the same calendar day in every timezone.
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function TasksTable({
  tasks,
  loading = false,
  onEdit,
  onDelete,
  filtered = false,
  onCreate,
  onResetFilters,
}: {
  tasks: Task[];
  loading?: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  filtered?: boolean;
  onCreate?: () => void;
  onResetFilters?: () => void;
}) {
  return (
    <div className="task-surface overflow-hidden rounded-2xl border border-white bg-card">
      <Table aria-busy={loading}>
        <TableCaption className="sr-only">Tasks</TableCaption>
        <TableHeader className="bg-slate-50/80 [&_th]:h-12 [&_th]:text-xs [&_th]:font-semibold [&_th]:text-slate-500">
          <TableRow>
            <TableHead scope="col" className="px-4">
              Title
            </TableHead>
            <TableHead scope="col">Description</TableHead>
            <TableHead scope="col">Status</TableHead>
            <TableHead scope="col" className="pr-4">
              Due Date
            </TableHead>
            <TableHead scope="col" className="pr-4 text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 4 }, (_, row) => (
              <TableRow key={row} aria-hidden="true">
                {Array.from({ length: 5 }, (_, column) => (
                  <TableCell key={column} className="px-4 py-5">
                    <Skeleton
                      className={column === 1 ? "h-4 w-40" : "h-4 w-24"}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : tasks.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="whitespace-normal px-6 py-16 text-center"
              >
                <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                  <span className="mb-1 rounded-2xl bg-indigo-50 p-4 text-primary">
                    <ClipboardList aria-hidden="true" className="size-7" />
                  </span>
                  <p className="font-semibold text-foreground">
                    {filtered ? "No matching tasks" : "No tasks yet"}
                  </p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {filtered
                      ? "Try a different search or status to find what you need."
                      : "Start with one small step. Add your first task and make a little progress today."}
                  </p>
                  {filtered ? (
                    <Button
                      variant="outline"
                      onClick={onResetFilters}
                      className="mt-2"
                    >
                      Clear filters
                    </Button>
                  ) : (
                    <Button onClick={onCreate} className="mt-2">
                      <Plus aria-hidden="true" />
                      Create your first task
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow key={task.id} className="hover:bg-indigo-50/30">
                <TableCell className="min-w-44 max-w-72 whitespace-normal break-words px-4 py-4 font-medium">
                  {task.title}
                </TableCell>
                <TableCell className="min-w-48 max-w-96 whitespace-pre-wrap break-words py-4 text-muted-foreground">
                  {task.description || "—"}
                </TableCell>
                <TableCell className="py-4">
                  <TaskStatusBadge status={task.status} />
                </TableCell>
                <TableCell className="py-4 pr-4 text-slate-600">
                  {task.dueDate ? (
                    <time
                      dateTime={task.dueDate}
                      className="inline-flex items-center gap-2"
                    >
                      <CalendarDays
                        aria-hidden="true"
                        className="size-3.5 text-slate-400"
                      />
                      {formatDueDate(task.dueDate)}
                    </time>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell className="pr-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!onEdit}
                    onClick={() => onEdit?.(task)}
                    aria-label={`Edit ${task.title}`}
                  >
                    <Pencil aria-hidden="true" className="size-3.5" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <Button
                    className="ml-1 text-slate-500 hover:bg-red-50 hover:text-red-700"
                    variant="ghost"
                    size="sm"
                    disabled={!onDelete}
                    onClick={() => onDelete?.(task)}
                    aria-label={`Delete ${task.title}`}
                  >
                    <Trash2 aria-hidden="true" className="size-3.5" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
