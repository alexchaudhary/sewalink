"use client";

import { useEffect, useState } from "react";
import { fetcher } from "../lib/api";
import ProviderCard from "../components/ProviderCard";
import { Search, SlidersHorizontal, Briefcase, DollarSign, X, CheckCircle, Compass, Wrench } from "lucide-react";

interface ProviderSummary {
  id: string;
  displayName: string;
  headline: string;
  hourlyRate: number;
  rating: number;
  city: string;
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<ProviderSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProvider, setSelectedProvider] = useState<ProviderSummary | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [jobBudget, setJobBudget] = useState<number>(1000);
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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
    <div style={{ minHeight: "100vh", background: "#040612", color: "#f3f4f6", fontFamily: "sans-serif", paddingBottom: "80px", position: "relative" }}>
      
      {/* Background Lighting Accents */}
      <div style={{ position: "absolute", top: "10%", right: "10%", width: "400px", height: "400px", background: "rgba(37,99,235,0.02)", filter: "blur(130px)", borderRadius: "50%", pointerEvents: "none" }} />

      {/* Global Navigation Grid */}
      <nav style={{ height: "80px", background: "rgba(9, 13, 26, 0.7)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 64px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)", padding: "10px", borderRadius: "14px", display: "flex", alignItems: "center" }}>
            <Wrench size={20} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: "24px", fontWeight: 900, letterSpacing: "-0.04em" }}>Kamdar<span style={{ color: "#2563eb" }}>Nepal</span></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <Link href="/dashboard/customer" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "14px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
            <Compass size={16} /> Return to Dashboard
          </Link>
        </div>
      </nav>

      {/* Header Framework Block */}
      <header style={{ padding: "48px 64px 24px", maxWidth: "1440px", margin: "0 auto", textAlign: "left" }}>
        <h1 style={{ fontSize: "36px", fontWeight: 900, margin: 0, letterSpacing: "-0.03em", color: "#fff" }}>Explore Talent Marketplace</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "15px", marginTop: "8px" }}>Discover and secure contract bookings with verified field personnel across Nepal node clusters.</p>
      </header>

      <main style={{ padding: "0 64px", maxWidth: "1440px", margin: "0 auto" }}>
        
        {/* Category Filter Badges Row Layout */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "40px", alignItems: "center" }}>
          <span style={{ fontSize: "11px", fontWeight: 800, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.05em", marginRight: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Briefcase size={14} /> Quick Trades:
          </span>
          <button
            onClick={() => setSelectedCategory("")}
            style={{ padding: "10px 20px", borderRadius: "12px", fontSize: "13px", fontWeight: 700, border: "1px solid rgba(255,255,255,0.05)", background: selectedCategory === "" ? "#2563eb" : "rgba(255,255,255,0.02)", color: "#fff", cursor: "pointer", transition: "all 0.2s" }}
          >
            All Fields
          </button>
          {hotCategories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              style={{ padding: "10px 20px", borderRadius: "12px", fontSize: "13px", fontWeight: 700, border: "1px solid rgba(255,255,255,0.05)", background: selectedCategory === cat.value ? "#2563eb" : "rgba(255,255,255,0.02)", color: selectedCategory === cat.value ? "#fff" : "rgba(255,255,255,0.6)", cursor: "pointer", transition: "all 0.2s" }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Outer Split Matrix Grid Panel Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "40px", alignItems: "flex-start", textAlign: "left" }}>
          
          {/* Advanced Search Sidebar Parameter Widget */}
          <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", fontSize: "16px", fontWeight: 800, color: "#fff" }}>
              <SlidersHorizontal size={16} color="#2563eb" /> Search Criteria
            </div>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", lineHeight: "1.5", marginBottom: "28px" }}>Apply parameters to narrow down verified maintenance workforce registries.</p>

            <form onSubmit={handleSearchSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 800, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>Keyword Search</label>
                <div style={{ position: "relative" }}>
                  <Search size={14} color="rgba(255,255,255,0.2)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    type="text"
                    placeholder="e.g. Plumber, Carpentry"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: "100%", height: "44px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "0 14px 0 42px", color: "#fff", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "11px", fontWeight: 800, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>Target Location</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  style={{ width: "100%", height: "44px", background: "#040612", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "0 14px", color: "#fff", fontSize: "13px", outline: "none", cursor: "pointer", boxSizing: "border-box" }}
                >
                  <option value="">All of Nepal</option>
                  <option value="kathmandu">Kathmandu</option>
                  <option value="lalitpur">Lalitpur</option>
                  <option value="bhaktapur">Bhaktapur</option>
                  <option value="pokhara">Pokhara</option>
                </select>
              </div>

              <button type="submit" style={{ width: "100%", height: "44px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(37,99,235,0.15)" }}>
                Apply Filter Nodes
              </button>
            </form>
          </div>

          {/* Core Stream Output Grid View Results */}
          <div>
            {error && (
              <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", padding: "16px", borderRadius: "16px", color: "#f87171", fontSize: "13px", marginBottom: "24px" }}>
                ⚠️ {error}
              </div>
            )}

            {loading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} style={{ height: "160px", background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "24px", padding: "24px" }} />
                ))}
              </div>
            ) : providers.length === 0 ? (
              <div style={{ border: "1px dashed rgba(255,255,255,0.06)", padding: "56px 32px", borderRadius: "24px", textAlign: "center", maxWidth: "440px", margin: "40px auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <Search size={24} color="rgba(255,255,255,0.15)" style={{ marginBottom: "16px" }} />
                <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#fff" }}>No Matching Specialists Found</h4>
                <p style={{ margin: "6px 0 0 0", fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: "1.5" }}>We could not isolate any verified active provider registries matching those parameters.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "28px" }}>
                {providers.map((p) => {
                  const isHovered = hoveredCard === p.id;
                  return (
                    <div
                      key={p.id}
                      onMouseEnter={() => setHoveredCard(p.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      style={{ background: "rgba(9, 13, 26, 0.4)", border: isHovered ? "1px solid rgba(37,99,235,0.3)" : "1px solid rgba(255,255,255,0.05)", padding: "28px", borderRadius: "24px", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", transform: isHovered ? "translateY(-4px)" : "translateY(0)" }}
                    >
                      <ProviderCard
                        id={p.id}
                        name={p.displayName}
                        profession={p.headline || "Service Provider"}
                        rating={p.rating || 0}
                        price={p.hourlyRate || 0}
                        location={p.city || "Nepal"}
                      />
                      <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => handleOpenHiringPanel(p)}
                          style={{ background: isHovered ? "#2563eb" : "transparent", color: isHovered ? "#fff" : "#3b82f6", border: "1px solid #2563eb", padding: "8px 18px", borderRadius: "12px", fontSize: "12px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
                        >
                          Instant Hire →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Global Interactive Contract Escrow Overlay Sheets Popup */}
      {isModalOpen && selectedProvider && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(3,5,10,0.85)", backdropFilter: "blur(12px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#090d16", border: "1px solid rgba(255,255,255,0.06)", width: "100%", maxWidth: "420px", borderRadius: "24px", padding: "32px", position: "relative", textAlign: "left" }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: "absolute", top: "24px", right: "24px", background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
              <X size={18} />
            </button>

            {bookingSuccess ? (
              <div style={{ padding: "32px 0", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                <div style={{ background: "rgba(16,185,129,0.08)", padding: "16px", borderRadius: "50%", border: "1px solid rgba(16,185,129,0.2)" }}>
                  <CheckCircle size={32} color="#10b981" />
                </div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#fff" }}>Contract Dispatch Successful</h3>
                <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: "1.5" }}>The procurement pipeline token was successfully logged and forwarded to the professional's tracking console.</p>
              </div>
            ) : (
              <form onSubmit={handleConfirmHiring} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <span style={{ fontSize: "10px", fontWeight: 800, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "4px" }}>Contract Request Pipeline</span>
                  <h3 style={{ margin: 0, fontSize: "22px", fontWeight: 800, color: "#fff" }}>{selectedProvider.displayName}</h3>
                  <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>{selectedProvider.headline || "Verified Workforce Node"}</p>
                </div>

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "12px 0", display: "flex", justifyContent: "space-between", fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
                  <span>Location: {selectedProvider.city || "Nepal"}</span>
                  <span style={{ fontWeight: 700, color: "#fff" }}>Rate: Rs. {selectedProvider.hourlyRate || 0}/hr</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "11px", fontWeight: 800, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>Job Task Summary</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe your maintenance or service deployment constraints explicitly..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    style={{ width: "100%", background: "rgba(0,0,0,0.3)", color: "#fff", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "12px 14px", fontSize: "13px", outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "sans-serif" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "11px", fontWeight: 800, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>Offered Contract Budget (Rs.)</label>
                  <div style={{ position: "relative" }}>
                    <DollarSign size={14} color="rgba(255,255,255,0.25)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="number"
                      required
                      min={500}
                      value={jobBudget}
                      onChange={(e) => setJobBudget(Number(e.target.value))}
                      style={{ width: "100%", height: "44px", background: "rgba(0,0,0,0.3)", color: "#fff", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "0 14px 0 38px", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  style={{ width: "100%", height: "46px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: 700, cursor: bookingLoading ? "not-allowed" : "pointer", opacity: bookingLoading ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  {bookingLoading ? "Securing Escrow Account..." : "Confirm & Dispatch Booking →"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Next.js Link Fallback for safety redirection compliance
function Link({ href, children, style }: { href: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <a href={href} style={{ textDecoration: "none", ...style }}>
      {children}
    </a>
  );
}