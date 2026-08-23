"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  User,
  Wrench,
  Briefcase,
  ShieldAlert,
  Layers,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [userType, setUserType] = useState<"customer" | "worker">("customer");
  const [skill, setSkill] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const skillsList = [
    { value: "painter", label: "Painter (पेन्टर)" },
    { value: "electrician", label: "Electrician (इलेक्ट्रिसियन)" },
    { value: "plumber", label: "Plumber (प्लम्बर)" },
    { value: "carpenter", label: "Carpenter (कार्पेन्टर)" },
    { value: "construction", label: "Construction Worker (मजदुर)" },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
    setErrors({ ...errors, [key]: undefined });
    setApiError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!form.firstName.trim()) newErrors.firstName = "Required";
    if (!form.lastName.trim()) newErrors.lastName = "Required";
    if (!form.email.includes("@")) newErrors.email = "Invalid email";

    const phoneRegex = /^(98|97)\d{8}$/;
    if (!form.phone.trim()) {
      newErrors.phone = "Required";
    } else if (!phoneRegex.test(form.phone.trim())) {
      newErrors.phone = "Must be valid Nepal number (98/97...)";
    }

    if (form.password.length < 8) newErrors.password = "Min 8 chars";

    if (!agreeTerms) {
      setApiError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (userType === "worker" && !skill) {
      setApiError("Please select your professional trade.");
      return;
    }

    try {
      setLoading(true);
      setApiError("");

      const response = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.toLowerCase().trim(),
          phone: form.phone.trim(),
          password: form.password,
          role: userType === "worker" ? "PROVIDER" : "CUSTOMER",
          skill: userType === "worker" ? skill.toUpperCase() : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed on server side processing."
        );
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setApiError(
        err?.message || "Registration failed backend connection handshake."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#060810] text-white flex items-center justify-center font-sans p-5 select-none relative overflow-hidden">
      {/* Background Layer Ambiance Ambient Lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] bg-orange-500/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[960px] bg-[#090d16] border border-white/10 rounded-[28px] overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-2xl shadow-black/60">
        
        {/* Left Panel - Corporate Branding Information */}
        <section className="bg-black/20 p-10 flex flex-col justify-between border-r border-white/5 relative">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl flex items-center shadow-lg shadow-blue-500/10">
              <Wrench size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black tracking-tight">
              Kamdar<span className="text-orange-500">Nepal</span>
            </span>
          </div>

          <div className="my-auto py-10 text-left">
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 text-[10px] font-extrabold tracking-wider text-blue-400 mb-6 uppercase">
              <Layers size={11} /> Verified Workforce Network
            </span>
            <h1 className="text-3xl font-black tracking-tight text-white leading-tight mb-4">
              Nepal&apos;s premier network for <span className="text-orange-500">verified</span> local workforce.
            </h1>
            <p className="text-white/40 text-sm leading-relaxed">
              Connecting homes, offices, and construction sites with skilled professionals instantly. Your trusted on-demand ecosystem for smarter, hassle-free local labor hire across Nepal.
            </p>
          </div>

          <div className="text-xs text-white/20 font-medium text-left">
            Clean Architecture Compliance © 2026
          </div>
        </section>

        {/* Right Panel - Core Multi-step Registration Form */}
        <section className="p-10 flex flex-col justify-center text-left">
          {success ? (
            <div className="py-12 text-center flex flex-col items-center justify-center gap-4">
              <div className="bg-emerald-500/10 p-5 rounded-full border border-emerald-500/20 text-emerald-400">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Onboarding Process Initiated</h3>
              <p className="text-sm text-white/40 max-w-xs">Your credential tokens have been successfully synchronized inside the active Neon Node cluster.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-white mb-1">Create Account</h2>
                <p className="text-white/40 text-xs">Access the high-fidelity secure service layer.</p>
              </div>

              {/* Identity Selector Tabs */}
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => { setUserType("customer"); setApiError(""); }}
                  className={`flex-1 flex items-center justify-center gap-2 h-9 border-none rounded-lg text-xs font-bold cursor-pointer transition-all duration-200 ${
                    userType === "customer" ? "bg-blue-600 text-white shadow-md" : "bg-transparent text-white/50 hover:text-white"
                  }`}
                >
                  <User size={13} /> Customer
                </button>
                <button
                  type="button"
                  onClick={() => { setUserType("worker"); setApiError(""); }}
                  className={`flex-1 flex items-center justify-center gap-2 h-9 border-none rounded-lg text-xs font-bold cursor-pointer transition-all duration-200 ${
                    userType === "worker" ? "bg-orange-500 text-[#03050a] shadow-md" : "bg-transparent text-white/50 hover:text-white"
                  }`}
                >
                  <Briefcase size={13} /> Kamdar
                </button>
              </div>

              {apiError && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium flex items-center gap-2.5">
                  <ShieldAlert size={16} className="shrink-0" />
                  <span>{apiError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                {/* Dynamic Professional Skill Selector Window */}
                {userType === "worker" && (
                  <div className="flex flex-col gap-1.5 relative" ref={dropdownRef}>
                    <label className="text-[10px] font-extrabold text-white/40 uppercase tracking-wider">Professional Trade / Skill</label>
                    <div 
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-full h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between px-4 text-xs text-slate-300 cursor-pointer hover:border-white/20 transition-colors"
                    >
                      <span>{skill ? skillsList.find(s => s.value === skill)?.label : "-- कुन काम गर्नुहुन्छ छान्नुहोस् --"}</span>
                      <ChevronDown size={14} className="text-white/40" />
                    </div>

                    {isOpen && (
                      <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-[#0d121f] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl">
                        {skillsList.map((item) => (
                          <div
                            key={item.value}
                            onClick={() => { setSkill(item.value); setIsOpen(false); setApiError(""); }}
                            className="px-4 py-3 text-xs text-white/70 hover:bg-white/10 hover:text-white cursor-pointer transition-colors border-b border-white/5 last:border-none"
                          >
                            {item.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold text-white/40 uppercase tracking-wider">First Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ram"
                      value={form.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className={`w-full h-11 bg-white/5 border rounded-xl px-4 text-xs text-white outline-none transition-all ${
                        errors.firstName ? 'border-red-500/50' : 'border-white/10 focus:border-blue-500/50'
                      }`}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold text-white/40 uppercase tracking-wider">Last Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Bahadur"
                      value={form.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className={`w-full h-11 bg-white/5 border rounded-xl px-4 text-xs text-white outline-none transition-all ${
                        errors.lastName ? 'border-red-500/50' : 'border-white/10 focus:border-blue-500/50'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-white/40 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`w-full h-11 bg-white/5 border rounded-xl pl-11 pr-4 text-xs text-white outline-none transition-all ${
                        errors.email ? 'border-red-500/50' : 'border-white/10 focus:border-blue-500/50'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-white/40 uppercase tracking-wider">Phone Number (Nepal)</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="text"
                      placeholder="98XXXXXXXX"
                      maxLength={10}
                      value={form.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={`w-full h-11 bg-white/5 border rounded-xl pl-11 pr-4 text-xs text-white outline-none transition-all ${
                        errors.phone ? 'border-red-500/50' : 'border-white/10 focus:border-blue-500/50'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-white/40 uppercase tracking-wider">Password Context</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 8 characters securely hashed"
                      value={form.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`w-full h-11 bg-white/5 border rounded-xl pl-11 pr-11 text-xs text-white outline-none transition-all ${
                        errors.password ? 'border-red-500/50' : 'border-white/10 focus:border-blue-500/50'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-none border-none text-white/30 hover:text-white cursor-pointer p-0"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 mt-1 cursor-pointer" onClick={() => setAgreeTerms(!agreeTerms)}>
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={() => {}}
                    className="mt-0.5 h-3.5 w-3.5 rounded border-white/10 bg-slate-950 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-[11px] text-white/50 leading-tight">
                    I explicitly consent and agree to the system Terms of Service and secure Privacy Policy Parameters.
                  </span>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className={`w-full h-11 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 border-none select-none disabled:opacity-50 mt-2 ${
                    userType === "worker"
                      ? "bg-orange-500 hover:bg-orange-600 text-[#03050a]"
                      : "bg-blue-600 hover:bg-blue-500 text-white"
                  }`}
                >
                  {loading
                    ? "Processing Pipelines..."
                    : userType === "worker"
                    ? "Join as Professional Workforce →"
                    : "Create Consumer Account →"}
                </Button>

                <div className="text-center text-xs text-white/40 mt-1">
                  Already have an identity token?{" "}
                  <Link href="/login" className="text-blue-400 font-bold hover:underline">
                    Sign in context
                  </Link>
                </div>
              </form>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}