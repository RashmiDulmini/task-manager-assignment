import { API_BASE_URL } from "./env";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly messages: string[] = [message],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    throw new ApiError(
      "Unable to reach the task API. Check that the backend is running.",
      0,
    );
  }

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    let messages = [`Request failed (${response.status}).`];

    if (body && typeof body === "object" && "message" in body) {
      if (typeof body.message === "string" && body.message.trim()) {
        messages = [body.message];
      } else if (Array.isArray(body.message)) {
        const details = body.message.filter(
          (item: unknown): item is string =>
            typeof item === "string" && item.trim().length > 0,
        );
        if (details.length > 0) messages = details;
      }
    }

    throw new ApiError(messages.join(" "), response.status, messages);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
