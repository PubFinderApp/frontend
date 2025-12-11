import { getApiUrl } from "@/shared/config/env";
import { getAuthToken } from "@/shared/lib/auth-storage";

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

type RequestOptions = RequestInit & {
  data?: Record<string, unknown> | undefined;
  withAuth?: boolean | string;
  token?: string | null;
};

// TODO: Confirm with backend dev that JSON payloads + endpoints match the live API.
export async function apiFetch<T>(path: string, options: RequestOptions = {}) {
  const url = getApiUrl(path);
  const { data, headers, withAuth, token, ...rest } = options;

  const requestInit: RequestInit = {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    credentials: "include",
  };

  const authToken = token ?? (withAuth ? getAuthToken() : null);
  if (authToken) {
    (
      requestInit.headers as Record<string, string>
    ).Authorization = `Bearer ${authToken}`;
  }

  if (data) {
    requestInit.body = JSON.stringify(data);
  }

  const response = await fetch(url, requestInit);
  let parsed: unknown = null;

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    parsed = await response.json();
  }

  if (!response.ok) {
    const message =
      (parsed as { message?: string } | null | undefined)?.message ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, parsed);
  }

  return parsed as T;
}
