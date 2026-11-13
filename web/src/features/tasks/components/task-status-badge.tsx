// Display readable status badges with distinct colors.
import { Badge } from "@/components/ui/badge";
import type { TaskStatus } from "../types/task";

const styles: Record<TaskStatus, { label: string; className: string }> = {
  TODO: {
    label: "To do",
    className: "border-slate-200 bg-slate-100 text-slate-700",
  },
  IN_PROGRESS: {
    label: "In progress",
    className: "border-amber-200 bg-amber-50 text-amber-800",
  },
  DONE: {
    label: "Done",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const style = styles[status];
  return (
    <Badge variant="outline" className={style.className}>
      {style.label}
    </Badge>
  );
}
