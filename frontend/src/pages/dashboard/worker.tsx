'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from "../../components/MainLayout";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function ProviderDashboard() {
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Active View Tabs: 'DASHBOARD' | 'PROFILE_SETTINGS'
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'PROFILE_SETTINGS'>('DASHBOARD');

  // Popup Modal Selection States
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  // Profile Form States Matrix
  const [displayName, setDisplayName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState(500);
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // Global Financial & Counter Aggregate Vectors
  const [completedCount, setCompletedCount] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);

  // 1. Core Handshake Vector to Pull Active Relational Bookings from Backend Grid
  const fetchDashboardData = async () => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("kamdarnepal_token") : null;
    if (!token) return;

    try {
      const res = await fetch(`${BASE_API_URL}/bookings`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const responseData = await res.json();
      
      if (res.ok && responseData.success) {
        const allBookings = responseData?.data?.bookings || [];
        
        const pendingRequests = allBookings.filter((b: any) => b.status === "PENDING");
        const confirmedSlots = allBookings.filter((b: any) => b.status === "CONFIRMED" || b.status === "ACCEPTED");
        const completedJobs = allBookings.filter((b: any) => b.status === "COMPLETED");

        setIncomingRequests(pendingRequests);
        setUpcomingBookings(confirmedSlots);
        setCompletedCount(completedJobs.length);

        // Compute Dynamic Real-Time Revenue directly from Completed Database nodes
        const revenue = completedJobs.reduce((sum: number, b: any) => sum + Number(b.budget || 0), 0);
        setMonthlyEarnings(revenue);
      }
    } catch (err) {
      console.error("Failed to query runtime booking streams:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Active Worker Profile Metrics into Form Buffers
  const fetchProfileData = async () => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("kamdarnepal_token") : null;
    const userStr = typeof window !== "undefined" ? window.localStorage.getItem("user") : null;
    if (!token || !userStr) return;

    try {
      const user = JSON.parse(userStr);
      const res = await fetch(`${BASE_API_URL}/providers/${user.id}`);
      const responseData = await res.json();
      const profile = responseData?.data?.provider || responseData?.provider;
      
      if (profile) {
        setDisplayName(profile.displayName || "");
        setHeadline(profile.headline || "");
        setBio(profile.bio || "");
        setHourlyRate(profile.hourlyRate || 500);
        setCity(profile.city || "");
        setDistrict(profile.district || "");
      }
    } catch (err) {
      console.error("Failed to coordinate profile fields context:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchProfileData();
  }, []);

  // 3. Commit Mutations to Mutate Booking Status Lifecycle Gateways (Accept/Reject/Complete)
  const handleStatusMutation = async (bookingId: string, targetStatus: "ACCEPTED" | "REJECTED" | "COMPLETED") => {
    setActionLoading(bookingId);
    const token = typeof window !== "undefined" ? window.localStorage.getItem("kamdarnepal_token") : null;

    let backendStatusToken = "CONFIRMED";
    if (targetStatus === "REJECTED") backendStatusToken = "REJECTED";
    if (targetStatus === "COMPLETED") backendStatusToken = "COMPLETED";

    try {
      const res = await fetch(`${BASE_API_URL}/bookings/${bookingId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: backendStatusToken })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(`Transaction successfully processed to state: ${targetStatus}`);
        fetchDashboardData(); // Hot-reload lists and financial tallies instantly
      } else {
        alert(data.message || "Database validation denied lifecycle adjustment.");
      }
    } catch (err) {
      console.error("Status mutation handshake dropped:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // 4. Update Profile Record Settings in Neon Database Clusters
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    const token = typeof window !== "undefined" ? window.localStorage.getItem("kamdarnepal_token") : null;

    try {
      const res = await fetch(`${BASE_API_URL}/providers`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          displayName,
          headline,
          bio,
          city,
          district,
          hourlyRate: Number(hourlyRate)
        })
      });

      const responseData = await res.json();
      if (res.ok && responseData.success) {
        alert("Profile metrics committed and live inside Kamdar Nepal grid nodes!");
        setActiveTab('DASHBOARD');
        fetchProfileData();
        fetchDashboardData();
      } else {
        alert(responseData.message || "Prisma schema verification validation rejected payload layout.");
      }
    } catch (err) {
      console.error("Profile dispatch failed:", err);
      alert("Failed connection boundaries.");
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <MainLayout title="Provider Dashboard">
      <div className="max-w-6xl mx-auto px-6 py-10 selection:bg-orange-500/20">
        
        {/* Navigation Tab Header Control System Panel */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              Worker <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">Dashboard Hub</span>
            </h1>
            <p className="mt-2 text-sm text-slate-400 font-medium">
              Monitor incoming jobs, manage timeline schedules, and upgrade your dynamic marketplace profile settings.
            </p>
          </div>
          
          {/* Tab Switcher */}
          <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-white/5 h-fit self-start sm:self-center font-bold text-xs uppercase tracking-wider">
            <button 
              onClick={() => setActiveTab('DASHBOARD')}
              className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'DASHBOARD' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-500 hover:text-white'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('PROFILE_SETTINGS')}
              className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'PROFILE_SETTINGS' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-500 hover:text-white'}`}
            >
              Edit Profile
            </button>
          </div>
        </div>

        {activeTab === 'DASHBOARD' ? (
          /* ========================================================================== */
          /* 📊 DASHBOARD OVERVIEW VIEW MODE MESH                                       */
          /* ========================================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Booking Requests */}
            <div className="lg:col-span-2 bg-slate-900/40 border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-2xl h-fit">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-3">
                Live Booking Requests
              </h2>
              
              <div className="mt-5 space-y-4">
                {loading ? (
                  <div className="text-xs font-mono tracking-widest text-slate-500 py-6 text-center animate-pulse uppercase">Connecting loops...</div>
                ) : incomingRequests.length === 0 ? (
                  <div className="text-xs font-mono tracking-widest text-slate-500/60 py-10 text-center border border-dashed border-white/5 rounded-xl uppercase">No pending customer requests found.</div>
                ) : (
                  incomingRequests.map((job: any) => (
                    <div 
                      key={job.id} 
                      onClick={() => setSelectedJob(job)} 
                      className="bg-slate-950/60 border border-white/5 p-5 rounded-xl flex flex-col justify-between sm:flex-row sm:items-center gap-4 transition-all hover:border-orange-500/20 shadow-lg shadow-black/30 cursor-pointer group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                            {job.customerName || "Verified Client"}
                          </span>
                          <span className="text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-md font-semibold">
                            {job.profession || "General Work"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {job.description || "No specific instructions provided."}
                        </p>
                        <div className="text-[11px] text-slate-500 font-mono pt-1">
                          💰 Budget: Rs. {job.budget}  |  📍 {job.city || "N/A"}
                        </div>
                      </div>

                      <div className="flex gap-2 flex-shrink-0 sm:justify-end" onClick={(e) => e.stopPropagation()}>
                        <button
                          disabled={actionLoading !== null}
                          onClick={() => handleStatusMutation(job.id, "REJECTED")}
                          className="h-8 px-3.5 rounded-xl bg-white/5 border border-white/5 text-[11px] font-bold text-white/70 hover:bg-red-500/10 hover:text-red-400 transition-colors focus:outline-none"
                        >
                          Reject
                        </button>
                        <button
                          disabled={actionLoading !== null}
                          onClick={() => handleStatusMutation(job.id, "ACCEPTED")}
                          className="h-8 px-4 rounded-xl bg-orange-600 text-[11px] font-black uppercase text-white hover:bg-orange-500 transition-colors focus:outline-none"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Sidebar Columns */}
            <div className="space-y-6">
              {/* Analytics Summary */}
              <div className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-2xl space-y-4">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-3">
                  Business Analytics
                </h2>
                
                <div className="space-y-3">
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Gross Account Volume</span>
                    <span className="text-xl font-black text-emerald-400 mt-1 block">Rs. {monthlyEarnings.toLocaleString()}</span>
                  </div>

                  <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Jobs Processed All-Time</span>
                    <span className="text-xl font-black text-white mt-1 block">{completedCount}</span>
                  </div>
                </div>
              </div>

              {/* Upcoming Bookings Pipeline */}
              <div className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-2xl space-y-4">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-3">
                  Upcoming Active Slotted Bookings
                </h2>

                <div className="space-y-3">
                  {loading ? (
                    <div className="text-xs font-mono tracking-widest text-slate-500 py-4 text-center animate-pulse uppercase">Syncing...</div>
                  ) : upcomingBookings.length === 0 ? (
                    <div className="text-xs font-mono tracking-widest text-slate-500/60 py-6 text-center border border-dashed border-white/5 rounded-xl uppercase">No active contracts assigned.</div>
                  ) : (
                    upcomingBookings.map((slot: any) => (
                      <div key={slot.id} className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-xs font-bold text-white">{slot.customerName || "Verified Client"}</div>
                            <div className="text-[10px] text-slate-400">{slot.date || "Scheduled"}</div>
                          </div>
                          <span className="text-xs font-mono text-orange-400 font-bold">Rs. {slot.budget}</span>
                        </div>

                        <button
                          disabled={actionLoading !== null}
                          onClick={() => handleStatusMutation(slot.id, "COMPLETED")}
                          className="w-full h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-600 text-emerald-400 hover:text-white text-[10px] font-black tracking-widest uppercase transition-all focus:outline-none"
                        >
                          {actionLoading === slot.id ? "Syncing..." : "Complete Work ✔"}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* ========================================================================== */
          /* 💼 EDIT PROFILE CONFIGURATION HUBS VIEW MODE                               */
          /* ========================================================================== */
          <div className="bg-slate-900/40 border border-white/5 p-8 rounded-2xl backdrop-blur-md shadow-2xl max-w-2xl mx-auto">
            <h2 className="text-lg font-bold text-white">Enterprise Profile Grid Settings</h2>
            <p className="text-xs text-slate-400 mb-6">Customize your active marketplace portfolio matrices visible to client pools.</p>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Public Display Name</label>
                <input type="text" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full h-10 bg-slate-950/80 text-white text-xs border border-white/10 rounded-xl px-3 outline-none focus:border-orange-500/40" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Professional Headline</label>
                <input type="text" required value={headline} onChange={(e) => setHeadline(e.target.value)} className="w-full h-10 bg-slate-950/80 text-white text-xs border border-white/10 rounded-xl px-3 outline-none focus:border-orange-500/40" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Base City</label>
                  <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="w-full h-10 bg-slate-950/80 text-white text-xs border border-white/10 rounded-xl px-3 outline-none focus:border-orange-500/40" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">District Name</label>
                  <input type="text" required value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full h-10 bg-slate-950/80 text-white text-xs border border-white/10 rounded-xl px-3 outline-none focus:border-orange-500/40" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hourly Rate (Rs.)</label>
                <input type="number" required min={150} max={2500} value={hourlyRate} onChange={(e) => setHourlyRate(Number(e.target.value))} className="w-full h-10 bg-slate-950/80 text-white text-xs border border-white/10 rounded-xl px-3 font-mono outline-none focus:border-orange-500/40" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Professional Bio Summary</label>
                <textarea required value={bio} onChange={(e) => setBio(e.target.value)} className="w-full h-24 bg-slate-950/80 text-white text-xs border border-white/10 rounded-xl p-3 outline-none focus:border-orange-500/40 resize-none font-medium normal-case" />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setActiveTab('DASHBOARD')} className="h-10 px-5 bg-white/5 text-white/80 rounded-xl border border-white/5 text-xs font-bold transition-colors hover:bg-white/10">
                  Cancel
                </button>
                <button type="submit" disabled={profileLoading} className="h-10 px-5 bg-orange-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors hover:bg-orange-500">
                  {profileLoading ? "Saving nodes..." : "Save Profile Matrix"}
                </button>
              </div>
            </form>
          </div>
        )}
        {selectedJob && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-md w-full p-6 relative space-y-4 shadow-2xl">
              <button onClick={() => setSelectedJob(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white text-xs focus:outline-none">
                ✕
              </button>

              <div>
                <h3 className="text-base font-bold text-white">Contract Blueprint Overview</h3>
                <p className="text-xs text-slate-400">Full customer dispatch file registry details.</p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Customer Sender Name</span>
                  <span className="text-xs font-bold text-white mt-1 block">{selectedJob.customerName || "Verified Client"}</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Job Instructions Notes</span>
                  <span className="text-xs text-slate-300 mt-1 block">{selectedJob.description || "No specific instructions specified."}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Payout Value</span>
                    <span className="text-xs font-mono font-bold text-emerald-400 mt-1 block">Rs. {selectedJob.budget}</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Node Area</span>
                    <span className="text-xs font-bold text-white mt-1 block">{selectedJob.city || "Local"}</span>
                  </div>
                </div>
              </div>

              <button onClick={() => setSelectedJob(null)} className="w-full h-10 bg-white/5 border border-white/5 text-white/80 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-white/10 transition-colors">
                Close Dispatch Record
              </button>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
}