"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MainLayout from "../components/MainLayout";
import ProviderCard from "../components/ProviderCard";
import { BrandBadge, BrandButton, BrandCard, BrandInput, BrandSelect } from "../components/ui/BrandUI";
import { fetcher } from "../lib/api";

interface ProviderSummary {
  id: string;
  displayName: string;
  headline: string;
  hourlyRate: number;
  rating: number;
  city: string;
}

const SERVICES = [
  { name: "Plumbing", icon: "🔧" },
  { name: "Electrical", icon: "⚡" },
  { name: "Carpentry", icon: "🪛" },
  { name: "Painting", icon: "🎨" },
  { name: "Cleaning", icon: "✨" },
];

export default function ProvidersPage() {
  const [providers, setProviders] = useState<ProviderSummary[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ProviderSummary[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [location, setLocation] = useState("");

  const loadProviders = async () => {
    setError("");
    setLoading(true);

    try {
      const data = await fetcher("/api/providers");
      setProviders(data.providers || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to load providers";
      setError(message);
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProviders();
  }, []);

  useEffect(() => {
    let filtered = providers;

    if (selectedService) {
      const query = selectedService.toLowerCase();
      filtered = filtered.filter((provider) => {
        const searchableText = `${provider.headline} ${provider.displayName} ${provider.city}`.toLowerCase();
        return searchableText.includes(query);
      });
    }

    if (selectedRating) {
      filtered = filtered.filter((provider) => provider.rating >= selectedRating);
    }

    filtered = filtered.filter((provider) => provider.hourlyRate <= priceRange[1]);

    if (location.trim()) {
      const query = location.trim().toLowerCase();
      filtered = filtered.filter((provider) => {
        const searchableText = `${provider.city} ${provider.displayName}`.toLowerCase();
        return searchableText.includes(query);
      });
    }

    setFilteredProviders(filtered);
  }, [providers, selectedService, selectedRating, priceRange, location]);

  const verifiedProviders = providers.filter((provider) => provider.rating >= 4.5).length;
  const averageRating =
    providers.length > 0 ? (providers.reduce((sum, provider) => sum + provider.rating, 0) / providers.length).toFixed(1) : "0.0";
  const startingPrice = providers.length > 0 ? Math.min(...providers.map((provider) => provider.hourlyRate)) : 0;

  const resetFilters = () => {
    setSelectedService(null);
    setSelectedRating(null);
    setPriceRange([0, 5000]);
    setLocation("");
  };

  return (
    <MainLayout title="Find Service Providers">
      <div className="space-y-8">
        <BrandCard className="relative overflow-hidden p-8 shadow-2xl shadow-slate-950/40 sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.16),transparent_30%)]" />
          <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 translate-x-1/4 -translate-y-1/4 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative max-w-3xl space-y-6">
            <BrandBadge>Nepal's Trusted Service Marketplace</BrandBadge>

            <h1 className="mb-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Find trusted local service providers
            </h1>

            <p className="max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              Connect with verified plumbers, electricians, carpenters, painters, and cleaners. Transparent pricing,
              upfront ratings, and fast local support.
            </p>

            <div className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-5 shadow-inner shadow-slate-950/20">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Popular services</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SERVICES.map((service) => (
                  <button
                    key={service.name}
                    onClick={() => setSelectedService(selectedService === service.name ? null : service.name)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-medium transition ${
                      selectedService === service.name
                        ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-300"
                        : "border-slate-800 bg-slate-900/70 text-slate-300 hover:border-cyan-400/40 hover:text-cyan-300"
                    }`}
                  >
                    <span>{service.icon}</span>
                    {service.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <BrandButton asChild variant="primary">
                <a href="#directory">Browse Providers</a>
              </BrandButton>
              <BrandButton variant="secondary">Become a Provider</BrandButton>
            </div>
          </div>
        </BrandCard>

        {providers.length > 0 ? (
          <section className="grid gap-6 lg:grid-cols-3">
            <BrandCard className="p-6 shadow-xl shadow-slate-950/40">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">Verified Providers</p>
              <p className="mt-3 text-3xl font-semibold text-white">{verifiedProviders}</p>
              <p className="mt-1 text-sm text-slate-400">4.5+ star rated</p>
            </BrandCard>

            <BrandCard className="p-6 shadow-xl shadow-slate-950/40">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">Avg Rating</p>
              <p className="mt-3 text-3xl font-semibold text-white">{averageRating} ⭐</p>
              <p className="mt-1 text-sm text-slate-400">Customer reviews</p>
            </BrandCard>

            <BrandCard className="p-6 shadow-xl shadow-slate-950/40">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">Starting Price</p>
              <p className="mt-3 text-3xl font-semibold text-white">Rs {startingPrice}/hr</p>
              <p className="mt-1 text-sm text-slate-400">From the lowest listed rate</p>
            </BrandCard>
          </section>
        ) : (
          <section className="flex justify-center">
            <div className="w-full max-w-2xl rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-8 text-center shadow-xl shadow-slate-950/20">
              <h2 className="text-xl font-semibold text-white">Just launched — be our first verified provider</h2>
              <p className="mt-2 text-sm text-slate-400">Stats will appear here as providers join.</p>
            </div>
          </section>
        )}

        <section id="directory" className="space-y-6">
          <BrandCard className="p-6 shadow-xl shadow-slate-950/20">
            <div className="grid gap-4 lg:grid-cols-4">
              <div className="min-w-[180px]">
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300">
                  Service Type
                </label>
                <BrandSelect
                  value={selectedService || ""}
                  onChange={(event) => setSelectedService(event.target.value || null)}
                >
                  <option value="">All Services</option>
                  {SERVICES.map((service) => (
                    <option key={service.name} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                </BrandSelect>
              </div>

              <div className="min-w-[180px]">
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300">
                  Minimum Rating
                </label>
                <BrandSelect
                  value={selectedRating || ""}
                  onChange={(event) => setSelectedRating(event.target.value ? Number(event.target.value) : null)}
                >
                  <option value="">All ratings</option>
                  <option value="3">3+ stars</option>
                  <option value="4">4+ stars</option>
                  <option value="4.5">4.5+ stars</option>
                </BrandSelect>
              </div>

              <div className="min-w-55">
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300">
                  Max Price (Rs/hr)
                </label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(event) => setPriceRange([0, Number(event.target.value)])}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-cyan-500"
                />
                <div className="mt-2 text-sm text-slate-400">Up to Rs {priceRange[1]}</div>
              </div>

              <div className="min-w-[180px]">
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300">
                  Location
                </label>
                <BrandInput
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Search city"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
                {filteredProviders.length} provider{filteredProviders.length !== 1 ? "s" : ""} found
              </div>
              <BrandButton variant="secondary" onClick={resetFilters}>
                Reset Filters
              </BrandButton>
            </div>
          </BrandCard>

          {error ? (
            <BrandCard className="border-red-500/30 bg-slate-950/70 p-8 text-center shadow-xl shadow-slate-950/40">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-2xl">
                ⚠️
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">We couldn’t load providers right now</h3>
              <p className="mt-2 text-sm text-slate-400">{error}</p>
              <BrandButton variant="secondary" className="mt-5 border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20" onClick={() => void loadProviders()}>
                Try again
              </BrandButton>
            </BrandCard>
          ) : loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <BrandCard key={index} className="p-4 shadow-xl shadow-slate-950/40">
                  <div className="animate-pulse space-y-4">
                    <div className="h-28 rounded-2xl bg-slate-800" />
                    <div className="h-3 w-24 rounded bg-slate-800" />
                    <div className="h-5 w-3/4 rounded bg-slate-800" />
                    <div className="h-10 rounded-2xl bg-slate-800" />
                  </div>
                </BrandCard>
              ))}
            </div>
          ) : providers.length === 0 ? (
            <BrandCard className="border-slate-800 bg-linear-to-br from-slate-900/90 to-slate-950 p-12 text-center shadow-xl shadow-slate-950/40">
              <div className="mx-auto max-w-md space-y-4">
                <h3 className="text-2xl font-semibold text-white">Just Launched</h3>
                <p className="text-slate-400">
                  We're building a community of verified service providers. Be the first to join and grow your business!
                </p>
                <div className="flex justify-center gap-3 pt-4">
                  <BrandButton asChild variant="primary">
                    <Link href="/register">Become a Provider</Link>
                  </BrandButton>
                  <BrandButton variant="secondary">Learn More</BrandButton>
                </div>
              </div>
            </BrandCard>
          ) : filteredProviders.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProviders.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  id={provider.id}
                  name={provider.displayName}
                  profession={provider.headline}
                  rating={provider.rating}
                  price={provider.hourlyRate}
                  location={provider.city || "Unknown"}
                />
              ))}
            </div>
          ) : (
            <BrandCard className="border-slate-800 bg-slate-950/60 p-8 text-center text-slate-400 shadow-xl shadow-slate-950/20">
              <p className="font-medium">No providers match your filters.</p>
              <button onClick={resetFilters} className="mt-3 text-sm font-medium text-cyan-300 hover:text-cyan-200">
                Clear filters
              </button>
            </BrandCard>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
