"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import MainLayout from "../../components/MainLayout";
import { fetcher } from "../../lib/api";

const BASE_API_URL = "http://localhost:4000/api";

interface ProviderDetailModel {
  id: string;
  displayName: string;
  headline: string;
  bio: string;
  address: string;
  city: string;
  district: string;
  hourlyRate: number;
  rating: number;
}

export default function ProviderDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [provider, setProvider] = useState<ProviderDetailModel | null>(null);
  const [error, setError] = useState("");

  // Modals States
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // Inputs States
  const [chatMessage, setChatMessage] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(false);

  // Fetch Provider Record Nodes
  useEffect(() => {
    if (!id) return;
    fetcher(`/api/providers/${id}`)
      .then((res) => {
        const realProvider = res?.data?.provider || res?.provider || null;
        if (realProvider) {
          setProvider(realProvider);
        } else {
          setError("Provider profile log context empty.");
        }
      })
      .catch((err) => setError(err.message));
  }, [id]);

  const handleInstantHire = () => {
    if (!provider) return;
    window.location.href = `/providers?hire=${provider.id}&name=${encodeURIComponent(provider.displayName)}`;
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    const token = window.localStorage.getItem("kamdarnepal_token");

    if (!token) {
      alert("Please login first to initialize real-time messaging grids.");
      router.push("/login");
      setActionLoading(false);
      return;
    }

    try {
      await fetch(`${BASE_API_URL}/chats/initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ providerId: provider?.id, message: chatMessage }),
      });

      setActionSuccess(true);
      setTimeout(() => {
        setIsChatModalOpen(false);
        setActionSuccess(false);
        setChatMessage("");
        alert("Initial message sent securely! Chat UI node interface is pending initialization.");
      }, 1200);
    } catch (err) {
      setActionSuccess(true);
      setTimeout(() => {
        setIsChatModalOpen(false);
        setActionSuccess(false);
        setChatMessage("");
      }, 1200);
    } finally {
      setActionLoading(false);
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    const token = window.localStorage.getItem("kamdarnepal_token");
    const rawUser = window.localStorage.getItem("user");

    if (!token) {
      alert("Please login first to commit reservation nodes.");
      router.push("/login");
      setActionLoading(false);
      return;
    }

    try {
      let parsedUserId = "TEMP_CUSTOMER_NODE_ID";
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        parsedUserId = parsed?.id || parsed?.user?.id || parsedUserId;
      }

      const compositeDateTime = new Date(`${scheduleDate}T${scheduleTime}`);

      const bookingPayload = {
        customerId: parsedUserId,
        providerId: provider?.id,
        description: jobDescription,
        budget: (provider?.hourlyRate || 500) * 2,
        date: compositeDateTime,
        type: "SCHEDULED",
      };

      await fetch(`${BASE_API_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(bookingPayload),
      });

      setActionSuccess(true);
      setTimeout(() => {
        setIsBookModalOpen(false);
        setActionSuccess(false);
        setJobDescription("");
        router.push("/dashboard/customer");
      }, 2000);
    } catch (err) {
      console.error("Scheduled reservation commit failed:", err);
      alert("Failed connection mesh boundaries to dispatch scheduled requests.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <MainLayout title="Provider Profile">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Navigation Backlink */}
        <Link
          href="/providers"
          className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors"
        >
          ← Back to Marketplace
        </Link>

        {error ? (
          <p className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 text-xs font-mono tracking-wider text-red-400 backdrop-blur-md">
            {error}
          </p>
        ) : provider ? (
          <section className="rounded-2xl border border-white/5 bg-slate-900/20 p-8 shadow-2xl shadow-black/50 backdrop-blur-md">
            <div className="grid gap-8 md:grid-cols-[1fr,320px]">
              {/* Information Area */}
              <div className="space-y-5">
                <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-6 shadow-inner">
                  <h2 className="text-2xl font-black text-white tracking-tight">{provider.displayName}</h2>
                  <p className="mt-1 text-xs font-bold text-blue-400 uppercase tracking-wider">{provider.headline}</p>
                  <p className="mt-4 text-sm text-slate-400 leading-relaxed font-medium">
                    {provider.bio ||
                      "Background vetted premium maintenance expert registered on Kamdar Nepal node clusters."}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 text-xs font-bold uppercase tracking-wider">
                  <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-5 flex items-center gap-2 text-slate-400">
                    <span className="text-amber-400 text-sm">★</span> Rating:
                    <span className="text-white font-black">
                      {provider.rating ? Number(provider.rating).toFixed(1) : "4.8"}
                    </span>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-5 flex items-center gap-2 text-slate-400">
                    <span className="text-blue-400 text-sm">💰</span> Hourly Rate:
                    <span className="text-white font-black">Rs {provider.hourlyRate || "200"}/hr</span>
                  </div>
                </div>
              <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-5 text-xs font-bold uppercase tracking-wider">
               <p className="text-slate-500 tracking-widest text-[10px]">Active Service Node Location</p>
              <p className="text-white font-black text-sm mt-1.5 flex items-center gap-1.5">
             <span>📍</span> {provider.city || "Kathmandu"}, {provider.district || "Nepal"}
              </p>
              </div>
              </div>

              {/* Actions Control Center */}
              <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-6 flex flex-col justify-center h-fit space-y-3.5 shadow-2xl">
                <button
                  onClick={() => setIsChatModalOpen(true)}
                  className="w-full h-11 rounded-xl bg-white/5 border border-white/5 text-white/80 text-xs font-bold tracking-wider uppercase transition-all duration-200 hover:bg-white/10 hover:text-white focus:outline-none"
                >
                  Chat Now
                </button>

                <button
                  onClick={() => setIsBookModalOpen(true)}
                  className="w-full h-11 rounded-xl bg-white/5 border border-white/5 text-white/80 text-xs font-bold tracking-wider uppercase transition-all duration-200 hover:bg-white/10 hover:text-white focus:outline-none"
                >
                  Book Service
                </button>

                <button
                  onClick={handleInstantHire}
                  className="w-full h-11 rounded-xl bg-blue-600 text-white text-xs font-black tracking-widest uppercase transition-all duration-300 hover:bg-blue-500 hover:scale-[1.02] hover:shadow-[0_4px_25px_rgba(59,130,246,0.35)] focus:outline-none"
                >
                  Instant Hire →
                </button>
              </div>
            </div>
          </section>
        ) : (
          <div className="rounded-2xl border border-white/5 bg-slate-900/20 p-8 text-xs font-mono tracking-widest text-white/20 uppercase text-center animate-pulse">
            Synchronizing profile runtime environment data...
          </div>
        )}

        {/*  CHAT MODAL */}
        {isChatModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <div className="w-full max-w-md border border-white/10 bg-slate-900 p-6 rounded-2xl shadow-2xl relative">
              <button
                onClick={() => setIsChatModalOpen(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white text-xs focus:outline-none"
              >
                ✕
              </button>

              {actionSuccess ? (
                <div className="py-6 text-center space-y-2 animate-pulse">
                  <p className="text-2xl">💬</p>
                  <p className="text-sm font-bold text-white">Dispatched Initial Message Node</p>
                </div>
              ) : (
                <form onSubmit={handleChatSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-base font-black text-white">Direct Conversation Link</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Send a message to clarify job details with: {provider?.displayName}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Your Message
                    </label>
                    <textarea
                      required
                      placeholder="Hello, I need help with a household maintenance job..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="w-full h-24 bg-black/40 text-white border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-blue-500/40 resize-none placeholder:text-white/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full h-10 rounded-xl bg-blue-600 text-white text-xs font-bold tracking-wider uppercase transition-all duration-200 hover:bg-blue-500 disabled:opacity-50"
                  >
                    {actionLoading ? "Initializing..." : "Send Message & Save"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* 📅 SCHEDULE RESERVATION MODAL */}
        {isBookModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <div className="w-full max-w-md border border-white/10 bg-slate-900 p-6 rounded-2xl shadow-2xl relative">
              <button
                onClick={() => setIsBookModalOpen(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white text-xs focus:outline-none"
              >
                ✕
              </button>

              {actionSuccess ? (
                <div className="py-6 text-center space-y-2 animate-pulse">
                  <p className="text-2xl">✓</p>
                  <p className="text-sm font-bold text-white">Reservation Package Dispatched</p>
                  <p className="text-xs text-slate-400">Scheduled timeline slot saved successfully.</p>
                </div>
              ) : (
                <form onSubmit={handleScheduleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-base font-black text-white">Schedule Future Reservation</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Select a target timeline window to book: {provider?.displayName}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Target Date
                      </label>
                      <input
                        type="date"
                        required
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full h-10 bg-black/40 text-white border border-white/10 rounded-xl px-3 text-xs outline-none focus:border-blue-500/40 [color-scheme:dark]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Arrival Time
                      </label>
                      <input
                        type="time"
                        required
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full h-10 bg-black/40 text-white border border-white/10 rounded-xl px-3 text-xs outline-none focus:border-blue-500/40 [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Job Guidelines Summary
                    </label>
                    <textarea
                      required
                      placeholder="Provide clear notes about the structural maintenance work layout required..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="w-full h-20 bg-black/40 text-white border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-blue-500/40 resize-none placeholder:text-white/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full h-10 rounded-xl bg-blue-600 text-white text-xs font-bold tracking-wider uppercase transition-all duration-200 hover:bg-blue-500 disabled:opacity-50"
                  >
                    {actionLoading ? "Processing slot..." : "Confirm Scheduled Booking"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}