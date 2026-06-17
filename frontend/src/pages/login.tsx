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
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const data = await fetcher("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      window.localStorage.setItem("sewalink_token", data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <MainLayout title="Sign in to SewaLink">
      <div className="mx-auto max-w-2xl rounded-3xl bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
        <p className="text-slate-400">Sign in with your email and password to access bookings, chat, and saved providers.</p>
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div>
            <label className="block text-sm text-slate-300">Email</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300">Password</label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              placeholder="Enter your password"
            />
          </div>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <button className="w-full rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">Sign in</button>
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
