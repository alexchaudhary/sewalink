import React, { useState, useEffect, useMemo } from "react";
import MainLayout from "@/components/MainLayout";
import { useRouter } from "next/router";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const fetcher = async (url: string) => {
  const token = typeof window !== "undefined" ? window.localStorage.getItem("kamdarnepal_token") : null;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  try {
    const res = await fetch(url, { headers });
    return await res.json();
  } catch (error) {
    console.error("Network infrastructure error:", error);
    return null;
  }
};

export default function ProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Multi-Parametric Filter States
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState(2500);

  // Booking Modal States Tracker Matrix
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetProviderId, setTargetProviderId] = useState("");
  const [targetProviderName, setTargetProviderName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobBudget, setJobBudget] = useState(500);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Fetch Providers Data
  useEffect(() => {
    let isMounted = true;
    fetcher(`${BASE_API_URL}/providers`)
      .then((res) => {
        if (!isMounted) return;
        const list = res?.data?.providers || res?.providers || [];
        setProviders(list);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Infrastructure pipeline failure:", err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for Query Parameters for Instant Modal Trigger
  useEffect(() => {
    if (router.isReady) {
      const { hire, name } = router.query;
      if (hire && name) {
        setTargetProviderId(hire as string);
        setTargetProviderName(decodeURIComponent(name as string));
        setIsModalOpen(true);
      }
    }
  }, [router.isReady, router.query]);

  // Filtering Engine
  const filteredProviders = useMemo(() => {
    return providers.filter((worker) => {
      if (selectedCategory !== "ALL") {
        const headlineStr = (worker.headline || "").toUpperCase();
        const nameStr = (worker.displayName || "").toUpperCase();
        const targetCategory = selectedCategory.toUpperCase();
        
        const isElectricianMatch = targetCategory === "ELECTRICIAN" && (headlineStr.includes("ELECT") || nameStr.includes("ELECT") || headlineStr.includes("WIRING"));
        const isPlumberMatch = targetCategory === "PLUMBER" && (headlineStr.includes("PLUMB") || nameStr.includes("PLUMB") || headlineStr.includes("PIPE"));
        const isCarpenterMatch = targetCategory === "CARPENTER" && (headlineStr.includes("CARP") || nameStr.includes("CARP") || headlineStr.includes("WOOD"));

        if (!isElectricianMatch && !isPlumberMatch && !isCarpenterMatch && !headlineStr.includes(targetCategory)) {
          return false;
        }
      }

      if (selectedLocation.trim() !== "") {
        const cityStr = (worker.city || "").toUpperCase();
        const inputStr = selectedLocation.toUpperCase().trim();
        if (!cityStr.includes(inputStr)) {
          return false;
        }
      }

      const rate = worker.hourlyRate ?? 500;
      return rate <= maxPrice;
    });
  }, [providers, selectedCategory, selectedLocation, maxPrice]);

  // Dispatch Booking Payload
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    
    const token = typeof window !== "undefined" ? window.localStorage.getItem("kamdarnepal_token") : null;
    const rawUser = typeof window !== "undefined" ? window.localStorage.getItem("user") : null;
    
    if (!token) {
      alert("Please login first to dispatch job request packets.");
      router.push("/login");
      setBookingLoading(false);
      return;
    }

    try {
      let parsedUserId = "";
      if (rawUser) {
        try {
          const parsed = JSON.parse(rawUser);
          parsedUserId = parsed?.id || parsed?.user?.id || "";
        } catch (err) {
          console.error("User payload parsing fallback activated:", err);
        }
      }

      const finalCustomerId = parsedUserId || "TEMP_CUSTOMER_NODE_ID";

      const bookingPayload = {
        customerId: finalCustomerId,
        providerId: targetProviderId,
        description: jobDescription,
        budget: jobBudget,
        date: new Date()
      };

      const res = await fetch(`${BASE_API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(bookingPayload)
      });

      const responseData = await res.json();
      if (res.ok && (responseData.success || responseData.id)) {
        setBookingSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setBookingSuccess(false);
          setJobDescription("");
          router.push("/dashboard/customer");
        }, 2000);
      } else {
        alert(responseData.message || "Prisma database verification rejected payload layout.");
      }
    } catch (err) {
      console.error("Booking transactional thread failed:", err);
      alert("Failed connection mesh boundaries to dispatch pipeline requests.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-6 py-10 selection:bg-blue-500/30">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-tight text-white">
            Explore Talent <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">Marketplace</span>
          </h1>
          <p className="mt-2 text-sm text-white/50 font-medium">
            Discover and connect directly with production-vetted, real-time verified local service experts near you.
          </p>
        </div>

        {/* Filters Matrix Setup */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <aside className="bg-slate-900/40 border border-white/5 p-5 rounded-2xl h-fit backdrop-blur-md shadow-2xl space-y-5">
            <h2 className="text-xs font-bold text-white/80 uppercase tracking-widest border-b border-white/5 pb-2">
              Advanced Filters
            </h2>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-wider block">
                Work Category
              </label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-10 bg-slate-950 border border-white/10 rounded-xl text-xs text-white px-3 focus:border-blue-500/50 outline-none cursor-pointer transition-colors"
              >
                <option value="ALL" className="bg-slate-900 text-white font-medium p-2">All Categories</option>
                <option value="ELECTRICIAN" className="bg-slate-900 text-white font-medium p-2">Electrician</option>
                <option value="PLUMBER" className="bg-slate-900 text-white font-medium p-2">Plumber</option>
                <option value="CARPENTER" className="bg-slate-900 text-white font-medium p-2">Carpenter</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-wider block">
                Target Location / City
              </label>
              <input 
                type="text"
                placeholder="e.g. Kathmandu, Lalitpur"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full h-10 bg-slate-950 border border-white/10 rounded-xl text-xs text-white px-3 placeholder:text-white/20 focus:border-blue-500/50 outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-wider block">
                Max Hourly Rate (Rs.)
              </label>
              <div className="flex justify-between text-[11px] font-mono text-blue-400 font-bold">
                <span>Rs 200</span>
                <span>Rs {maxPrice}</span>
              </div>
              <input 
                type="range" 
                min="200" 
                max="2500" 
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer bg-white/5 h-1 rounded-lg transition-all"
              />
            </div>
          </aside>

          {/* Render Workforce Grid */}
          <section className="md:col-span-3">
            {loading ? (
              <div className="text-xs font-mono tracking-widest text-white/20 uppercase py-12 text-center animate-pulse">
                Synchronizing available workforce matrix registries...
              </div>
            ) : filteredProviders.length === 0 ? (
              <div className="text-xs font-mono tracking-widest text-white/30 uppercase py-16 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                No service providers match your current parameter filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredProviders.map((worker: any, index: number) => {
                  const initials = (worker.displayName || "Expert")
                    .trim()
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <div 
                      key={worker.id || worker._id || index}
                      className="bg-slate-900/20 border border-white/5 p-6 rounded-2xl hover:border-blue-500/20 hover:bg-slate-900/40 hover:shadow-[0_20px_50px_rgba(59,130,246,0.06)] transition-all duration-300 group flex flex-col justify-between relative overflow-hidden backdrop-blur-md"
                    >
                      {/* Ribbon Badge */}
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-cyan-500 text-[9px] font-black tracking-widest text-white uppercase px-3 py-1 rounded-bl-xl shadow-md select-none">
                        {worker.rating && Number(worker.rating) >= 4.9 ? "★ TOP RATED" : "✓ VETTED"}
                      </div>

                      <div>
                        <div className="flex items-start gap-4">
                          <div className="relative flex-shrink-0">
                            <div className="w-14 h-14 rounded-2xl border border-white/10 overflow-hidden bg-slate-950 flex items-center justify-center group-hover:border-blue-500/30 transition-colors duration-300 shadow-inner">
                              {worker.avatarUrl ? (
                                <img 
                                  src={worker.avatarUrl} 
                                  alt={worker.displayName || "Provider"} 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <span className="text-sm font-black tracking-wider text-blue-400 bg-blue-500/10 w-full h-full flex items-center justify-center select-none">
                                  {initials}
                                </span>
                              )}
                            </div>
                            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
                          </div>

                          <div className="min-w-0 flex-1 pr-6">
                            <h3 className="text-base font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                              {worker.displayName || "Service Professional"}
                            </h3>
                            <p className="text-xs text-white/50 truncate mt-0.5">
                              {worker.headline || "Technician"}
                            </p>
                            
                            <div className="flex items-center gap-3 mt-3 text-[11px] text-white/60 font-medium">
                              <span className="flex items-center gap-1 text-amber-400 font-bold">
                                ★ {worker.rating ? Number(worker.rating).toFixed(1) : "4.8"}
                              </span>
                              <span>•</span>
                              <span>{worker.completedJobsCount || "0"} Jobs Done</span>
                              <span>•</span>
                              <span className="truncate">📍 {worker.city || "Nepal"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-white/30 tracking-wider block">
                            Hourly Rate
                          </span>
                          <span className="text-sm font-black text-white font-mono">
                            Rs {worker.hourlyRate || "500"}<span className="text-xs text-white/40 font-normal">/hr</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            type="button"
                            onClick={() => router.push(`/providers/${worker.id || worker._id}`)} 
                            className="h-9 px-3.5 bg-white/5 text-white/80 border border-white/5 rounded-xl text-xs font-bold transition-all duration-200 hover:bg-white/10 hover:text-white"
                          >
                            Profile
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTargetProviderId(worker.id || worker._id);
                              setTargetProviderName(worker.displayName || "Provider");
                              setIsModalOpen(true);
                            }}
                            className="h-9 px-4 bg-blue-600 text-white rounded-xl text-xs font-black transition-all duration-300 hover:bg-blue-500 hover:scale-[1.03] hover:shadow-[0_4px_25px_rgba(59,130,246,0.35)]"
                          >
                            Instant Hire →
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

        </div>
      </div>

      {/* Dynamic Modal Box Layer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                router.replace("/providers", undefined, { shallow: true });
              }}
              className="absolute top-4 right-4 text-white/40 hover:text-white text-sm font-bold"
            >
              ✕
            </button>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h3 className="text-base font-bold text-white">Hiring Pipeline Dispatch Successful</h3>
                <p className="text-xs text-white/50">Your transaction has been securely committed into database nodes.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white">Initialize Instant Dispatch</h3>
                  <p className="text-xs text-white/50 mt-1">
                    Booking request node anchor: <span className="text-blue-400 font-bold">{targetProviderName}</span>
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-wider block">
                    Job Description Brief
                  </label>
                  <textarea
                    required
                    placeholder="Describe what specific emergency help you require right now..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full h-24 bg-black/40 text-white border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-blue-500/40 resize-none placeholder:text-white/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-wider block">
                    Offered Contract Budget (Rs.)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-white/30 font-bold">Rs.</span>
                    <input
                      type="number"
                      required
                      min={500}
                      value={jobBudget}
                      onChange={(e) => setJobBudget(Number(e.target.value))}
                      className="w-full h-10 bg-black/40 text-white border border-white/10 rounded-xl pl-10 pr-4 text-xs outline-none focus:border-blue-500/40 font-mono"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      router.replace("/providers", undefined, { shallow: true });
                    }}
                    className="h-10 flex-1 bg-white/5 border border-white/5 text-white/80 rounded-xl text-xs font-bold transition-all hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="h-10 flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                  >
                    {bookingLoading ? "Dispatching..." : "Confirm & Dispatch →"}
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