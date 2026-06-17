"use client";

import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import ProviderCard from "../components/ProviderCard";
import { fetcher } from "../lib/api";

interface ProviderSummary {
  id: string;
  displayName: string;
  headline: string;
  hourlyRate: number;
  rating: number;
  city: string;
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<ProviderSummary[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetcher("/api/providers")
      .then((data) => setProviders(data.providers || []))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <MainLayout title="Browse providers">
      <section className="grid gap-6 lg:grid-cols-4">
        <div className="rounded-3xl bg-slate-900/90 p-6 shadow-xl shadow-slate-950/40">
          <h2 className="text-lg font-semibold text-white">Search filters</h2>
          <p className="mt-3 text-slate-400">Search by category, price, rating, and location.</p>
        </div>
        <div className="lg:col-span-3">
          {error ? <p className="text-red-400">{error}</p> : null}
          <div className="grid gap-6 md:grid-cols-2">
            {providers.length === 0 ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-slate-400">No providers available yet.</div>
            ) : (
              providers.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  id={provider.id}
                  name={provider.displayName}
                  profession={provider.headline}
                  rating={provider.rating}
                  price={provider.hourlyRate}
                  location={provider.city || "Unknown"}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
