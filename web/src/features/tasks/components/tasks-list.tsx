// LLM: Fetch tasks and coordinate loading, error, empty, and success states.
"use client";

import { useEffect, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";
import { tasksApi } from "../api";
import type { Task } from "../types/task";
import { TasksTable } from "./tasks-table";
import { TaskFormDialog } from "./task-form-dialog";
import { DeleteTaskDialog } from "./delete-task-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  selectTasks,
  type StatusFilter,
  type DueDateSort,
} from "../task-list-options";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; tasks: Task[] };

export function TasksList() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [revision, setRevision] = useState(0);
  const [editor, setEditor] = useState<{ task?: Task } | null>(null);
  const [deletion, setDeletion] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [dueDateSort, setDueDateSort] = useState<DueDateSort>("NONE");
  const visibleTasks =
    state.status === "success"
      ? selectTasks(state.tasks, statusFilter, dueDateSort)
      : [];

  useEffect(() => {
    const controller = new AbortController();
    tasksApi
      .findAll(controller.signal)
      .then((tasks) => {
        if (!controller.signal.aborted) setState({ status: "success", tasks });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState({
            status: "error",
            message:
              error instanceof ApiError
                ? error.message
                : "Something went wrong while loading tasks. Please try again.",
          });
        }
      });
    return () => controller.abort();
  }, [revision]);

  function refresh() {
    setState({ status: "loading" });
    setRevision((value) => value + 1);
  }

  return (
    <section aria-labelledby="tasks-heading" className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 id="tasks-heading" className="text-xl font-semibold">
            LLM Tasks
          </h2>
          <p role="status" className="text-sm text-muted-foreground">
            {state.status === "loading"
              ? "Loading tasks…"
              : state.status === "success"
                ? `${state.tasks.length} ${state.tasks.length === 1 ? "task" : "tasks"}`
                : "Tasks could not be loaded."}
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Button onClick={() => setEditor({})}>Create task</Button>
          <Button
            variant="outline"
            onClick={refresh}
            disabled={state.status === "loading"}
          >
            <RefreshCw
              aria-hidden="true"
              className={state.status === "loading" ? "animate-spin" : ""}
            />
            Refresh
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="w-full space-y-2 sm:w-48">
          <Label htmlFor="task-status-filter">LLM Filter by Status</Label>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as StatusFilter)}
          >
            <SelectTrigger id="task-status-filter" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="TODO">To do</SelectItem>
              <SelectItem value="IN_PROGRESS">In progress</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full space-y-2 sm:w-56">
          <Label htmlFor="task-due-sort">LLM Sort by Due Date</Label>
          <Select
            value={dueDateSort}
            onValueChange={(value) => setDueDateSort(value as DueDateSort)}
          >
            <SelectTrigger id="task-due-sort" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NONE">Creation order</SelectItem>
              <SelectItem value="ASC">Earliest first</SelectItem>
              <SelectItem value="DESC">Latest first</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {state.status === "success" && (
          <p
            className="self-end pb-2 text-sm text-muted-foreground"
            role="status"
          >
            Showing {visibleTasks.length} of {state.tasks.length} tasks
          </p>
        )}
      </div>
      {state.status === "error" ? (
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>LLM Unable to load tasks</AlertTitle>
          <AlertDescription>
            <p>{state.message}</p>
            <Button variant="outline" className="mt-3" onClick={refresh}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <TasksTable
          tasks={visibleTasks}
          filtered={
            state.status === "success" &&
            state.tasks.length > 0 &&
            statusFilter !== "ALL"
          }
          loading={state.status === "loading"}
          onEdit={(task) => setEditor({ task })}
          onDelete={setDeletion}
        />
      )}
      {editor && (
        <TaskFormDialog
          key={editor.task?.id ?? "create"}
          task={editor.task}
          onClose={() => setEditor(null)}
          onSaved={() => {
            setEditor(null);
            refresh();
          }}
        />
      )}
      {deletion && (
        <DeleteTaskDialog
          key={deletion.id}
          task={deletion}
          onClose={() => setDeletion(null)}
          onDeleted={() => {
            setDeletion(null);
            refresh();
          }}
        />
      )}
    </section>
  );
}
