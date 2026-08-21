"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import MainLayout from "../components/MainLayout";
import { fetcher } from "../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // 1. Prevent duplicate network payload dispatches
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const data = await fetcher("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      
      // 2. Commit the cryptographically verified JWT bearer string to local state maps
      window.localStorage.setItem("sewalink_token", data.token);
      
      // 3. CRITICAL MULTI-TENANT FIX: Evaluate role parameters to isolate dashboard redirection paths
      const assignedRole = data.user?.role?.toUpperCase();
      
      if (assignedRole === "ADMIN") {
        router.push("/admin-dashboard");
      } else if (assignedRole === "PROVIDER") {
        router.push("/provider-dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "Invalid credentials sequence. Authentication rejected.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Sign in to SewaLink">
      <div className="mx-auto max-w-2xl rounded-3xl bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40 border border-slate-800 text-left">
        <p className="text-slate-400">Sign in with your email and password to access bookings, chat, and saved providers.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div>
            <label className="block text-sm text-slate-300">Email</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading}
              type="email"
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400 disabled:opacity-50 transition"
              placeholder="name@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm text-slate-300">Password</label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
              type="password"
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400 disabled:opacity-50 transition"
              placeholder="Enter your password"
              required
            />
          </div>
          
          {error ? <p className="text-sm text-red-400">⚠️ {error}</p> : null}
          
          <button 
            disabled={loading}
            className="w-full rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              "Sign in"
            )}
          </button>
        </form>
        
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-400">
          <Link href="/forgot-password" className="text-cyan-300 hover:text-cyan-200">
            Forgot password?
          </Link>
          <Link href="/register" className="text-cyan-300 hover:text-cyan-200">
            Create account
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
