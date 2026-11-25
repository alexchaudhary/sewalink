"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Apple,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  Clock3,
  Droplet,
  Eye,
  EyeOff,
  Hammer,
  Home,
  LockKeyhole,
  Mail,
  Monitor,
  Paintbrush,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  Wrench,
  Zap,
} from "lucide-react";
import { fetcher, getApiBaseUrl } from "../lib/api";

type AccountType = "customer" | "worker";
type SignupMethod = "email" | "phone";
type FormFields = "firstName" | "lastName" | "email" | "phone" | "password";

const categories = [
  { label: "Plumber", Icon: Droplet },
  { label: "Electrician", Icon: Zap },
  { label: "Carpenter", Icon: Hammer },
  { label: "Painter", Icon: Paintbrush },
  { label: "Cleaner", Icon: Sparkles },
  { label: "IT Support", Icon: Monitor },
];

const countryPrefixes = [
  { value: "+977", label: "Nepal (+977)" },
  { value: "+91", label: "India (+91)" },
  { value: "+1", label: "US/Canada (+1)" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [userType, setUserType] = useState<AccountType>("customer");
  const [signupMethod, setSignupMethod] = useState<SignupMethod>("email");
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [countryPrefix, setCountryPrefix] = useState("+977");
  const [skill, setSkill] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<FormFields, string>>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const passwordChecks = [
    form.password.length >= 8,
    /[A-Z]/.test(form.password) && /[a-z]/.test(form.password),
    /\d/.test(form.password),
    /[^A-Za-z0-9]/.test(form.password),
  ];
  const passwordStrength = passwordChecks.filter(Boolean).length;
  const strengthLabel =
    passwordStrength < 2 ? "Weak" : passwordStrength < 4 ? "Good" : "Strong";
  const strengthColor =
    passwordStrength < 2
      ? "bg-rose-400"
      : passwordStrength < 4
        ? "bg-amber-400"
        : "bg-emerald-400";

  const handleInputChange = (key: FormFields, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setApiError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newErrors: Partial<Record<FormFields, string>> = {};
    const localPhone = form.phone.replace(/\D/g, "");

    if (form.firstName.trim().length < 2) {
      newErrors.firstName = "Enter your first name (at least 2 characters).";
    }
    if (form.lastName.trim().length < 2) {
      newErrors.lastName = "Enter your last name (at least 2 characters).";
    }
    if (
      signupMethod === "phone"
        ? !/^(98|97)\d{8}$/.test(localPhone)
        : localPhone.length < 7 || localPhone.length > 15
    ) {
      newErrors.phone =
        signupMethod === "phone"
          ? "Enter a valid Nepal mobile number starting with 98 or 97."
          : "Enter a valid phone number.";
    }
    if (signupMethod === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        newErrors.email = "Enter a valid email address.";
      }
      if (form.password.length < 8) {
        newErrors.password = "Use at least 8 characters.";
      }
    }

    setErrors(newErrors);
    setApiError("");

    if (Object.keys(newErrors).length > 0) return;
    if (!agreeTerms) {
      setApiError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }
    if (signupMethod === "phone") {
      setOtpStep(true);
      setOtp("");
      return;
    }
    if (userType === "worker" && !skill) {
      setApiError("Please select your professional trade.");
      return;
    }

    try {
      setLoading(true);
      await fetcher("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.toLowerCase().trim(),
          phone: `${countryPrefix}${localPhone}`,
          password: form.password,
          role: userType === "worker" ? "PROVIDER" : "CUSTOMER",
          skill: userType === "worker" ? skill.toUpperCase() : undefined,
        }),
      });

      setSuccess(true);
      window.setTimeout(() => router.push("/login"), 1600);
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Registration could not be completed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: "google" | "microsoft" | "apple") => {
    const role = userType === "worker" ? "provider" : "client";
    setApiError("");

    if (provider === "microsoft") {
      const clientId = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID;
      const redirectUri = process.env.NEXT_PUBLIC_MICROSOFT_REDIRECT_URI;
      if (!clientId || !redirectUri) {
        setApiError(
          "Microsoft sign-up needs NEXT_PUBLIC_MICROSOFT_CLIENT_ID and NEXT_PUBLIC_MICROSOFT_REDIRECT_URI configured.",
        );
        return;
      }

      const state = `${role}.${window.crypto.randomUUID()}`;
      window.sessionStorage.setItem("kamdar_microsoft_oauth_state", state);
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        response_mode: "query",
        scope: "openid profile email User.Read",
        state,
      });
      window.location.assign(
        `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`,
      );
      return;
    }

    const authUrl = new URL(`${getApiBaseUrl()}/auth/${provider}`);
    authUrl.searchParams.set("role", role);
    window.location.assign(authUrl.toString());
  };

  return (
    <main className="min-h-screen bg-[#0B0E14] text-white md:grid md:min-h-screen md:grid-cols-[minmax(0,0.85fr)_minmax(400px,1fr)]">
      <section
        aria-label="Why choose Kamdar"
        className="relative hidden min-h-screen flex-col overflow-hidden border-r border-white/[0.07] bg-[#0D1119] px-6 py-8 md:flex lg:px-10 lg:py-9 xl:px-16 xl:py-11"
      >
        <div className="pointer-events-none absolute -left-36 top-24 h-96 w-96 rounded-full bg-orange-500/[0.08] blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-36 right-0 h-96 w-96 rounded-full bg-amber-300/[0.05] blur-[120px]" />

        <Link href="/" className="relative z-10 inline-flex w-fit items-center gap-3" aria-label="Kamdar home">
          <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#FF9F1C] to-[#FF6B00] text-[#17100A] shadow-lg shadow-orange-500/20">
            <Wrench size={21} strokeWidth={2.6} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-[22px] font-extrabold leading-none tracking-tight">Kamdar</span>
            <span className="mt-1 block text-[9px] font-bold tracking-[0.19em] text-white/45">HOME SERVICES MARKETPLACE</span>
          </span>
        </Link>

        <div className="relative z-10 my-auto max-w-[650px] py-12 xl:py-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-300/15 bg-orange-300/[0.06] px-3 py-1.5 text-[11px] font-semibold text-orange-200/90">
            <ShieldCheck size={14} aria-hidden="true" />
            Trusted help, right around the corner
          </div>
          <h1 className="max-w-[620px] text-[clamp(2.5rem,4vw,4.35rem)] font-bold leading-[1.08] tracking-[-0.045em]">
            Book skilled{" "}
            <span className="bg-gradient-to-r from-[#FF8A00] to-[#FF9F1C] bg-clip-text text-transparent">
              local experts
            </span>{" "}
            in minutes.
          </h1>
          <p className="mt-5 max-w-[530px] text-[15px] leading-7 text-slate-400">
            Connect with verified, background-checked professionals for every home service need — fast, safe, and transparent.
          </p>

          <div className="mt-8 flex max-w-[565px] flex-wrap gap-2.5">
            {categories.map(({ label, Icon }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.025] px-3 py-2 text-xs font-medium text-slate-300"
              >
                <Icon size={14} className="text-orange-300" aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-x-9 gap-y-5 border-y border-white/[0.07] py-6">
            <div>
              <p className="text-2xl font-bold tracking-tight">12K<span className="text-orange-400">+</span></p>
              <p className="mt-1 text-[11px] text-slate-500">Verified experts</p>
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight">98<span className="text-orange-400">%</span></p>
              <p className="mt-1 text-[11px] text-slate-500">Satisfaction rate</p>
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight">3 min</p>
              <p className="mt-1 text-[11px] text-slate-500">Avg. booking time</p>
            </div>
          </div>

          <div className="mt-7 flex items-center gap-5 rounded-2xl border border-white/[0.09] bg-white/[0.035] p-4 shadow-xl shadow-black/10 backdrop-blur-md">
            <div className="relative flex h-[82px] w-[82px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-orange-200/20 bg-gradient-to-br from-orange-300/20 via-[#25202A] to-[#111723]">
              <div className="absolute bottom-[-18px] h-[68px] w-[68px] rounded-full bg-orange-400/20 blur-2xl" />
              <div className="relative flex h-[58px] w-[58px] items-center justify-center rounded-full border border-white/15 bg-white/[0.08] shadow-[inset_0_1px_12px_rgba(255,255,255,0.12)]">
                <UserRound size={30} className="text-orange-100" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <span className="absolute bottom-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#191A20] bg-emerald-400 text-[#0B0E14]">
                <Check size={11} strokeWidth={3} aria-hidden="true" />
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex gap-0.5 text-amber-400" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star key={index} size={13} fill="currentColor" aria-hidden="true" />
                ))}
              </div>
              <blockquote className="mt-2 text-[13px] leading-5 text-slate-200">
                “Found a great electrician in minutes. Professional, punctual, and completely hassle-free.”
              </blockquote>
              <p className="mt-2 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-300">Rajesh K.</span> · Homeowner, Kathmandu
              </p>
            </div>
          </div>
        </div>
        <p className="relative z-10 text-[10px] tracking-wide text-white/25">LOCAL EXPERTISE. PEACE OF MIND.</p>
      </section>

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-8 sm:px-8 md:px-6 lg:px-10 xl:px-14">
        <div className="pointer-events-none absolute -right-36 -top-32 h-96 w-96 rounded-full bg-orange-500/[0.055] blur-[110px]" />
        <div className="relative z-10 w-full max-w-[560px]">
          <Link href="/" className="mb-8 inline-flex items-center gap-2.5 md:hidden" aria-label="Kamdar home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF9F1C] to-[#FF6B00] text-[#17100A]">
              <Wrench size={18} strokeWidth={2.6} aria-hidden="true" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">Kamdar</span>
          </Link>

          {success ? (
            <div role="status" className="rounded-3xl border border-white/[0.08] bg-[#10141D] px-6 py-14 text-center shadow-2xl shadow-black/20 sm:px-10">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                <CheckCircle2 size={34} aria-hidden="true" />
              </span>
              <h1 className="mt-6 text-2xl font-bold tracking-tight">You&apos;re all set!</h1>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
                Your Kamdar account is ready. Taking you to sign in…
              </p>
            </div>
          ) : (
            <>
              <header className="mb-6">
                <h2 className="text-[27px] font-bold tracking-[-0.035em] sm:text-[30px]">Create your account</h2>
                <p className="mt-1.5 text-sm leading-6 text-slate-400">
                  Join the Kamdar marketplace as a client or skilled professional
                </p>
              </header>

              <div aria-label="Choose account type" className="grid grid-cols-2 gap-3" role="group">
                <button
                  type="button"
                  aria-pressed={userType === "customer"}
                  onClick={() => { setUserType("customer"); setApiError(""); }}
                  className={`group rounded-2xl border p-3.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70 sm:p-4 ${
                    userType === "customer"
                      ? "border-orange-400/70 bg-orange-400/[0.08] shadow-[0_0_0_1px_rgba(255,138,0,0.15)]"
                      : "border-white/[0.09] bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.045]"
                  }`}
                >
                  <span className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${userType === "customer" ? "bg-orange-400/15 text-orange-300" : "bg-white/[0.06] text-slate-400 group-hover:text-slate-200"}`}>
                    <Home size={18} aria-hidden="true" />
                  </span>
                  <span className="block text-[12px] font-bold leading-4 text-white sm:text-[13px]">Looking for Services</span>
                  <span className="mt-1.5 block min-h-[34px] text-[10px] leading-[17px] text-slate-400 sm:text-[11px]">
                    I want to hire skilled professionals for my home
                  </span>
                  <span className={`mt-3 inline-flex rounded-full px-2 py-1 text-[9px] font-semibold sm:text-[10px] ${userType === "customer" ? "bg-orange-400/10 text-orange-200" : "bg-white/[0.06] text-slate-400"}`}>
                    Client / Homeowner
                  </span>
                </button>
                <button
                  type="button"
                  aria-pressed={userType === "worker"}
                  onClick={() => { setUserType("worker"); setApiError(""); }}
                  className={`group rounded-2xl border p-3.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70 sm:p-4 ${
                    userType === "worker"
                      ? "border-orange-400/70 bg-orange-400/[0.08] shadow-[0_0_0_1px_rgba(255,138,0,0.15)]"
                      : "border-white/[0.09] bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.045]"
                  }`}
                >
                  <span className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${userType === "worker" ? "bg-orange-400/15 text-orange-300" : "bg-white/[0.06] text-slate-400 group-hover:text-slate-200"}`}>
                    <BriefcaseBusiness size={18} aria-hidden="true" />
                  </span>
                  <span className="block text-[12px] font-bold leading-4 text-white sm:text-[13px]">Offer Services (Kamdar)</span>
                  <span className="mt-1.5 block min-h-[34px] text-[10px] leading-[17px] text-slate-400 sm:text-[11px]">
                    I am a skilled technician/expert looking for jobs
                  </span>
                  <span className={`mt-3 inline-flex rounded-full px-2 py-1 text-[9px] font-semibold sm:text-[10px] ${userType === "worker" ? "bg-orange-400/10 text-orange-200" : "bg-white/[0.06] text-slate-400"}`}>
                    Service Provider
                  </span>
                </button>
              </div>

              <div
                aria-live="polite"
                className={`mt-3 overflow-hidden rounded-xl border px-3.5 text-[11px] leading-5 transition-all duration-300 ${
                  userType === "worker"
                    ? "max-h-20 border-amber-400/20 bg-amber-400/[0.08] py-2.5 text-amber-100/85"
                    : "max-h-20 border-white/[0.07] bg-white/[0.025] py-2.5 text-slate-400"
                }`}
              >
                {userType === "worker" ? (
                  <span className="flex items-start gap-2">
                    <BadgeCheck size={15} className="mt-0.5 shrink-0 text-amber-300" aria-hidden="true" />
                    Registering as a Kamdar? You will be guided through our skills verification process next.
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Clock3 size={14} className="shrink-0 text-orange-300" aria-hidden="true" />
                    Quick 1-minute setup to start booking.
                  </span>
                )}
              </div>

              <div aria-label="Signup method" className="mt-4 grid grid-cols-2 rounded-xl border border-white/[0.09] bg-white/[0.025] p-1" role="group">
                <button
                  type="button"
                  aria-pressed={signupMethod === "phone"}
                  onClick={() => { setSignupMethod("phone"); setOtpStep(false); setOtp(""); setApiError(""); }}
                  className={`rounded-lg px-2 py-2.5 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70 sm:text-xs ${
                    signupMethod === "phone" ? "bg-orange-400/15 text-orange-200 shadow-sm" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Sign up with Phone
                </button>
                <button
                  type="button"
                  aria-pressed={signupMethod === "email"}
                  onClick={() => { setSignupMethod("email"); setOtpStep(false); setApiError(""); }}
                  className={`rounded-lg px-2 py-2.5 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70 sm:text-xs ${
                    signupMethod === "email" ? "bg-orange-400/15 text-orange-200 shadow-sm" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Sign up with Email
                </button>
              </div>

              {apiError && (
                <div role="alert" className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-400/20 bg-rose-400/[0.07] p-3 text-xs leading-5 text-rose-200">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{apiError}</span>
                </div>
              )}

              {signupMethod === "phone" && otpStep ? (
                <div className="mt-5 flex flex-col gap-4">
                  <div role="status" className="rounded-xl border border-amber-400/20 bg-amber-400/[0.08] p-3.5 text-[11px] leading-5 text-amber-100/90">
                    SMS verification is not configured yet. No code was sent, and phone registration is unavailable. Switch to email signup to create your account.
                  </div>
                  <div>
                    <label htmlFor="phoneOtp" className="mb-1.5 block text-[11px] font-semibold text-slate-300">6-digit verification code</label>
                    <input
                      id="phoneOtp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      value={otp}
                      onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                      aria-label="6-digit phone verification code"
                      className="h-12 w-full rounded-xl border border-white/[0.1] bg-white/[0.035] px-4 text-center text-lg font-semibold tracking-[0.6em] text-white outline-none transition placeholder:text-slate-600 focus:border-orange-400/70 focus:ring-2 focus:ring-orange-400/15"
                      placeholder="••••••"
                    />
                    <p className="mt-2 text-[10px] text-slate-500">A resend timer will be available when SMS delivery is connected.</p>
                  </div>
                  <button
                    type="button"
                    disabled
                    title="Phone verification is unavailable until SMS support is configured"
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] text-[13px] font-bold text-[#1C1308] opacity-50"
                  >
                    Verify &amp; Create Account <ArrowRight size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    disabled
                    className="mx-auto text-[11px] font-semibold text-slate-500"
                    title="Phone verification is unavailable until SMS support is configured"
                  >
                    Resend code unavailable
                  </button>
                </div>
              ) : (
              <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-3.5">
                {userType === "worker" && signupMethod === "email" && (
                  <div>
                    <label htmlFor="skill" className="mb-1.5 block text-[11px] font-semibold text-slate-300">Your main skill</label>
                    <select
                      id="skill"
                      value={skill}
                      onChange={(event) => { setSkill(event.target.value); setApiError(""); }}
                      className="h-11 w-full rounded-xl border border-white/[0.1] bg-[#111620] px-3.5 text-xs text-white outline-none transition focus:border-orange-400/70 focus:ring-2 focus:ring-orange-400/15"
                    >
                      <option value="">Select your professional trade</option>
                      <option value="plumber">Plumber</option>
                      <option value="electrician">Electrician</option>
                      <option value="carpenter">Carpenter</option>
                      <option value="painter">Painter</option>
                      <option value="cleaner">Cleaner</option>
                      <option value="it_support">IT Support</option>
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="firstName" className="mb-1.5 block text-[11px] font-semibold text-slate-300">First name</label>
                    <div className="relative">
                      <UserRound size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                      <input
                        id="firstName"
                        autoComplete="given-name"
                        type="text"
                        placeholder="e.g. Ram"
                        value={form.firstName}
                        onChange={(event) => handleInputChange("firstName", event.target.value)}
                        aria-invalid={Boolean(errors.firstName)}
                        aria-describedby={errors.firstName ? "firstName-error" : undefined}
                        className={`h-11 w-full rounded-xl border bg-white/[0.035] pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-slate-600 focus:ring-2 focus:ring-orange-400/15 ${errors.firstName ? "border-rose-400/60 focus:border-rose-400" : "border-white/[0.1] focus:border-orange-400/70"}`}
                      />
                    </div>
                    {errors.firstName && <p id="firstName-error" className="mt-1 text-[10px] text-rose-300">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="mb-1.5 block text-[11px] font-semibold text-slate-300">Last name</label>
                    <div className="relative">
                      <UserRound size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                      <input
                        id="lastName"
                        autoComplete="family-name"
                        type="text"
                        placeholder="e.g. Shrestha"
                        value={form.lastName}
                        onChange={(event) => handleInputChange("lastName", event.target.value)}
                        aria-invalid={Boolean(errors.lastName)}
                        aria-describedby={errors.lastName ? "lastName-error" : undefined}
                        className={`h-11 w-full rounded-xl border bg-white/[0.035] pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-slate-600 focus:ring-2 focus:ring-orange-400/15 ${errors.lastName ? "border-rose-400/60 focus:border-rose-400" : "border-white/[0.1] focus:border-orange-400/70"}`}
                      />
                    </div>
                    {errors.lastName && <p id="lastName-error" className="mt-1 text-[10px] text-rose-300">{errors.lastName}</p>}
                  </div>
                </div>

                {signupMethod === "email" && <div>
                  <label htmlFor="email" className="mb-1.5 block text-[11px] font-semibold text-slate-300">Email address</label>
                  <div className="relative">
                    <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                    <input
                      id="email"
                      autoComplete="email"
                      type="email"
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={(event) => handleInputChange("email", event.target.value)}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className={`h-11 w-full rounded-xl border bg-white/[0.035] pl-10 pr-3.5 text-xs text-white outline-none transition placeholder:text-slate-600 focus:ring-2 focus:ring-orange-400/15 ${errors.email ? "border-rose-400/60 focus:border-rose-400" : "border-white/[0.1] focus:border-orange-400/70"}`}
                    />
                  </div>
                  {errors.email && <p id="email-error" className="mt-1 text-[10px] text-rose-300">{errors.email}</p>}
                </div>}

                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-[11px] font-semibold text-slate-300">Phone number</label>
                  <div className={`flex h-11 overflow-hidden rounded-xl border bg-white/[0.035] transition focus-within:ring-2 focus-within:ring-orange-400/15 ${errors.phone ? "border-rose-400/60 focus-within:border-rose-400" : "border-white/[0.1] focus-within:border-orange-400/70"}`}>
                    <span className="flex items-center pl-3.5 text-slate-500" aria-hidden="true"><Phone size={15} /></span>
                    {signupMethod === "email" ? (
                      <>
                        <label htmlFor="countryPrefix" className="sr-only">Country calling code</label>
                        <select
                          id="countryPrefix"
                          value={countryPrefix}
                          onChange={(event) => setCountryPrefix(event.target.value)}
                          aria-label="Country calling code"
                          className="ml-2 w-[91px] appearance-none border-r border-white/[0.09] bg-transparent px-1 text-[11px] font-medium text-slate-300 outline-none"
                        >
                          {countryPrefixes.map((prefix) => (
                            <option key={prefix.value} value={prefix.value} className="bg-[#111620]">{prefix.value}</option>
                          ))}
                        </select>
                      </>
                    ) : (
                      <span className="ml-2 flex w-[76px] items-center border-r border-white/[0.09] px-1 text-[11px] font-medium text-slate-300">+977</span>
                    )}
                    <input
                      id="phone"
                      autoComplete="tel-national"
                      type="tel"
                      inputMode="tel"
                      placeholder="98XXXXXXXX"
                      value={form.phone}
                      onChange={(event) => handleInputChange("phone", event.target.value)}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                      className="min-w-0 flex-1 bg-transparent px-3 text-xs text-white outline-none placeholder:text-slate-600"
                    />
                  </div>
                  {errors.phone && <p id="phone-error" className="mt-1 text-[10px] text-rose-300">{errors.phone}</p>}
                </div>

                {signupMethod === "email" && <div>
                  <label htmlFor="password" className="mb-1.5 block text-[11px] font-semibold text-slate-300">Password</label>
                  <div className="relative">
                    <LockKeyhole size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                    <input
                      id="password"
                      autoComplete="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      value={form.password}
                      onChange={(event) => handleInputChange("password", event.target.value)}
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={errors.password ? "password-error" : form.password ? "password-strength" : undefined}
                      className={`h-11 w-full rounded-xl border bg-white/[0.035] pl-10 pr-11 text-xs text-white outline-none transition placeholder:text-slate-600 focus:ring-2 focus:ring-orange-400/15 ${errors.password ? "border-rose-400/60 focus:border-rose-400" : "border-white/[0.1] focus:border-orange-400/70"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70"
                    >
                      {showPassword ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
                    </button>
                  </div>
                  {errors.password ? (
                    <p id="password-error" className="mt-1 text-[10px] text-rose-300">{errors.password}</p>
                  ) : form.password ? (
                    <div id="password-strength" className="mt-2" aria-live="polite">
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>Password strength</span>
                        <span className={passwordStrength < 2 ? "text-rose-300" : passwordStrength < 4 ? "text-amber-300" : "text-emerald-300"}>{strengthLabel}</span>
                      </div>
                      <div className="mt-1 flex gap-1" role="img" aria-label={`Password strength: ${strengthLabel}`}>
                        {passwordChecks.map((passed, index) => (
                          <span key={index} className={`h-1 flex-1 rounded-full ${passed ? strengthColor : "bg-white/[0.09]"}`} />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>}

                <label className="mt-0.5 flex cursor-pointer items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(event) => { setAgreeTerms(event.target.checked); setApiError(""); }}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70"
                  />
                  <span className="text-[10px] leading-[17px] text-slate-400">
                    I agree to the <span className="font-medium text-slate-200">Terms of Service</span> and <span className="font-medium text-slate-200">Privacy Policy</span>.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] text-[13px] font-bold text-[#1C1308] shadow-lg shadow-orange-500/[0.14] transition duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0E14] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {signupMethod === "phone"
                    ? "Send Verification Code"
                    : loading
                      ? "Creating your account…"
                      : userType === "worker"
                        ? "Register as Kamdar Professional"
                        : "Create Client Account"}
                  {!loading && <ArrowRight size={16} aria-hidden="true" />}
                </button>
              </form>
              )}

              <div className="my-4 flex items-center gap-3 text-[10px] text-slate-600">
                <span className="h-px flex-1 bg-white/[0.08]" />
                OR SIGN UP WITH
                <span className="h-px flex-1 bg-white/[0.08]" />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button type="button" onClick={() => handleOAuth("google")} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.025] text-xs font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/[0.05]">
                  <span className="bg-gradient-to-br from-blue-400 via-emerald-400 to-amber-400 bg-clip-text text-sm font-black text-transparent" aria-hidden="true">G</span>
                  Google
                </button>
                <button type="button" onClick={() => handleOAuth("microsoft")} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.025] text-xs font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/[0.05]">
                  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                    <path fill="#F25022" d="M1 1h6.5v6.5H1z" />
                    <path fill="#7FBA00" d="M8.5 1H15v6.5H8.5z" />
                    <path fill="#00A4EF" d="M1 8.5h6.5V15H1z" />
                    <path fill="#FFB900" d="M8.5 8.5H15V15H8.5z" />
                  </svg>
                  Microsoft / Outlook
                </button>
                <button type="button" onClick={() => handleOAuth("apple")} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.025] text-xs font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/[0.05]">
                  <Apple size={15} aria-hidden="true" />
                  Apple
                </button>
              </div>

              <p className="mt-5 text-center text-xs text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-orange-300 transition hover:text-orange-200 focus-visible:outline-none focus-visible:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
