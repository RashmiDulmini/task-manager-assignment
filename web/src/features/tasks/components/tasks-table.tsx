// LLM: Render task rows, loading placeholders, and the empty state.
import { Skeleton } from "@/components/ui/skeleton";
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
}: {
  tasks: Task[];
  loading?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table aria-busy={loading}>
        <TableCaption className="sr-only">LLM Tasks</TableCaption>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead scope="col" className="px-4">
              LLM Title
            </TableHead>
            <TableHead scope="col">LLM Description</TableHead>
            <TableHead scope="col">LLM Status</TableHead>
            <TableHead scope="col" className="pr-4">
              LLM Due Date
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 4 }, (_, row) => (
              <TableRow key={row} aria-hidden="true">
                {Array.from({ length: 4 }, (_, column) => (
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
                colSpan={4}
                className="py-16 text-center text-muted-foreground"
              >
                LLM: No tasks yet
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="min-w-44 max-w-72 whitespace-normal break-words px-4 py-4 font-medium">
                  {task.title}
                </TableCell>
                <TableCell className="min-w-48 max-w-96 whitespace-pre-wrap break-words py-4 text-muted-foreground">
                  {task.description || "—"}
                </TableCell>
                <TableCell className="py-4">
                  <TaskStatusBadge status={task.status} />
                </TableCell>
                <TableCell className="py-4 pr-4">
                  {task.dueDate ? (
                    <time dateTime={task.dueDate}>
                      {formatDueDate(task.dueDate)}
                    </time>
                  ) : (
                    "—"
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
