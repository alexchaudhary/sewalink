"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router"; 
import { fetcher } from "../../lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Calendar, MapPin, Briefcase, LogOut, LayoutDashboard, 
  Sliders, CheckCircle, Clock, DollarSign, ShieldCheck, 
  Zap, AlertCircle, ChevronRight
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

  useEffect(() => {
    const loadWorkerData = async () => {
      try {
        setLoading(true);
        setError("");
        const token = window.localStorage.getItem("kamdarnepal_token");
        if (!token) {
          router.push("/login");
          return;
        }

        const authData = await fetcher("/api/auth/me");
        if (authData.user.role === "CUSTOMER") {
          router.push("/dashboard/customer");
          return;
        }
        setUser(authData.user);

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

  const handleLogout = () => {
    window.localStorage.removeItem("kamdarnepal_token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 font-sans select-none">
        <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
        <span className="text-slate-500 text-xs font-bold tracking-widest uppercase animate-pulse">INITIALIZING ENTERPRISE CONSOLE...</span>
      </div>
    );
  }

  const fInitial = user?.firstName ? user.firstName.charAt(0) : "W";
  const lInitial = user?.lastName ? user.lastName.charAt(0) : "P";
  const userInitials = `${fInitial}${lInitial}`.toUpperCase();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20 relative overflow-x-hidden select-none">
      
      {/* Cyber Navigation Matrix Bar */}
      <nav className="h-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-12 sticky top-0 z-50">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-orange-500 p-2.5 rounded-xl flex items-center shadow-lg shadow-orange-500/10">
            <Briefcase size={20} className="text-slate-950" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-black tracking-tight text-white">Kamdar<span className="text-orange-500">Nepal</span></span>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Duty Control Custom Switch */}
          <div 
            onClick={() => setIsOnline(!isOnline)} 
            className="flex items-center gap-3 bg-slate-900 border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-full cursor-pointer select-none active:scale-95 transition-all duration-200"
          >
            <div className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              isOnline ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-red-500 shadow-[0_0_10px_#ef4444]"
            )} />
            <span className="text-xs font-bold text-slate-300 tracking-wide">{isOnline ? "DUTY: ONLINE" : "DUTY: OFFLINE"}</span>
          </div>

          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-400 font-bold text-sm flex items-center gap-2 px-3 py-2 rounded-xl transition-colors"
          >
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </nav>

      {/* Main Framework Body Workspace */}
      <main className="max-w-6xl mx-auto px-8 pt-12">
        
        {/* Profile Card Banner Block Component */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center gap-6 mb-8 text-left">
          <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center text-xl font-black text-slate-950 shadow-lg shadow-orange-500/10 shrink-0">
            {userInitials}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-extrabold text-orange-500 tracking-wider uppercase">KAMDAR NEPAL</span>
              <div className="w-1 h-1 bg-slate-700 rounded-full" />
              <h1 className="text-xl font-extrabold tracking-tight text-white">
                {user ? `${user.firstName} ${user.lastName || ""}` : "Service Professional"}
              </h1>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5 flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-extrabold tracking-wider">VERIFIED COMPLIANCE</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm font-medium">
              Account Node Identity: {user?.email || "internal_pipeline_gateway"} • Live telemetry session secured.
            </p>
          </div>
        </div>

        {/* Analytics Section Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center text-left">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Accrued Earnings</span>
              <div className="text-3xl font-black text-white mt-1">Rs. 0</div>
            </div>
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
              <DollarSign size={20} className="text-slate-400" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center text-left">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Dispatched Audits</span>
              <div className="text-3xl font-black text-white mt-1">{jobs.length} Active</div>
            </div>
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
              <CheckCircle size={20} className="text-slate-400" />
            </div>
          </div>
        </div>

        {/* Dispatches Stream Area Layout */}
        <div className="flex items-center justify-between mb-6 text-left">
          <h2 className="text-lg font-extrabold tracking-tight text-white">Assigned Service Dispatches</h2>
          <span className="text-xs text-slate-500 font-medium">Telemetry sync active</span>
        </div>
        
        {jobs.length === 0 ? (
          /* High Fidelity Corporate Empty State Card Window Layout */
          <div className="border border-dashed border-slate-800 p-12 py-16 rounded-2xl text-center flex flex-col items-center justify-center gap-4 bg-slate-900/20">
            <div className="bg-orange-500/10 p-4 rounded-full border border-orange-500/20">
              <Clock size={24} className="text-orange-500" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-base font-bold text-white tracking-tight">No Active Job Requests</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Your online duty status is currently active. Incoming consumer bookings and real-time dispatch routes will instantly populate inside this tracking matrix.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {jobs.map((j) => {
              const isHovered = hoveredCard === j.id;
              return (
                <div 
                  key={j.id} 
                  onMouseEnter={() => setHoveredCard(j.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={cn(
                    "bg-slate-900 border border-slate-800 rounded-2xl p-6 relative transition-all duration-200 ease-out flex flex-col justify-between gap-4",
                    isHovered ? "border-orange-500/40 -translate-y-1 shadow-xl" : ""
                  )}
                >
                  <div>
                    <div className="mb-4">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Pipeline Booking Reference</span>
                      <h3 className="text-base font-extrabold text-white mt-1 tracking-tight">{j.customerName}</h3>
                    </div>
                    <div className="flex flex-col gap-2 text-xs text-slate-400 border-b border-slate-800 pb-4 mb-4 font-medium">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-orange-500" />
                        <span>{j.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-orange-500" />
                        <span>{j.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 font-bold block">Contract Value</span>
                      <span className="text-sm font-extrabold text-white">Rs. {j.payment}</span>
                    </div>

                    <Button className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1">
                      Accept Dispatch <ChevronRight size={14} />
                    </Button>
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