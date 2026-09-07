"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import Link from "next/link";
import { fetcher } from "../lib/api";
import { Button } from "@/components/ui/button";
import { Mail, Lock, ShieldAlert, Eye, EyeOff, Wrench, User, Briefcase } from "lucide-react";
interface LoginUser {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
}

interface LoginResponse {
  token?: string;
  user?: LoginUser;
  data?: {
    token?: string;
    user?: LoginUser;
  };
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"customer" | "worker">("customer"); 
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      if (!email || !password) {
        setError("Please enter your account email and password fields.");
        return;
      }

      // Backend expects clean email and password credentials for database auth lookup
      const requestBody = {
        email: email.toLowerCase().trim(),
        password: password,
      };

      const response = await fetcher<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      const sessionToken = response.data?.token || response.token;

      if (!sessionToken) {
        setError("Authentication handshake failed. Storage token parameters not resolved.");
        return;
      }
window.localStorage.setItem("kamdarnepal_token", sessionToken);

const loggedInUser =
  response.data?.user || response.user;

if (loggedInUser) {
  window.localStorage.setItem(
    "user",
    JSON.stringify(loggedInUser)
  );
}

const dbUserRole = loggedInUser?.role;

      if (dbUserRole === "PROVIDER") {
        router.push("/dashboard/worker"); 
      } else {
        router.push("/dashboard/customer"); 
      }

    } catch (err: any) {
      setError(err?.message || "Authentication failed. Invalid login credentials sequence.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060810] text-white flex items-center justify-center font-sans p-5 select-none">
      
      {/* Background Lighting Accent */}
      <div className="absolute top-[-5%] left-[10%] w-[400px] h-[400px] bg-blue-500/2 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[420px] bg-[#090d16] border border-white/5 rounded-[24px] px-8 py-10 shadow-2xl shadow-black/50 text-left">
        
        {/* Kamdar Nepal Brand Header */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl flex items-center shadow-lg shadow-blue-500/10">
            <Wrench size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black tracking-tight">Kamdar<span className="text-orange-500">Nepal</span></span>
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight text-white mb-2">Welcome back</h2>
        <p className="text-white/40 text-sm mb-6">Select account type and enter credentials to sign in.</p>

        {/* Customer vs Kamdar Selection Tabs */}
        <div className="flex bg-white/2 p-1 rounded-xl border border-white/5 mb-6">
          <button 
            type="button" 
            onClick={() => { setUserType("customer"); setError(""); }} 
            className={`flex-1 flex items-center justify-center gap-2 h-10 border-none rounded-lg text-xs font-bold cursor-pointer transition-all duration-200 ${
              userType === "customer" ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" : "bg-transparent text-white/60 hover:text-white"
            }`}
          >
            <User size={14} /> Customer
          </button>
          <button 
            type="button" 
            onClick={() => { setUserType("worker"); setError(""); }} 
            className={`flex-1 flex items-center justify-center gap-2 h-10 border-none rounded-lg text-xs font-bold cursor-pointer transition-all duration-200 ${
              userType === "worker" ? "bg-orange-500 text-[#03050a] shadow-md shadow-orange-500/10" : "bg-transparent text-white/60 hover:text-white"
            }`}
          >
            <Briefcase size={14} /> Kamdar
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-500/5 border border-red-500/15 rounded-xl color text-red-400 text-xs font-medium flex items-center gap-2.5">
            <ShieldAlert size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-extrabold text-white/40 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="name@example.com" 
                className="w-full h-12 bg-white/2 border border-white/6 focus:border-blue-500/40 rounded-xl pl-12 pr-4 text-sm text-white outline-none box-sizing border-box transition-all duration-200" 
                required 
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-extrabold text-white/40 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••••••" 
                className="w-full h-12 bg-white/2 border border-white/6 focus:border-blue-500/40 rounded-xl px-12 text-sm text-white outline-none box-sizing border-box transition-all duration-200" 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-4 top-1/2 -translate-y-1/2 background-none border-none text-white/30 hover:text-white cursor-pointer p-0"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading} 
            className={`w-full h-12 text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 border-none select-none disabled:opacity-50 ${
              userType === "worker" ? "bg-orange-500 hover:bg-orange-600 text-[#03050a]" : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
          >
            {loading ? "Signing in..." : userType === "worker" ? "Sign in as Kamdar →" : "Sign in as Customer →"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-white/40 font-medium">
          Don't have an account?{" "}
          <Link 
            href="/register" 
            className={`text-sm font-bold no-underline transition-colors ${
              userType === "worker" ? "text-orange-500 hover:text-orange-400" : "text-blue-500 hover:text-blue-400"
            }`}
          >
            Sign up
          </Link>
        </div>

      </div>
    </div>
  );
}