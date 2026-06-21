"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Hammer,
  Lock,
  Mail,
  MapPin,
  Paintbrush,
  ShieldCheck,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";

const SERVICES = [
  { Icon: Wrench, label: "Plumbing" },
  { Icon: Zap, label: "Electrical" },
  { Icon: Hammer, label: "Repair work" },
  { Icon: Paintbrush, label: "Painting" },
  { Icon: Sparkles, label: "Cleaning" },
];

const ROADMAP = [
  { Icon: ShieldCheck, title: "Development phase", text: "Core login, registration, and service flows are being built." },
  { Icon: Clock, title: "Early access soon", text: "Real users and service partners will be added only after testing." },
  { Icon: MapPin, title: "Built for local service", text: "The platform is being prepared for organized local service discovery." },
];

interface Form {
  email: string;
  password: string;
}

interface Errs {
  email?: string;
  password?: string;
}

function validate(form: Form): Errs {
  const errors: Errs = {};
  if (!form.email.trim()) errors.email = "Required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Invalid email";

  if (!form.password) errors.password = "Required";
  else if (form.password.length < 6) errors.password = "Password too short";

  return errors;
}

function BrandLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        background: "linear-gradient(135deg,#f59e0b,#ea580c)",
        color: "#111827",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 10px 30px rgba(245,158,11,0.28)",
      }}>
        <Wrench size={20} strokeWidth={2.5} />
      </div>
      <div>
        <div style={{ fontSize: 19, fontWeight: 900, lineHeight: 1, color: "#fff" }}>swealink.in</div>
        <div style={{ marginTop: 4, fontSize: 11, color: "rgba(255,255,255,0.38)" }}>Local services platform</div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  IconEl,
  right,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  IconEl: React.ElementType;
  right?: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label htmlFor={id} style={{
        color: "rgba(255,255,255,0.48)",
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
      }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <IconEl size={15} style={{
          position: "absolute",
          left: 14,
          top: "50%",
          transform: "translateY(-50%)",
          color: error ? "#f87171" : "rgba(255,255,255,0.34)",
          pointerEvents: "none",
        }} />
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          style={{
            width: "100%",
            border: `1px solid ${error ? "rgba(248,113,113,0.65)" : "rgba(255,255,255,0.12)"}`,
            borderRadius: 10,
            background: error ? "rgba(248,113,113,0.07)" : "rgba(255,255,255,0.045)",
            color: "#fff",
            fontFamily: "inherit",
            fontSize: 14,
            outline: "none",
            padding: right ? "13px 44px 13px 42px" : "13px 14px 13px 42px",
          }}
        />
        {right && (
          <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}>
            {right}
          </div>
        )}
      </div>
      {error && <span style={{ color: "#f87171", fontSize: 12 }}>{error}</span>}
    </div>
  );
}

export default function LoginPage() {
  const [form, setForm] = useState<Form>({ email: "", password: "" });
  const [errors, setErrors] = useState<Errs>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (key: keyof Form) => (value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setLoading(false);
    setSuccess(true);
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "#060810",
      color: "#fff",
      fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
    }}>
      <div style={{ height: 2, background: "linear-gradient(90deg,transparent,#f59e0b,transparent)" }} />

      <div className="auth-grid" style={{
        display: "grid",
        gridTemplateColumns: "minmax(0,1.05fr) minmax(380px,0.95fr)",
        minHeight: "calc(100vh - 2px)",
      }}>
        <section className="auth-left" style={{
          position: "relative",
          overflow: "hidden",
          padding: 56,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg,#0d1117 0%,#111827 52%,#15100a 100%)",
        }}>
          <div style={{
            position: "absolute",
            inset: 0,
            opacity: 0.06,
            backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.8) 1px,transparent 1px)",
            backgroundSize: "28px 28px",
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <BrandLogo />

            <div style={{
              marginTop: 74,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: "1px solid rgba(245,158,11,0.24)",
              borderRadius: 999,
              background: "rgba(245,158,11,0.09)",
              color: "#fbbf24",
              fontSize: 11,
              fontWeight: 800,
              padding: "6px 13px",
              textTransform: "uppercase",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "#f59e0b" }} />
              Currently in development
            </div>

            <h1 style={{
              maxWidth: 560,
              margin: "24px 0 0",
              fontSize: 54,
              fontWeight: 900,
              lineHeight: 1.05,
            }}>
              Sign in to your swealink.in workspace.
            </h1>
            <p style={{
              maxWidth: 460,
              margin: "20px 0 0",
              color: "rgba(255,255,255,0.58)",
              fontSize: 16,
              lineHeight: 1.7,
            }}>
              Use this page to test the account experience while the real marketplace,
              providers, and customer flows are still being prepared.
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(5,minmax(0,1fr))",
              gap: 10,
              maxWidth: 560,
              marginTop: 34,
            }}>
              {SERVICES.map(({ Icon, label }) => (
                <div key={label} style={{
                  minHeight: 82,
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.045)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  textAlign: "center",
                }}>
                  <Icon size={20} color="#f59e0b" />
                  <span style={{ color: "rgba(255,255,255,0.64)", fontSize: 12, fontWeight: 600 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 1, display: "grid", gap: 12, maxWidth: 560 }}>
            {ROADMAP.map(({ Icon, title, text }) => (
              <div key={title} style={{ display: "grid", gridTemplateColumns: "34px 1fr", gap: 12, alignItems: "start" }}>
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: "rgba(245,158,11,0.11)",
                  border: "1px solid rgba(245,158,11,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <Icon size={16} color="#f59e0b" />
                </div>
                <div>
                  <p style={{ margin: 0, color: "#fff", fontSize: 14, fontWeight: 800 }}>{title}</p>
                  <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.5 }}>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 38px",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ width: "100%", maxWidth: 410 }}>
            {!success ? (
              <div style={{ display: "grid", gap: 24 }}>
                <div style={{ display: "grid", gap: 22 }}>
                  <BrandLogo />
                  <div>
                    <h2 style={{ margin: 0, fontSize: 30, fontWeight: 900 }}>Welcome back</h2>
                    <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.45)", fontSize: 14 }}>
                      Sign in to continue testing your swealink.in account.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} noValidate style={{ display: "grid", gap: 16 }}>
                  <Field
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={set("email")}
                    error={errors.email}
                    IconEl={Mail}
                  />
                  <Field
                    id="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={set("password")}
                    error={errors.password}
                    IconEl={Lock}
                    right={
                      <button
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((current) => !current)}
                        style={{ border: 0, background: "transparent", color: "rgba(255,255,255,0.42)", cursor: "pointer", padding: 0, display: "flex" }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                  />

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 9, color: "rgba(255,255,255,0.48)", fontSize: 13 }}>
                      <input type="checkbox" style={{ width: 16, height: 16, accentColor: "#f59e0b" }} />
                      Keep me signed in
                    </label>
                    <Link href="/forgot-password" style={{ color: "#f59e0b", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                      Forgot password?
                    </Link>
                  </div>

                  <button type="submit" disabled={loading} style={{
                    minHeight: 48,
                    border: 0,
                    borderRadius: 10,
                    background: loading ? "rgba(245,158,11,0.55)" : "linear-gradient(135deg,#f59e0b,#ea580c)",
                    color: "#111827",
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    fontFamily: "inherit",
                    fontSize: 14,
                    fontWeight: 900,
                  }}>
                    {loading ? "Signing in..." : <>Sign in <ArrowRight size={16} /></>}
                  </button>
                </form>

                <p style={{ margin: 0, textAlign: "center", color: "rgba(255,255,255,0.45)", fontSize: 13 }}>
                  Need an account?{" "}
                  <Link href="/register" style={{ color: "#f59e0b", fontWeight: 800, textDecoration: "none" }}>
                    Create one
                  </Link>
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", justifyItems: "center", gap: 18, textAlign: "center" }}>
                <CheckCircle2 size={58} color="#f59e0b" />
                <div>
                  <h2 style={{ margin: 0, fontSize: 28, fontWeight: 900 }}>Signed in</h2>
                  <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.48)", lineHeight: 1.6 }}>
                    This demo state is ready. Connect it to your real auth API when backend integration is complete.
                  </p>
                </div>
                <Link href="/dashboard" style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#f59e0b,#ea580c)",
                  color: "#111827",
                  fontWeight: 900,
                  padding: "13px 26px",
                  textDecoration: "none",
                }}>
                  Go to dashboard <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(255,255,255,0.24); }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px #10141f inset !important;
          -webkit-text-fill-color: #fff !important;
        }
        @media (max-width: 1024px) {
          .auth-grid { grid-template-columns: 1fr !important; }
          .auth-left { display: none !important; }
        }
      `}</style>
    </main>
  );
}
