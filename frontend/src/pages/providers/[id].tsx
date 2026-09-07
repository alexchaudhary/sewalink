"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import MainLayout from "../../components/MainLayout";
import { fetcher } from "../../lib/api";

interface ProviderDetailModel {
  id: string;
  displayName: string;
  headline: string;
  bio: string;
  address: string;
  city: string;
  district: string;
  hourlyRate: number;
  rating: number;
}

interface ProviderResponse {
  provider?: ProviderDetailModel;
  data?: {
    provider?: ProviderDetailModel;
  };
}

interface StoredUser {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
}

interface CreateBookingPayload {
  customerId: string;
  providerId: string;
  description: string;
  budget: number;
  date: string;
  type: "SCHEDULED";
}

export default function ProviderDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [provider, setProvider] =
    useState<ProviderDetailModel | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // Booking form states
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  // Chat state
  const [chatMessage, setChatMessage] = useState("");

  // Action states
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(false);
  const [actionError, setActionError] = useState("");

  /**
   * Load provider profile.
   *
   * Important:
   * The API base URL is already handled by lib/api.ts,
   * therefore we use /providers/:id instead of /api/providers/:id.
   */
  useEffect(() => {
    if (!router.isReady || !id) {
      return;
    }

    const providerId = Array.isArray(id) ? id[0] : id;

    let cancelled = false;

    const loadProvider = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetcher<ProviderResponse>(
          `/providers/${encodeURIComponent(providerId)}`
        );

        if (cancelled) {
          return;
        }

        const realProvider =
          response?.data?.provider ||
          response?.provider ||
          null;

        if (!realProvider) {
          setProvider(null);
          setError("Provider not found.");
          return;
        }

        setProvider(realProvider);
      } catch (err) {
        if (cancelled) {
          return;
        }

        const message =
          err instanceof Error
            ? err.message
            : "Failed to load provider.";

        setProvider(null);
        setError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProvider();

    return () => {
      cancelled = true;
    };
  }, [router.isReady, id]);

  /**
   * Open booking modal.
   */
  const handleOpenBooking = () => {
    setActionError("");
    setActionSuccess(false);
    setIsBookModalOpen(true);
  };

  /**
   * Open chat modal.
   *
   * Chat backend endpoint is not currently implemented,
   * so we keep the UI honest instead of calling a nonexistent API.
   */
  const handleOpenChat = () => {
    setActionError("");
    setActionSuccess(false);
    setIsChatModalOpen(true);
  };

  /**
   * Instant hire currently redirects to marketplace with
   * the selected provider information.
   */
  const handleInstantHire = () => {
    if (!provider) {
      return;
    }

    const query = new URLSearchParams({
      hire: provider.id,
      name: provider.displayName,
    });

    router.push(`/providers?${query.toString()}`);
  };

  /**
   * Close all action state after successful booking.
   */
  const resetBookingForm = () => {
    setScheduleDate("");
    setScheduleTime("");
    setJobDescription("");
    setActionSuccess(false);
    setActionError("");
  };

  /**
   * Read the currently authenticated user from localStorage.
   */
  const getStoredUser = (): StoredUser | null => {
    if (typeof window === "undefined") {
      return null;
    }

    const rawUser = window.localStorage.getItem("user");

    if (!rawUser) {
      return null;
    }

    try {
      const parsed = JSON.parse(rawUser);

      if (parsed?.user) {
        return parsed.user as StoredUser;
      }

      return parsed as StoredUser;
    } catch {
      return null;
    }
  };

  /**
   * Scheduled booking creation.
   *
   * We do not use a fake customer ID anymore.
   * The authenticated customer's real user ID must exist.
   */
  const handleScheduleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!provider) {
      setActionError("Provider information is unavailable.");
      return;
    }

    if (!scheduleDate || !scheduleTime || !jobDescription.trim()) {
      setActionError(
        "Please complete the date, time, and job description."
      );
      return;
    }

    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("kamdarnepal_token")
        : null;

    if (!token) {
      setActionError("Please login first to book a service.");
      router.push("/login");
      return;
    }

    const storedUser = getStoredUser();

    if (!storedUser?.id) {
      setActionError(
        "Your customer session is incomplete. Please login again."
      );
      return;
    }

    if (
      storedUser.role &&
      storedUser.role !== "CUSTOMER"
    ) {
      setActionError(
        "Only customer accounts can create service bookings."
      );
      return;
    }

    const scheduledDateTime = new Date(
      `${scheduleDate}T${scheduleTime}`
    );

    if (Number.isNaN(scheduledDateTime.getTime())) {
      setActionError("Please select a valid date and time.");
      return;
    }

    if (scheduledDateTime.getTime() <= Date.now()) {
      setActionError(
        "Please choose a future date and time."
      );
      return;
    }

    const bookingPayload: CreateBookingPayload = {
      customerId: storedUser.id,
      providerId: provider.id,
      description: jobDescription.trim(),
      budget: Math.max(
        Number(provider.hourlyRate || 500) * 2,
        500
      ),
      date: scheduledDateTime.toISOString(),
      type: "SCHEDULED",
    };

    try {
      setActionLoading(true);
      setActionError("");
      setActionSuccess(false);

      await fetcher("/bookings", {
        method: "POST",
        body: JSON.stringify(bookingPayload),
      });

      setActionSuccess(true);

      setTimeout(() => {
        setIsBookModalOpen(false);
        resetBookingForm();
        router.push("/dashboard/customer");
      }, 1200);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to create booking.";

      setActionError(message);
      setActionSuccess(false);
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Chat is intentionally not connected to a nonexistent endpoint.
   * The backend chat module needs to exist before sending messages.
   */
  const handleChatSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!chatMessage.trim()) {
      setActionError("Please enter a message.");
      return;
    }

    setActionError(
      "Messaging is not available yet. Please use Book Service to contact this provider."
    );
  };

  /**
   * Loading state.
   */
  if (loading) {
    return (
      <MainLayout title="Provider Profile">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link
            href="/providers"
            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Back to Marketplace
          </Link>

          <div className="mt-6 rounded-2xl border border-white/5 bg-slate-900/20 p-8 text-center shadow-2xl backdrop-blur-md">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-blue-500" />

            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">
              Loading provider profile...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  /**
   * Provider loading error.
   */
  if (error || !provider) {
    return (
      <MainLayout title="Provider Profile">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link
            href="/providers"
            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Back to Marketplace
          </Link>

          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-950/20 p-8 shadow-2xl backdrop-blur-md">
            <p className="text-sm font-bold text-red-300">
              {error || "Provider not found."}
            </p>

            <Link
              href="/providers"
              className="mt-5 inline-flex rounded-xl bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/15"
            >
              Return to Marketplace
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={`${provider.displayName} | Provider Profile`}>
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Navigation */}
        <Link
          href="/providers"
          className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors"
        >
          ← Back to Marketplace
        </Link>

        {/* Provider Profile */}
        <section className="rounded-2xl border border-white/5 bg-slate-900/20 p-8 shadow-2xl shadow-black/50 backdrop-blur-md">
          <div className="grid gap-8 md:grid-cols-[1fr,320px]">
            {/* Information Area */}
            <div className="space-y-5">
              <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-6 shadow-inner">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-black tracking-tight text-white">
                      {provider.displayName}
                    </h1>

                    {provider.headline && (
                      <p className="mt-1 text-xs font-bold uppercase tracking-wider text-blue-400">
                        {provider.headline}
                      </p>
                    )}
                  </div>

                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Available Provider
                  </div>
                </div>

                <p className="mt-4 text-sm font-medium leading-relaxed text-slate-400">
                  {provider.bio ||
                    "Professional service provider registered on Kamdar Nepal."}
                </p>
              </div>

              {/* Stats */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Rating
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg text-amber-400">
                      ★
                    </span>

                    <span className="text-xl font-black text-white">
                      {Number(provider.rating || 0).toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Hourly Rate
                  </p>

                  <p className="mt-2 text-xl font-black text-white">
                    Rs {Number(provider.hourlyRate || 0).toLocaleString()}
                    <span className="ml-1 text-xs font-bold text-slate-500">
                      /hr
                    </span>
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Service Location
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm font-black text-white">
                  <span>📍</span>

                  <span>
                    {provider.city || "Kathmandu"}
                    {provider.district
                      ? `, ${provider.district}`
                      : ""}
                  </span>
                </p>

                {provider.address && (
                  <p className="mt-2 text-xs font-medium text-slate-500">
                    {provider.address}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="h-fit rounded-2xl border border-white/5 bg-slate-950/40 p-6 shadow-2xl">
              <div className="mb-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Service Actions
                </p>

                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-400">
                  Choose how you want to work with this provider.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleOpenChat}
                  className="w-full h-11 rounded-xl border border-white/5 bg-white/5 text-xs font-bold uppercase tracking-wider text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  Chat Now
                </button>

                <button
                  type="button"
                  onClick={handleOpenBooking}
                  className="w-full h-11 rounded-xl border border-white/5 bg-white/5 text-xs font-bold uppercase tracking-wider text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  Book Service
                </button>

                <button
                  type="button"
                  onClick={handleInstantHire}
                  className="w-full h-11 rounded-xl bg-blue-600 text-xs font-black uppercase tracking-widest text-white transition-all duration-300 hover:bg-blue-500 hover:scale-[1.02] hover:shadow-[0_4px_25px_rgba(59,130,246,0.35)] focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                >
                  Instant Hire →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Chat Modal */}
        {isChatModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-modal-title"
          >
            <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
              <button
                type="button"
                onClick={() => {
                  setIsChatModalOpen(false);
                  setActionError("");
                  setChatMessage("");
                }}
                className="absolute right-4 top-4 text-slate-500 transition hover:text-white focus:outline-none"
                aria-label="Close chat dialog"
              >
                ✕
              </button>

              <div className="pr-8">
                <h2
                  id="chat-modal-title"
                  className="text-base font-black text-white"
                >
                  Direct Conversation
                </h2>

                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  Messaging for{" "}
                  <span className="font-bold text-white">
                    {provider.displayName}
                  </span>{" "}
                  will be available once the chat service is enabled.
                </p>
              </div>

              {actionError && (
                <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs font-medium leading-relaxed text-amber-300">
                  {actionError}
                </div>
              )}

              <form
                onSubmit={handleChatSubmit}
                className="mt-5 space-y-4"
              >
                <div>
                  <label
                    htmlFor="chat-message"
                    className="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                  >
                    Your Message
                  </label>

                  <textarea
                    id="chat-message"
                    placeholder="Hello, I need help with a service..."
                    value={chatMessage}
                    onChange={(event) => {
                      setChatMessage(event.target.value);
                      setActionError("");
                    }}
                    className="mt-1.5 h-24 w-full resize-none rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-white outline-none placeholder:text-white/20 focus:border-blue-500/40"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-10 rounded-xl bg-blue-600 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-blue-500"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {isBookModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
          >
            <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
              <button
                type="button"
                onClick={() => {
                  if (!actionLoading) {
                    setIsBookModalOpen(false);
                    resetBookingForm();
                  }
                }}
                disabled={actionLoading}
                className="absolute right-4 top-4 text-slate-500 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none"
                aria-label="Close booking dialog"
              >
                ✕
              </button>

              {actionSuccess ? (
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-xl text-emerald-400">
                    ✓
                  </div>

                  <h2 className="mt-4 text-base font-black text-white">
                    Booking Created Successfully
                  </h2>

                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    Your scheduled service request has been submitted.
                  </p>
                </div>
              ) : (
                <>
                  <div className="pr-8">
                    <h2
                      id="booking-modal-title"
                      className="text-base font-black text-white"
                    >
                      Schedule Service
                    </h2>

                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      Book a service with{" "}
                      <span className="font-bold text-white">
                        {provider.displayName}
                      </span>
                      .
                    </p>
                  </div>

                  {actionError && (
                    <div
                      className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs font-medium leading-relaxed text-red-300"
                      role="alert"
                    >
                      {actionError}
                    </div>
                  )}

                  <form
                    onSubmit={handleScheduleSubmit}
                    className="mt-5 space-y-4"
                  >
                    {/* Date + Time */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label
                          htmlFor="schedule-date"
                          className="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                        >
                          Service Date
                        </label>

                        <input
                          id="schedule-date"
                          type="date"
                          required
                          min={new Date()
                            .toISOString()
                            .split("T")[0]}
                          value={scheduleDate}
                          onChange={(event) => {
                            setScheduleDate(event.target.value);
                            setActionError("");
                          }}
                          className="w-full h-10 rounded-xl border border-white/10 bg-black/40 px-3 text-xs text-white outline-none focus:border-blue-500/40 [color-scheme:dark]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="schedule-time"
                          className="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                        >
                          Service Time
                        </label>

                        <input
                          id="schedule-time"
                          type="time"
                          required
                          value={scheduleTime}
                          onChange={(event) => {
                            setScheduleTime(event.target.value);
                            setActionError("");
                          }}
                          className="w-full h-10 rounded-xl border border-white/10 bg-black/40 px-3 text-xs text-white outline-none focus:border-blue-500/40 [color-scheme:dark]"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <label
                        htmlFor="job-description"
                        className="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                      >
                        Job Description
                      </label>

                      <textarea
                        id="job-description"
                        required
                        minLength={5}
                        placeholder="Describe the work you need..."
                        value={jobDescription}
                        onChange={(event) => {
                          setJobDescription(event.target.value);
                          setActionError("");
                        }}
                        className="h-24 w-full resize-none rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-white outline-none placeholder:text-white/20 focus:border-blue-500/40"
                      />
                    </div>

                    {/* Estimated Budget */}
                    <div className="rounded-xl border border-white/5 bg-black/20 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Estimated Budget
                        </span>

                        <span className="text-sm font-black text-white">
                          Rs{" "}
                          {(
                            Number(provider.hourlyRate || 500) * 2
                          ).toLocaleString()}
                        </span>
                      </div>

                      <p className="mt-1 text-[10px] text-slate-600">
                        Estimated for a 2-hour service.
                      </p>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="w-full h-11 rounded-xl bg-blue-600 text-xs font-black uppercase tracking-wider text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {actionLoading
                        ? "Creating Booking..."
                        : "Confirm Scheduled Booking"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}