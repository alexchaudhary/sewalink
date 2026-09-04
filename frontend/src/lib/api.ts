const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

/**
 * Returns the current API base URL.
 *
 * Expected .env.local:
 * NEXT_PUBLIC_API_URL=http://localhost:4000/api
 */
export function getApiBaseUrl(): string {
  return API_BASE.replace(/\/+$/, "");
}

/**
 * Returns authentication headers for browser requests.
 */
export function authHeaders(): Record<string, string> {
  if (typeof window === "undefined") {
    return {};
  }

  const token = window.localStorage.getItem("kamdarnepal_token");

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Build a complete API URL.
 *
 * Example:
 * fetcher("/auth/login")
 * =>
 * http://localhost:4000/api/auth/login
 */
function buildApiUrl(path: string): string {
  const base = getApiBaseUrl();

  // Prevent accidental double slash
  const cleanPath = path.startsWith("/")
    ? path
    : `/${path}`;

  return `${base}${cleanPath}`;
}

/**
 * Main API fetcher.
 */
export async function fetcher(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const url = buildApiUrl(path);

  const headers: Record<string, string> = {
    ...authHeaders(),
    ...(options.headers
      ? Object.fromEntries(
          new Headers(options.headers).entries()
        )
      : {}),
  };

  /**
   * Don't force Content-Type for FormData.
   *
   * Browser must automatically create the multipart/form-data
   * boundary when uploading files.
   */
  const isFormData =
    typeof FormData !== "undefined" &&
    options.body instanceof FormData;

  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  console.log("🌐 [API REQUEST]", {
    method: options.method || "GET",
    url,
    authenticated: !!headers.Authorization,
  });

  let response: Response;

  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (error) {
    console.error("❌ [API NETWORK ERROR]", {
      url,
      error,
    });

    throw new Error(
      "Cannot connect to the backend server. Please make sure the backend is running on http://localhost:4000."
    );
  }

  /**
   * Read response safely.
   *
   * Some endpoints may return JSON while others may return
   * empty/text responses.
   */
  const contentType =
    response.headers.get("content-type") || "";

  let body: any = null;

  if (contentType.includes("application/json")) {
    body = await response.json().catch(() => null);
  } else {
    const text = await response.text().catch(() => "");
    body = text || null;
  }

  console.log("📡 [API RESPONSE]", {
    method: options.method || "GET",
    url,
    status: response.status,
    ok: response.ok,
    body,
  });

  if (!response.ok) {
    const message =
      body?.message ||
      body?.error ||
      (typeof body === "string" && body.trim()
        ? body
        : null) ||
      `API request failed with status ${response.status}`;

    /**
     * If backend says token is invalid/expired,
     * remove the stale token so the frontend doesn't
     * keep sending it forever.
     */
    if (
      response.status === 401 &&
      typeof window !== "undefined"
    ) {
      window.localStorage.removeItem("kamdarnepal_token");
    }

    throw new Error(message);
  }

  return body;
}