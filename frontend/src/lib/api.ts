const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function authHeaders() {
  if (typeof window === "undefined") {
    return {};
  }
  // Corrected header block of the fetcher function inside src/lib/api.ts

// 1. Cleanly retrieved our new login token name 'kamdarnepal_token'
const token = typeof window !== "undefined" ? window.localStorage.getItem("kamdarnepal_token") : null;

const headers: HeadersInit = {
  "Content-Type": "application/json",
};

// 2. Sent to the backend in the correct 'Bearer <token>' format according to corporate standards
if (token) {
  headers["Authorization"] = `Bearer ${token}`;
}
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
