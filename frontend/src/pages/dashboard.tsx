"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import MainLayout from "../components/MainLayout";
import { fetcher } from "../lib/api";
import { Calendar, Clock, MapPin, User, Wrench, ShieldAlert } from "lucide-react";

interface Booking {
  id: string;
  providerName: string;
  profession: string;
  date: string;
  status: "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED";
  budget: number;
  city: string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
}

export default function CustomerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        // 1. Check local storage for token presence to verify active session security bounds
        const token = window.localStorage.getItem("sewalink_token");
        if (!token) {
          router.push("/login");
          return;
        }

        // 2. Fetch authorized customer profile records via centralized authentication vectors
        const authData = await fetcher("/api/auth/me");
        setUser(authData.user);

        // 3. Fetch related marketplace active service records matching user constraints
        try {
          const bookingData = await fetcher("/api/bookings");
          setBookings(bookingData.bookings || []);
        } catch (bErr) {
          // Fallback to empty container array if the core booking router is not yet active
          setBookings([]);
        }

      } catch (err: any) {
        setError(err?.message || "Failed to load dashboard secure session.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [router]);

  // Helper function to resolve dynamic style metrics mapping across contextual job states
  const getStatusStyle = (status: Booking["status"]) => {
    switch (status) {
      case "ACCEPTED": return { bg: "rgba(16,185,129,0.1)", text: "#10b981", border: "rgba(16,185,129,0.2)" };
      case "COMPLETED": return { bg: "rgba(59,130,246,0.1)", text: "#3b82f6", border: "rgba(59,130,246,0.2)" };
      case "CANCELLED": return { bg: "rgba(239,68,68,0.1)", text: "#ef4444", border: "rgba(239,68,68,0.2)" };
      default: return { bg: "rgba(245,158,11,0.1)", text: "#f59e0b", border: "rgba(245,158,11,0.2)" };
    }
  };

  return (
    <MainLayout title="Customer Dashboard — SewaLink">
      <div style={{ minHeight: "85vh", background: "#060810", color: "#fff", padding: "40px 24px", textAlign: "left" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          {/* Welcome Branding Header Workspace */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "24px", marginBottom: "32px" }}>
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: 800, margin: 0 }}>
                Welcome back, <span style={{ background: "linear-gradient(135deg,#f59e0b,#ea580c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {user ? `${user.firstName} ${user.lastName}` : "Customer"}
                </span> 👋
              </h1>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginTop: "4px" }}>Manage your active service requests and home maintenance tasks.</p>
            </div>
            <Link href="/providers" style={{ background: "linear-gradient(135deg,#f59e0b 0%,#ea580c 100%)", color: "#111827", textDecoration: "none", fontWeight: 700, padding: "10px 20px", borderRadius: "10px", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 10px 20px rgba(245,158,11,0.15)" }}>
              <Wrench size={16} /> Find New Provider
            </Link>
          </div>

          {error && (
            <div style={{ marginBottom: "24px", padding: "14px", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "12px", color: "#f87171", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldAlert size={18} /> {error}
            </div>
          )}

          {loading ? (
            /* Client Layout Visual Loading Skeleton Matrix */
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {[1, 2].map((i) => (
                <div key={i} style={{ height: "160px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", animation: "pulse 1.5s infinite" }} />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            /* Defensive Empty State View Conditional Guard */
            <div style={{ textAlign: "center", background: "#090d16", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "64px 24px", maxWidth: "600px", margin: "40px auto" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <Calendar size={28} color="#f59e0b" />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>No Bookings Yet</h3>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginTop: "8px", lineHeight: 1.6, maxWidth: "400px", margin: "8px auto 24px" }}>
                You haven&apos;t scheduled any professionals yet. Hire certified plumbers, electricians, or painters near your location.
              </p>
              <Link href="/providers" style={{ color: "#f59e0b", textDecoration: "none", fontSize: "14px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                Browse verified providers <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            /* Core Data Grid Card Renders Mapping List */
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {bookings.map((booking) => {
                const style = getStatusStyle(booking.status);
                return (
                  <div key={booking.id} style={{ background: "#090d16", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", justifytype: "space-between", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>{booking.providerName}</h3>
                          <span style={{ fontSize: "12px", color: "#f59e0b", fontWeight: 600, textTransform: "uppercase", trackingWidth: "0.05em", marginTop: "4px", display: "block" }}>{booking.profession}</span>
                        </div>
                        <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "6px", background: style.bg, color: style.text, border: `1px solid ${style.border}` }}>
                          {booking.status}
                        </span>
                      </div>
                      
                      <div style={{ display: "flex", gap: "16px", marginTop: "20px", fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><Calendar size={14} /> {booking.date}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><MapPin size={14} style={{ textTransform: "capitalize" }} /> {booking.city}</div>
                      </div>
                    </div>

                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: "16px", paddingTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>Total Budget</span>
                      <span style={{ fontSize: "16px", fontWeight: 800, color: "#fff" }}>Rs. {booking.budget}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
}

// Internal component instance layout adapter to prevent icon layout fragmentation
function ArrowRight({ size }: { size: number }) {
  return <span style={{ fontSize: size }}>→</span>;
}
