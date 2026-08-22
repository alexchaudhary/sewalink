"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetcher } from "../lib/api";
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
  ChevronDown
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "" });
  const [userType, setUserType] = useState<"customer" | "worker">("customer");
  const [skill, setSkill] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<any>({});
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
    { value: "construction", label: "Construction Worker (मजदुर)" }
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
    const newErrors: any = {};

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
      await fetcher("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.toLowerCase().trim(),
          phone: form.phone.trim(),
          password: form.password,
          role: userType === "worker" ? "PROVIDER" : "CUSTOMER",
          skill: userType === "worker" ? skill : undefined,
        }),
      });
      setSuccess(true);
    } catch (err: any) {
      setApiError(err?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-container">
      <div className="grid-container">
        
        {/* Sidebar Panel */}
        <section className="left-panel">
          <div className="brand-header">
            <div className="brand-icon">
              <Wrench size={18} strokeWidth={2.5} />
            </div>
            <div>
              <div className="brand-name">Kamdar<span style={{ color: "#ff6b00" }}>Nepal</span></div>
              <div className="brand-sub">Elite Service Platform</div>
            </div>
          </div>

          <div className="hero-content">
            <span className="badge"><Layers size={11} /> Enterprise Business Architecture</span>
            <h1 className="hero-title">
              Nepal's premier network for <span style={{ color: "#ff6b00" }}>verified</span> local workforce.
            </h1>
            <p className="hero-p">
              Connecting homes, offices, and construction sites with skilled professionals instantly. 
              Your trusted on-demand ecosystem for smarter, hassle-free local labor hire across Nepal.
            </p>
          </div>

          <div className="footer-text">Clean Architecture Compliance © 2026</div>
        </section>

        {/* Form Panel */}
        <section className="right-panel">
          <div className="form-wrapper">
            {!success ? (
              <div className="fade-in">
                <div className="header-block">
                  <h2>Create Account</h2>
                  <p>Access the high-fidelity cloud network.</p>
                </div>

                <div className="tab-container">
                  <button
                    type="button"
                    onClick={() => setUserType("customer")}
                    className={`tab-btn ${userType === "customer" ? "active-customer" : ""}`}
                  >
                    <User size={13} /> Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType("worker")}
                    className={`tab-btn ${userType === "worker" ? "active-worker" : ""}`}
                  >
                    <Briefcase size={13} /> Kamdar
                  </button>
                </div>

                {apiError && <div className="error-alert"><ShieldAlert size={14} />{apiError}</div>}

                <form onSubmit={handleSubmit} className="actual-form">
                  {userType === "worker" && (
                    <div className="input-group" ref={dropdownRef}>
                      <label>Professional Trade</label>
                      <div className="custom-dropdown-container">
                        <div 
                          className="luxury-input custom-dropdown-trigger" 
                          onClick={() => setIsOpen(!isOpen)}
                        >
                          <span>
                            {skill 
                              ? skillsList.find(s => s.value === skill)?.label 
                              : "-- Select Your Skill --"}
                          </span>
                          <ChevronDown size={16} className={`arrow-icon ${isOpen ? 'rotate' : ''}`} />
                        </div>
                        
                        {isOpen && (
                          <div className="custom-dropdown-menu">
                            {skillsList.map((s) => (
                              <div
                                key={s.value}
                                className={`custom-dropdown-item ${skill === s.value ? 'selected' : ''}`}
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

                  <div className="name-row">
                    <div className="input-group">
                      <label>First Name</label>
                      <input type="text" placeholder="Aarav" value={form.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} className="luxury-input" />
                      {errors.firstName && <span className="field-err">{errors.firstName}</span>}
                    </div>
                    <div className="input-group">
                      <label>Last Name</label>
                      <input type="text" placeholder="Sharma" value={form.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} className="luxury-input" />
                      {errors.lastName && <span className="field-err">{errors.lastName}</span>}
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="name@domain.com" value={form.email} onChange={(e) => handleInputChange("email", e.target.value)} className="luxury-input" />
                    {errors.email && <span className="field-err">{errors.email}</span>}
                  </div>

                  <div className="input-group">
                    <label>Phone Number (Nepal)</label>
                    <input type="tel" placeholder="98XXXXXXXX" value={form.phone} onChange={(e) => handleInputChange("phone", e.target.value)} className="luxury-input" />
                    {errors.phone && <span className="field-err">{errors.phone}</span>}
                  </div>

                  <div className="input-group">
                    <label>Secure Password</label>
                    <div style={{ position: "relative" }}>
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={form.password} 
                        onChange={(e) => handleInputChange("password", e.target.value)} 
                        className="luxury-input" 
                        style={{ paddingRight: "40px" }}
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", border: 0, background: "transparent", color: "#444", cursor: "pointer", display: "flex" }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && <span className="field-err">{errors.password}</span>}
                  </div>

                  <div className="checkbox-group">
                    <input 
                      type="checkbox" 
                      id="terms-check" 
                      checked={agreeTerms} 
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="luxury-checkbox"
                    />
                    <label htmlFor="terms-check">
                      I agree to the <span className="highlight-text">Terms of Service</span> and <span className="highlight-text">Privacy Policy</span>.
                    </label>
                  </div>

                  <button type="submit" disabled={loading} className={`submit-btn ${userType === 'customer' ? 'btn-blue' : 'btn-orange'}`}>
                    {loading ? "Authorizing Token..." : <>{userType === "customer" ? "Register Identity" : "Register Token"} <ArrowRight size={14} /></>}
                  </button>
                </form>

                <div className="divider-zone">
                  <span className="line"></span>
                  <span className="divider-text">Or register with</span>
                  <span className="line"></span>
                </div>

                <div className="social-grid">
                  <button type="button" onClick={() => alert("Google Auth Linked")} className="social-btn btn-google">
                    <svg className="social-svg" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    Google
                  </button>

                  <button type="button" onClick={() => alert("Facebook Auth Linked")} className="social-btn btn-facebook">
                    <svg className="social-svg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </button>

                  <button type="button" onClick={() => alert("Apple Auth Linked")} className="social-btn btn-apple">
                    <svg className="social-svg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.61.71-1.14 1.86-1 2.97 1.08.08 2.16-.57 2.81-1.37z"/>
                    </svg>
                    Apple
                  </button>
                </div>

                <div className="footer-redirect">
                  Already have registered nodes? <Link href="/login" className="login-link">Sign in</Link>
                </div>
              </div>
            ) : (
              <div className="success-box">
                <CheckCircle2 size={48} color="#22c55e" style={{ margin: "0 auto 16px auto" }} />
                <h2>Onboarding Complete</h2>
                <p style={{ color: "#888", fontSize: "14px", marginTop: "8px" }}>Your official node signature has been compiled successfully.</p>
                <button onClick={() => router.push("/dashboard")} className="submit-btn btn-blue" style={{ marginTop: "24px" }}>
                  Launch Workspace →
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      <style jsx global>{`
        body { margin: 0; background: #03050a; color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .main-container { min-height: 100vh; display: flex; flex-direction: column; background: #03050a; }
        .grid-container { display: grid; grid-template-columns: 1.1fr 0.9fr; min-height: 100vh; }
        .left-panel { background: #050811; padding: 60px; display: flex; flex-direction: column; justify-content: space-between; position: relative; border-right: 1px solid rgba(255,255,255,0.02); }
        .brand-header { display: flex; align-items: center; gap: 12px; }
        .brand-icon { width: 38px; height: 38px; background: linear-gradient(135deg, #1e3a8a, #3b82f6); border-radius: 10px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.1); }
        .brand-name { font-size: 20px; font-weight: 900; letter-spacing: -0.5px; }
        .brand-sub { font-size: 10px; color: #555; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }
        .hero-content { max-width: 460px; margin: auto 0; }
        .badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.2); padding: 5px 12px; border-radius: 20px; font-size: 10px; font-weight: 700; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.5px; }
        .hero-title { font-size: 44px; font-weight: 900; line-height: 1.15; margin: 24px 0 16px 0; letter-spacing: -1px; }
        .hero-p { color: #888; font-size: 15px; line-height: 1.65; margin-top: 16px; }
        .footer-text { font-size: 11px; color: #444; font-family: monospace; }
        .right-panel { display: flex; align-items: center; justify-content: center; padding: 40px; background: #03050a; }
        .form-wrapper { width: 100%; max-width: 370px; }
        .header-block h2 { font-size: 26px; font-weight: 900; margin: 0; letter-spacing: -0.5px; }
        .header-block p { color: #666; font-size: 13px; margin: 6px 0 0 0; }
        .tab-container { display: flex; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 3px; border-radius: 12px; margin: 28px 0; }
        .tab-btn { flex: 1; border: 0; outline: none; background: transparent; color: #666; height: 38px; font-size: 13px; font-weight: 700; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s; }
        .tab-btn:hover { color: #fff; }
        .active-customer { background: #2563eb !important; color: #fff !important; box-shadow: 0 4px 15px rgba(37,99,235,0.2); }
        .active-worker { background: #e65100 !important; color: #fff !important; box-shadow: 0 4px 15px rgba(230,81,0,0.3); }
        .actual-form { display: flex; flex-direction: column; gap: 16px; }
        .name-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .input-group { display: flex; flex-direction: column; gap: 6px; }
        .input-group label { font-size: 10px; font-weight: 800; color: #555; text-transform: uppercase; letter-spacing: 0.5px; }
        .luxury-input {
          width: 100% !important; height: 44px !important; background: rgba(255,255,255,0.02) !important;
          border: 1px solid rgba(255,255,255,0.07) !important; border-radius: 10px !important;
          color: #fff !important; padding: 0 14px !important; font-size: 13px !important;
          outline: none !important; box-sizing: border-box !important; transition: all 0.2s !important;
          appearance: none !important; -webkit-appearance: none !important;
        }
        .luxury-input:focus { border-color: rgba(59,130,246,0.4) !important; background: rgba(255,255,255,0.04) !important; }
        .custom-dropdown-container { position: relative; width: 100%; }
        .custom-dropdown-trigger { display: flex; align-items: center; justify-content: space-between; cursor: pointer; user-select: none; }
        .arrow-icon { color: #555; transition: transform 0.2s ease; }
        .arrow-icon.rotate { transform: rotate(180deg); }
        .custom-dropdown-menu {
          position: absolute; top: calc(100% + 6px); left: 0; width: 100%;
          background: #090d16; border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; z-index: 50; overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5); padding: 4px;
        }
        .custom-dropdown-item {
          padding: 10px 14px; font-size: 13px; color: rgba(255,255,255,0.7);
          cursor: pointer; border-radius: 8px; transition: all 0.15s ease;
        }
        .custom-dropdown-item:hover { background: rgba(255,255,255,0.04); color: #fff; }
        .custom-dropdown-item.selected { background: #e65100; color: #fff; font-weight: 700; }
        .submit-btn { width: 100%; height: 44px; border: 0; outline: none; border-radius: 10px; color: #fff; font-size: 13px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 8px; transition: all 0.2s; }
        .btn-blue { background: linear-gradient(135deg, #2563eb, #1d4ed8); box-shadow: 0 4px 20px rgba(37,99,235,0.15); }
        .btn-orange { background: linear-gradient(135deg, #e65100, #bf360c); box-shadow: 0 4px 20px rgba(230,81,0,0.15); }
        .submit-btn:active { transform: scale(0.99); }
        .divider-zone { display: flex; align-items: center; gap: 10px; margin: 24px 0; }
        .line { flex: 1; height: 1px; background: rgba(255,255,255,0.05); }
        .divider-text { font-size: 11px; color: #444; font-weight: 600; text-transform: uppercase; }
        .social-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .social-btn { height: 42px; border: 0; border-radius: 10px; font-size: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; outline: none; }
        .btn-google { background: #ffffff !important; color: #1f2937 !important; border: 1px solid #e5e7eb !important; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .btn-google:hover { background: #f9fafb !important; }
        .btn-facebook { background: #1877F2 !important; color: #ffffff !important; box-shadow: 0 2px 8px rgba(24,119,242,0.2); }
        .btn-facebook:hover { background: #166fe5 !important; }
        .btn-apple { background: #000000 !important; color: #ffffff !important; border: 1px solid rgba(255,255,255,0.15) !important; box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
        .btn-apple:hover { background: #111111 !important; }
        .social-svg { width: 15px; height: 15px; }
        .checkbox-group { display: flex; align-items: flex-start; gap: 8px; margin: 4px 0; }
        .luxury-checkbox { margin-top: 2px; width: 14px; height: 14px; accent-color: #2563eb; cursor: pointer; }
        .checkbox-group label { font-size: 12px; color: #666; font-weight: 500; line-height: 1.4; cursor: pointer; }
        .highlight-text { color: #888; font-weight: 700; text-decoration: underline; }
        .field-err { font-size: 11px; color: #f87171; font-weight: 600; text-align: left; }
        .footer-redirect { text-align: center; font-size: 13px; color: #555; margin-top: 28px; }
        .login-link { color: #2563eb; text-decoration: none; font-weight: 700; }
        .error-alert { padding: 12px; background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.15); color: #f87171; border-radius: 10px; font-size: 12px; display: flex; align-items: center; gap: 8px; }
        .success-box { text-align: center; padding: 20px; }
        @media (max-width: 1024px) { .grid-container { grid-template-columns: 1fr; } .left-panel { display: none; } }
      `}</style>
    </main>
  );
}