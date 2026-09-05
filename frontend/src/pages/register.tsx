"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/api";
import {
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  Layers,
  Lock,
  Mail,
  Phone,
  ShieldAlert,
  User,
  Wrench,
} from "lucide-react";

type UserType = "customer" | "worker";

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};

type FormErrors = Partial<Record<keyof RegisterForm, string>>;

const skillsList = [
  { value: "painter", label: "Painter (पेन्टर)" },
  { value: "electrician", label: "Electrician (इलेक्ट्रिसियन)" },
  { value: "plumber", label: "Plumber (प्लम्बर)" },
  { value: "carpenter", label: "Carpenter (कार्पेन्टर)" },
  {
    value: "construction",
    label: "Construction Worker (मजदुर)",
  },
];

const initialForm: RegisterForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
};

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [userType, setUserType] = useState<UserType>("customer");
  const [skill, setSkill] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (
    key: keyof RegisterForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [key]: undefined,
    }));

    setApiError("");
  };

  const handleUserTypeChange = (type: UserType) => {
    setUserType(type);
    setApiError("");
    setErrors({});
    setIsOpen(false);

    if (type === "customer") {
      setSkill("");
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }

    const email = form.email.trim().toLowerCase();

    if (!email) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    const phone = form.phone.trim();
    const phoneRegex = /^(98|97)\d{8}$/;

    if (!phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone =
        "Enter a valid Nepal mobile number starting with 98 or 97.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must contain at least 8 characters.";
    }

    return newErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setApiError("");

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!agreeTerms) {
      setApiError(
        "Please agree to the Terms of Service and Privacy Policy."
      );
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
          phone: form.phone.trim(),
          password: form.password,
          role: userType === "worker" ? "PROVIDER" : "CUSTOMER",
          skill: userType === "worker" ? skill.toUpperCase() : undefined,
        }),
      });

      setSuccess(true);

      window.setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#060810] p-5 font-sans text-white">
      {/* Ambient background */}
      <div
        className="pointer-events-none absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[150px]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[450px] w-[450px] rounded-full bg-orange-500/5 blur-[130px]"
        aria-hidden="true"
      />

      <div className="grid w-full max-w-[960px] grid-cols-1 overflow-hidden rounded-[28px] border border-white/10 bg-[#090d16] shadow-2xl shadow-black/60 md:grid-cols-2">
        {/* Branding panel */}
        <section className="relative flex flex-col justify-between border-b border-white/5 bg-black/20 p-8 text-left sm:p-10 md:border-b-0 md:border-r">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-2 shadow-lg shadow-blue-500/10">
              <Wrench
                size={18}
                className="text-white"
                strokeWidth={2.5}
              />
            </div>

            <span className="text-xl font-black tracking-tight">
              Kamdar<span className="text-orange-500">Nepal</span>
            </span>
          </div>

          <div className="my-auto py-10 text-left">
            <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-blue-400">
              <Layers size={11} />
              Verified Workforce Network
            </span>

            <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight text-white">
              Nepal&apos;s trusted network for{" "}
              <span className="text-orange-500">local professionals.</span>
            </h1>

            <p className="text-sm leading-relaxed text-white/40">
              Connect with skilled professionals for your home, office, and
              construction needs. Or join our network and offer your skills
              to customers across Nepal.
            </p>
          </div>

          <div className="text-xs font-medium text-white/20">
            © 2026 Kamdar Nepal
          </div>
        </section>

        {/* Registration panel */}
        <section className="flex flex-col justify-center p-8 text-left sm:p-10">
          {success ? (
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 p-5 text-emerald-400">
                <CheckCircle2 size={40} />
              </div>

              <h3 className="text-xl font-black tracking-tight text-white">
                Account Created Successfully
              </h3>

              <p className="max-w-xs text-sm text-white/40">
                Your account is ready. Redirecting you to the sign-in page...
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="mb-1 text-2xl font-extrabold tracking-tight text-white">
                  Create Account
                </h2>

                <p className="text-xs text-white/40">
                  Get started with trusted local services.
                </p>
              </div>

              {/* Account type */}
              <div
                className="flex rounded-xl border border-white/5 bg-white/5 p-1"
                role="tablist"
                aria-label="Account type"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={userType === "customer"}
                  onClick={() => handleUserTypeChange("customer")}
                  className={`flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-none text-xs font-bold transition-all duration-200 ${
                    userType === "customer"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-transparent text-white/50 hover:text-white"
                  }`}
                >
                  <User size={13} />
                  Customer
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={userType === "worker"}
                  onClick={() => handleUserTypeChange("worker")}
                  className={`flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-none text-xs font-bold transition-all duration-200 ${
                    userType === "worker"
                      ? "bg-orange-500 text-[#03050a] shadow-md"
                      : "bg-transparent text-white/50 hover:text-white"
                  }`}
                >
                  <Briefcase size={13} />
                  Kamdar
                </button>
              </div>

              {/* API error */}
              {apiError && (
                <div
                  role="alert"
                  className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs font-medium text-red-400"
                >
                  <ShieldAlert size={16} className="shrink-0" />
                  <span>{apiError}</span>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3.5"
                noValidate
              >
                {/* Professional skill */}
                {userType === "worker" && (
                  <div
                    ref={dropdownRef}
                    className="relative flex flex-col gap-1.5"
                  >
                    <label
                      htmlFor="professional-trade"
                      className="text-[10px] font-extrabold uppercase tracking-wider text-white/40"
                    >
                      Professional Trade / Skill
                    </label>

                    <button
                      id="professional-trade"
                      type="button"
                      aria-haspopup="listbox"
                      aria-expanded={isOpen}
                      onClick={() => setIsOpen((previous) => !previous)}
                      className="flex h-11 w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 text-left text-xs text-slate-300 outline-none transition-colors hover:border-white/20 focus:border-orange-500/50"
                    >
                      <span>
                        {skill
                          ? skillsList.find(
                              (item) => item.value === skill
                            )?.label
                          : "-- कुन काम गर्नुहुन्छ छान्नुहोस् --"}
                      </span>

                      <ChevronDown
                        size={14}
                        className={`text-white/40 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div
                        role="listbox"
                        aria-label="Professional trade"
                        className="absolute left-0 top-[calc(100%+4px)] z-50 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0d121f] shadow-2xl"
                      >
                        {skillsList.map((item) => (
                          <button
                            key={item.value}
                            type="button"
                            role="option"
                            aria-selected={skill === item.value}
                            onClick={() => {
                              setSkill(item.value);
                              setIsOpen(false);
                              setApiError("");
                            }}
                            className="block w-full border-b border-white/5 px-4 py-3 text-left text-xs text-white/70 transition-colors last:border-none hover:bg-white/10 hover:text-white"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Name */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="firstName"
                      className="text-[10px] font-extrabold uppercase tracking-wider text-white/40"
                    >
                      First Name
                    </label>

                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      placeholder="e.g. Ram"
                      value={form.firstName}
                      onChange={(event) =>
                        handleInputChange(
                          "firstName",
                          event.target.value
                        )
                      }
                      aria-invalid={Boolean(errors.firstName)}
                      aria-describedby={
                        errors.firstName
                          ? "firstName-error"
                          : undefined
                      }
                      className={`h-11 w-full rounded-xl border bg-white/5 px-4 text-xs text-white outline-none transition-all ${
                        errors.firstName
                          ? "border-red-500/50 focus:border-red-500"
                          : "border-white/10 focus:border-blue-500/50"
                      }`}
                    />

                    {errors.firstName && (
                      <span
                        id="firstName-error"
                        className="text-[10px] text-red-400"
                      >
                        {errors.firstName}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="lastName"
                      className="text-[10px] font-extrabold uppercase tracking-wider text-white/40"
                    >
                      Last Name
                    </label>

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      placeholder="e.g. Bahadur"
                      value={form.lastName}
                      onChange={(event) =>
                        handleInputChange(
                          "lastName",
                          event.target.value
                        )
                      }
                      aria-invalid={Boolean(errors.lastName)}
                      aria-describedby={
                        errors.lastName
                          ? "lastName-error"
                          : undefined
                      }
                      className={`h-11 w-full rounded-xl border bg-white/5 px-4 text-xs text-white outline-none transition-all ${
                        errors.lastName
                          ? "border-red-500/50 focus:border-red-500"
                          : "border-white/10 focus:border-blue-500/50"
                      }`}
                    />

                    {errors.lastName && (
                      <span
                        id="lastName-error"
                        className="text-[10px] text-red-400"
                      >
                        {errors.lastName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="email"
                    className="text-[10px] font-extrabold uppercase tracking-wider text-white/40"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={14}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={(event) =>
                        handleInputChange("email", event.target.value)
                      }
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                      className={`h-11 w-full rounded-xl border bg-white/5 pl-11 pr-4 text-xs text-white outline-none transition-all ${
                        errors.email
                          ? "border-red-500/50 focus:border-red-500"
                          : "border-white/10 focus:border-blue-500/50"
                      }`}
                    />
                  </div>

                  {errors.email && (
                    <span
                      id="email-error"
                      className="text-[10px] text-red-400"
                    >
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="phone"
                    className="text-[10px] font-extrabold uppercase tracking-wider text-white/40"
                  >
                    Phone Number (Nepal)
                  </label>

                  <div className="relative">
                    <Phone
                      size={14}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    />

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      placeholder="98XXXXXXXX"
                      maxLength={10}
                      value={form.phone}
                      onChange={(event) =>
                        handleInputChange(
                          "phone",
                          event.target.value.replace(/\D/g, "")
                        )
                      }
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={
                        errors.phone ? "phone-error" : undefined
                      }
                      className={`h-11 w-full rounded-xl border bg-white/5 pl-11 pr-4 text-xs text-white outline-none transition-all ${
                        errors.phone
                          ? "border-red-500/50 focus:border-red-500"
                          : "border-white/10 focus:border-blue-500/50"
                      }`}
                    />
                  </div>

                  {errors.phone && (
                    <span
                      id="phone-error"
                      className="text-[10px] text-red-400"
                    >
                      {errors.phone}
                    </span>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="password"
                    className="text-[10px] font-extrabold uppercase tracking-wider text-white/40"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={14}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Minimum 8 characters"
                      value={form.password}
                      onChange={(event) =>
                        handleInputChange(
                          "password",
                          event.target.value
                        )
                      }
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={
                        errors.password
                          ? "password-error"
                          : undefined
                      }
                      className={`h-11 w-full rounded-xl border bg-white/5 pl-11 pr-11 text-xs text-white outline-none transition-all ${
                        errors.password
                          ? "border-red-500/50 focus:border-red-500"
                          : "border-white/10 focus:border-blue-500/50"
                      }`}
                    />

                    <button
                      type="button"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      onClick={() =>
                        setShowPassword((previous) => !previous)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer border-none bg-transparent p-0 text-white/30 transition-colors hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <span
                      id="password-error"
                      className="text-[10px] text-red-400"
                    >
                      {errors.password}
                    </span>
                  )}
                </div>

                {/* Terms */}
                <label className="mt-1 flex cursor-pointer items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(event) =>
                      setAgreeTerms(event.target.checked)
                    }
                    className="mt-0.5 h-3.5 w-3.5 cursor-pointer rounded border-white/10 bg-slate-950 accent-blue-600"
                  />

                  <span className="text-[11px] leading-tight text-white/50">
                    I agree to the Terms of Service and Privacy Policy.
                  </span>
                </label>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className={`mt-2 flex h-11 w-full items-center justify-center gap-1.5 rounded-xl border-none text-xs font-bold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                    userType === "worker"
                      ? "bg-orange-500 text-[#03050a] hover:bg-orange-600"
                      : "bg-blue-600 text-white hover:bg-blue-500"
                  }`}
                >
                  {loading ? (
                    <>
                      <span
                        className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
                        aria-hidden="true"
                      />
                      Creating account...
                    </>
                  ) : userType === "worker" ? (
                    "Join as a Professional →"
                  ) : (
                    "Create Customer Account →"
                  )}
                </Button>

                <div className="mt-1 text-center text-xs text-white/40">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-bold text-blue-400 hover:underline"
                  >
                    Sign in
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