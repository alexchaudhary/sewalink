'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from "../../components/MainLayout";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function WorkerDashboard() {
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Navigation Sub-tabs
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'PROFILE_SETTINGS'>('DASHBOARD');

  // Filter & Search
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'THIS_WEEK' | 'THIS_MONTH' | 'ALL_TIME'>('THIS_MONTH');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('ALL');

  // Details Modal
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  // Profile Form States
  const [displayName, setDisplayName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState(500);
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // Marketplace Availability
  const [isOnline, setIsOnline] = useState(true);
  const [togglingStatus, setTogglingStatus] = useState(false);

  // Profile Image Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null);

  // Financial Metrics
  const [completedCount, setCompletedCount] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);

  // 1. Fetch & Filter Dashboard Data
  const fetchDashboardData = async () => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("kamdarnepal_token") : null;
    const userStr = typeof window !== "undefined" ? window.localStorage.getItem("user") : null;
    const currentUser = userStr ? JSON.parse(userStr) : null;

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
        const rawBookings = responseData?.bookings || responseData?.data?.bookings || [];
        
        // SAFEGUARD: Only include incoming PENDING requests created by OTHER customers (not yourself)
        const pendingRequests = rawBookings.filter((b: any) => {
          const isPending = b?.status?.toUpperCase() === "PENDING";
          const isNotSelf = currentUser?.id ? b?.customerId !== currentUser.id : true;
          return isPending && isNotSelf;
        });

        const confirmedSlots = rawBookings.filter((b: any) => 
          b?.status?.toUpperCase() === "CONFIRMED" || b?.status?.toUpperCase() === "ACCEPTED"
        );
        
        const completedJobs = rawBookings.filter((b: any) => b?.status?.toUpperCase() === "COMPLETED");

        setIncomingRequests(pendingRequests);
        setUpcomingBookings(confirmedSlots);
        setCompletedCount(completedJobs.length);

        const revenue = completedJobs.reduce((sum: number, b: any) => sum + Number(b.budget || 0), 0);
        setMonthlyEarnings(revenue);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Worker Profile
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
        
        if (profile.availabilityStatus !== undefined) {
          setIsOnline(profile.availabilityStatus === "AVAILABLE" || profile.availabilityStatus === "ONLINE");
        }
      }
    } catch (err) {
      console.error("Failed to fetch profile data:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchProfileData();
  }, []);

  // Toggle Marketplace Online/Offline Status
  const handleAvailabilityToggle = async () => {
    setTogglingStatus(true);
    const token = typeof window !== "undefined" ? window.localStorage.getItem("kamdarnepal_token") : null;
    const targetState = !isOnline;
    const stringPayload = targetState ? "AVAILABLE" : "OFFLINE";

    try {
      const res = await fetch(`${BASE_API_URL}/providers/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ availabilityStatus: stringPayload })
      });

      if (res.ok) {
        setIsOnline(targetState);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setTogglingStatus(false);
    }
  };

  // Status Mutation Handler (Accept / Reject / Complete)
  const handleStatusMutation = async (bookingId: string | string[], targetStatus: "ACCEPTED" | "REJECTED" | "COMPLETED") => {
    const idsToUpdate = Array.isArray(bookingId) ? bookingId : [bookingId];
    setActionLoading(idsToUpdate[0]);
    const token = typeof window !== "undefined" ? window.localStorage.getItem("kamdarnepal_token") : null;

    let backendStatusToken = "CONFIRMED";
    if (targetStatus === "REJECTED") backendStatusToken = "REJECTED";
    if (targetStatus === "COMPLETED") backendStatusToken = "COMPLETED";

    try {
      await Promise.all(
        idsToUpdate.map(id =>
          fetch(`${BASE_API_URL}/bookings/${id}/status`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ status: backendStatusToken })
          })
        )
      );
      fetchDashboardData();
    } catch (err) {
      console.error("Status mutation error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Avatar Selection & Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile) return;

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
        setCurrentAvatarUrl(data.avatarUrl);
        setSelectedFile(null);
        setImagePreview(null);
        fetchProfileData();
      } else {
        alert(data.message || "Upload failed.");
      }
    } catch (err) {
      console.error("Avatar upload exception:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  // Submit Profile Changes
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
        setActiveTab('DASHBOARD');
        fetchProfileData();
      }
    } catch (err) {
      console.error("Profile update error:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  // Filter pending requests by search/location
  const filteredRequests = incomingRequests.filter((job: any) => {
    const matchesSearch = searchQuery === '' || 
      (job.customerName && job.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.description && job.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLocation = locationFilter === 'ALL' || job.city === locationFilter;

    return matchesSearch && matchesLocation;
  });

  // Group duplicate customer pending requests into aggregated UI cards
  const groupedRequests: any[] = Object.values(
    filteredRequests.reduce((acc: any, job: any) => {
      const key = job.customerId || job.customerPhone || job.customerName;
      if (!acc[key]) {
        acc[key] = {
          ...job,
          requestCount: 1,
          allJobIds: [job.id]
        };
      } else {
        acc[key].requestCount += 1;
        acc[key].allJobIds.push(job.id);
      }
      return acc;
    }, {})
  );

  return (
    <MainLayout title="Worker Dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 text-slate-100">
        
        {/* Header Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Worker Dashboard Hub</h1>
            <p className="text-slate-400 text-sm mt-1">
              Monitor incoming jobs, manage schedules, and update your dynamic profile.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Status Switcher */}
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl">
              <span className="text-xs font-medium text-slate-300">Marketplace Status</span>
              <button
                type="button"
                disabled={togglingStatus}
                onClick={handleAvailabilityToggle}
                className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isOnline ? 'bg-emerald-500' : 'bg-slate-700'}`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isOnline ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              <span className={`text-[11px] font-bold uppercase tracking-wider ${isOnline ? 'text-emerald-400' : 'text-slate-500'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* View Sub-Tabs */}
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('DASHBOARD')}
                className={`px-4 py-1.5 rounded-lg transition-all ${activeTab === 'DASHBOARD' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('PROFILE_SETTINGS')}
                className={`px-4 py-1.5 rounded-lg transition-all ${activeTab === 'PROFILE_SETTINGS' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'DASHBOARD' ? (
          /* DASHBOARD VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Live Requests Stream */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Filters */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    Live Booking Requests
                    <span className="bg-orange-500/10 text-orange-400 text-xs px-2 py-0.5 rounded-full border border-orange-500/20 font-medium">
                      {groupedRequests.length}
                    </span>
                  </h2>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search requests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-1.5 outline-none focus:border-slate-700 w-36 sm:w-44"
                  />
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs text-slate-400 rounded-lg px-2 py-1.5 outline-none"
                  >
                    <option value="ALL">All Cities</option>
                    <option value="Bhaktapur">Bhaktapur</option>
                    <option value="Kathmandu">Kathmandu</option>
                    <option value="Lalitpur">Lalitpur</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="p-8 text-center text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800 text-xs">
                  Loading requests...
                </div>
              ) : groupedRequests.length === 0 ? (
                <div className="p-8 text-center text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800 text-xs">
                  No pending booking requests available right now.
                </div>
              ) : (
                <div className="space-y-3">
                  {groupedRequests.map((job: any) => {
                    const phoneNum = job.customerPhone !== "N/A" ? job.customerPhone : null;
                    return (
                      <div
                        key={job.id}
                        onClick={() => setSelectedJob(job)}
                        className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-all cursor-pointer group shadow-sm"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors text-sm">
                              {job.customerName}
                            </h3>
                            <span className="text-[10px] font-bold uppercase tracking-wide bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                              {job.profession || "Instant"}
                            </span>
                            {job.requestCount > 1 && (
                              <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                                {job.requestCount} Requests
                              </span>
                            )}
                          </div>
                          
                          <p className="text-xs text-slate-300 leading-relaxed line-clamp-1">
                            {job.description || "No specific instructions provided."}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 pt-1">
                            <span className="font-medium text-slate-200">💰 Rs. {job.budget}</span>
                            <span className="text-slate-600">•</span>
                            <span className="flex items-center gap-1">📍 {job.city}</span>
                            <span className="text-slate-600">•</span>
                            <span>⏰ {job.date || "Today"}</span>
                          </div>

                          {/* Direct Phone Call Button */}
                          {phoneNum && (
                            <div className="pt-1.5">
                              <a
                                href={`tel:${phoneNum}`}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-emerald-400 bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 px-2.5 py-1 rounded-md transition-all group/phone"
                              >
                                <span className="text-slate-500 group-hover/phone:text-emerald-400">📞</span>
                                <span>{phoneNum}</span>
                                <span className="text-[9px] uppercase tracking-wider font-sans font-bold text-emerald-400 bg-emerald-500/10 px-1 rounded">Call</span>
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 flex-shrink-0 sm:self-center pt-2 sm:pt-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            disabled={actionLoading !== null}
                            onClick={() => handleStatusMutation(job.allJobIds, "REJECTED")}
                            className="h-8 px-3.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-xs font-semibold text-red-400 hover:border-red-500/40 transition-all"
                          >
                            Reject
                          </button>
                          <button
                            disabled={actionLoading !== null}
                            onClick={() => handleStatusMutation(job.allJobIds, "ACCEPTED")}
                            className="h-8 px-4 rounded-lg bg-orange-600 hover:bg-orange-500 text-xs font-semibold text-white transition-colors shadow-sm"
                          >
                            Accept {job.requestCount > 1 ? `(${job.requestCount})` : ''}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Side Widgets */}
            <div className="space-y-6">
              
              {/* Analytics Box */}
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">Business Analytics</h3>
                  <select
                    value={analyticsTimeframe}
                    onChange={(e: any) => setAnalyticsTimeframe(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-slate-400 text-[11px] rounded-lg px-2 py-1 outline-none"
                  >
                    <option value="THIS_MONTH">This Month</option>
                    <option value="THIS_WEEK">This Week</option>
                    <option value="ALL_TIME">All Time</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Gross Earnings</span>
                    <p className="text-base font-bold text-emerald-400">Rs. {monthlyEarnings.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Jobs Completed</span>
                    <p className="text-base font-bold text-orange-400">{completedCount}</p>
                  </div>
                </div>
              </div>

              {/* Active Bookings Widget */}
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-4">
                <h3 className="font-bold text-white text-sm">Active Slotted Bookings</h3>
                {loading ? (
                  <p className="text-xs text-slate-500">Syncing schedule...</p>
                ) : upcomingBookings.length === 0 ? (
                  <p className="text-xs text-slate-500">No active slotted bookings.</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingBookings.map((slot: any) => {
                      const slotPhone = slot.customerPhone !== "N/A" ? slot.customerPhone : null;
                      return (
                        <div key={slot.id} className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-lg space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-xs font-bold text-white">{slot.customerName}</h4>
                              <p className="text-[11px] text-slate-400 mt-0.5">📅 {slot.date}</p>
                            </div>
                            <span className="text-xs font-semibold text-emerald-400">Rs. {slot.budget}</span>
                          </div>
                          {slotPhone && (
                            <p className="text-xs text-slate-400 font-mono">
                              📞 <a href={`tel:${slotPhone}`} className="hover:underline hover:text-white">{slotPhone}</a>
                            </p>
                          )}
                          <button
                            disabled={actionLoading !== null}
                            onClick={() => handleStatusMutation(slot.id, "COMPLETED")}
                            className="w-full h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-600 text-emerald-400 hover:text-white text-[11px] font-bold tracking-wider uppercase transition-colors focus:outline-none mt-2"
                          >
                            {actionLoading === slot.id ? "Updating..." : "Complete Work ✔"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* EDIT PROFILE VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-xl space-y-4 h-fit">
              <h3 className="font-bold text-white text-sm">Profile Avatar</h3>
              <p className="text-xs text-slate-400">Upload a clean profile image for clients to view.</p>
              
              <div className="flex justify-center py-2">
                <div className="w-24 h-24 rounded-full border-2 border-slate-700 overflow-hidden bg-slate-950 flex items-center justify-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : currentAvatarUrl ? (
                    <img src={currentAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-slate-500">No Image</span>
                  )}
                </div>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer"
              />

              {selectedFile && (
                <button
                  type="button"
                  onClick={handleAvatarUpload}
                  disabled={uploadingImage}
                  className="w-full h-9 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  {uploadingImage ? "Uploading..." : "Save Avatar"}
                </button>
              )}
            </div>

            <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 p-6 rounded-xl space-y-6">
              <div>
                <h3 className="font-bold text-white text-sm">Marketplace Profile</h3>
                <p className="text-xs text-slate-400 mt-0.5">Customize your details visible to potential clients.</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Public Display Name</label>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full h-9 bg-slate-950 text-white border border-slate-800 rounded-lg px-3 text-xs outline-none focus:border-slate-600 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Professional Headline</label>
                    <input
                      type="text"
                      required
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="w-full h-9 bg-slate-950 text-white border border-slate-800 rounded-lg px-3 text-xs outline-none focus:border-slate-600 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-9 bg-slate-950 text-white border border-slate-800 rounded-lg px-3 text-xs outline-none focus:border-slate-600 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">District</label>
                    <input
                      type="text"
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full h-9 bg-slate-950 text-white border border-slate-800 rounded-lg px-3 text-xs outline-none focus:border-slate-600 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Hourly Rate (Rs.)</label>
                    <input
                      type="number"
                      required
                      min={150}
                      max={2500}
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(Number(e.target.value))}
                      className="w-full h-9 bg-slate-950 text-white border border-slate-800 rounded-lg px-3 text-xs font-mono outline-none focus:border-slate-600 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Bio / Overview</label>
                  <textarea
                    required
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full h-24 bg-slate-950 text-white border border-slate-800 rounded-lg p-3 outline-none focus:border-slate-600 resize-none font-medium text-xs leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('DASHBOARD')}
                    className="h-9 px-4 bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="h-9 px-4 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    {profileLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DETAILS OVERLAY MODAL */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-lg w-full relative space-y-4 shadow-xl">
              <button
                onClick={() => setSelectedJob(null)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white text-xs focus:outline-none transition-colors"
              >
                ✕
              </button>

              <div>
                <h3 className="font-bold text-white text-base">Booking Details</h3>
                <p className="text-xs text-slate-400">Complete service request breakdown.</p>
              </div>

              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
                <div>
                  <span className="text-slate-500 font-semibold block">Client Name</span>
                  <span className="text-white font-medium">{selectedJob.customerName}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Phone Contact</span>
                  <span className="text-white font-mono">{selectedJob.customerPhone || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Service Description</span>
                  <p className="text-white mt-0.5 leading-relaxed">{selectedJob.description || "None provided."}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-slate-500 font-semibold block">Budget</span>
                    <span className="text-emerald-400 font-bold">Rs. {selectedJob.budget}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Location</span>
                    <span className="text-white">{selectedJob.city}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="h-8 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
}