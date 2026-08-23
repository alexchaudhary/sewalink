"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router"; 
import { fetcher } from "../../lib/api";
import { 
  Calendar, MapPin, Wrench, LogOut, 
  Compass, CheckCircle2, ArrowUpRight, ShieldCheck, Inbox
} from "lucide-react";

interface Booking {
  id: string;
  providerName: string;
  profession: string;
  date: string;
  status: "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED";
  budget: number;
  city: string;
}

export default function UltraCustomerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoverBtn, setHoverBtn] = useState(false);
  const [hoverLogout, setHoverLogout] = useState(false);

  // Authenticate user session and retrieve active client booking pipelines
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Check for local authentication bearer token
        const token = window.localStorage.getItem("kamdarnepal_token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Fetch user metadata from auth endpoint
        const authData = await fetcher("/api/auth/me");
        if (authData.user.role === "PROVIDER") {
          router.push("/dashboard/worker");
          return;
        }
        setUser(authData.user);

        // Fetch client procurement bookings
        const bookingData = await fetcher("/api/bookings").catch(() => ({ bookings: [] }));
        setBookings(bookingData.bookings || []);

      } catch (err: any) {
        setError("Failed to authenticate secure resource streams.");
        if (err?.status === 401) {
          window.localStorage.removeItem("kamdarnepal_token");
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [router]);

  // Handle account logout and session clearing
  const handleLogout = () => {
    window.localStorage.removeItem("kamdarnepal_token");
    router.push("/login");
  };

  // Full-screen loading screen displayed during session verification
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#040612", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", fontFamily: "sans-serif" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(37,99,235,0.1)", borderTop: "3px solid #2563eb", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", fontWeight: 600, letterSpacing: "0.05em" }}>LOADING SECURED INTERACTION GRID...</span>
        <style jsx global>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Generate upper-case initials to avoid avatar visual truncation
  const fInitial = user?.firstName ? user.firstName.charAt(0) : "C";
  const lInitial = user?.lastName ? user.lastName.charAt(0) : "U";
  const userInitials = `${fInitial}${lInitial}`.toUpperCase();

  // Color mapping helper function based on booking lifecycle status
  const getStatusStyles = (status: Booking["status"]) => {
    switch (status) {
      case "ACCEPTED": return { text: "#10b981", bg: "rgba(16,185,129,0.06)", border: "rgba(16,185,129,0.15)" };
      case "COMPLETED": return { text: "#3b82f6", bg: "rgba(59,130,246,0.06)", border: "rgba(59,130,246,0.15)" };
      case "CANCELLED": return { text: "#ef4444", bg: "rgba(239,68,68,0.06)", border: "rgba(239,68,68,0.15)" };
      default: return { text: "#f59e0b", bg: "rgba(245,158,11,0.06)", border: "rgba(245,158,11,0.15)" };
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#040612", color: "#f3f4f6", fontFamily: "sans-serif", paddingBottom: "80px", position: "relative" }}>
      
      {/* Background radial gradient decoration */}
      <div style={{ position: "absolute", top: "-5%", left: "10%", width: "450px", height: "450px", background: "rgba(37,99,235,0.03)", filter: "blur(130px)", borderRadius: "50%", pointerEvents: "none" }} />

      {/* Global Top Navigation Bar */}
      <nav style={{ height: "80px", background: "rgba(9, 13, 26, 0.7)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 64px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)", padding: "10px", borderRadius: "14px", display: "flex", alignItems: "center", boxShadow: "0 0 20px rgba(37,99,235,0.2)" }}>
            <Wrench size={20} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: "24px", fontWeight: 900, letterSpacing: "-0.04em" }}>Kamdar<span style={{ color: "#2563eb" }}>Nepal</span></span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          <Link href="/providers" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "14px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
            <Compass size={16} /> Explore Marketplace
          </Link>
          <button onClick={handleLogout} onMouseEnter={() => setHoverLogout(true)} onMouseLeave={() => setHoverLogout(false)} style={{ background: "none", border: "none", color: hoverLogout ? "#ef4444" : "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      {/* Main Dashboard Layout Container */}
      <main style={{ padding: "48px 64px", maxWidth: "1440px", margin: "0 auto" }}>
        
        {/* Account Summary Banner */}
        <div style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.005) 100%)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "24px", marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div style={{ width: "64px", height: "64px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 900, color: "#fff", boxShadow: "0 8px 24px rgba(37,99,235,0.15)", flexShrink: 0 }}>
              {userInitials}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "14px", fontWeight: 800, color: "#2563eb", letterSpacing: "0.05em" }}>KAMDAR NEPAL</span>
                <div style={{ height: "4px", width: "4px", background: "rgba(255,255,255,0.2)", borderRadius: "50%" }} />
                <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#fff" }}>
                  {user ? `${user.firstName} ${user.lastName || ""}` : "Client Platform User"}
                </h1>
                <div style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: "30px", padding: "2px 10px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <ShieldCheck size={11} color="#3b82f6" />
                  <span style={{ fontSize: "10px", color: "#3b82f6", fontWeight: 800 }}>SECURED CLIENT GATEWAY</span>
                </div>
              </div>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.35)", fontSize: "13px", lineHeight: "1.4" }}>
                Authorized Node Cluster Endpoint • Account ID: {user?.id || "resolving_identity"}
              </p>
            </div>
          </div>

          <button 
            onClick={() => router.push("/providers")}
            onMouseEnter={() => setHoverBtn(true)}
            onMouseLeave={() => setHoverBtn(false)}
            style={{ background: "#2563eb", color: "#fff", border: "none", fontWeight: 700, padding: "16px 32px", borderRadius: "14px", fontSize: "14px", display: "flex", alignItems: "center", gap: "10px", boxShadow: hoverBtn ? "0 12px 24px rgba(37,99,235,0.25)" : "none", cursor: "pointer", transform: hoverBtn ? "translateY(-2px)" : "translateY(0)", transition: "all 0.2s" }}
          >
            Find & Hire Labor Resource <ArrowUpRight size={16} />
          </button>
        </div>

        <h2 style={{ fontSize: "20px", fontWeight:800, marginBottom: "24px", letterSpacing: "-0.02em" }}>Active Service Procurement Pipelines</h2>
        
        {/* Render error banner if network request fails */}
        {error && (
          <div style={{ padding: "16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", color: "#ef4444", marginBottom: "24px" }}>
            {error}
          </div>
        )}

        {/* Conditional rendering for zero bookings vs mapped booking cards */}
        {bookings.length === 0 ? (
          /* High Fidelity 100% English Corporate Empty State Architecture */
          <div style={{ border: "1px dashed rgba(255,255,255,0.06)", padding: "64px 32px", borderRadius: "24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", background: "rgba(255,255,255,0.005)" }}>
            <div style={{ background: "rgba(255,255,255,0.01)", padding: "16px", borderRadius: "50%" }}>
              <Inbox size={24} color="rgba(255,255,255,0.15)" />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>No Active Procurement Pipelines</h4>
              <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "rgba(255,255,255,0.4)", maxWidth: "440px", lineHeight: "1.6" }}>
                You have not booked any service professionals yet. Click on the "Find & Hire Labor Resource" button above to browse and hire verified experts instantly from the live marketplace network.
              </p>
            </div>
          </div>
        ) : (
          /* Grid mapping active service procurement requests */
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "28px" }}>
            {bookings.map((b) => {
              const isHovered = hoveredCard === b.id;
              const sStyle = getStatusStyles(b.status);
              return (
                <div
                  key={b.id}
                  onMouseEnter={() => setHoveredCard(b.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{ 
                    background: "rgba(9, 13, 26, 0.4)", 
                    border: isHovered ? "1px solid rgba(37,99,235,0.3)" : "1px solid rgba(255,255,255,0.05)", 
                    padding: "28px", 
                    borderRadius: "24px", 
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", 
                    transform: isHovered ? "translateY(-4px)" : "translateY(0)" 
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "19px", fontWeight: 800 }}>{b.providerName}</h3>
                      <span style={{ fontSize: "12px", color: "#3b82f6", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em", display: "block", marginTop: "4px" }}>
                        {b.profession}
                      </span>
                    </div>
                    <span style={{ color: sStyle.text, background: sStyle.bg, border: `1px solid ${sStyle.border}`, padding: "6px 14px", borderRadius: "30px", fontSize: "11px", fontWeight: 800 }}>
                      {b.status}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", color: "rgba(255,255,255,0.45)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Calendar size={14} /> {b.date}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <MapPin size={14} /> {b.city}
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: 900, color: "#fff", marginTop: "6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span>Rs. {b.budget}</span>
                      <span style={{ fontSize: "12px", color: "#10b981", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                        <CheckCircle2 size={13} /> Secured Escrow
                      </span>
                    </div>
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