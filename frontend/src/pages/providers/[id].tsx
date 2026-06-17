"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import MainLayout from "../../components/MainLayout";
import { fetcher } from "../../lib/api";

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

  useEffect(() => {
    if (!id) return;
    fetcher(`/api/providers/${id}`)
      .then((data) => setProvider(data.provider))
      .catch((err) => setError(err.message));
  }, [id]);

  return (
    <MainLayout title="Provider profile">
      <div className="space-y-6">
        <Link href="/providers" className="text-cyan-300 hover:text-cyan-200">
          ← Back to providers
        </Link>
        {error ? (
          <p className="rounded-3xl bg-slate-900/90 p-6 text-red-400">{error}</p>
        ) : provider ? (
          <section className="rounded-3xl bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/50">
            <div className="grid gap-6 md:grid-cols-[0.7fr,0.3fr]">
              <div className="space-y-4">
                <div className="rounded-3xl bg-slate-800/80 p-6">
                  <h2 className="text-3xl font-semibold text-white">{provider.displayName}</h2>
                  <p className="mt-2 text-slate-300">{provider.headline}</p>
                  <p className="mt-4 text-slate-400">{provider.bio || "Experienced local provider with verified services."}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-800/80 p-5">Rating: {provider.rating.toFixed(1)}</div>
                  <div className="rounded-3xl bg-slate-800/80 p-5">Rate: Rs {provider.hourlyRate}/hr</div>
                </div>
                <div className="rounded-3xl bg-slate-800/80 p-5">
                  <p className="text-slate-400">Location:</p>
                  <p className="text-white">{provider.city}, {provider.district}</p>
                </div>
              </div>
              <div className="rounded-3xl bg-slate-800/80 p-6">
                <button className="w-full rounded-full bg-cyan-500 px-5 py-3 font-semibold text-slate-950">Chat now</button>
                <button className="mt-4 w-full rounded-full border border-slate-700 px-5 py-3 text-slate-100">Book service</button>
              </div>
            </div>
          </section>
        ) : (
          <div className="rounded-3xl bg-slate-900/90 p-8 text-slate-400">Loading provider details...</div>
        )}
      </div>
    </MainLayout>
  );
}
