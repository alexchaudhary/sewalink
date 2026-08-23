"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js App Router को लागि सही आयात
import Link from "next/link";
import { fetcher } from "../lib/api";
import { Mail, Lock, ShieldAlert, Eye, EyeOff, Wrench, User, Briefcase } from "lucide-react";

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

      // ब्याकइन्ड (Prisma Database) ले बुझ्ने सही Business Logic रोल मिलाएको
      const requestBody = {
        email: email.toLowerCase().trim(),
        password: password,
        role: userType === "worker" ? "PROVIDER" : "CUSTOMER", 
      };

      const response = await fetcher("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      // ब्याकइन्ड रेस्पोन्स स्ट्रक्चर अनुसार टोकन तानेको
      const sessionToken = response.data?.token || response.token;

      if (!sessionToken) {
        setError("Authentication handshake failed. Storage token parameters not resolved.");
        return;
      }

      // टोकन सुरक्षित राखेको
      window.localStorage.setItem("kamdarnepal_token", sessionToken);

      // ब्याकइन्डबाट आएको वास्तविक युजरको रोल (PROVIDER वा CUSTOMER)
      const dbUserRole = response.data?.user?.role || response.user?.role;

      // Corporate Level Standard: रोल अनुसार छुट्टाछुट्टै ड्यासबोर्डमा रिडाइरेक्ट गर्ने लजिक
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
    <div style={{ minHeight: "100vh", background: "#060810", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "420px", background: "#090d16", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "24px", padding: "40px 32px", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
        
        {/* Kamdar Nepal Brand Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center", marginBottom: "32px" }}>
          <div style={{ background: "linear-gradient(135deg, #1e3a8a, #3b82f6)", padding: "8px", borderRadius: "10px", display: "flex", alignItems: "center" }}>
            <Wrench size={18} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: "22px", fontWeight: 900, letterSpacing: "-0.03em" }}>Kamdar<span style={{ color: "#f97316" }}>Nepal</span></span>
        </div>

        <h2 style={{ fontSize: "24px", fontWeight: 800, textAlign: "left", margin: "0 0 8px 0" }}>Welcome back</h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", margin: "0 0 24px 0", textAlign: "left" }}>Select account type and enter credentials to sign in.</p>

        {/* Customer vs Kamdar Selection Tabs */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.03)", padding: "4px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "24px" }}>
          <button type="button" onClick={() => { setUserType("customer"); setError(""); }} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", height: "40px", background: userType === "customer" ? "#1e3a8a" : "transparent", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
            <User size={16} />
            Customer
          </button>
          <button type="button" onClick={() => { setUserType("worker"); setError(""); }} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", height: "40px", background: userType === "worker" ? "#f97316" : "transparent", color: userType === "worker" ? "#111827" : "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
            <Briefcase size={16} />
            Kamdar
          </button>
        </div>

        {error && (
          <div style={{ marginBottom: "24px", padding: "14px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "12px", color: "#f87171", fontSize: "13px", display: "flex", alignItems: "center", gap: "10px", textAlign: "left" }}>
            <ShieldAlert size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px", textAlign: "left" }}>
          <div>
            <label style={{ fontSize: "11px", fontWeight: 800, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail size={16} color="rgba(255,255,255,0.25)" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" style={{ width: "100%", height: "48px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "0 16px 0 48px", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box" }} required />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "11px", fontWeight: 800, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={16} color="rgba(255,255,255,0.25)" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" style={{ width: "100%", height: "48px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "0 48px 0 48px", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box" }} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer" }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ width: "100%", height: "48px", background: userType === "worker" ? "#f97316" : "#2563eb", color: userType === "worker" ? "#111827" : "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Signing in..." : userType === "worker" ? "Sign in as Kamdar →" : "Sign in as Customer →"}
          </button>
        </form>

        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>
          Don't have an account? <Link href="/register" style={{ color: userType === "worker" ? "#f97316" : "#3b82f6", textDecoration: "none", fontWeight: 600 }}>Sign up</Link>
        </div>

      </div>
    </div>
  );
}
