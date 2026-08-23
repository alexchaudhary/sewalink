"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router"; 
import { fetcher } from "../../lib/api";
import { 
  Calendar, MapPin, Briefcase, LogOut, 
  CheckCircle, Clock, DollarSign, ShieldCheck, 
  ChevronRight
} from "lucide-react";

interface JobRequest {
  id: string;
  customerName: string;
  location: string;
  date: string;
  status: "PENDING" | "ACCEPTED" | "COMPLETED";
  payment: number;
  urgency: "HIGH" | "STANDARD";
}

export default function UltraWorkerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isOnline, setIsOnline] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoverLogout, setHoverLogout] = useState(false);

  // Authenticate worker session and retrieve assigned job dispatches
  useEffect(() => {
    const loadWorkerData = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Retrieve session token from client storage
        const token = window.localStorage.getItem("kamdarnepal_token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Fetch current authenticated user record
        const authData = await fetcher("/api/auth/me");
        
        // Redirect client users to their respective customer dashboard
        if (authData.user.role === "CUSTOMER") {
          router.push("/dashboard/customer");
          return;
        }
        setUser(authData.user);

        // Fetch active service bookings from internal API endpoint
        const bookingData = await fetcher("/api/bookings").catch(() => ({ bookings: [] }));
        setJobs(bookingData.bookings || []);

      } catch (err: any) {
        setError(err?.message || "Failed to resolve authenticated session pipeline.");
        if (err?.status === 401 || err?.status === 403) {
          window.localStorage.removeItem("kamdarnepal_token");
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    loadWorkerData();
  }, [router]);

  // Logout handler to flush local token and redirect to login
  const handleLogout = () => {
    window.localStorage.removeItem("kamdarnepal_token");
    router.push("/login");
  };

  // Fullscreen loader rendered while authenticating and loading telemetry
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#03050a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", fontFamily: "sans-serif" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(249,115,22,0.1)", borderTop: "3px solid #f97316", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", fontWeight: 600, letterSpacing: "0.05em" }}>INITIALIZING ENTERPRISE CONSOLE...</span>
        <style jsx global>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Dynamic avatar initials mapping to prevent layout breaking on null values
  const fInitial = user?.firstName ? user.firstName.charAt(0) : "W";
  const lInitial = user?.lastName ? user.lastName.charAt(0) : "P";
  const userInitials = `${fInitial}${lInitial}`.toUpperCase();

  return (
    <div style={{ minHeight: "100vh", background: "#03050a", color: "#f3f4f6", fontFamily: "sans-serif", paddingBottom: "80px", overflowX: "hidden", position: "relative" }}>
      
      {/* Background ambient lighting element */}
      <div style={{ position: "absolute", top: "-10%", left: "15%", width: "400px", height: "400px", background: "rgba(249,115,22,0.04)", filter: "blur(120px)", borderRadius: "50%", pointerEvents: "none" }} />

      {/* Enterprise Global Navigation Header */}
      <nav style={{ height: "80px", background: "rgba(6, 9, 16, 0.7)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 64px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ background: "linear-gradient(135deg, #f97316, #d97706)", padding: "10px", borderRadius: "14px", display: "flex", alignItems: "center", boxShadow: "0 0 20px rgba(249,113,22,0.2)" }}>
            <Briefcase size={20} color="#03050a" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: "24px", fontWeight: 900, letterSpacing: "-0.04em" }}>Kamdar<span style={{ color: "#f97316" }}>Nepal</span></span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          {/* Duty status toggle pill */}
          <div onClick={() => setIsOnline(!isOnline)} style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: "8px 18px", borderRadius: "30px", cursor: "pointer" }}>
            <div style={{ width: "10px", height: "10px", background: isOnline ? "#10b981" : "#ef4444", borderRadius: "50%", boxShadow: isOnline ? "0 0 10px #10b981" : "0 0 10px #ef4444" }} />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>{isOnline ? "DUTY: ONLINE" : "DUTY: OFFLINE"}</span>
          </div>
          
          <button onClick={handleLogout} onMouseEnter={() => setHoverLogout(true)} onMouseLeave={() => setHoverLogout(false)} style={{ background: "none", border: "none", color: hoverLogout ? "#ef4444" : "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      {/* Main Framework Dashboard Content */}
      <main style={{ padding: "48px 64px", maxWidth: "1440px", margin: "0 auto" }}>
        
        {/* Service Professional Banner Profile Card */}
        <div style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "24px", padding: "32px", display: "flex", alignItems: "center", gap: "24px", marginBottom: "40px" }}>
          <div style={{ width: "64px", height: "64px", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 900, color: "#03050a", boxShadow: "0 8px 24px rgba(249,115,22,0.15)", flexShrink: 0 }}>
            {userInitials}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "14px", fontWeight: 800, color: "#f97316", letterSpacing: "0.05em" }}>KAMDAR NEPAL</span>
              <div style={{ height: "4px", width: "4px", background: "rgba(255,255,255,0.2)", borderRadius: "50%" }} />
              <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#fff" }}>
                {user ? `${user.firstName} ${user.lastName || ""}` : "Service Professional"}
              </h1>
              <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "30px", padding: "2px 10px", display: "flex", alignItems: "center", gap: "6px" }}>
                <ShieldCheck size={11} color="#10b981" />
                <span style={{ fontSize: "10px", color: "#10b981", fontWeight: 800 }}>VERIFIED COMPLIANCE</span>
              </div>
            </div>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: "13px", lineHeight: "1.4" }}>
              Account Node Identity: {user?.email || "internal_pipeline_gateway"} • Live telemetry session secured.
            </p>
          </div>
        </div>

        {/* Analytics and Key Metric Display Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "48px" }}>
          <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", padding: "24px 28px", borderRadius: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em" }}>Accrued Earnings</span>
              <div style={{ fontSize: "32px", fontWeight: 900, color: "#fff", marginTop: "6px" }}>Rs. 0</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: "12px", borderRadius: "14px" }}><DollarSign size={20} color="rgba(255,255,255,0.4)" /></div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", padding: "24px 28px", borderRadius: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em" }}>Dispatched Audits</span>
              <div style={{ fontSize: "32px", fontWeight: 900, color: "#fff", marginTop: "6px" }}>{jobs.length} Active</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: "12px", borderRadius: "14px" }}><CheckCircle size={20} color="rgba(255,255,255,0.4)" /></div>
          </div>
        </div>

        {/* Real-time Job Stream Container */}
        <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "24px", letterSpacing: "-0.02em" }}>Assigned Service Dispatches</h2>
        
        {error && (
          <div style={{ padding: "16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", color: "#ef4444", marginBottom: "24px" }}>
            {error}
          </div>
        )}

        {/* Conditional rendering for empty job queue vs active job dispatches */}
        {jobs.length === 0 ? (
          /* High Fidelity Empty State UI */
          <div style={{ border: "1px dashed rgba(255,255,255,0.08)", padding: "64px 32px", borderRadius: "24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", background: "rgba(255,255,255,0.005)" }}>
            <div style={{ background: "rgba(249,115,22,0.04)", padding: "16px", borderRadius: "50%", border: "1px solid rgba(249,115,22,0.1)" }}>
              <Clock size={24} color="#f97316" style={{ animation: "pulse 2s infinite" }} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>No Active Job Requests</h4>
              <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "rgba(255,255,255,0.4)", maxWidth: "460px", lineHeight: "1.6" }}>
                Your online duty status is currently active. Incoming consumer bookings and real-time dispatch routes will instantly populate inside this tracking matrix.
              </p>
            </div>
          </div>
        ) : (
          /* Grid mapping for active service dispatches */
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "28px" }}>
            {jobs.map((j) => {
              const isHovered = hoveredCard === j.id;
              return (
                <div
                  key={j.id}
                  onMouseEnter={() => setHoveredCard(j.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{ 
                    background: "rgba(9, 13, 22, 0.5)", 
                    border: isHovered ? "1px solid rgba(249,115,22,0.3)" : "1px solid rgba(255,255,255,0.05)", 
                    padding: "28px", 
                    borderRadius: "24px", 
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", 
                    transform: isHovered ? "translateY(-4px)" : "translateY(0)" 
                  }}
                >
                  <div style={{ marginBottom: "20px" }}>
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontWeight: 700, textTransform: "uppercase" }}>Pipeline Booking Reference</span>
                    <h3 style={{ margin: "4px 0 0 0", fontSize: "20px", fontWeight: 800, color: "#fff" }}>{j.customerName}</h3>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", color: "rgba(255,255,255,0.5)", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: "20px", marginBottom: "24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <MapPin size={16} color="rgba(255,255,255,0.4)" /> {j.location}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Calendar size={16} color="rgba(255,255,255,0.4)" /> {j.date}
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: 800, color: "#f97316" }}>
                      Contract Value: Rs. {j.payment}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button style={{ flex: 1, height: "44px", background: "#f97316", color: "#03050a", border: "none", borderRadius: "12px", fontWeight: 700, cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                      Accept Dispatch <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}