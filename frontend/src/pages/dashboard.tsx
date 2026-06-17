"use client";

import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import { fetcher } from "../lib/api";

interface Booking {
  id: string;
  type: string;
  status: string;
  totalPrice: number;
  location: string;
  scheduledAt: string;
}

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetcher("/api/bookings")
      .then((data) => setBookings(data.bookings || []))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <MainLayout title="Customer dashboard">
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-slate-900/90 p-6 shadow-xl shadow-slate-950/40">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Active bookings</p>
          <p className="mt-4 text-4xl font-semibold text-white">{bookings.filter((booking) => booking.status === "PENDING").length}</p>
        </div>
        <div className="rounded-3xl bg-slate-900/90 p-6 shadow-xl shadow-slate-950/40">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Completed</p>
          <p className="mt-4 text-4xl font-semibold text-white">{bookings.filter((booking) => booking.status === "COMPLETED").length}</p>
        </div>
        <div className="rounded-3xl bg-slate-900/90 p-6 shadow-xl shadow-slate-950/40">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Total spend</p>
          <p className="mt-4 text-4xl font-semibold text-white">Rs {bookings.reduce((sum, booking) => sum + booking.totalPrice, 0)}</p>
        </div>
      </section>
      <section className="mt-8 rounded-3xl bg-slate-900/90 p-6 shadow-xl shadow-slate-950/40">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Recent bookings</h2>
            <p className="mt-2 text-slate-400">Review your latest requests and booking status.</p>
          </div>
        </div>
        {error ? <p className="mt-6 text-red-400">{error}</p> : null}
        <div className="mt-6 grid gap-4">
          {bookings.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-slate-400">No bookings found. Sign in and create your first booking.</div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
                <div className="flex items-center justify-between gap-4 text-white">
                  <span className="font-semibold">{booking.type} service</span>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-200">{booking.status}</span>
                </div>
                <p className="mt-3 text-slate-300">{booking.location}</p>
                <p className="mt-2 text-sm text-slate-400">Scheduled: {new Date(booking.scheduledAt).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </MainLayout>
  );
}
