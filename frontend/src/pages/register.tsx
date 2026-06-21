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
  Phone,
  ShieldCheck,
  Sparkles,
  User,
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

const BUILD_STEPS = [
  { Icon: User, title: "Create test accounts", text: "Use registration to validate the onboarding flow." },
  { Icon: ShieldCheck, title: "Prepare verification", text: "Provider and user checks can be added after the core flow is stable." },
  { Icon: MapPin, title: "Launch by location", text: "Start with a focused service area before opening public signups." },
  { Icon: Clock, title: "Add bookings later", text: "Keep the current phase simple, then connect scheduling and payments." },
];

interface Form {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

interface Errs {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
}

function validate(form: Form): Errs {
  const errors: Errs = {};
  if (!form.firstName.trim()) errors.firstName = "Required";
  if (!form.lastName.trim()) errors.lastName = "Required";
  if (!form.email.trim()) errors.email = "Required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Invalid email";
  if (!form.phone.trim()) errors.phone = "Required";
  else if (!/^[+\d\s\-()]{7,}$/.test(form.phone)) errors.phone = "Invalid number";
  if (!form.password) errors.password = "Required";
  else if (form.password.length < 8) errors.password = "Min 8 characters";
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
        <div style={{ fontSize: 19, fontWeight: 900, lineHeight: 1, color: "#fff" }}>sewalink</div>
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

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const score =
    (password.length >= 8 ? 1 : 0) +
    (/[A-Z]/.test(password) ? 1 : 0) +
    (/\d/.test(password) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(password) ? 1 : 0);

  const label = ["", "Weak", "Fair", "Good", "Strong"][score];
  const color = ["", "#f87171", "#fbbf24", "#facc15", "#4ade80"][score];

  return (
    <div style={{ display: "grid", gap: 5, marginTop: 8 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4 }}>
        {[1, 2, 3, 4].map((item) => (
          <span
            key={item}
            style={{
              height: 3,
              borderRadius: 999,
              background: item <= score ? color : "rgba(255,255,255,0.12)",
            }}
          />
        ))}
      </div>
      <span style={{ color, fontSize: 11 }}>{label}</span>
    </div>
  );
}

export default function RegisterPage() {
  const [form, setForm] = useState<Form>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
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
        gridTemplateColumns: "minmax(0,1.05fr) minmax(390px,0.95fr)",
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
              marginTop: 64,
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
              Private build
            </div>

            <h1 style={{
              maxWidth: 570,
              margin: "24px 0 0",
              fontSize: 54,
              fontWeight: 900,
              lineHeight: 1.05,
            }}>
              Create a test account for sewalink.
            </h1>
            <p style={{
              maxWidth: 470,
              margin: "20px 0 0",
              color: "rgba(255,255,255,0.58)",
              fontSize: 16,
              lineHeight: 1.7,
            }}>
              Registration is ready for development testing. Public customer and provider
              onboarding can be added when the marketplace is ready to launch.
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

          <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, maxWidth: 660 }}>
            {BUILD_STEPS.map(({ Icon, title, text }) => (
              <div key={title} style={{
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 8,
                background: "rgba(255,255,255,0.04)",
                padding: 16,
              }}>
                <Icon size={18} color="#f59e0b" />
                <p style={{ margin: "12px 0 0", color: "#fff", fontSize: 14, fontWeight: 800 }}>{title}</p>
                <p style={{ margin: "5px 0 0", color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.5 }}>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "44px 38px",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ width: "100%", maxWidth: 430 }}>
            {!success ? (
              <div style={{ display: "grid", gap: 22 }}>
                <div style={{ display: "grid", gap: 22 }}>
                  <BrandLogo />
                  <div>
                    <h2 style={{ margin: 0, fontSize: 30, fontWeight: 900 }}>Create account</h2>
                    <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.45)", fontSize: 14 }}>
                      Set up a development account for testing the product.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} noValidate style={{ display: "grid", gap: 15 }}>
                  <div className="name-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Field
                      id="firstName"
                      label="First name"
                      placeholder="Aarav"
                      value={form.firstName}
                      onChange={set("firstName")}
                      error={errors.firstName}
                      IconEl={User}
                    />
                    <Field
                      id="lastName"
                      label="Last name"
                      placeholder="Sharma"
                      value={form.lastName}
                      onChange={set("lastName")}
                      error={errors.lastName}
                      IconEl={User}
                    />
                  </div>

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
                    id="phone"
                    label="Phone"
                    type="tel"
                    placeholder="+977 98XXXXXXXX"
                    value={form.phone}
                    onChange={set("phone")}
                    error={errors.phone}
                    IconEl={Phone}
                  />

                  <div>
                    <Field
                      id="password"
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 8 characters"
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
                    <PasswordStrength password={form.password} />
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
                    {loading ? "Creating account..." : <>Create account <ArrowRight size={16} /></>}
                  </button>
                </form>

                <p style={{ margin: 0, color: "rgba(255,255,255,0.32)", fontSize: 12, lineHeight: 1.6, textAlign: "center" }}>
                  By registering, you can test the account flow. Terms and privacy pages can be connected before public launch.
                </p>

                <p style={{ margin: 0, textAlign: "center", color: "rgba(255,255,255,0.45)", fontSize: 13 }}>
                  Already have an account?{" "}
                  <Link href="/login" style={{ color: "#f59e0b", fontWeight: 800, textDecoration: "none" }}>
                    Sign in
                  </Link>
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", justifyItems: "center", gap: 18, textAlign: "center" }}>
                <CheckCircle2 size={58} color="#f59e0b" />
                <div>
                  <h2 style={{ margin: 0, fontSize: 28, fontWeight: 900 }}>Account created</h2>
                  <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.48)", lineHeight: 1.6 }}>
                    Thanks, <strong style={{ color: "#fff" }}>{form.firstName}</strong>. This is a demo success state for the development build.
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
                <button
                  type="button"
                  onClick={() => {
                    setSuccess(false);
                    setErrors({});
                    setForm({ firstName: "", lastName: "", email: "", phone: "", password: "" });
                  }}
                  style={{
                    border: 0,
                    background: "transparent",
                    color: "rgba(255,255,255,0.38)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: 12,
                    textDecoration: "underline",
                  }}
                >
                  Register another account
                </button>
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
        @media (max-width: 560px) {
          .name-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
