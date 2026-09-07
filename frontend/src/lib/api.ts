// frontend/src/lib/api.ts

export type ApiUserRole =
  | "CUSTOMER"
  | "PROVIDER"
  | "ADMIN";

export type ProviderAvailabilityStatus =
  | "AVAILABLE"
  | "OFFLINE";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: ApiUserRole;
}

export interface ProviderListParams {
  q?: string;
  city?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  page?: number;
  limit?: number;
}

export interface CreateBookingPayload {
  providerId: string;
  serviceType?: string;
  profession?: string;
  description?: string;
  city?: string;
  district?: string;
  budget?: number;
  scheduledAt?: string;
  date?: string;
}

export interface UpdateBookingStatusPayload {
  status:
    | "PENDING"
    | "CONFIRMED"
    | "ACCEPTED"
    | "REJECTED"
    | "COMPLETED"
    | "CANCELLED";
}

export interface UpdateProviderProfilePayload {
  /*
   * Marketplace profile fields
   */
  displayName?: string;
  headline?: string;
  bio?: string;
  city?: string;
  district?: string;
  hourlyRate?: number;

  /*
   * User/profile compatibility fields
   */
  firstName?: string;
  lastName?: string;
  experience?: number;
  skills?: string[];

  /*
   * Marketplace availability
   */
  availabilityStatus?: ProviderAvailabilityStatus;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface PaymentCheckoutPayload {
  bookingId: string;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000/api";

function getApiBaseUrl(): string {
  return API_BASE.replace(/\/+$/, "");
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(
    "kamdarnepal_token"
  );
}

function authHeaders(): Record<string, string> {
  const token = getAuthToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

function buildApiUrl(path: string): string {
  const normalizedPath =
    path.startsWith("/")
      ? path
      : `/${path}`;

  return `${getApiBaseUrl()}${normalizedPath}`;
}

function buildQueryString(
  params: object
): string {
  const searchParams =
    new URLSearchParams();

  Object.entries(params).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        searchParams.set(
          key,
          String(value)
        );
      }
    }
  );

  const query =
    searchParams.toString();

  return query
    ? `?${query}`
    : "";
}

export async function fetcher<
  T = unknown
>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url =
    buildApiUrl(path);

  const token =
    getAuthToken();

  const isFormData =
    typeof FormData !== "undefined" &&
    options.body instanceof FormData;

  const headers: Record<
    string,
    string
  > = {
    ...authHeaders(),
  };

  if (!isFormData) {
    headers[
      "Content-Type"
    ] = "application/json";
  }

  if (options.headers) {
    const suppliedHeaders =
      new Headers(
        options.headers
      );

    suppliedHeaders.forEach(
      (value, key) => {
        headers[key] =
          value;
      }
    );
  }

  try {
    if (
      process.env.NODE_ENV ===
      "development"
    ) {
      console.log(
        `[API] ${options.method || "GET"} ${url}`
      );
    }

    const response =
      await fetch(url, {
        ...options,
        headers,
      });

    const contentType =
      response.headers.get(
        "content-type"
      ) || "";

    let responseData: unknown =
      null;

    if (
      contentType.includes(
        "application/json"
      )
    ) {
      try {
        responseData =
          await response.json();
      } catch {
        responseData =
          null;
      }
    } else {
      try {
        const text =
          await response.text();

        responseData =
          text || null;
      } catch {
        responseData =
          null;
      }
    }

    if (
      process.env.NODE_ENV ===
      "development"
    ) {
      console.log(
        `[API] ${response.status} ${url}`
      );
    }

    if (
      response.status === 401 &&
      typeof window !== "undefined"
    ) {
      window.localStorage.removeItem(
        "kamdarnepal_token"
      );
    }

    if (!response.ok) {
      let message =
        "Request failed.";

      if (
        responseData &&
        typeof responseData ===
          "object"
      ) {
        const data =
          responseData as Record<
            string,
            unknown
          >;

        if (
          typeof data.message ===
          "string"
        ) {
          message =
            data.message;
        } else if (
          data.error &&
          typeof data.error ===
            "object"
        ) {
          const error =
            data.error as Record<
              string,
              unknown
            >;

          if (
            typeof error.message ===
            "string"
          ) {
            message =
              error.message;
          }
        }
      } else if (
        typeof responseData ===
        "string"
      ) {
        message =
          responseData ||
          message;
      }

      throw new Error(
        message
      );
    }

    return responseData as T;
  } catch (error) {
    if (
      error instanceof Error
    ) {
      throw error;
    }

    throw new Error(
      "Unable to connect to the server."
    );
  }
}

export const api = {
  auth: {
    login: (
      payload: LoginPayload
    ) =>
      fetcher("/auth/login", {
        method: "POST",
        body: JSON.stringify(
          payload
        ),
      }),

    register: (
      payload: RegisterPayload
    ) =>
      fetcher("/auth/register", {
        method: "POST",
        body: JSON.stringify(
          payload
        ),
      }),

    me: () =>
      fetcher("/auth/me", {
        method: "GET",
      }),

    forgotPassword: (
      payload: ForgotPasswordPayload
    ) =>
      fetcher(
        "/auth/forgot-password",
        {
          method: "POST",
          body: JSON.stringify(
            payload
          ),
        }
      ),

    verifyOtp: (
      payload: VerifyOtpPayload
    ) =>
      fetcher(
        "/auth/verify-otp",
        {
          method: "POST",
          body: JSON.stringify(
            payload
          ),
        }
      ),
  },

  providers: {
    list: (
      params: ProviderListParams = {}
    ) =>
      fetcher(
        `/providers${buildQueryString(
          params
        )}`,
        {
          method: "GET",
        }
      ),

    getById: (
      providerId: string
    ) =>
      fetcher(
        `/providers/${providerId}`,
        {
          method: "GET",
        }
      ),

    updateProfile: (
      payload: UpdateProviderProfilePayload
    ) =>
      fetcher(
        "/providers/profile",
        {
          method: "PUT",
          body: JSON.stringify(
            payload
          ),
        }
      ),

    uploadAvatar: (
      file: File
    ) => {
      const formData =
        new FormData();

      formData.append(
        "avatar",
        file
      );

      return fetcher(
        "/providers/avatar",
        {
          method: "POST",
          body: formData,
        }
      );
    },
  },

  bookings: {
    list: () =>
      fetcher(
        "/bookings",
        {
          method: "GET",
        }
      ),

    create: (
      payload: CreateBookingPayload
    ) =>
      fetcher(
        "/bookings",
        {
          method: "POST",
          body: JSON.stringify(
            payload
          ),
        }
      ),

    updateStatus: (
      bookingId: string,
      payload: UpdateBookingStatusPayload
    ) =>
      fetcher(
        `/bookings/${bookingId}/status`,
        {
          method: "PUT",
          body: JSON.stringify(
            payload
          ),
        }
      ),
  },

  payments: {
    createCheckout: (
      payload: PaymentCheckoutPayload
    ) =>
      fetcher(
        "/payments/checkout",
        {
          method: "POST",
          body: JSON.stringify(
            payload
          ),
        }
      ),
  },

  admin: {
    metrics: () =>
      fetcher(
        "/admin/metrics",
        {
          method: "GET",
        }
      ),
  },
};