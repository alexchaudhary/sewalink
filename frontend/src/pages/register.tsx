"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
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
import styles from "./register.module.css";

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

  const handleSocialLogin = (provider: "google" | "facebook" | "apple") => {
    window.location.href = `http://localhost:4000/api/auth/${provider}`;
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
    } catch (err: any) {
      setApiError(
        err?.message || "Registration failed backend connection handshake."
      );
    } finally {
      setLoading(false);
    }
  };

  const dynamicThemeClass =
    userType === "worker" ? "theme-mode-worker" : "theme-mode-customer";
  const getButtonText = () =>
    loading
      ? "Processing..."
      : userType === "customer"
      ? "Create Account"
      : "Join as Professional";
  const targetButtonHexColor = userType === "worker" ? "#ff6b00" : "#2563eb";

  return (
    <main className={`${styles.mainContainer} ${dynamicThemeClass}`}>
      <div className={styles.gridContainer}>
        {/* Left Side Sidebar Panel Component Layer */}
        <section className={styles.leftPanel}>
          <div className="glow-adaptive absolute -top-20 -left-20 w-80 h-80" />
          <div className="brand-header">
            <div className="brand-icon">
              <Wrench size={18} strokeWidth={2.5} />
            </div>
            <div>
              <div className="brand-name">
                Kamdar<span className="accent-glow-text">Nepal</span>
              </div>
              <div className="brand-sub">Elite Service Platform</div>
            </div>
          </div>

          <div className="hero-content">
            <span className="badge">
              <Layers size={11} /> Enterprise Business Architecture
            </span>
            <h1 className="hero-title">
              Nepal's premier network for{" "}
              <span className="accent-glow-text">verified</span> local workforce.
            </h1>
            <p className="hero-p">
              Connecting homes, offices, and construction sites with skilled
              professionals instantly. Your trusted on-demand ecosystem for
              smarter, hassle-free local labor hire across Nepal.
            </p>
          </div>

          <div className="footer-text">Clean Architecture Compliance © 2026</div>
        </section>

        {/* Right Side Form Panel Container Element */}
        <section className={styles.rightPanel}>
          <div className={styles.formWrapper}>
            {!success ? (
              <div className="fade-in">
                <div className={styles.headerBlock}>
                  <h2>Create Account</h2>
                  <p>Access the high-fidelity cloud network.</p>
                </div>

                {/* Identity Tab Switched Matrix Controls */}
                <div className={styles.tabContainer}>
                  <button
                    type="button"
                    onClick={() => {
                      setUserType("customer");
                      setApiError("");
                    }}
                    className={`${styles.tabBtn} ${
                      userType === "customer" ? styles.activeCustomer : ""
                    }`}
                  >
                    <User size={13} /> Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUserType("worker");
                      setApiError("");
                    }}
                    className={`${styles.tabBtn} ${
                      userType === "worker" ? styles.activeWorker : ""
                    }`}
                  >
                    <Briefcase size={13} /> Kamdar
                  </button>
                </div>

                {/* HIGH VISIBILITY DYNAMIC ERROR ALERT SIGNAL PANEL */}
                {apiError && (
                  <div className="flex items-center gap-3 bg-red-950/40 border border-red-900/50 text-red-200 px-4 py-3.5 rounded-xl text-sm font-medium my-4 animate-fade-in-up">
                    <ShieldAlert size={18} className="text-red-500 shrink-0" />
                    <span className="leading-relaxed">{apiError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className={styles.actualForm}>
                  {userType === "worker" && (
                    <div className={styles.inputGroup} ref={dropdownRef}>
                      <label>Professional Trade</label>
                      <div className={styles.customDropdownContainer}>
                        <div
                          className={`${styles.luxuryInput} ${styles.customDropdownTrigger}`}
                          onClick={() => setIsOpen(!isOpen)}
                        >
                          <span
                            className={
                              skill ? "text-white" : "text-placeholder"
                            }
                          >
                            {skill
                              ? skillsList.find((s) => s.value === skill)?.label
                              : "-- Select Your Skill --"}
                          </span>
                          <ChevronDown
                            size={16}
                            className={`arrow-icon ${isOpen ? "rotate" : ""}`}
                          />
                        </div>
                        {isOpen && (
                          <div className={styles.dynamicDropdownFloat}>
                            {skillsList.map((s) => (
                              <div
                                key={s.value}
                                className={styles.customDropdownItem}
                                onClick={() => {
                                  setSkill(s.value);
                                  setIsOpen(false);
                                }}
                              >
                                {s.label}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className={styles.nameRow}>
                    <div className={styles.inputGroup}>
                      <label>First Name</label>
                      <input
                        type="text"
                        placeholder="Aarav"
                        value={form.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className={styles.luxuryInput}
                      />
                      {errors.firstName && (
                        <span className={styles.fieldErr}>
                          {errors.firstName}
                        </span>
                      )}
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Last Name</label>
                      <input
                        type="text"
                        placeholder="Sharma"
                        value={form.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className={styles.luxuryInput}
                      />
                      {errors.lastName && (
                        <span className={styles.fieldErr}>
                          {errors.lastName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Email Address</label>
                    <div className={styles.inputIconWrapper}>
                      <Mail size={16} className={styles.inputIcon} />
                      <input
                        type="email"
                        placeholder="name@domain.com"
                        value={form.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className={`${styles.luxuryInput} ${styles.withIcon}`}
                      />
                    </div>
                    {errors.email && (
                      <span className={styles.fieldErr}>{errors.email}</span>
                    )}
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Phone Number (Nepal)</label>
                    <div className={styles.inputIconWrapper}>
                      <Phone size={16} className={styles.inputIcon} />
                      <input
                        type="text"
                        placeholder="98XXXXXXXX"
                        value={form.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className={`${styles.luxuryInput} ${styles.withIcon}`}
                      />
                    </div>
                    {errors.phone && (
                      <span className={styles.fieldErr}>{errors.phone}</span>
                    )}
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Secure Password</label>
                    <div className={styles.inputIconWrapper}>
                      <Lock size={16} className={styles.inputIcon} />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        className={`${styles.luxuryInput} ${styles.withIcon}`}
                      />
                      <button
                        type="button"
                        className={styles.eyeBtn}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <span className={styles.fieldErr}>
                        {errors.password}
                      </span>
                    )}
                  </div>

                  <div className={styles.termsRow}>
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className={styles.luxuryCheckbox}
                    />
                    <label htmlFor="terms">
                      I agree to the{" "}
                      <Link href="/terms" className={styles.loginLink}>
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className={styles.loginLink}>
                        Privacy Policy
                      </Link>
                      .
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      backgroundColor: targetButtonHexColor,
                      color: "#ffffff",
                    }}
                    className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl hover:brightness-110 active:scale-98 transition-all duration-200"
                  >
                    <span>{getButtonText()}</span>
                    <ArrowRight size={16} />
                  </button>
                </form>

                {/* Social Auth Divider */}
                <div className={styles.socialDivider}>
                  <span>OR REGISTER WITH</span>
                </div>

                <div className={styles.socialGridRow}>
                  {/* Google */}
                  <button
                    type="button"
                    onClick={() => handleSocialLogin("google")}
                    className={styles.socialBtn}
                  >
                    <svg
                      className={styles.brandIconSvg}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#EA4335"
                        d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 22.3 12 23z"
                      />
                    </svg>
                    Google
                  </button>

                  {/* Facebook */}
                  <button
                    type="button"
                    onClick={() => handleSocialLogin("facebook")}
                    className={`${styles.socialBtn} ${styles.facebookOfficial}`}
                  >
                    <svg
                      className={styles.brandIconSvg}
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </button>

                  {/* Apple */}
                  <button
                    type="button"
                    onClick={() => handleSocialLogin("apple")}
                    className={`${styles.socialBtn} ${styles.appleOfficial}`}
                  >
                    <svg
                      className={styles.brandIconSvg}
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.34c.67-.82 1.12-1.96.99-3.1-.96.04-2.13.64-2.82 1.44-.61.71-1.14 1.87-.99 2.99 1.07.08 2.15-.51 2.82-1.33z" />
                    </svg>
                    Apple
                  </button>
                </div>

                <p className={styles.loginPrompt}>
                  Already have an account?{" "}
                  <Link href="/login" className={styles.loginLink}>
                    Sign In
                  </Link>
                </p>
              </div>
            ) : (
              <div className="success-card fade-in">
                <CheckCircle2 size={48} className="success-icon" />
                <h2>Registration Complete</h2>
                <p>
                  Your premium account credentials have been securely provisioned
                  to our system database.
                </p>
                <button
                  onClick={() => router.push("/login")}
                  style={{ backgroundColor: targetButtonHexColor }}
                  className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-white shadow-xl hover:brightness-110 active:scale-98 transition-all duration-200"
                >
                  <span>Proceed to Login Terminal</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}