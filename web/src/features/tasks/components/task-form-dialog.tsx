// LLM: Create or edit a task in an accessible dialog with validation and save feedback.
"use client";

import { useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiError } from "@/lib/api";
import { tasksApi } from "../api";
import type { Task, TaskStatus } from "../types/task";

export function TaskFormDialog({
  task,
  onClose,
  onSaved,
}: {
  task?: Task;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "TODO");
  const [dueDate, setDueDate] = useState(task?.dueDate?.slice(0, 10) ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const pending = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    if (!title.trim()) {
      setTitleError(
        "Enter a title containing at least one non-space character.",
      );
      return;
    }
    pending.current = true;
    setSaving(true);
    setError(null);
    setTitleError(null);
    try {
      const fields = { title: title.trim(), description, status };
      if (task) {
        await tasksApi.update(task.id, {
          ...fields,
          dueDate:
            dueDate === task.dueDate?.slice(0, 10)
              ? task.dueDate
              : dueDate || null,
        });
      } else {
        await tasksApi.create({ ...fields, ...(dueDate ? { dueDate } : {}) });
      }
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Unable to save this task. Please try again.",
      );
      setError(
        error instanceof ApiError
          ? error.message
          : "Unable to save this task. Please try again.",
      );
      return;
    } finally {
      pending.current = false;
      setSaving(false);
    }
    toast.success(
      task ? "Task updated successfully" : "Task created successfully",
    );
    onSaved();
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !pending.current) onClose();
      }}
    >
      <DialogContent
        className="max-h-[90dvh] overflow-y-auto sm:max-w-lg"
        showCloseButton={!saving}
        onEscapeKeyDown={(event) => {
          if (pending.current) event.preventDefault();
        }}
        onInteractOutside={(event) => {
          if (pending.current) event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {task ? "LLM Edit Task" : "LLM Create Task"}
          </DialogTitle>
          <DialogDescription>
            {task
              ? "Update the details below and save your changes."
              : "Add a title and any optional details for your task."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-5" aria-busy={saving}>
          <fieldset disabled={saving} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">LLM Title</Label>
              <Input
                id="task-title"
                required
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setTitleError(null);
                }}
                aria-invalid={!!titleError}
                aria-describedby={titleError ? "task-title-error" : undefined}
              />
              {titleError && (
                <p
                  id="task-title-error"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {titleError}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-description">LLM Description</Label>
              <Textarea
                id="task-description"
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-status">LLM Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as TaskStatus)}
                disabled={saving}
              >
                <SelectTrigger id="task-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">To do</SelectItem>
                  <SelectItem value="IN_PROGRESS">In progress</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-due-date">LLM Due Date</Label>
              <Input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />
            </div>
          </fieldset>
          {error && (
            <p
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
            >
              {error}
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : task ? "Save changes" : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
