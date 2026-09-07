import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { useRouter } from "next/router";
import { api } from "@/lib/api";

interface Provider {
  id: string;
  displayName?: string;
  headline?: string;
  bio?: string;
  avatarUrl?: string;
  city?: string;
  district?: string;
  hourlyRate?: number;
  rating?: number;
  completedJobsCount?: number;
}

interface ProviderListResponse {
  providers?: Provider[];
  data?: {
    providers?: Provider[];
  };
}

interface StoredUser {
  id?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface BookingResponse {
  success?: boolean;
  message?: string;
  id?: string;
  data?: {
    id?: string;
    message?: string;
  };
}

export default function ProvidersPage() {
  const router = useRouter();

  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // ---------------------------------------------------------
  // Filter States
  // ---------------------------------------------------------

  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState(2500);

  // ---------------------------------------------------------
  // Booking Modal States
  // ---------------------------------------------------------

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetProviderId, setTargetProviderId] = useState("");
  const [targetProviderName, setTargetProviderName] = useState("");

  const [serviceType, setServiceType] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobBudget, setJobBudget] = useState(500);

  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // ---------------------------------------------------------
  // Load Providers
  // ---------------------------------------------------------

  useEffect(() => {
    let isMounted = true;

    const loadProviders = async () => {
      try {
        setLoading(true);
        setLoadError("");

        const response = await api.providers.list({
          page: 1,
          limit: 100,
        });

        if (!isMounted) {
          return;
        }

        const data = response as ProviderListResponse;

        const list =
          data?.data?.providers ??
          data?.providers ??
          [];

        setProviders(Array.isArray(list) ? list : []);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error("Failed to load providers:", error);

        setProviders([]);

        setLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load service providers."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadProviders();

    return () => {
      isMounted = false;
    };
  }, []);

  // ---------------------------------------------------------
  // Query Parameter -> Instant Hire Modal
  // ---------------------------------------------------------

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const hireQuery = router.query.hire;
    const nameQuery = router.query.name;

    if (!hireQuery) {
      return;
    }

    const providerId = Array.isArray(hireQuery)
      ? hireQuery[0]
      : hireQuery;

    if (!providerId) {
      return;
    }

    let providerName = "Provider";

    if (nameQuery) {
      const rawName = Array.isArray(nameQuery)
        ? nameQuery[0]
        : nameQuery;

      if (rawName) {
        try {
          providerName = decodeURIComponent(rawName);
        } catch {
          providerName = rawName;
        }
      }
    }

    setTargetProviderId(providerId);
    setTargetProviderName(providerName);
    setBookingError("");
    setBookingSuccess(false);
    setIsModalOpen(true);
  }, [router.isReady, router.query]);

  // ---------------------------------------------------------
  // Provider Filtering
  // ---------------------------------------------------------

  const filteredProviders = useMemo(() => {
    return providers.filter((worker) => {
      // Category filter
      if (selectedCategory !== "ALL") {
        const headlineStr = (worker.headline || "").toUpperCase();
        const nameStr = (worker.displayName || "").toUpperCase();
        const targetCategory = selectedCategory.toUpperCase();

        const isElectricianMatch =
          targetCategory === "ELECTRICIAN" &&
          (
            headlineStr.includes("ELECT") ||
            nameStr.includes("ELECT") ||
            headlineStr.includes("WIRING")
          );

        const isPlumberMatch =
          targetCategory === "PLUMBER" &&
          (
            headlineStr.includes("PLUMB") ||
            nameStr.includes("PLUMB") ||
            headlineStr.includes("PIPE")
          );

        const isCarpenterMatch =
          targetCategory === "CARPENTER" &&
          (
            headlineStr.includes("CARP") ||
            nameStr.includes("CARP") ||
            headlineStr.includes("WOOD")
          );

        const genericMatch =
          headlineStr.includes(targetCategory);

        if (
          !isElectricianMatch &&
          !isPlumberMatch &&
          !isCarpenterMatch &&
          !genericMatch
        ) {
          return false;
        }
      }

      // Location filter
      if (selectedLocation.trim() !== "") {
        const cityStr = (worker.city || "").toUpperCase();
        const districtStr = (worker.district || "").toUpperCase();
        const inputStr = selectedLocation
          .toUpperCase()
          .trim();

        const locationMatches =
          cityStr.includes(inputStr) ||
          districtStr.includes(inputStr);

        if (!locationMatches) {
          return false;
        }
      }

      // Hourly rate filter
      const rate =
        typeof worker.hourlyRate === "number"
          ? worker.hourlyRate
          : 500;

      return rate <= maxPrice;
    });
  }, [
    providers,
    selectedCategory,
    selectedLocation,
    maxPrice,
  ]);

  // ---------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------

  const getInitials = (name?: string) => {
    const normalizedName = (name || "Expert").trim();

    if (!normalizedName) {
      return "EX";
    }

    return normalizedName
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const resetBookingForm = () => {
    setServiceType("");
    setJobDescription("");
    setJobBudget(500);
    setScheduledDate("");
    setScheduledTime("");
    setBookingError("");
    setBookingSuccess(false);
    setTargetProviderId("");
    setTargetProviderName("");
  };

  const closeBookingModal = () => {
    if (bookingLoading) {
      return;
    }

    setIsModalOpen(false);
    resetBookingForm();

    void router.replace(
      "/providers",
      undefined,
      {
        shallow: true,
      }
    );
  };

  // ---------------------------------------------------------
  // Booking Submission
  // ---------------------------------------------------------

  const handleBookingSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (bookingLoading) {
      return;
    }

    setBookingError("");

    // Authentication check
    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem(
            "kamdarnepal_token"
          )
        : null;

    if (!token) {
      await router.push("/login");
      return;
    }

    // Read logged-in user
    const rawUser =
      typeof window !== "undefined"
        ? window.localStorage.getItem("user")
        : null;

    if (!rawUser) {
      setBookingError(
        "Your session information is missing. Please log in again."
      );
      return;
    }

    let parsedUser: StoredUser;

    try {
      const parsed = JSON.parse(rawUser);

      parsedUser =
        parsed?.user &&
        typeof parsed.user === "object"
          ? parsed.user
          : parsed;
    } catch (error) {
      console.error(
        "Failed to parse stored user:",
        error
      );

      setBookingError(
        "Your login session is invalid. Please log in again."
      );

      return;
    }

    const customerId = parsedUser?.id;
    const role = String(
      parsedUser?.role || ""
    ).toUpperCase();

    // Never use a fake customer ID
    if (!customerId) {
      setBookingError(
        "Unable to identify your customer account. Please log in again."
      );
      return;
    }

    // Customer-only booking
    if (role && role !== "CUSTOMER") {
      setBookingError(
        "Only customer accounts can create service bookings."
      );
      return;
    }

    if (!targetProviderId) {
      setBookingError(
        "Please select a valid service provider."
      );
      return;
    }

    // Service type validation
    const trimmedServiceType =
      serviceType.trim();

    if (!trimmedServiceType) {
      setBookingError(
        "Please select the type of service you need."
      );
      return;
    }

    // Description validation
    const trimmedDescription =
      jobDescription.trim();

    if (trimmedDescription.length < 10) {
      setBookingError(
        "Please provide at least 10 characters describing the job."
      );
      return;
    }

    // Budget validation
    if (
      !Number.isFinite(jobBudget) ||
      jobBudget < 500
    ) {
      setBookingError(
        "The minimum booking budget is Rs 500."
      );
      return;
    }

    // Date validation
    if (!scheduledDate) {
      setBookingError(
        "Please select a service date."
      );
      return;
    }

    // Time validation
    if (!scheduledTime) {
      setBookingError(
        "Please select a service time."
      );
      return;
    }

    // Build scheduled date/time
    const scheduledAtDate = new Date(
      `${scheduledDate}T${scheduledTime}`
    );

    if (
      Number.isNaN(
        scheduledAtDate.getTime()
      )
    ) {
      setBookingError(
        "Please provide a valid scheduled date and time."
      );
      return;
    }

    // Prevent past booking
    if (scheduledAtDate.getTime() <= Date.now()) {
      setBookingError(
        "Please select a future date and time."
      );
      return;
    }

    setBookingLoading(true);

    try {
      const bookingPayload = {
        customerId,
        providerId: targetProviderId,
        serviceType: trimmedServiceType,
        description: trimmedDescription,
        budget: jobBudget,
        scheduledAt:
          scheduledAtDate.toISOString(),
      };

      const response =
        await api.bookings.create(
          bookingPayload
        );

      const responseData =
        response as BookingResponse;

      const bookingId =
        responseData?.data?.id ??
        responseData?.id;

      const success =
        responseData?.success === true ||
        Boolean(bookingId);

      if (!success) {
        throw new Error(
          responseData?.message ||
            responseData?.data?.message ||
            "Booking request could not be created."
        );
      }

      setBookingSuccess(true);

      window.setTimeout(() => {
        setIsModalOpen(false);
        resetBookingForm();

        void router.push(
          "/dashboard/customer"
        );
      }, 1800);
    } catch (error) {
      console.error(
        "Booking creation failed:",
        error
      );

      setBookingError(
        error instanceof Error
          ? error.message
          : "Unable to create the booking request. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Render
  // ---------------------------------------------------------

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-6 py-10 selection:bg-blue-500/30">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-tight text-white">
            Explore Talent{" "}
            <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              Marketplace
            </span>
          </h1>

          <p className="mt-2 text-sm text-white/50 font-medium">
            Discover and connect directly with production-vetted,
            real-time verified local service experts near you.
          </p>
        </div>

        {/* Filters + Provider Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters */}
          <aside className="bg-slate-900/40 border border-white/5 p-5 rounded-2xl h-fit backdrop-blur-md shadow-2xl space-y-5">
            <h2 className="text-xs font-bold text-white/80 uppercase tracking-widest border-b border-white/5 pb-2">
              Advanced Filters
            </h2>

            {/* Category */}
            <div className="space-y-1.5">
              <label
                htmlFor="provider-category"
                className="text-[10px] font-black text-white/30 uppercase tracking-wider block"
              >
                Work Category
              </label>

              <select
                id="provider-category"
                value={selectedCategory}
                onChange={(event) =>
                  setSelectedCategory(
                    event.target.value
                  )
                }
                className="w-full h-10 bg-slate-950 border border-white/10 rounded-xl text-xs text-white px-3 focus:border-blue-500/50 outline-none cursor-pointer transition-colors"
              >
                <option
                  value="ALL"
                  className="bg-slate-900 text-white"
                >
                  All Categories
                </option>

                <option
                  value="ELECTRICIAN"
                  className="bg-slate-900 text-white"
                >
                  Electrician
                </option>

                <option
                  value="PLUMBER"
                  className="bg-slate-900 text-white"
                >
                  Plumber
                </option>

                <option
                  value="CARPENTER"
                  className="bg-slate-900 text-white"
                >
                  Carpenter
                </option>
              </select>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label
                htmlFor="provider-location"
                className="text-[10px] font-black text-white/30 uppercase tracking-wider block"
              >
                Target Location / City
              </label>

              <input
                id="provider-location"
                type="text"
                placeholder="e.g. Kathmandu, Lalitpur"
                value={selectedLocation}
                onChange={(event) =>
                  setSelectedLocation(
                    event.target.value
                  )
                }
                className="w-full h-10 bg-slate-950 border border-white/10 rounded-xl text-xs text-white px-3 placeholder:text-white/20 focus:border-blue-500/50 outline-none transition-colors"
              />
            </div>

            {/* Max Price */}
            <div className="space-y-1.5">
              <label
                htmlFor="max-price"
                className="text-[10px] font-black text-white/30 uppercase tracking-wider block"
              >
                Max Hourly Rate (Rs.)
              </label>

              <div className="flex justify-between text-[11px] font-mono text-blue-400 font-bold">
                <span>Rs 200</span>
                <span>
                  Rs {maxPrice}
                </span>
              </div>

              <input
                id="max-price"
                type="range"
                min="200"
                max="2500"
                step="50"
                value={maxPrice}
                onChange={(event) =>
                  setMaxPrice(
                    Number(event.target.value)
                  )
                }
                className="w-full accent-blue-500 cursor-pointer bg-white/5 h-1 rounded-lg transition-all"
              />
            </div>
          </aside>

          {/* Provider Grid */}
          <section
            className="md:col-span-3"
            aria-live="polite"
          >
            {/* Loading */}
            {loading ? (
              <div className="text-xs font-mono tracking-widest text-white/20 uppercase py-12 text-center animate-pulse">
                Synchronizing available workforce matrix registries...
              </div>
            ) : loadError ? (
              /* Error */
              <div className="border border-red-500/20 rounded-2xl bg-red-500/[0.04] px-6 py-12 text-center">
                <div className="text-red-400 text-sm font-bold mb-2">
                  Unable to load service providers
                </div>

                <p className="text-xs text-white/40 max-w-md mx-auto">
                  {loadError}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    window.location.reload()
                  }
                  className="mt-5 h-9 px-4 bg-white/5 border border-white/10 text-white/80 rounded-xl text-xs font-bold hover:bg-white/10 transition-all"
                >
                  Retry
                </button>
              </div>
            ) : filteredProviders.length ===
              0 ? (
              /* Empty */
              <div className="text-xs font-mono tracking-widest text-white/30 uppercase py-16 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                No service providers match your current parameter filters.
              </div>
            ) : (
              /* Results */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredProviders.map(
                  (worker) => {
                    const initials =
                      getInitials(
                        worker.displayName
                      );

                    const providerId =
                      worker.id;

                    const rating =
                      typeof worker.rating ===
                      "number"
                        ? worker.rating
                        : 4.8;

                    const completedJobs =
                      typeof worker.completedJobsCount ===
                      "number"
                        ? worker.completedJobsCount
                        : 0;

                    const hourlyRate =
                      typeof worker.hourlyRate ===
                      "number"
                        ? worker.hourlyRate
                        : 500;

                    return (
                      <div
                        key={providerId}
                        className="bg-slate-900/20 border border-white/5 p-6 rounded-2xl hover:border-blue-500/20 hover:bg-slate-900/40 hover:shadow-[0_20px_50px_rgba(59,130,246,0.06)] transition-all duration-300 group flex flex-col justify-between relative overflow-hidden backdrop-blur-md"
                      >
                        {/* Ribbon */}
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-cyan-500 text-[9px] font-black tracking-widest text-white uppercase px-3 py-1 rounded-bl-xl shadow-md select-none">
                          {rating >= 4.9
                            ? "★ TOP RATED"
                            : "✓ VETTED"}
                        </div>

                        <div>
                          {/* Provider Header */}
                          <div className="flex items-start gap-4">
                            <div className="relative flex-shrink-0">
                              <div className="w-14 h-14 rounded-2xl border border-white/10 overflow-hidden bg-slate-950 flex items-center justify-center group-hover:border-blue-500/30 transition-colors duration-300 shadow-inner">
                                {worker.avatarUrl ? (
                                  <img
                                    src={
                                      worker.avatarUrl
                                    }
                                    alt={
                                      worker.displayName ||
                                      "Service provider"
                                    }
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                  />
                                ) : (
                                  <span className="text-sm font-black tracking-wider text-blue-400 bg-blue-500/10 w-full h-full flex items-center justify-center select-none">
                                    {
                                      initials
                                    }
                                  </span>
                                )}
                              </div>

                              <span
                                className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full"
                                aria-label="Available provider"
                                title="Available"
                              />
                            </div>

                            <div className="min-w-0 flex-1 pr-6">
                              <h3 className="text-base font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                                {worker.displayName ||
                                  "Service Professional"}
                              </h3>

                              <p className="text-xs text-white/50 truncate mt-0.5">
                                {worker.headline ||
                                  "Service Technician"}
                              </p>

                              <div className="flex items-center gap-3 mt-3 text-[11px] text-white/60 font-medium flex-wrap">
                                <span className="flex items-center gap-1 text-amber-400 font-bold">
                                  ★{" "}
                                  {rating.toFixed(
                                    1
                                  )}
                                </span>

                                <span>
                                  •
                                </span>

                                <span>
                                  {
                                    completedJobs
                                  }{" "}
                                  Jobs Done
                                </span>

                                <span>
                                  •
                                </span>

                                <span className="truncate">
                                  📍{" "}
                                  {worker.city ||
                                    "Nepal"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-white/30 tracking-wider block">
                              Hourly Rate
                            </span>

                            <span className="text-sm font-black text-white font-mono">
                              Rs{" "}
                              {
                                hourlyRate
                              }

                              <span className="text-xs text-white/40 font-normal">
                                /hr
                              </span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Profile */}
                            <button
                              type="button"
                              onClick={() =>
                                router.push(
                                  `/providers/${providerId}`
                                )
                              }
                              className="h-9 px-3.5 bg-white/5 text-white/80 border border-white/5 rounded-xl text-xs font-bold transition-all duration-200 hover:bg-white/10 hover:text-white"
                            >
                              Profile
                            </button>

                            {/* Hire */}
                            <button
                              type="button"
                              onClick={() => {
                                setTargetProviderId(
                                  providerId
                                );

                                setTargetProviderName(
                                  worker.displayName ||
                                    "Provider"
                                );

                                setBookingError(
                                  ""
                                );

                                setBookingSuccess(
                                  false
                                );

                                setIsModalOpen(
                                  true
                                );
                              }}
                              className="h-9 px-4 bg-blue-600 text-white rounded-xl text-xs font-black transition-all duration-300 hover:bg-blue-500 hover:scale-[1.03] hover:shadow-[0_4px_25px_rgba(59,130,246,0.35)]"
                            >
                              Instant Hire →
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* -----------------------------------------------------
          Booking Modal
      ----------------------------------------------------- */}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
        >
          <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl my-8">
            {/* Close */}
            <button
              type="button"
              onClick={closeBookingModal}
              disabled={bookingLoading}
              aria-label="Close booking dialog"
              className="absolute top-4 right-4 text-white/40 hover:text-white text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ✕
            </button>

            {bookingSuccess ? (
              /* Success State */
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>

                <h3 className="text-base font-bold text-white">
                  Hiring Request Sent Successfully
                </h3>

                <p className="text-xs text-white/50">
                  Your booking request has been securely submitted.
                  Redirecting you to your customer dashboard...
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleBookingSubmit}
                className="space-y-4"
              >
                {/* Heading */}
                <div className="pr-8">
                  <h3
                    id="booking-modal-title"
                    className="text-base font-bold text-white"
                  >
                    Initialize Instant Dispatch
                  </h3>

                  <p className="text-xs text-white/50 mt-1">
                    Booking request for{" "}
                    <span className="text-blue-400 font-bold">
                      {targetProviderName}
                    </span>
                  </p>
                </div>

                {/* Booking Error */}
                {bookingError && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-xs text-red-300"
                  >
                    {bookingError}
                  </div>
                )}

                {/* Service Type */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="service-type"
                    className="text-[10px] font-black text-white/30 uppercase tracking-wider block"
                  >
                    Service Type
                  </label>

                  <select
                    id="service-type"
                    required
                    value={serviceType}
                    onChange={(event) =>
                      setServiceType(
                        event.target.value
                      )
                    }
                    className="w-full h-10 bg-black/40 text-white border border-white/10 rounded-xl px-3 text-xs outline-none focus:border-blue-500/40"
                  >
                    <option
                      value=""
                      className="bg-slate-900"
                    >
                      Select service
                    </option>

                    <option
                      value="Electrician"
                      className="bg-slate-900"
                    >
                      Electrician
                    </option>

                    <option
                      value="Plumber"
                      className="bg-slate-900"
                    >
                      Plumber
                    </option>

                    <option
                      value="Carpenter"
                      className="bg-slate-900"
                    >
                      Carpenter
                    </option>

                    <option
                      value="Painter"
                      className="bg-slate-900"
                    >
                      Painter
                    </option>

                    <option
                      value="Cleaning"
                      className="bg-slate-900"
                    >
                      Cleaning
                    </option>

                    <option
                      value="Appliance Repair"
                      className="bg-slate-900"
                    >
                      Appliance Repair
                    </option>

                    <option
                      value="Other"
                      className="bg-slate-900"
                    >
                      Other
                    </option>
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="job-description"
                    className="text-[10px] font-black text-white/30 uppercase tracking-wider block"
                  >
                    Job Description Brief
                  </label>

                  <textarea
                    id="job-description"
                    required
                    minLength={10}
                    placeholder="Describe the service you require..."
                    value={jobDescription}
                    onChange={(event) =>
                      setJobDescription(
                        event.target.value
                      )
                    }
                    className="w-full h-24 bg-black/40 text-white border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-blue-500/40 resize-none placeholder:text-white/20"
                  />

                  <p className="text-[10px] text-white/20">
                    Minimum 10 characters.
                  </p>
                </div>

                {/* Schedule */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Date */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="scheduled-date"
                      className="text-[10px] font-black text-white/30 uppercase tracking-wider block"
                    >
                      Service Date
                    </label>

                    <input
                      id="scheduled-date"
                      type="date"
                      required
                      min={getTodayDate()}
                      value={scheduledDate}
                      onChange={(event) =>
                        setScheduledDate(
                          event.target.value
                        )
                      }
                      className="w-full h-10 bg-black/40 text-white border border-white/10 rounded-xl px-3 text-xs outline-none focus:border-blue-500/40"
                    />
                  </div>

                  {/* Time */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="scheduled-time"
                      className="text-[10px] font-black text-white/30 uppercase tracking-wider block"
                    >
                      Service Time
                    </label>

                    <input
                      id="scheduled-time"
                      type="time"
                      required
                      value={scheduledTime}
                      onChange={(event) =>
                        setScheduledTime(
                          event.target.value
                        )
                      }
                      className="w-full h-10 bg-black/40 text-white border border-white/10 rounded-xl px-3 text-xs outline-none focus:border-blue-500/40"
                    />
                  </div>
                </div>

                {/* Budget */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="job-budget"
                    className="text-[10px] font-black text-white/30 uppercase tracking-wider block"
                  >
                    Offered Contract Budget (Rs.)
                  </label>

                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-white/30 font-bold">
                      Rs.
                    </span>

                    <input
                      id="job-budget"
                      type="number"
                      required
                      min={500}
                      step={50}
                      value={jobBudget}
                      onChange={(event) =>
                        setJobBudget(
                          Number(
                            event.target.value
                          )
                        )
                      }
                      className="w-full h-10 bg-black/40 text-white border border-white/10 rounded-xl pl-10 pr-4 text-xs outline-none focus:border-blue-500/40 font-mono"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeBookingModal}
                    disabled={bookingLoading}
                    className="h-10 flex-1 bg-white/5 border border-white/5 text-white/80 rounded-xl text-xs font-bold transition-all hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="h-10 flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bookingLoading
                      ? "Dispatching..."
                      : "Confirm & Dispatch →"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </MainLayout>
  );
}