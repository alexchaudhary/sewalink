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
  // 1. Manage reactive state vectors for datasets, inputs, and feedback layers
  const [providers, setProviders] = useState<ProviderSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  /**
   * Orchestrates dynamic network requests leveraging your centralized API fetcher block
   */
  const loadProvidersData = async (query = "", city = "") => {
    try {
      setLoading(true);
      setError("");

      // Formulate semantic query search params matching your backend request schemas
      const pathParams = new URLSearchParams();
      if (query) pathParams.append("q", query);
      if (city) pathParams.append("city", city);

      const endpointPath = pathParams.toString() 
        ? `/api/providers?${pathParams.toString()}` 
        : "/api/providers";

      const data = await fetcher(endpointPath);
      setProviders(data.providers || []);
    } catch (err: any) {
      setError(err?.message || "Network exception: Failed to synchronize with provider discovery data maps.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Automatically sync active database queries on viewport component mount
  useEffect(() => {
    loadProvidersData();
  }, []);

  /**
   * Captures and submits form parameters down the active state pipeline
   */
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadProvidersData(searchQuery, selectedCity);
  };

  return (
    <MainLayout title="Browse Verified Providers">
      <section className="grid gap-6 lg:grid-cols-4">
        
        {/* Left Side: Filter Form Block */}
        <div className="rounded-3xl bg-slate-900/90 p-6 shadow-xl shadow-slate-950/40 border border-slate-800 text-left">
          <h2 className="text-lg font-semibold text-white mb-1">Search Filters</h2>
          <p className="text-xs text-slate-400 mb-6">Filter out background-vetted maintenance specialists across Nepal.</p>
          
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Keyword Search</label>
              <input
                type="text"
                placeholder="e.g. Plumbing, Electrician"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 text-white placeholder-slate-600 border border-slate-800 focus:border-amber-500/50 rounded-xl px-3 py-2.5 text-xs focus:outline-none transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Target Region</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-slate-950 text-slate-300 border border-slate-800 focus:border-amber-500/50 rounded-xl px-3 py-2.5 text-xs focus:outline-none transition"
              >
                <option value="">All of Nepal</option>
                <option value="kathmandu">Kathmandu</option>
                <option value="lalitpur">Lalitpur</option>
                <option value="bhaktapur">Bhaktapur</option>
                <option value="pokhara">Pokhara</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs py-2.5 transition shadow-lg shadow-amber-500/5"
            >
              Apply Filter Parameters
            </button>
          </form>
        </div>

        {/* Right Side: Listing Views Render Pipeline Matrix */}
        <div className="lg:col-span-3 text-left">
          {error ? (
            <div className="mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-xs font-semibold text-red-400">
              ⚠️ {error}
            </div>
          ) : null}

          {loading ? (
            // Unified Client Loading State
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((skeleton) => (
                <div key={skeleton} className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6 h-40 animate-pulse flex flex-col justify-between">
                  <div className="h-4 bg-slate-900 rounded w-1/2" />
                  <div className="h-3 bg-slate-900 rounded w-1/3" />
                  <div className="h-4 bg-slate-900 rounded w-full mt-4" />
                </div>
              ))}
            </div>
          ) : providers.length === 0 ? (
            // Empty Dataset View Conditional Guard
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-12 text-center text-slate-400 max-w-lg mx-auto mt-6">
              <span className="text-3xl block mb-2">🔍</span>
              <h4 className="text-white font-bold text-sm mb-1">No Matching Professionals Available</h4>
              <p className="text-xs text-slate-500 leading-relaxed">We could not locate any active provider profile registries matching your targeted lookup inputs.</p>
            </div>
          ) : (
            // Core Data Grid Card Renders Mapping List
            <div className="grid gap-6 md:grid-cols-2">
              {providers.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  id={provider.id}
                  name={provider.displayName}
                  profession={provider.headline || "Independent Maintenance Professional"}
                  rating={provider.rating || 0}
                  price={provider.hourlyRate || 0}
                  location={provider.city || "Nepal"}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
