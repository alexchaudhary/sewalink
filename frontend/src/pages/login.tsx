"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { fetcher } from "../lib/api";
import { ArrowRight, CheckCircle2, Eye, EyeOff, Lock, Mail, Wrench } from "lucide-react";

// ── Shared Static Configurations ─────────────────────────────────────────────
const SERVICES = [
  { Icon: Wrench, label: "Plumbing" },
  { Icon: Wrench, label: "Electrical" },
  { Icon: Wrench, label: "Repair work" },
  { Icon: Wrench, label: "Painting" },
  { Icon: Wrench, label: "Cleaning" },
];

const ROADMAP = [
  { title: "Development phase", text: "Core login, registration, and service flows are being built." },
  { title: "Early access soon", text: "Real users and service partners will be added only after testing." },
  { title: "Built for local service", text: "The platform is being prepared for organized local service discovery." },
];

interface Form { email: string; password: string; }
interface Errs { email?: string; password?: string; server?: string; }

// ── In-App Client Form Validation Handler ────────────────────────────────────
function validate(form: Form): Errs {
  const errors: Errs = {};
  if (!form.email.trim()) errors.email = "Required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Invalid email";
  if (!form.password) errors.password = "Required";
  else if (form.password.length < 6) errors.password = "Password too short";
  return errors;
}

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<Form>({ email: "", password: "" });
  const [errors, setErrors] = useState<Errs>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (key: keyof Form) => (value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined, server: undefined }));
  };

  // ── Asynchronous Form Submission Engine ────────────────────────────────────
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading || success) return;

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      setLoading(true);
      const data = await fetcher("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      if (data && data.token) {
        window.localStorage.setItem("sewalink_token", data.token);
        setSuccess(true);
        const assignedRole = data.user?.role?.toUpperCase();
        await new Promise((res) => setTimeout(res, 800));

        // Multi-Tenant Redirection Rules
        if (assignedRole === "ADMIN") router.push("/admin-dashboard");
        else if (assignedRole === "PROVIDER") router.push("/provider-dashboard");
        else router.push("/dashboard");
      }
    } catch (err: any) {
      setErrors((curr) => ({ ...curr, server: err?.message || "Invalid credentials sequence." }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#060810", color: "#fff", fontFamily: "sans-serif" }}>
      <div style={{ height: 2, background: "linear-gradient(90deg,transparent,#f59e0b,transparent)" }} />
      <div className="auth-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(360px,0.9fr)", minHeight: "calc(100vh - 2px)" }}>
        
        {/* Left Hand Column Panel Viewport */}
        <section className="auth-left" style={{ padding: 48, background: "linear-gradient(135deg,#0d1117 0%,#111827 100%)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 38, fontWeight: 900, margin: "20px 0" }}>Sign in to your sewalink workspace.</h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>Test your local backend synchronization routines securely.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginTop: 24 }}>
              {SERVICES.map(({ Icon, label }) => (
                <div key={label} style={{ padding: 12, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, background: "rgba(255,255,255,0.03)", textAlign: "center" }}>
                  <Icon size={16} color="#f59e0b" style={{ margin: "0 auto 6px" }} />
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
            {ROADMAP.map(({ title, text }) => (
              <div key={title}>
                <h4 style={{ fontSize: 13, margin: 0, color: "#f59e0b" }}>✓ {title}</h4>
                <p style={{ fontSize: 11, margin: "2px 0 0", color: "rgba(255,255,255,0.4)" }}>{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Right Hand Form Interface Column Viewport */}
        <section className="auth-right" style={{ padding: 48, display: "flex", flexDirection: "column", justifyContent: "center", background: "#060810", borderLeft: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ width: "100%", maxWidth: 340, margin: "0 auto", textAlign: "left" }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Welcome back</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 4 }}>Enter credentials to access account configurations.</p>
            
            {errors.server && <div style={{ marginTop: 16, padding: 12, background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 8, color: "#f87171", fontSize: 12 }}>⚠️ {errors.server}</div>}
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 24 }}>
              <div>
                <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, textTransform: "uppercase", fontWeight: 700 }}>Email Address</label>
                <div style={{ position: "relative", marginTop: 4 }}>
                  <Mail size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                  <input type="email" placeholder="alex@sewalink.com" value={form.email} onChange={(e) => set("email")(e.target.value)} disabled={loading || success} style={{ width: "100%", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: 13, outline: "none", padding: "11px 12px 11px 36px" }} required />
                </div>
                {errors.email && <span style={{ color: "#f87171", fontSize: 11 }}>{errors.email}</span>}
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, textTransform: "uppercase", fontWeight: 700 }}>Password</label>
                <div style={{ position: "relative", marginTop: 4 }}>
                  <Lock size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                  <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={(e) => set("password")(e.target.value)} disabled={loading || success} style={{ width: "100%", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: 13, outline: "none", padding: "11px 36px 11px 36px" }} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer" }}>
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.password && <span style={{ color: "#f87171", fontSize: 11 }}>{errors.password}</span>}
              </div>

              <button type="submit" disabled={loading || success} style={{ marginTop: 8, height: 42, borderRadius: 8, background: success ? "#10b981" : "linear-gradient(135deg,#f59e0b 0%,#ea580c 100%)", border: "none", color: success ? "#fff" : "#111827", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, width: "100%", justifyContent: "center" }}>
                {loading ? (
                  "Verifying..."
                ) : success ? (
                  <>
                    <CheckCircle2 size={15} />
                    Redirecting...
                  </>
                ) : (
                  <>
                    Sign in to Account
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
            <div style={{ marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
              Don&apos;t have an account? <Link href="/register" style={{ color: "#f59e0b", textDecoration: "none", fontWeight: 600 }}>Sign up</Link>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
