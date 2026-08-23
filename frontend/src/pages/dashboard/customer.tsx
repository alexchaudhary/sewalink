"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router"; 
import { fetcher } from "../../lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Calendar, MapPin, Wrench, LogOut, Compass, ArrowUpRight, ShieldCheck, Inbox, Lock
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

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");
        const token = window.localStorage.getItem("kamdarnepal_token");
        if (!token) {
          router.push("/login");
          return;
        }

        const authData = await fetcher("/api/auth/me");
        if (authData.user.role === "PROVIDER") {
          router.push("/dashboard/worker");
          return;
        }
        setUser(authData.user);

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

  const handleLogout = () => {
    window.localStorage.removeItem("kamdarnepal_token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#040612] flex flex-col items-center justify-center gap-4 font-sans select-none">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-slate-500 text-xs font-bold tracking-widest uppercase animate-pulse">
          LOADING SECURED INTERACTION GRID...
        </span>
      </div>
    );
  }

  const userInitials = user ? `${user.firstName ? user.firstName.charAt(0) : ""}${user.lastName ? user.lastName.charAt(0) : ""}`.toUpperCase() : "C";

  const getStatusStyles = (status: Booking["status"]) => {
    switch (status) {
      case "ACCEPTED": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "COMPLETED": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "CANCELLED": return "text-red-400 bg-red-500/10 border-red-500/20";
      default: return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#040612] text-gray-100 font-sans pb-20 relative overflow-x-hidden select-none">
      
      {/* Premium Background Ambiance Blue Glow */}
      <div className="absolute top-[-5%] left-[10%] w-[450px] h-[450px] bg-blue-500/5 blur-[130px] rounded-full pointer-events-none" />

      {/* Corporate Fixed Navigation Grid */}
      <nav className="h-20 bg-[#090d1a]/70 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 md:px-16 sticky top-0 z-50">
        <div className="flex items-center gap-3.5 group cursor-pointer" onClick={() => router.push("/dashboard/customer")}>
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2.5 rounded-xl flex items-center shadow-lg shadow-blue-500/10 transition-transform duration-300 group-hover:scale-105">
            <Wrench size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">Kamdar<span className="text-blue-500">Nepal</span></span>
        </div>
        
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/providers" className="text-white/60 hover:text-blue-400 font-semibold text-sm flex items-center gap-2 transition-colors duration-200">
            <Compass size={16} /> Explore Marketplace
          </Link>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="text-white/50 hover:text-red-400 font-bold text-sm flex items-center gap-2 px-3 py-2 rounded-xl transition-colors duration-200"
          >
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </nav>

      {/* Main Framework Dashboard Workspace Area */}
      <main className="max-w-7xl mx-auto px-6 md:px-16 pt-12">
        
        {/* Profile Card Banner Widget Block Layer */}
        <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/5 rounded-3xl p-8 flex items-center justify-between flex-wrap gap-6 mb-10 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-xl shadow-blue-500/10 shrink-0">
              {userInitials}
            </div>
            <div className="flex flex-col gap-1.5 text-left">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-extrabold text-blue-500 tracking-widest uppercase">KAMDAR NEPAL</span>
                <div className="w-1 h-1 bg-white/20 rounded-full" />
                <h1 className="text-2xl font-extrabold tracking-tight text-white">
                  Welcome back, {user ? `${user.firstName} ${user.lastName || ""}` : "Client Platform User"}
                </h1>
                <div className="bg-blue-500/5 border border-blue-500/10 rounded-full px-2.5 py-0.5 flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-blue-400" />
                  <span className="text-[10px] text-blue-400 font-extrabold tracking-wider">SECURED CLIENT GATEWAY</span>
                </div>
              </div>
              <p className="text-white/35 text-sm font-medium">
                Authorized Node Cluster Endpoint • Account ID: {user?.id || "resolving_identity"}
              </p>
            </div>
          </div>

          {/* Premium Blue CTA Button */}
          <Button 
            onClick={() => router.push("/providers")}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 px-7 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-blue-600/10 active:scale-95 transition-all duration-200"
          >
            Find & Hire Labor Resource <ArrowUpRight size={16} strokeWidth={2.5} />
          </Button>
        </div>

        {/* Procurement Pipeline Section Header */}
        <h2 className="text-xl font-extrabold tracking-tight text-white mb-7 text-left">Active Service Procurement Pipelines</h2>
        
        {bookings.length === 0 ? (
          /* High Fidelity 100% English Corporate Empty State Architecture Layout Window */
          <div className="border border-dashed border-white/10 p-16 py-20 rounded-3xl text-center flex flex-col items-center justify-center gap-4 bg-white/[0.005]">
            <div className="bg-white/5 p-4 rounded-full border border-white/10">
              <Inbox size={24} className="text-white/40" />
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-lg font-bold text-white tracking-tight">No Active Procurement Pipelines</h4>
              <p className="text-sm text-white/40 max-w-md mx-auto leading-relaxed">
                You have not booked any service professionals yet. Click on the "Find & Hire Labor Resource" button above to browse and hire verified experts instantly from the live marketplace network.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {bookings.map((b) => {
              const isHovered = hoveredCard === b.id;
              return (
                <div 
                  key={b.id}
                  onMouseEnter={() => setHoveredCard(b.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={cn(
                    "bg-[#090d1a]/40 border rounded-3xl p-7 relative transition-all duration-300 ease-out flex flex-col justify-between gap-4",
                    isHovered ? "border-blue-500/30 -translate-y-1 shadow-2xl shadow-black/50" : "border-white/5"
                  )}
                >
                  <div>
                    <div className="flex justify-between items-start mb-5 gap-4">
                      <div>
                        <h3 className="text-lg font-extrabold text-white tracking-tight">{b.providerName}</h3>
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mt-1">{b.profession}</span>
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black border tracking-wider",
                        getStatusStyles(b.status)
                      )}>
                        {b.status}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2.5 text-sm text-white/45 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-white/30" /> <span>{b.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-white/30" /> <span>{b.city}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-base font-black text-white pt-4 border-t border-white/5 flex items-center justify-between">
                    <span>Rs. {b.budget}</span>
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <Lock size={12} /> Secured Escrow
                    </span>
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