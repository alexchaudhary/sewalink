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

  // Image Upload States Matrix
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null);

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
        const allBookings = responseData?.bookings || responseData?.data?.bookings || [];
        
        const pendingRequests = allBookings.filter((b: any) => b?.status?.toUpperCase() === "PENDING");
        const confirmedSlots = allBookings.filter((b: any) => b?.status?.toUpperCase() === "CONFIRMED" || b?.status?.toUpperCase() === "ACCEPTED");
        const completedJobs = allBookings.filter((b: any) => b?.status?.toUpperCase() === "COMPLETED");

        setIncomingRequests(pendingRequests);
        setUpcomingBookings(confirmedSlots);
        setCompletedCount(completedJobs.length);

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
        setCurrentAvatarUrl(profile.avatarUrl || null);
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
        fetchDashboardData();
      } else {
        alert(data.message || "Database validation denied lifecycle adjustment.");
      }
    } catch (err) {
      console.error("Status mutation handshake dropped:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // 4. Handle Local File Picker Changes & Generate Previews
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 5. Direct Media Binary Asset Stream Dispatch Form Handler
  const handleAvatarUpload = async () => {
    if (!selectedFile) {
      alert("Please select a photo file from your local hardware device storage first.");
      return;
    }

    setUploadingImage(true);
    const token = typeof window !== "undefined" ? window.localStorage.getItem("kamdarnepal_token") : null;
    const formData = new FormData();
    formData.append("avatar", selectedFile);

    try {
      const res = await fetch(`${BASE_API_URL}/providers/avatar`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert("Profile photo securely streamed and saved on Cloudinary repositories!");
        setCurrentAvatarUrl(data.avatarUrl);
        setSelectedFile(null);
        setImagePreview(null);
        fetchProfileData();
      } else {
        alert(data.message || "Media server parsing transaction boundary denied.");
      }
    } catch (err) {
      console.error("Media upload pipeline exception:", err);
      alert("Network interface connection dropped this image data packet.");
    } finally {
      setUploadingImage(false);
    }
  };

  // 6. Update Profile Text Record Settings
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    const token = typeof window !== "undefined" ? window.localStorage.getItem("kamdarnepal_token") : null;

    try {
      const res = await fetch(`${BASE_API_URL}/providers/profile`, {
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
        alert("Profile text configurations committed successfully!");
        setActiveTab('DASHBOARD');
        fetchProfileData();
      } else {
        alert(responseData.message || "Prisma verification validation failed.");
      }
    } catch (err) {
      console.error("Profile metrics text packet dispatch error:", err);
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
          
          {/* Tab Switcher Capsule */}
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
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Live Booking Requests</h2>
              {loading ? (
                <div className="p-8 text-center text-slate-500 text-sm bg-slate-950/40 rounded-xl border border-white/5">Connecting loops...</div>
              ) : incomingRequests.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm bg-slate-950/40 rounded-xl border border-white/5">No pending customer requests found.</div>
              ) : (
                incomingRequests.map((job: any) => (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className="bg-slate-950/60 border border-white/5 p-5 rounded-xl flex flex-col justify-between sm:flex-row sm:items-center gap-4 transition-all hover:border-orange-500/20 shadow-lg shadow-black/30 cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">{job.customerName || "Verified Client"}</h3>
                        <span className="text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded font-mono uppercase">{job.profession}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">{job.description}</p>
                      <div className="text-xs font-semibold text-slate-300 mt-2">
                        💰 Budget: Rs. {job.budget} &nbsp;|&nbsp; 📍 {job.city}
                      </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0 sm:justify-end" onClick={(e) => e.stopPropagation()}>
                      <button
                        disabled={actionLoading !== null}
                        onClick={() => handleStatusMutation(job.id, "REJECTED")}
                        className="h-8 px-3.5 rounded-xl bg-white/5 border border-white/5 text-[11px] font-bold text-white/70 hover:bg-red-500/10 hover:text-red-400 focus:outline-none transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        disabled={actionLoading !== null}
                        onClick={() => handleStatusMutation(job.id, "ACCEPTED")}
                        className="h-8 px-4 rounded-xl bg-orange-600 text-[11px] font-black uppercase text-white hover:bg-orange-500 focus:outline-none transition-colors"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Sidebar Columns */}
            <div className="space-y-6">
              {/* Analytics Summary */}
              <div className="bg-slate-950/60 border border-white/5 p-5 rounded-xl space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Business Analytics</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Gross Account Volume</span>
                    <p className="text-lg font-black text-emerald-400 mt-1">Rs. {monthlyEarnings.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Jobs Processed All-Time</span>
                    <p className="text-lg font-black text-white mt-1">{completedCount}</p>
                  </div>
                </div>
              </div>

              {/* Upcoming Bookings Pipeline */}
              <div className="bg-slate-950/60 border border-white/5 p-5 rounded-xl space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Upcoming Active Slotted Bookings</h2>
                {loading ? (
                  <p className="text-xs text-slate-500">Syncing...</p>
                ) : upcomingBookings.length === 0 ? (
                  <p className="text-xs text-slate-500">No active contracts assigned.</p>
                ) : (
                  upcomingBookings.map((slot: any) => (
                    <div key={slot.id} className="bg-white/5 border border-white/5 p-3 rounded-lg space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold text-white">{slot.customerName}</p>
                          <p className="text-[10px] text-slate-400">{slot.date}</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-amber-400">Rs. {slot.budget}</span>
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
        ) : (
          /* ========================================================================== */
          /* 💼 EDIT PROFILE CONFIGURATION HUBS VIEW MODE WITH DIRECT UPLOAD            */
          /* ========================================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Box Component: Photo Upload Layout */}
            <div className="bg-slate-950/60 border border-white/5 p-6 rounded-xl space-y-6 self-start">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Profile Avatar Asset</h2>
                <p className="text-xs text-slate-400 mt-1">Upload a clean high-resolution face image portfolio token.</p>
              </div>

              {/* Dynamic Live Previews Frame */}
              <div className="flex justify-center">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-dashed border-white/20 flex items-center justify-center bg-slate-900 relative group">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : currentAvatarUrl ? (
                    <img src={currentAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-slate-600 font-bold uppercase">No Image</span>
                  )}
                </div>
              </div>

              {/* Native Input Gateway */}
              <div className="space-y-3">
                <label className="block w-full cursor-pointer text-center bg-white/5 hover:bg-white/10 text-xs font-bold text-white py-2.5 rounded-xl border border-white/10 transition-colors">
                  Choose Photo File
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>

                {selectedFile && (
                  <button
                    type="button"
                    onClick={handleAvatarUpload}
                    disabled={uploadingImage}
                    className="w-full h-9 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase rounded-xl transition-all shadow-md focus:outline-none"
                  >
                    {uploadingImage ? "Uploading..." : "Upload Photo Now ↑"}
                  </button>
                )}
              </div>
            </div>

            {/* Right Box Component: Main Text Fields */}
            <div className="lg:col-span-2 bg-slate-950/60 border border-white/5 p-6 rounded-xl">
              <div className="mb-6">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Enterprise Profile Grid Settings</h2>
                <p className="text-xs text-slate-400 mt-1">Customize your active marketplace portfolio matrices visible to client pools.</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Public Display Name</label>
                    <input type="text" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full h-10 bg-slate-950/80 text-white border border-white/10 rounded-xl px-3 text-sm outline-none focus:border-orange-500/40" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Professional Headline</label>
                    <input type="text" required value={headline} onChange={(e) => setHeadline(e.target.value)} className="w-full h-10 bg-slate-950/80 text-white border border-white/10 rounded-xl px-3 text-sm outline-none focus:border-orange-500/40" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Target Base City</label>
                    <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="w-full h-10 bg-slate-950/80 text-white border border-white/10 rounded-xl px-3 text-sm outline-none focus:border-orange-500/40" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">District Name</label>
                    <input type="text" required value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full h-10 bg-slate-950/80 text-white border border-white/10 rounded-xl px-3 text-sm outline-none focus:border-orange-500/40" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Hourly Rate (Rs.)</label>
                    <input type="number" required min={150} max={2500} value={hourlyRate} onChange={(e) => setHourlyRate(Number(e.target.value))} className="w-full h-10 bg-slate-950/80 text-white border border-white/10 rounded-xl px-3 text-sm font-mono outline-none focus:border-orange-500/40" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Professional Bio Summary</label>
                  <textarea required value={bio} onChange={(e) => setBio(e.target.value)} className="w-full h-24 bg-slate-950/80 text-white border border-white/10 rounded-xl p-3 outline-none focus:border-orange-500/40 resize-none font-medium text-sm normal-case" />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => setActiveTab('DASHBOARD')} className="h-10 px-5 bg-white/5 text-white/80 text-xs font-bold rounded-xl border border-white/5 transition-colors hover:bg-white/10">
                    Cancel
                  </button>
                  <button type="submit" disabled={profileLoading} className="h-10 px-6 bg-orange-600 hover:bg-orange-500 text-white text-xs font-black uppercase rounded-xl transition-all shadow-md focus:outline-none">
                    {profileLoading ? "Saving nodes..." : "Save Profile Matrix"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dynamic Detail Overlay Popup Modal */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-950 border border-white/10 w-full max-w-lg rounded-2xl p-6 relative shadow-2xl space-y-4">
              <button onClick={() => setSelectedJob(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white text-xs focus:outline-none">✕</button>
              
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Contract Blueprint Overview</h3>
                <p className="text-xs text-slate-400">Full customer dispatch file registry details.</p>
              </div>

              <div className="space-y-3 bg-white/5 p-4 rounded-xl text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase block">Customer Sender Name</span>
                  <p className="text-white font-semibold mt-0.5">{selectedJob.customerName}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase block">Job Instructions Notes</span>
                  <p className="text-slate-200 mt-0.5">{selectedJob.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                  <div>
                    <span className="text-slate-400 font-bold uppercase block">Payout Value</span>
                    <p className="text-amber-400 font-mono font-bold mt-0.5">Rs. {selectedJob.budget}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase block">Node Area</span>
                    <p className="text-white font-semibold mt-0.5">{selectedJob.city}</p>
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