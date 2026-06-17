const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function authHeaders() {
  if (typeof window === "undefined") {
    return {};
  }
  const token = window.localStorage.getItem("sewalink_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetcher(path: string, options: RequestInit = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...authHeaders(),
    ...(options.headers || {}),
  } as Record<string, string>;

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.message || "API request failed");
  }

  return body;
}
