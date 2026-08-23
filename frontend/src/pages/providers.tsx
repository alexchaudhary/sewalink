"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router"; 
import { fetcher } from "../lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import ProviderCard from "../components/ProviderCard";
import { Search, SlidersHorizontal, Briefcase, DollarSign, CheckCircle2, Compass, Wrench } from "lucide-react";

interface ProviderSummary {
  id: string;
  displayName: string;
  headline: string;
  hourlyRate: number;
  rating: number;
  city: string;
}

export default function ProvidersPage() {
  const router = useRouter();
  const [providers, setProviders] = useState<ProviderSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Booking Modal States (Shadcn Architecture)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProvider, setSelectedProvider] = useState<ProviderSummary | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [jobBudget, setJobBudget] = useState<number>(1000);
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  const hotCategories = [
    { value: "painter", label: "Painter" },
    { value: "electrician", label: "Electrician" },
    { value: "plumber", label: "Plumber" },
    { value: "carpenter", label: "Carpenter" },
    { value: "construction", label: "Labor" }
  ];

  const loadProvidersData = async (query = "", city = "", category = "") => {
    try {
      setLoading(true);
      setError("");

      const pathParams = new URLSearchParams();
      const combinedQuery = [query, category].filter(Boolean).join(" ").trim();
      if (combinedQuery) pathParams.append("q", combinedQuery);
      if (city) pathParams.append("city", city);

      const endpointPath = pathParams.toString() 
        ? `/api/providers?${pathParams.toString()}` 
        : "/api/providers";

      const data = await fetcher(endpointPath);
      setProviders(data.providers || []);
    } catch (err: any) {
      setError(err?.message || "Failed to synchronize platform provider records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProvidersData(searchQuery, selectedCity, selectedCategory);
  }, [selectedCity, selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadProvidersData(searchQuery, selectedCity, selectedCategory);
  };

  const handleOpenHiringPanel = (provider: ProviderSummary) => {
    setSelectedProvider(provider);
    setIsModalOpen(true);
    setBookingSuccess(false);
  };

  const handleConfirmHiring = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider) return;

    try {
      setBookingLoading(true);
      await fetcher("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          providerId: selectedProvider.id,
          description: jobDescription,
          budget: Number(jobBudget),
          date: new Date().toISOString().split("T")[0]
        })
      });

      setBookingSuccess(true);
      setJobDescription("");
      setTimeout(() => {
        setIsModalOpen(false);
        setBookingSuccess(false);
      }, 2000);

    } catch (bErr: any) {
      alert(bErr?.message || "Hiring session handshake failed.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040612] text-slate-100 font-sans pb-20 relative overflow-x-hidden select-none text-left">
      
      {/* Background Lighting Accent */}
      <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-blue-500/5 blur-[130px] rounded-full pointer-events-none" />

      {/* Global Navigation Grid */}
      <nav className="h-20 bg-[#090d1a]/70 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 md:px-16 sticky top-0 z-50">
        <div className="flex items-center gap-3.5 group cursor-pointer" onClick={() => router.push("/dashboard/customer")}>
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2.5 rounded-xl flex items-center shadow-lg shadow-blue-500/10 transition-transform duration-300 group-hover:scale-105">
            <Wrench size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">Kamdar<span className="text-blue-500">Nepal</span></span>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/dashboard/customer" className="text-white/60 hover:text-blue-400 font-semibold text-sm flex items-center gap-2 transition-colors duration-200">
            <Compass size={16} /> Return to Dashboard
          </Link>
        </div>
      </nav>

      {/* Header Framework Block */}
      <header className="max-w-7xl mx-auto px-6 md:px-16 pt-12 pb-6">
        <h1 className="text-4xl font-black tracking-tight text-white">Explore Talent Marketplace</h1>
        <p className="text-white/40 text-base mt-2">Discover and secure contract bookings with verified field personnel across Nepal node clusters.</p>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-16">
        
        {/* Category Filter Badges Row Layout */}
        <div className="flex flex-wrap gap-2.5 mb-10 items-center">
          <span className="text-xs font-extrabold text-white/35 uppercase tracking-wider mr-2 flex items-center gap-1.5">
            <Briefcase size={14} /> Quick Trades:
          </span>
          <Button
            variant={selectedCategory === "" ? "default" : "outline"}
            onClick={() => setSelectedCategory("")}
            className={cn(
              "h-10 px-5 rounded-xl text-xs font-bold transition-all duration-200",
              selectedCategory === "" ? "bg-blue-600 hover:bg-blue-500 text-white border-none" : "border-white/5 bg-white/5 text-white/60 hover:text-white"
            )}
          >
            All Fields
          </Button>
          {hotCategories.map((cat) => (
            <Button
              key={cat.value}
              variant={selectedCategory === cat.value ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat.value)}
              className={cn(
                "h-10 px-5 rounded-xl text-xs font-bold transition-all duration-200",
                selectedCategory === cat.value ? "bg-blue-600 hover:bg-blue-500 text-white border-none" : "border-white/5 bg-white/5 text-white/60 hover:text-white"
              )}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Outer Split Matrix Grid Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
          
          {/* Advanced Search Sidebar Parameter Widget */}
          <div className="bg-white/5 border border-white/5 rounded-3xl p-7 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-1.5 text-base font-extrabold text-white">
              <SlidersHorizontal size={16} className="text-blue-500" /> Search Criteria
            </div>
            <p className="text-xs text-white/35 leading-relaxed mb-7">Apply parameters to narrow down verified maintenance workforce registries.</p>

            <form onSubmit={handleSearchSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-extrabold text-white/40 uppercase tracking-wider">Keyword Search</label>
                <div className="relative">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
                  <input
                    type="text"
                    placeholder="e.g. Plumber, Carpentry"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 bg-black/20 border border-white/10 focus:border-blue-500/40 rounded-xl pl-10 pr-4 text-xs text-white outline-none transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-extrabold text-white/40 uppercase tracking-wider">Target Location</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full h-11 bg-[#040612] border border-white/10 focus:border-blue-500/40 rounded-xl px-3.5 text-xs text-white outline-none cursor-pointer transition-all duration-200"
                >
                  <option value="">All of Nepal</option>
                  <option value="kathmandu">Kathmandu</option>
                  <option value="lalitpur">Lalitpur</option>
                  <option value="bhaktapur">Bhaktapur</option>
                  <option value="pokhara">Pokhara</option>
                </select>
              </div>

              <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-500/10 active:scale-95 transition-all duration-200">
                Apply Filter Nodes
              </Button>
            </form>
          </div>

          {/* Core Stream Output Grid View Results */}
          <div className="lg:col-span-3">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs mb-6">
                ⚠️ {error}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="h-48 bg-white/5 border border-white/5 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : providers.length === 0 ? (
              <div className="border border-dashed border-white/10 p-12 rounded-3xl text-center bg-white/[0.005]">
                <h3 className="text-base font-bold text-white mb-1">No Matching Specialists Found</h3>
                <p className="text-xs text-white/40">We could not isolate any verified active provider registries matching those parameters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {providers.map((p) => (
                  <div key={p.id} className="bg-white/5 border border-white/5 rounded-3xl p-6 relative group flex flex-col justify-between">
                    <ProviderCard
                      id={p.id}
                      name={p.displayName}
                      profession={p.headline || "Service Provider"}
                      rating={p.rating || 0}
                      price={p.hourlyRate || 0}
                      location={p.city || "Nepal"}
                    />
                    <div className="mt-4 flex justify-end pt-3 border-t border-white/5">
                      <Button
                        onClick={() => handleOpenHiringPanel(p)}
                        className="bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white px-5 h-9 rounded-xl text-xs font-bold active:scale-95 transition-all duration-200"
                      >
                        Instant Hire →
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Global Interactive Contract Escrow Overlay Popup via Shadcn Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#090d1a] border border-white/10 text-white rounded-3xl p-6 sm:max-w-md">
          {bookingSuccess ? (
            <div className="text-center py-8 flex flex-col items-center gap-3">
              <CheckCircle2 size={48} className="text-emerald-400" />
              <DialogTitle className="text-xl font-extrabold">Contract Dispatch Successful</DialogTitle>
              <DialogDescription className="text-xs text-white/40 max-w-xs">
                The procurement pipeline token was successfully logged and forwarded to the professional's tracking console.
              </DialogDescription>
            </div>
          ) : selectedProvider ? (
            <form onSubmit={handleConfirmHiring} className="flex flex-col gap-4">
              <DialogHeader>
                <DialogTitle className="text-lg font-extrabold text-white">Contract Request Pipeline</DialogTitle>
                <DialogDescription className="text-xs text-white/40">
                  Direct engagement request for <span className="text-blue-400 font-bold">{selectedProvider.displayName}</span> ({selectedProvider.headline || "Verified Workforce Node"}).
                </DialogDescription>
              </DialogHeader>

              <div className="bg-white/5 rounded-2xl p-3 text-xs text-white/60 flex flex-col gap-1 my-1">
                <div>Location: <span className="text-white font-semibold">{selectedProvider.city || "Nepal"}</span></div>
                <div>Standard Rate: <span className="text-white font-semibold">Rs. {selectedProvider.hourlyRate || 0}/hr</span></div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-white/40 uppercase">Job Task Summary</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your maintenance or service deployment constraints explicitly..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full bg-black/30 text-white placeholder-white/20 border border-white/10 rounded-xl p-3 text-xs outline-none resize-none focus:border-blue-500/40 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-white/40 uppercase">Offered Contract Budget (Rs.)</label>
                <div className="relative">
                  <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="number"
                    required
                    min={500}
                    value={jobBudget}
                    onChange={(e) => setJobBudget(Number(e.target.value))}
                    className="w-full h-10 bg-black/30 text-white border border-white/10 rounded-xl pl-8 pr-4 text-xs outline-none focus:border-blue-500/40 transition-colors"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={bookingLoading}
                className="w-full h-11 mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all duration-200"
              >
                {bookingLoading ? "Securing Escrow Account..." : "Confirm & Dispatch Booking →"}
              </Button>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}