"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import MainLayout from "../../components/MainLayout";
import { api } from "../../lib/api";

type WorkerTab = "DASHBOARD" | "PROFILE_SETTINGS";

type AnalyticsTimeframe =
  | "THIS_WEEK"
  | "THIS_MONTH"
  | "ALL_TIME";

type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ACCEPTED"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELLED";

type MutationStatus =
  | "ACCEPTED"
  | "REJECTED"
  | "COMPLETED";

interface StoredUser {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
}

interface Booking {
  id: string;
  customerId?: string;
  providerId?: string;
  customerName?: string;
  customerPhone?: string;
  description?: string;
  profession?: string;
  serviceType?: string;
  city?: string;
  district?: string;
  budget?: number | string;
  date?: string;
  scheduledAt?: string;
  status?: BookingStatus | string;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
}

interface GroupedBooking extends Booking {
  requestCount: number;
  allJobIds: string[];
}

interface ProviderProfile {
  id: string;
  displayName?: string;
  headline?: string;
  bio?: string;
  city?: string;
  district?: string;
  hourlyRate?: number;
  avatarUrl?: string | null;
  availabilityStatus?: string;
}

interface BookingListResponse {
  success?: boolean;
  bookings?: Booking[];
  data?: {
    bookings?: Booking[];
  };
  message?: string;
}

interface ProviderResponse {
  success?: boolean;
  provider?: ProviderProfile;
  data?: {
    provider?: ProviderProfile;
  };
  message?: string;
}

interface UpdateResponse {
  success?: boolean;
  message?: string;
  data?: {
    message?: string;
    avatarUrl?: string;
    provider?: ProviderProfile;
  };
  avatarUrl?: string;
}

interface StoredSession {
  user?: StoredUser;
  data?: {
    user?: StoredUser;
  };
}

function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser =
    window.localStorage.getItem("user");

  if (!rawUser) {
    return null;
  }

  try {
    const parsed =
      JSON.parse(rawUser) as
        | StoredUser
        | StoredSession;

    if (
      parsed &&
      typeof parsed === "object" &&
      "user" in parsed &&
      parsed.user
    ) {
      return parsed.user;
    }

    if (
      parsed &&
      typeof parsed === "object" &&
      "data" in parsed &&
      parsed.data?.user
    ) {
      return parsed.data.user;
    }

    return parsed as StoredUser;
  } catch (error) {
    console.error(
      "Failed to parse stored user:",
      error
    );

    return null;
  }
}

function normalizeBookingList(
  response: unknown
): Booking[] {
  const data =
    response as BookingListResponse;

  const bookings =
    data?.data?.bookings ??
    data?.bookings ??
    [];

  return Array.isArray(bookings)
    ? bookings
    : [];
}

function normalizeProvider(
  response: unknown
): ProviderProfile | null {
  const data =
    response as ProviderResponse;

  return (
    data?.data?.provider ??
    data?.provider ??
    null
  );
}

function getBookingStatus(
  booking: Booking
): string {
  return String(
    booking.status || ""
  ).toUpperCase();
}

function getBookingDate(
  booking: Booking
): string {
  return (
    booking.scheduledAt ||
    booking.date ||
    booking.createdAt ||
    ""
  );
}

function formatBookingDate(
  booking: Booking
): string {
  const rawDate =
    getBookingDate(booking);

  if (!rawDate) {
    return "Schedule not specified";
  }

  const parsedDate =
    new Date(rawDate);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return rawDate;
  }

  return parsedDate.toLocaleString(
    "en-NP",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
}

function getPhoneNumber(
  booking: Booking
): string | null {
  const phone =
    booking.customerPhone?.trim();

  if (!phone || phone === "N/A") {
    return null;
  }

  return phone;
}

function getBudget(
  booking: Booking
): number {
  const budget = Number(
    booking.budget ?? 0
  );

  return Number.isFinite(budget)
    ? budget
    : 0;
}

function getCustomerName(
  booking: Booking
): string {
  return (
    booking.customerName ||
    "Customer"
  );
}

function isWithinTimeframe(
  booking: Booking,
  timeframe: AnalyticsTimeframe
): boolean {
  if (timeframe === "ALL_TIME") {
    return true;
  }

  const rawDate =
    booking.completedAt ??
    booking.updatedAt ??
    booking.scheduledAt ??
    booking.date ??
    booking.createdAt;

  if (!rawDate) {
    return false;
  }

  const date =
    new Date(rawDate);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return false;
  }

  const now = new Date();

  if (timeframe === "THIS_WEEK") {
    const startOfWeek =
      new Date(now);

    const day =
      startOfWeek.getDay();

    const diff =
      day === 0 ? 6 : day - 1;

    startOfWeek.setDate(
      startOfWeek.getDate() - diff
    );

    startOfWeek.setHours(
      0,
      0,
      0,
      0
    );

    return date >= startOfWeek;
  }

  const startOfMonth =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

  return date >= startOfMonth;
}

export default function WorkerDashboard() {
  // ---------------------------------------------------------
  // Dashboard State
  // ---------------------------------------------------------

  const [
    incomingRequests,
    setIncomingRequests,
  ] = useState<Booking[]>([]);

  const [
    upcomingBookings,
    setUpcomingBookings,
  ] = useState<Booking[]>([]);

  // Keep the complete provider booking history for analytics.
  // Dashboard widgets intentionally show only pending/active bookings,
  // but completed jobs must remain available for earnings metrics.
  const [
    allBookings,
    setAllBookings,
  ] = useState<Booking[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    dashboardError,
    setDashboardError,
  ] = useState("");

  const [
    actionLoading,
    setActionLoading,
  ] = useState<string | null>(null);

  // ---------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------

  const [
    activeTab,
    setActiveTab,
  ] = useState<WorkerTab>(
    "DASHBOARD"
  );

  // ---------------------------------------------------------
  // Filters
  // ---------------------------------------------------------

  const [
    analyticsTimeframe,
    setAnalyticsTimeframe,
  ] =
    useState<AnalyticsTimeframe>(
      "THIS_MONTH"
    );

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    locationFilter,
    setLocationFilter,
  ] = useState("ALL");

  // ---------------------------------------------------------
  // Details Modal
  // ---------------------------------------------------------

  const [
    selectedJob,
    setSelectedJob,
  ] = useState<Booking | null>(
    null
  );

  // ---------------------------------------------------------
  // Profile State
  // ---------------------------------------------------------

  const [
    displayName,
    setDisplayName,
  ] = useState("");

  const [
    headline,
    setHeadline,
  ] = useState("");

  const [bio, setBio] =
    useState("");

  const [
    hourlyRate,
    setHourlyRate,
  ] = useState(500);

  const [city, setCity] =
    useState("");

  const [
    district,
    setDistrict,
  ] = useState("");

  const [
    profileLoading,
    setProfileLoading,
  ] = useState(false);

  const [
    profileError,
    setProfileError,
  ] = useState("");

  const [
    profileSuccess,
    setProfileSuccess,
  ] = useState("");

  // ---------------------------------------------------------
  // Marketplace Availability
  // ---------------------------------------------------------

  const [
    isOnline,
    setIsOnline,
  ] = useState(true);

  const [
    togglingStatus,
    setTogglingStatus,
  ] = useState(false);

  // ---------------------------------------------------------
  // Avatar Upload
  // ---------------------------------------------------------

  const [
    selectedFile,
    setSelectedFile,
  ] = useState<File | null>(null);

  const [
    imagePreview,
    setImagePreview,
  ] = useState<string | null>(
    null
  );

  const [
    uploadingImage,
    setUploadingImage,
  ] = useState(false);

  const [
    currentAvatarUrl,
    setCurrentAvatarUrl,
  ] = useState<string | null>(
    null
  );

  const [
    avatarError,
    setAvatarError,
  ] = useState("");

  const [
    avatarSuccess,
    setAvatarSuccess,
  ] = useState("");

  // ---------------------------------------------------------
  // User
  // ---------------------------------------------------------

  const [
    currentUser,
    setCurrentUser,
  ] = useState<StoredUser | null>(
    null
  );

  // ---------------------------------------------------------
  // Load Dashboard Data
  // ---------------------------------------------------------

  const fetchDashboardData =
    useCallback(async () => {
      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem(
              "kamdarnepal_token"
            )
          : null;

      const user =
        getStoredUser();

      if (!token || !user) {
        setLoading(false);
        setDashboardError(
          "Your worker session is missing. Please log in again."
        );
        return;
      }

      try {
        setDashboardError("");

        const response =
          await api.bookings.list();

        const rawBookings =
          normalizeBookingList(
            response
          );

        // Preserve every booking returned for this provider.
        // Completed bookings are intentionally excluded from the
        // live/active widgets below, but analytics depends on them.
        setAllBookings(rawBookings);

        const pendingRequests =
          rawBookings.filter(
            (booking) => {
              const status =
                getBookingStatus(
                  booking
                );

              const isPending =
                status === "PENDING";

              const isNotSelf =
                user.id
                  ? booking.customerId !==
                    user.id
                  : true;

              return (
                isPending &&
                isNotSelf
              );
            }
          );

        const confirmedSlots =
          rawBookings.filter(
            (booking) => {
              const status =
                getBookingStatus(
                  booking
                );

              return (
                status ===
                  "CONFIRMED" ||
                status ===
                  "ACCEPTED"
              );
            }
          );

        setIncomingRequests(
          pendingRequests
        );

        setUpcomingBookings(
          confirmedSlots
        );
      } catch (error) {
        console.error(
          "Failed to fetch dashboard data:",
          error
        );

        setAllBookings([]);
        setIncomingRequests([]);
        setUpcomingBookings([]);

        setDashboardError(
          error instanceof Error
            ? error.message
            : "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  // ---------------------------------------------------------
  // Load Worker Profile
  // ---------------------------------------------------------

  const fetchProfileData =
    useCallback(async () => {
      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem(
              "kamdarnepal_token"
            )
          : null;

      const user =
        getStoredUser();

      if (!token || !user) {
        return;
      }

      try {
        const response =
          await api.providers.getById(
            user.id || ""
          );

        const profile =
          normalizeProvider(
            response
          );

        if (!profile) {
          return;
        }

        setDisplayName(
          profile.displayName ||
            ""
        );

        setHeadline(
          profile.headline ||
            ""
        );

        setBio(
          profile.bio || ""
        );

        setHourlyRate(
          typeof profile.hourlyRate ===
            "number"
            ? profile.hourlyRate
            : 500
        );

        setCity(
          profile.city || ""
        );

        setDistrict(
          profile.district || ""
        );

        setCurrentAvatarUrl(
          profile.avatarUrl ||
            null
        );

        if (
          profile.availabilityStatus !==
          undefined
        ) {
          const status =
            String(
              profile.availabilityStatus
            ).toUpperCase();

          setIsOnline(
            status ===
              "AVAILABLE" ||
              status ===
                "ONLINE"
          );
        }
      } catch (error) {
        console.error(
          "Failed to fetch profile data:",
          error
        );
      }
    }, []);

  // ---------------------------------------------------------
  // Initial Load
  // ---------------------------------------------------------

  useEffect(() => {
    const user =
      getStoredUser();

    setCurrentUser(user);

    void fetchDashboardData();
    void fetchProfileData();
  }, [
    fetchDashboardData,
    fetchProfileData,
  ]);

  // ---------------------------------------------------------
  // Availability Toggle
  // ---------------------------------------------------------

  const handleAvailabilityToggle =
    async () => {
      if (togglingStatus) {
        return;
      }

      const targetState =
        !isOnline;

      setTogglingStatus(true);

      try {
        const response =
          await api.providers.updateProfile(
            {
              availabilityStatus:
                targetState
                  ? "AVAILABLE"
                  : "OFFLINE",
            }
          );

        const data =
          response as UpdateResponse;

        if (
          data?.success === false
        ) {
          throw new Error(
            data.message ||
              "Unable to update marketplace status."
          );
        }

        setIsOnline(
          targetState
        );
      } catch (error) {
        console.error(
          "Failed to update availability:",
          error
        );
      } finally {
        setTogglingStatus(false);
      }
    };

  // ---------------------------------------------------------
  // Booking Status Mutation
  // ---------------------------------------------------------

  const handleStatusMutation =
    async (
      bookingId:
        | string
        | string[],
      targetStatus: MutationStatus
    ) => {
      const idsToUpdate =
        Array.isArray(bookingId)
          ? bookingId
          : [bookingId];

      const validIds =
        idsToUpdate.filter(
          Boolean
        );

      if (
        validIds.length === 0 ||
        actionLoading !== null
      ) {
        return;
      }

      setActionLoading(
        validIds[0]
      );

      try {
        const backendStatus =
          targetStatus ===
            "ACCEPTED"
            ? "CONFIRMED"
            : targetStatus;

        /*
         * Do not silently ignore failed requests.
         * Each API call is awaited and any failure
         * stops the success flow.
         */
        for (const id of validIds) {
          await api.bookings.updateStatus(
            id,
            {
              status:
                backendStatus,
            }
          );
        }

        setSelectedJob(
          null
        );

        await fetchDashboardData();
      } catch (error) {
        console.error(
          "Status mutation error:",
          error
        );
      } finally {
        setActionLoading(null);
      }
    };

  // ---------------------------------------------------------
  // Avatar File Selection
  // ---------------------------------------------------------

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setAvatarError("");
    setAvatarSuccess("");

    /*
     * Basic client-side validation.
     */
    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setAvatarError(
        "Please select a valid image file."
      );

      event.target.value = "";
      return;
    }

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      setAvatarError(
        "Image size must be 5 MB or less."
      );

      event.target.value = "";
      return;
    }

    /*
     * Revoke previous object URL
     * before creating a new one.
     */
    setImagePreview(
      (previousPreview) => {
        if (previousPreview) {
          URL.revokeObjectURL(
            previousPreview
          );
        }

        return URL.createObjectURL(
          file
        );
      }
    );

    setSelectedFile(file);
  };

  // ---------------------------------------------------------
  // Cleanup Image Preview
  // ---------------------------------------------------------

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(
          imagePreview
        );
      }
    };
  }, [imagePreview]);

  // ---------------------------------------------------------
  // Avatar Upload
  // ---------------------------------------------------------

  const handleAvatarUpload =
    async () => {
      if (
        !selectedFile ||
        uploadingImage
      ) {
        return;
      }

      setUploadingImage(true);
      setAvatarError("");
      setAvatarSuccess("");

      try {
        const response =
          await api.providers.uploadAvatar(
            selectedFile
          );

        const data =
          response as UpdateResponse;

        const avatarUrl =
          data?.data?.avatarUrl ??
          data?.avatarUrl ??
          data?.data?.provider
            ?.avatarUrl;

        if (
          data?.success === false
        ) {
          throw new Error(
            data.message ||
              "Avatar upload failed."
          );
        }

        if (avatarUrl) {
          setCurrentAvatarUrl(
            avatarUrl
          );
        }

        setSelectedFile(
          null
        );

        setImagePreview(
          null
        );

        setAvatarSuccess(
          "Profile avatar updated successfully."
        );

        await fetchProfileData();
      } catch (error) {
        console.error(
          "Avatar upload failed:",
          error
        );

        setAvatarError(
          error instanceof Error
            ? error.message
            : "Unable to upload profile avatar."
        );
      } finally {
        setUploadingImage(false);
      }
    };

  // ---------------------------------------------------------
  // Profile Submit
  // ---------------------------------------------------------

  const handleProfileSubmit =
    async (
      event: React.FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      if (profileLoading) {
        return;
      }

      setProfileLoading(true);
      setProfileError("");
      setProfileSuccess("");

      const trimmedDisplayName =
        displayName.trim();

      const trimmedHeadline =
        headline.trim();

      const trimmedBio =
        bio.trim();

      const trimmedCity =
        city.trim();

      const trimmedDistrict =
        district.trim();

      if (
        trimmedDisplayName.length <
        2
      ) {
        setProfileError(
          "Display name must contain at least 2 characters."
        );

        setProfileLoading(false);
        return;
      }

      if (
        trimmedHeadline.length <
        3
      ) {
        setProfileError(
          "Professional headline must contain at least 3 characters."
        );

        setProfileLoading(false);
        return;
      }

      if (
        trimmedBio.length <
        10
      ) {
        setProfileError(
          "Bio must contain at least 10 characters."
        );

        setProfileLoading(false);
        return;
      }

      if (!trimmedCity) {
        setProfileError(
          "City is required."
        );

        setProfileLoading(false);
        return;
      }

      if (!trimmedDistrict) {
        setProfileError(
          "District is required."
        );

        setProfileLoading(false);
        return;
      }

      if (
        !Number.isFinite(
          hourlyRate
        ) ||
        hourlyRate < 150 ||
        hourlyRate > 2500
      ) {
        setProfileError(
          "Hourly rate must be between Rs. 150 and Rs. 2,500."
        );

        setProfileLoading(false);
        return;
      }

      try {
        const response =
          await api.providers.updateProfile(
            {
              displayName:
                trimmedDisplayName,
              headline:
                trimmedHeadline,
              bio: trimmedBio,
              city: trimmedCity,
              district:
                trimmedDistrict,
              hourlyRate:
                Number(
                  hourlyRate
                ),
            }
          );

        const data =
          response as UpdateResponse;

        if (
          data?.success === false
        ) {
          throw new Error(
            data.message ||
              "Unable to update your profile."
          );
        }

        setDisplayName(
          trimmedDisplayName
        );

        setHeadline(
          trimmedHeadline
        );

        setBio(
          trimmedBio
        );

        setCity(
          trimmedCity
        );

        setDistrict(
          trimmedDistrict
        );

        setProfileSuccess(
          "Marketplace profile updated successfully."
        );

        setActiveTab(
          "DASHBOARD"
        );

        await fetchProfileData();
      } catch (error) {
        console.error(
          "Profile update error:",
          error
        );

        setProfileError(
          error instanceof Error
            ? error.message
            : "Unable to update your profile."
        );
      } finally {
        setProfileLoading(false);
      }
    };

  // ---------------------------------------------------------
  // Filter Requests
  // ---------------------------------------------------------

  const filteredRequests =
    useMemo(() => {
      const normalizedSearch =
        searchQuery
          .toLowerCase()
          .trim();

      return incomingRequests.filter(
        (job) => {
          const customerName =
            getCustomerName(
              job
            ).toLowerCase();

          const description =
            (
              job.description ||
              ""
            ).toLowerCase();

          const serviceType =
            (
              job.serviceType ||
              job.profession ||
              ""
            ).toLowerCase();

          const cityName =
            (
              job.city ||
              ""
            ).toLowerCase();

          const matchesSearch =
            !normalizedSearch ||
            customerName.includes(
              normalizedSearch
            ) ||
            description.includes(
              normalizedSearch
            ) ||
            serviceType.includes(
              normalizedSearch
            );

          const matchesLocation =
            locationFilter ===
              "ALL" ||
            cityName ===
              locationFilter.toLowerCase();

          return (
            matchesSearch &&
            matchesLocation
          );
        }
      );
    }, [
      incomingRequests,
      searchQuery,
      locationFilter,
    ]);

  // ---------------------------------------------------------
  // Group Requests
  // ---------------------------------------------------------

  const groupedRequests =
    useMemo(() => {
      const grouped =
        filteredRequests.reduce<
          Record<
            string,
            GroupedBooking
          >
        >(
          (
            accumulator,
            job
          ) => {
            const key =
              job.customerId ||
              job.customerPhone ||
              job.customerName ||
              job.id;

            if (
              !accumulator[key]
            ) {
              accumulator[key] = {
                ...job,
                requestCount: 1,
                allJobIds: [
                  job.id,
                ],
              };
            } else {
              accumulator[
                key
              ].requestCount +=
                1;

              accumulator[
                key
              ].allJobIds.push(
                job.id
              );
            }

            return accumulator;
          },
          {}
        );

      return Object.values(
        grouped
      );
    }, [
      filteredRequests,
    ]);

  // ---------------------------------------------------------
  // Analytics
  // ---------------------------------------------------------

  const analyticsBookings =
    useMemo(() => {
      // Analytics must use the complete booking history, not just the
      // pending and active dashboard subsets. This ensures COMPLETED
      // jobs are counted for This Week, This Month, and All Time.
      const uniqueBookings =
        new Map<
          string,
          Booking
        >();

      allBookings.forEach(
        (booking) => {
          uniqueBookings.set(
            booking.id,
            booking
          );
        }
      );

      return Array.from(
        uniqueBookings.values()
      );
    }, [
      allBookings,
    ]);

  const completedCount =
    useMemo(() => {
      return analyticsBookings.filter(
        (booking) =>
          getBookingStatus(
            booking
          ) === "COMPLETED" &&
          isWithinTimeframe(
            booking,
            analyticsTimeframe
          )
      ).length;
    }, [
      analyticsBookings,
      analyticsTimeframe,
    ]);

  const monthlyEarnings =
    useMemo(() => {
      return analyticsBookings
        .filter(
          (booking) =>
            getBookingStatus(
              booking
            ) ===
              "COMPLETED" &&
            isWithinTimeframe(
              booking,
              analyticsTimeframe
            )
        )
        .reduce(
          (
            total,
            booking
          ) =>
            total +
            getBudget(
              booking
            ),
          0
        );
    }, [
      analyticsBookings,
      analyticsTimeframe,
    ]);

  // ---------------------------------------------------------
  // Render
  // ---------------------------------------------------------

  return (
    <MainLayout title="Worker Dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 text-slate-100">
        {/* Header Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Worker Dashboard Hub
            </h1>

            <p className="text-slate-400 text-sm mt-1">
              Monitor incoming jobs, manage schedules, and update your dynamic profile.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Status Switcher */}
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl">
              <span className="text-xs font-medium text-slate-300">
                Marketplace Status
              </span>

              <button
                type="button"
                disabled={
                  togglingStatus
                }
                onClick={
                  handleAvailabilityToggle
                }
                aria-label={
                  isOnline
                    ? "Set marketplace status offline"
                    : "Set marketplace status online"
                }
                aria-pressed={
                  isOnline
                }
                className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${
                  isOnline
                    ? "bg-emerald-500"
                    : "bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isOnline
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>

              <span
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  isOnline
                    ? "text-emerald-400"
                    : "text-slate-500"
                }`}
              >
                {isOnline
                  ? "Online"
                  : "Offline"}
              </span>
            </div>

            {/* View Sub-Tabs */}
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() =>
                  setActiveTab(
                    "DASHBOARD"
                  )
                }
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  activeTab ===
                  "DASHBOARD"
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Overview
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveTab(
                    "PROFILE_SETTINGS"
                  )
                }
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  activeTab ===
                  "PROFILE_SETTINGS"
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Error */}
        {dashboardError && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-300"
          >
            {dashboardError}
          </div>
        )}

        {activeTab ===
        "DASHBOARD" ? (
          /* DASHBOARD VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Live Requests Stream */}
            <div className="lg:col-span-2 space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    Live Booking Requests

                    <span className="bg-orange-500/10 text-orange-400 text-xs px-2 py-0.5 rounded-full border border-orange-500/20 font-medium">
                      {
                        groupedRequests.length
                      }
                    </span>
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <label
                    htmlFor="request-search"
                    className="sr-only"
                  >
                    Search booking requests
                  </label>

                  <input
                    id="request-search"
                    type="text"
                    placeholder="Search requests..."
                    value={
                      searchQuery
                    }
                    onChange={(
                      event
                    ) =>
                      setSearchQuery(
                        event.target
                          .value
                      )
                    }
                    className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-1.5 outline-none focus:border-slate-700 w-36 sm:w-44"
                  />

                  <label
                    htmlFor="request-location"
                    className="sr-only"
                  >
                    Filter requests by city
                  </label>

                  <select
                    id="request-location"
                    value={
                      locationFilter
                    }
                    onChange={(
                      event
                    ) =>
                      setLocationFilter(
                        event.target
                          .value
                      )
                    }
                    className="bg-slate-950 border border-slate-800 text-xs text-slate-400 rounded-lg px-2 py-1.5 outline-none"
                  >
                    <option value="ALL">
                      All Cities
                    </option>

                    <option value="Bhaktapur">
                      Bhaktapur
                    </option>

                    <option value="Kathmandu">
                      Kathmandu
                    </option>

                    <option value="Lalitpur">
                      Lalitpur
                    </option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="p-8 text-center text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800 text-xs animate-pulse">
                  Loading requests...
                </div>
              ) : groupedRequests.length ===
                0 ? (
                <div className="p-8 text-center text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800 text-xs">
                  No pending booking requests available right now.
                </div>
              ) : (
                <div className="space-y-3">
                  {groupedRequests.map(
                    (job) => {
                      const phoneNum =
                        getPhoneNumber(
                          job
                        );

                      return (
                        <div
                          key={
                            job.id
                          }
                          onClick={() =>
                            setSelectedJob(
                              job
                            )
                          }
                          role="button"
                          tabIndex={0}
                          onKeyDown={(
                            event
                          ) => {
                            if (
                              event.key ===
                                "Enter" ||
                              event.key ===
                                " "
                            ) {
                              event.preventDefault();

                              setSelectedJob(
                                job
                              );
                            }
                          }}
                          className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-all cursor-pointer group shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                          <div className="space-y-1.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors text-sm">
                                {getCustomerName(
                                  job
                                )}
                              </h3>

                              <span className="text-[10px] font-bold uppercase tracking-wide bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                                {job.serviceType ||
                                  job.profession ||
                                  "Instant"}
                              </span>

                              {job.requestCount >
                                1 && (
                                <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                                  {
                                    job.requestCount
                                  }{" "}
                                  Requests
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed line-clamp-1">
                              {job.description ||
                                "No specific instructions provided."}
                            </p>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 pt-1">
                              <span className="font-medium text-slate-200">
                                💰 Rs.{" "}
                                {getBudget(
                                  job
                                ).toLocaleString(
                                  "en-NP"
                                )}
                              </span>

                              <span className="text-slate-600">
                                •
                              </span>

                              <span className="flex items-center gap-1">
                                📍{" "}
                                {job.city ||
                                  "Location not specified"}
                              </span>

                              <span className="text-slate-600">
                                •
                              </span>

                              <span>
                                ⏰{" "}
                                {formatBookingDate(
                                  job
                                )}
                              </span>
                            </div>

                            {/* Phone */}
                            {phoneNum && (
                              <div className="pt-1.5">
                                <a
                                  href={`tel:${phoneNum}`}
                                  onClick={(
                                    event
                                  ) =>
                                    event.stopPropagation()
                                  }
                                  className="inline-flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-emerald-400 bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 px-2.5 py-1 rounded-md transition-all group/phone"
                                >
                                  <span className="text-slate-500 group-hover/phone:text-emerald-400">
                                    📞
                                  </span>

                                  <span>
                                    {
                                      phoneNum
                                    }
                                  </span>

                                  <span className="text-[9px] uppercase tracking-wider font-sans font-bold text-emerald-400 bg-emerald-500/10 px-1 rounded">
                                    Call
                                  </span>
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div
                            className="flex items-center gap-2 flex-shrink-0 sm:self-center pt-2 sm:pt-0"
                            onClick={(
                              event
                            ) =>
                              event.stopPropagation()
                            }
                          >
                            <button
                              type="button"
                              disabled={
                                actionLoading !==
                                null
                              }
                              onClick={() =>
                                handleStatusMutation(
                                  job.allJobIds,
                                  "REJECTED"
                                )
                              }
                              className="h-8 px-3.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-xs font-semibold text-red-400 hover:border-red-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoading
                                ? "Updating..."
                                : "Reject"}
                            </button>

                            <button
                              type="button"
                              disabled={
                                actionLoading !==
                                null
                              }
                              onClick={() =>
                                handleStatusMutation(
                                  job.allJobIds,
                                  "ACCEPTED"
                                )
                              }
                              className="h-8 px-4 rounded-lg bg-orange-600 hover:bg-orange-500 text-xs font-semibold text-white transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoading
                                ? "Updating..."
                                : `Accept ${
                                    job.requestCount >
                                    1
                                      ? `(${job.requestCount})`
                                      : ""
                                  }`}
                            </button>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* Side Widgets */}
            <div className="space-y-6">
              {/* Analytics */}
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">
                    Business Analytics
                  </h3>

                  <label
                    htmlFor="analytics-timeframe"
                    className="sr-only"
                  >
                    Analytics timeframe
                  </label>

                  <select
                    id="analytics-timeframe"
                    value={
                      analyticsTimeframe
                    }
                    onChange={(
                      event
                    ) =>
                      setAnalyticsTimeframe(
                        event.target
                          .value as AnalyticsTimeframe
                      )
                    }
                    className="bg-slate-950 border border-slate-800 text-slate-400 text-[11px] rounded-lg px-2 py-1 outline-none"
                  >
                    <option value="THIS_MONTH">
                      This Month
                    </option>

                    <option value="THIS_WEEK">
                      This Week
                    </option>

                    <option value="ALL_TIME">
                      All Time
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Gross Earnings
                    </span>

                    <p className="text-base font-bold text-emerald-400">
                      Rs.{" "}
                      {monthlyEarnings.toLocaleString(
                        "en-NP"
                      )}
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Jobs Completed
                    </span>

                    <p className="text-base font-bold text-orange-400">
                      {
                        completedCount
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Active Bookings */}
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-4">
                <h3 className="font-bold text-white text-sm">
                  Active Slotted Bookings
                </h3>

                {loading ? (
                  <p className="text-xs text-slate-500">
                    Syncing schedule...
                  </p>
                ) : upcomingBookings.length ===
                  0 ? (
                  <p className="text-xs text-slate-500">
                    No active slotted bookings.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {upcomingBookings.map(
                      (slot) => {
                        const slotPhone =
                          getPhoneNumber(
                            slot
                          );

                        return (
                          <div
                            key={
                              slot.id
                            }
                            className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-lg space-y-2"
                          >
                            <div className="flex justify-between items-start gap-3">
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-white truncate">
                                  {getCustomerName(
                                    slot
                                  )}
                                </h4>

                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  📅{" "}
                                  {formatBookingDate(
                                    slot
                                  )}
                                </p>
                              </div>

                              <span className="text-xs font-semibold text-emerald-400 whitespace-nowrap">
                                Rs.{" "}
                                {getBudget(
                                  slot
                                ).toLocaleString(
                                  "en-NP"
                                )}
                              </span>
                            </div>

                            {slotPhone && (
                              <p className="text-xs text-slate-400 font-mono">
                                📞{" "}
                                <a
                                  href={`tel:${slotPhone}`}
                                  className="hover:underline hover:text-white"
                                >
                                  {
                                    slotPhone
                                  }
                                </a>
                              </p>
                            )}

                            <button
                              type="button"
                              disabled={
                                actionLoading !==
                                null
                              }
                              onClick={() =>
                                handleStatusMutation(
                                  slot.id,
                                  "COMPLETED"
                                )
                              }
                              className="w-full h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-600 text-emerald-400 hover:text-white text-[11px] font-bold tracking-wider uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoading ===
                              slot.id
                                ? "Updating..."
                                : "Complete Work ✔"}
                            </button>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* EDIT PROFILE VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Avatar */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-xl space-y-4 h-fit">
              <h3 className="font-bold text-white text-sm">
                Profile Avatar
              </h3>

              <p className="text-xs text-slate-400">
                Upload a clean profile image for clients to view.
              </p>

              <div className="flex justify-center py-2">
                <div className="w-24 h-24 rounded-full border-2 border-slate-700 overflow-hidden bg-slate-950 flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={
                        imagePreview
                      }
                      alt="Selected profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : currentAvatarUrl ? (
                    <img
                      src={
                        currentAvatarUrl
                      }
                      alt="Current profile avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-slate-500">
                      No Image
                    </span>
                  )}
                </div>
              </div>

              <label
                htmlFor="worker-avatar"
                className="block text-xs font-medium text-slate-300"
              >
                Choose profile image
              </label>

              <input
                id="worker-avatar"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={
                  handleFileChange
                }
                className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer"
              />

              <p className="text-[10px] text-slate-500">
                JPG, PNG or WebP. Maximum 5 MB.
              </p>

              {avatarError && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-300"
                >
                  {
                    avatarError
                  }
                </div>
              )}

              {avatarSuccess && (
                <div
                  role="status"
                  className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-300"
                >
                  {
                    avatarSuccess
                  }
                </div>
              )}

              {selectedFile && (
                <button
                  type="button"
                  onClick={
                    handleAvatarUpload
                  }
                  disabled={
                    uploadingImage
                  }
                  className="w-full h-9 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingImage
                    ? "Uploading..."
                    : "Save Avatar"}
                </button>
              )}
            </div>

            {/* Marketplace Profile */}
            <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 p-6 rounded-xl space-y-6">
              <div>
                <h3 className="font-bold text-white text-sm">
                  Marketplace Profile
                </h3>

                <p className="text-xs text-slate-400 mt-0.5">
                  Customize your details visible to potential clients.
                </p>
              </div>

              {profileError && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-300"
                >
                  {
                    profileError
                  }
                </div>
              )}

              {profileSuccess && (
                <div
                  role="status"
                  className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-xs text-emerald-300"
                >
                  {
                    profileSuccess
                  }
                </div>
              )}

              <form
                onSubmit={
                  handleProfileSubmit
                }
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="display-name"
                      className="block text-xs font-medium text-slate-300 mb-1"
                    >
                      Public Display Name
                    </label>

                    <input
                      id="display-name"
                      type="text"
                      required
                      minLength={2}
                      value={
                        displayName
                      }
                      onChange={(
                        event
                      ) =>
                        setDisplayName(
                          event.target
                            .value
                        )
                      }
                      className="w-full h-9 bg-slate-950 text-white border border-slate-800 rounded-lg px-3 text-xs outline-none focus:border-slate-600 font-medium"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="professional-headline"
                      className="block text-xs font-medium text-slate-300 mb-1"
                    >
                      Professional Headline
                    </label>

                    <input
                      id="professional-headline"
                      type="text"
                      required
                      minLength={3}
                      value={
                        headline
                      }
                      onChange={(
                        event
                      ) =>
                        setHeadline(
                          event.target
                            .value
                        )
                      }
                      className="w-full h-9 bg-slate-950 text-white border border-slate-800 rounded-lg px-3 text-xs outline-none focus:border-slate-600 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="worker-city"
                      className="block text-xs font-medium text-slate-300 mb-1"
                    >
                      City
                    </label>

                    <input
                      id="worker-city"
                      type="text"
                      required
                      value={city}
                      onChange={(
                        event
                      ) =>
                        setCity(
                          event.target
                            .value
                        )
                      }
                      className="w-full h-9 bg-slate-950 text-white border border-slate-800 rounded-lg px-3 text-xs outline-none focus:border-slate-600 font-medium"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="worker-district"
                      className="block text-xs font-medium text-slate-300 mb-1"
                    >
                      District
                    </label>

                    <input
                      id="worker-district"
                      type="text"
                      required
                      value={
                        district
                      }
                      onChange={(
                        event
                      ) =>
                        setDistrict(
                          event.target
                            .value
                        )
                      }
                      className="w-full h-9 bg-slate-950 text-white border border-slate-800 rounded-lg px-3 text-xs outline-none focus:border-slate-600 font-medium"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="worker-hourly-rate"
                      className="block text-xs font-medium text-slate-300 mb-1"
                    >
                      Hourly Rate (Rs.)
                    </label>

                    <input
                      id="worker-hourly-rate"
                      type="number"
                      required
                      min={150}
                      max={2500}
                      value={
                        hourlyRate
                      }
                      onChange={(
                        event
                      ) =>
                        setHourlyRate(
                          Number(
                            event.target
                              .value
                          )
                        )
                      }
                      className="w-full h-9 bg-slate-950 text-white border border-slate-800 rounded-lg px-3 text-xs font-mono outline-none focus:border-slate-600 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="worker-bio"
                    className="block text-xs font-medium text-slate-300 mb-1"
                  >
                    Bio / Overview
                  </label>

                  <textarea
                    id="worker-bio"
                    required
                    minLength={10}
                    value={bio}
                    onChange={(
                      event
                    ) =>
                      setBio(
                        event.target
                          .value
                      )
                    }
                    className="w-full h-24 bg-slate-950 text-white border border-slate-800 rounded-lg p-3 outline-none focus:border-slate-600 resize-none font-medium text-xs leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab(
                        "DASHBOARD"
                      )
                    }
                    className="h-9 px-4 bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      profileLoading
                    }
                    className="h-9 px-4 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {profileLoading
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {selectedJob && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-details-title"
          >
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-lg w-full relative space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
              <button
                type="button"
                onClick={() =>
                  setSelectedJob(
                    null
                  )
                }
                aria-label="Close booking details"
                className="absolute top-4 right-4 text-slate-500 hover:text-white text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-colors"
              >
                ✕
              </button>

              <div className="pr-8">
                <h3
                  id="booking-details-title"
                  className="font-bold text-white text-base"
                >
                  Booking Details
                </h3>

                <p className="text-xs text-slate-400">
                  Complete service request breakdown.
                </p>
              </div>

              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
                <div>
                  <span className="text-slate-500 font-semibold block">
                    Client Name
                  </span>

                  <span className="text-white font-medium">
                    {
                      getCustomerName(
                        selectedJob
                      )
                    }
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 font-semibold block">
                    Phone Contact
                  </span>

                  <span className="text-white font-mono">
                    {
                      selectedJob.customerPhone ||
                      "N/A"
                    }
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 font-semibold block">
                    Service Type
                  </span>

                  <span className="text-white">
                    {selectedJob.serviceType ||
                      selectedJob.profession ||
                      "Service request"}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 font-semibold block">
                    Service Description
                  </span>

                  <p className="text-white mt-0.5 leading-relaxed">
                    {selectedJob.description ||
                      "None provided."}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500 font-semibold block">
                    Scheduled Time
                  </span>

                  <span className="text-white">
                    {formatBookingDate(
                      selectedJob
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-slate-500 font-semibold block">
                      Budget
                    </span>

                    <span className="text-emerald-400 font-bold">
                      Rs.{" "}
                      {getBudget(
                        selectedJob
                      ).toLocaleString(
                        "en-NP"
                      )}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-semibold block">
                      Location
                    </span>

                    <span className="text-white">
                      {selectedJob.city ||
                        "Not specified"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedJob(
                      null
                    )
                  }
                  className="h-8 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}