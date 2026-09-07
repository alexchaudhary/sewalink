"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import MainLayout from "../components/MainLayout";
import { fetcher } from "../lib/api";
interface ForgotPasswordResponse {
  message?: string;
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const data = await fetcher<ForgotPasswordResponse>(
  "/auth/forgot-password",
  {
    method: "POST",
    body: JSON.stringify({ email }),
  }
);

setMessage(data.message || "Password reset request sent.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <MainLayout title="Forgot password">
      <div className="mx-auto max-w-2xl rounded-3xl bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
        <p className="text-slate-400">Enter your email address and we will send a password reset link or OTP.</p>
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <label className="block text-sm text-slate-300">
            Email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              placeholder="name@example.com"
            />
          </label>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
          <button className="w-full rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">Send reset link</button>
        </form>
      </div>
    </MainLayout>
  );
}
