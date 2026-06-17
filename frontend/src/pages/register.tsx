"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import MainLayout from "../components/MainLayout";
import { fetcher } from "../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", role: "CUSTOMER" });
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const data = await fetcher("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      window.localStorage.setItem("sewalink_token", data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <MainLayout title="Create your SewaLink account">
      <div className="mx-auto max-w-3xl rounded-3xl bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-slate-300">
              First name
              <input
                value={form.firstName}
                onChange={(event) => setForm({ ...form, firstName: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </label>
            <label className="text-sm text-slate-300">
              Last name
              <input
                value={form.lastName}
                onChange={(event) => setForm({ ...form, lastName: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-slate-300">
              Email
              <input
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                type="email"
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </label>
            <label className="text-sm text-slate-300">
              Phone
              <input
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </label>
          </div>
          <label className="text-sm text-slate-300">
            Password
            <input
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              type="password"
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </label>
          <label className="text-sm text-slate-300">
            Account type
            <select
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="PROVIDER">Provider</option>
            </select>
          </label>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <button className="rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">Create account</button>
        </form>
        <p className="mt-6 text-sm text-slate-400">
          Already have an account? <Link href="/login" className="text-cyan-300 hover:text-cyan-200">Sign in</Link>
        </p>
      </div>
    </MainLayout>
  );
}
