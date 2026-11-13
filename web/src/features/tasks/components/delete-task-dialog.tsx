// LLM: Confirm task deletion and show pending, error, and success feedback.
"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { ApiError } from "@/lib/api";
import { tasksApi } from "../api";
import type { Task } from "../types/task";

export function DeleteTaskDialog({
  task,
  onClose,
  onDeleted,
}: {
  task: Task;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pending = useRef(false);

  async function remove() {
    if (pending.current) return;
    pending.current = true;
    setDeleting(true);
    setError(null);
    try {
      await tasksApi.remove(task.id);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Unable to delete this task. Please try again.";
      setError(message);
      toast.error(message);
      return;
    } finally {
      pending.current = false;
      setDeleting(false);
    }
    toast.success("Task deleted successfully");
    onDeleted();
  }

  return (
    <AlertDialog
      open
      onOpenChange={(open) => {
        if (!open && !pending.current) onClose();
      }}
    >
      <AlertDialogContent
        onEscapeKeyDown={(event) => {
          if (pending.current) event.preventDefault();
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>LLM Delete Task</AlertDialogTitle>
          <AlertDialogDescription className="break-words">
            Delete &quot;{task.title}&quot;? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleting}
            onClick={(event) => {
              event.preventDefault();
              void remove();
            }}
          >
            {deleting ? "Deleting..." : "Delete task"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
