import { apiRequest } from "../../lib/api";
import type { CreateTaskInput, Task, UpdateTaskInput } from "./types/task";

export const tasksApi = {
  findAll(signal?: AbortSignal): Promise<Task[]> {
    return apiRequest<Task[]>("/tasks", { signal });
  },

  findOne(id: string, signal?: AbortSignal): Promise<Task> {
    return apiRequest<Task>(`/tasks/${encodeURIComponent(id)}`, { signal });
  },

  create(input: CreateTaskInput): Promise<Task> {
    return apiRequest<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  update(id: string, input: UpdateTaskInput): Promise<Task> {
    return apiRequest<Task>(`/tasks/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },

  remove(id: string): Promise<void> {
    return apiRequest<void>(`/tasks/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
};
