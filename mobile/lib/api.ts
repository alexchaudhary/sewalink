const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = async (
  endpoint: string,
  options: RequestInit & { token?: string } = {}
) => {
  const { token, ...fetchOptions } = options;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};

export const loginUser = (email: string, password: string) =>
  api("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const registerUser = (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: "CUSTOMER" | "PROVIDER";
}) =>
  api("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getProviders = (token: string) =>
  api("/providers", { token, method: "GET" });

export const getProvider = (id: string, token: string) =>
  api(`/providers/${id}`, { token, method: "GET" });

export const createBooking = (
  data: {
    providerId: string;
    type: "INSTANT" | "SCHEDULED" | "EMERGENCY";
    scheduledAt: string;
    totalPrice: number;
    location: string;
    notes?: string;
  },
  token: string
) =>
  api("/bookings", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });

export const getBookings = (token: string) =>
  api("/bookings", { token, method: "GET" });
