import type { Task, TaskStatus } from "./types/task";

export type StatusFilter = "ALL" | TaskStatus;
export type DueDateSort = "NONE" | "ASC" | "DESC";

export function selectTasks(
  tasks: Task[],
  status: StatusFilter,
  sort: DueDateSort,
): Task[] {
  const filtered = tasks.filter(
    (task) => status === "ALL" || task.status === status,
  );
  if (sort === "NONE") return filtered;
  return filtered.sort((a, b) => {
    // Undated tasks stay last in both directions. Equal dates retain their order.
    if (!a.dueDate) return b.dueDate ? 1 : 0;
    if (!b.dueDate) return -1;
    const comparison = a.dueDate
      .slice(0, 10)
      .localeCompare(b.dueDate.slice(0, 10));
    return sort === "ASC" ? comparison : -comparison;
  });
}
