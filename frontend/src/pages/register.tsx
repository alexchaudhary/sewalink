import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { fetcher } from "../lib/api";

// ── Left panel service chips ──────────────────────────────────────────────────
const CHIPS = [
  { icon: "🔧", label: "Plumber" },
  { icon: "⚡", label: "Electrician" },
  { icon: "🔨", label: "Carpenter" },
  { icon: "🖌️", label: "Painter" },
  { icon: "🧹", label: "Cleaner" },
  { icon: "💻", label: "IT Support" },
];

// ── Avatar gradients for social proof ────────────────────────────────────────
const AVATAR_GRADIENTS = [
  "from-amber-400 to-orange-500",
  "from-violet-400 to-purple-500",
  "from-emerald-400 to-teal-500",
  "from-sky-400 to-blue-500",
  "from-rose-400 to-pink-500",
];
const AVATAR_INITIALS = ["R", "S", "A", "P", "M"];

// ── Reusable field wrapper ────────────────────────────────────────────────────
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10.5px] font-semibold uppercase tracking-[0.4px] text-white/35">
        {label}
      </label>
      {children}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "CUSTOMER",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);
  const [showSuccess,  setShowSuccess]  = useState(false);
  const [error,        setError]        = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!form.firstName.trim()) { setError("First name is required."); return; }
    if (!form.email.trim())     { setError("Email address is required."); return; }
    if (form.password && form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetcher("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      window.localStorage.setItem("sewalink_token", data.token);
      setShowSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1400);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Input class helper ──────────────────────────────────────────────────────
  const inputCls = (extra = "") =>
    `w-full bg-white/[0.05] border border-white/[0.08] rounded-xl py-2.5 text-[12.5px] text-white placeholder:text-white/20 outline-none transition-all duration-200 focus:border-amber-500/60 focus:bg-amber-500/[0.05] focus:shadow-[0_0_0_3px_rgba(245,158,11,0.10)] ${extra}`;

  return (
    <div
      className="min-h-screen w-full lg:grid lg:grid-cols-[52%_1fr]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ══════════════════════════════════════════════════════════════════
          LEFT PANEL
      ══════════════════════════════════════════════════════════════════ */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0d1117] via-[#0a0d18] to-[#0c1020] px-12 py-10">

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/35 to-transparent" />

        {/* Glow blobs — inline filter:blur to avoid Tailwind purge issues */}
        <div
          className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-orange-400/[0.13]"
          style={{ filter: "blur(120px)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-indigo-500/[0.10]"
          style={{ filter: "blur(120px)" }}
        />

        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* ── TOP: Logo + copy ── */}
        <div className="relative z-10">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2.5 mb-10 no-underline group">
            {/* SVG icon mark */}
            <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-gradient-to-br from-amber-400 to-orange-500 shadow-[0_4px_18px_rgba(245,158,11,0.40)] transition-shadow duration-200 group-hover:shadow-[0_4px_28px_rgba(245,158,11,0.55)]">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M4 9C4 6.24 6.24 4 9 4s5 2.24 5 5-2.24 5-5 5"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M9 14c2.76 0 5-2.24 5-5S11.76 4 9 4"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeOpacity="0.45"
                />
                <circle cx="4" cy="9" r="1.5" fill="#fff" />
                <circle cx="14" cy="9" r="1.5" fill="#fff" fillOpacity="0.45" />
              </svg>
            </span>
            <span className="text-[19px] font-extrabold tracking-[-0.4px]">
              <span className="text-white">Sewa</span>
              <span className="text-amber-400">Link</span>
            </span>
          </Link>

          {/* Overline */}
          <p className="mb-2.5 text-[9.5px] font-bold uppercase tracking-[1.8px] text-amber-500">
            Home Services Marketplace
          </p>

          {/* Headline */}
          <h1 className="mb-3 text-[30px] font-extrabold leading-[1.18] tracking-[-0.7px] text-white">
            Book skilled<br />
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              local experts
            </span>
            <br />
            in minutes.
          </h1>

          {/* Subtext */}
          <p className="mb-5 max-w-[320px] text-[12.5px] leading-relaxed text-white/[0.38]">
            SewaLink connects you with verified, background-checked professionals for every home service need — fast, safe, and transparent.
          </p>

          {/* Service chips */}
          <div className="flex flex-wrap gap-1.5">
            {CHIPS.map((c) => (
              <span
                key={c.label}
                className="inline-flex cursor-default items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-white/60 transition-all duration-200 hover:border-amber-400/35 hover:bg-amber-400/[0.07] hover:text-amber-300"
              >
                {c.icon} {c.label}
              </span>
            ))}
          </div>
        </div>

        {/* ── BOTTOM: Stats + testimonial ── */}
        <div className="relative z-10">
          {/* Stats row */}
          <div className="mb-5 flex gap-8 border-t border-white/[0.06] pt-4">
            {[
              { val: "12K+", lbl: "Verified experts" },
              { val: "98%",  lbl: "Satisfaction rate" },
              { val: "3 min", lbl: "Avg. booking time" },
            ].map((s) => (
              <div key={s.lbl}>
                <div className="text-[15px] font-extrabold text-white">{s.val}</div>
                <div className="text-[10px] text-white/30">{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* Testimonial card */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-4 backdrop-blur-sm">
            {/* Stars */}
            <div className="mb-2 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="11" height="11" viewBox="0 0 12 12" fill="#f59e0b">
                  <path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.09L6 8.02 3.22 9.55l.53-3.09L1.5 4.27l3.11-.45L6 1z" />
                </svg>
              ))}
            </div>
            <p className="mb-3 text-[11.5px] italic leading-relaxed text-white/45">
              "Found a reliable plumber within 10 minutes. The whole process was seamless — booking, payment, everything."
            </p>
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-[10px] font-bold text-white">
                RK
              </span>
              <div>
                <div className="text-[11px] font-semibold text-white/50">Rajesh K.</div>
                <div className="text-[10px] text-white/25">Homeowner, Kathmandu</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          RIGHT PANEL
      ══════════════════════════════════════════════════════════════════ */}
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#060810] px-6 py-12 sm:px-10">

        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

        <div className="w-full max-w-[380px]">

          {/* Mobile logo */}
          <Link href="/" className="mb-8 inline-flex items-center gap-2 no-underline lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-gradient-to-br from-amber-400 to-orange-500 text-[13px] font-black text-white">S</span>
            <span className="text-[17px] font-extrabold">
              <span className="text-white">Sewa</span>
              <span className="text-amber-400">Link</span>
            </span>
          </Link>

          {showSuccess ? (
            /* ── SUCCESS STATE ─────────────────────────────────────────── */
            <div className="flex flex-col items-center gap-3.5 py-5 text-center animate-fade-in-up">
              <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full border border-amber-500/25 bg-amber-500/[0.12]">
                <CheckCircle2 size={28} className="text-amber-400" />
              </div>
              <div>
                <h2 className="text-[20px] font-extrabold text-white">Account created!</h2>
                <p className="mt-1 text-[12.5px] text-white/35">
                  Welcome to SewaLink. Redirecting you to your dashboard…
                </p>
              </div>
              <Link
                href="/dashboard"
                className="mt-1 inline-flex items-center gap-2 rounded-[11px] bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2.5 text-[13px] font-bold text-black shadow-[0_4px_20px_rgba(245,158,11,0.28)] transition-all duration-200 hover:opacity-90 hover:-translate-y-px no-underline"
              >
                Go to dashboard <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            /* ── FORM ──────────────────────────────────────────────────── */
            <>
              {/* Heading */}
              <h2 className="mb-1 text-[22px] font-extrabold tracking-tight text-white">
                Create your account
              </h2>
              <p className="mb-5 text-[12px] text-white/35">
                Join the SewaLink marketplace — it takes under a minute.
              </p>

              {/* Role toggle */}
              <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl border border-white/[0.07] bg-white/[0.04] p-1">
                {(["CUSTOMER", "PROVIDER"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, role: r }))}
                    className={`rounded-[9px] py-2 text-[12px] font-semibold transition-all duration-200 ${
                      form.role === r
                        ? "bg-amber-500 text-black shadow-[0_2px_12px_rgba(245,158,11,0.35)]"
                        : "text-white/35 hover:text-white/60"
                    }`}
                  >
                    {r === "CUSTOMER" ? "I need help" : "I offer services"}
                  </button>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                {/* First + Last name */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First name">
                    <div className="relative">
                      <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                      <input
                        value={form.firstName}
                        onChange={set("firstName")}
                        placeholder="Aarav"
                        className={inputCls("pl-9 pr-3")}
                      />
                    </div>
                  </Field>
                  <Field label="Last name">
                    <div className="relative">
                      <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                      <input
                        value={form.lastName}
                        onChange={set("lastName")}
                        placeholder="Sharma"
                        className={inputCls("pl-9 pr-3")}
                      />
                    </div>
                  </Field>
                </div>

                {/* Email */}
                <Field label="Email address">
                  <div className="relative">
                    <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      placeholder="you@example.com"
                      className={inputCls("pl-9 pr-3")}
                    />
                  </div>
                </Field>

                {/* Phone */}
                <Field label="Phone number">
                  <div className="relative">
                    <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder="+977 98XXXXXXXX"
                      className={inputCls("pl-9 pr-3")}
                    />
                  </div>
                </Field>

                {/* Password */}
                <Field label="Create password">
                  <div className="relative">
                    <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={set("password")}
                      placeholder="Min. 8 characters"
                      className={inputCls("pl-9 pr-10")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors duration-200"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                </Field>

                {/* Terms */}
                <p className="my-1 text-center text-[10.5px] text-white/20">
                  By creating an account you agree to our{" "}
                  <Link href="#" className="text-amber-400/65 no-underline hover:text-amber-400 transition-colors">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-amber-400/65 no-underline hover:text-amber-400 transition-colors">
                    Privacy Policy
                  </Link>
                  .
                </p>

                {/* Error */}
                {error && (
                  <div className="rounded-xl border border-red-500/[0.18] bg-red-500/[0.08] px-3 py-2.5 text-[11.5px] text-red-300">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex w-full items-center justify-center gap-2 rounded-[11px] bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-[13px] font-bold text-black shadow-[0_4px_20px_rgba(245,158,11,0.28)] transition-all duration-200 hover:opacity-90 hover:-translate-y-px active:scale-[0.98] ${
                    isLoading ? "cursor-not-allowed opacity-70" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Creating account…
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Sign in link */}
              <p className="mt-3.5 text-center text-[11.5px] text-white/25">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-amber-400/75 no-underline hover:text-amber-400 transition-colors duration-200">
                  Sign in
                </Link>
              </p>

              {/* Social proof */}
              <div className="mt-3.5 flex items-center justify-center gap-2.5 border-t border-white/[0.05] pt-3.5">
                <div className="flex items-center">
                  {AVATAR_GRADIENTS.map((g, i) => (
                    <span
                      key={i}
                      className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#060810] bg-gradient-to-br ${g} text-[9px] font-bold text-white ${i > 0 ? "-ml-1.5" : ""}`}
                    >
                      {AVATAR_INITIALS[i]}
                    </span>
                  ))}
                </div>
                <p className="text-[10.5px] text-white/[0.22]">
                  Join <span className="font-bold text-white/40">2,400+</span> early members
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
