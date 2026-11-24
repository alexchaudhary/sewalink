"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Globe, Mail, Menu, MessageCircle, Search, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home",      href: "/" },
  { label: "Services",  href: "/providers" },
  { label: "Providers", href: "/providers" },
  { label: "About",     href: "#" },
  { label: "Contact",   href: "#" },
];

/* ── Logo ──────────────────────────────────────────────────────────────────── */
function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 no-underline group flex-shrink-0">
      {/* SVG mark */}
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="flex-shrink-0">
        <rect width="36" height="36" rx="9" fill="url(#lg)"/>
        {/* Chain link left */}
        <rect x="6" y="13" width="14" height="7" rx="3.5" stroke="#0a0c14" strokeWidth="2.5" fill="none"/>
        {/* Chain link right */}
        <rect x="16" y="16" width="14" height="7" rx="3.5" stroke="#0a0c14" strokeWidth="2.5" fill="none"/>
        {/* Interlock seam cover */}
        <rect x="16" y="15" width="4" height="9" fill="url(#lg)"/>
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f59e0b"/>
            <stop offset="1" stopColor="#d97706"/>
          </linearGradient>
        </defs>
      </svg>
      {/* Wordmark */}
      <span
        className="text-[19px] font-extrabold leading-none tracking-[-0.03em]"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <span className="text-white">Kam</span>
        <span style={{ color: "#fbbf24" }}>dar</span>
      </span>
    </Link>
  );
}

/* ── Layout ────────────────────────────────────────────────────────────────── */
export default function HomeLayout({ children }: { children: ReactNode }) {
  const [authed,   setAuthed]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    setAuthed(Boolean(window.localStorage.getItem("sewalink_token")));
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#060810] text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#060810]/85 backdrop-blur-xl border-b border-white/[0.08]"
            : "bg-[#060810]/35 backdrop-blur-xl border-b border-white/[0.04]"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo />

          {/* Desktop center nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="px-4 py-2 rounded-lg text-sm text-white/55 hover:text-white hover:bg-white/[0.05] transition-all duration-200 no-underline"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right */}
          <div className="hidden lg:flex items-center gap-2">
            <button className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05] transition-all duration-200">
              <Search size={16} strokeWidth={1.75} />
            </button>
            {authed ? (
              <button
                onClick={() => { window.localStorage.removeItem("sewalink_token"); window.location.href = "/"; }}
                className="btn-ghost px-4 py-2 text-sm font-semibold"
              >
                Sign out
              </button>
            ) : (
              <>
                <Link href="/login" className="px-3 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 no-underline">
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="btn-ghost px-4 py-2 text-sm no-underline inline-flex items-center"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.05] transition-all duration-200"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} strokeWidth={1.75} /> : <Menu size={20} strokeWidth={1.75} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-white/[0.06] bg-[#060810]/97 backdrop-blur-xl px-4 pb-5 pt-3 flex flex-col gap-1 sm:px-6">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm text-white/55 hover:text-white hover:bg-white/[0.05] transition-all duration-200 no-underline"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex gap-2 mt-3 pt-3 border-t border-white/[0.06]">
              <Link href="/login" onClick={() => setOpen(false)} className="flex-1 text-center py-2.5 rounded-xl text-sm font-medium text-white/70 border border-white/[0.08] hover:text-white hover:border-white/20 transition-all duration-200 no-underline">
                Sign In
              </Link>
              <Link href="/register" onClick={() => setOpen(false)} className="btn-ghost flex-1 text-center py-2.5 rounded-xl text-sm no-underline">
                Create Account
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── CONTENT ────────────────────────────────────────────────────── */}
      <main>{children}</main>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="bg-[#040610] border-t border-white/[0.06] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 mb-10">

            {/* Brand — spans 2 cols */}
            <div className="lg:col-span-2">
              <Logo />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
                Kamdar is a home services marketplace connecting homeowners with verified local professionals. Currently in active development.
              </p>
              {/* Social icons */}
              <div className="flex gap-2 mt-5">
                {[
                  { Icon: Globe, label: "Website" },
                  { Icon: MessageCircle, label: "Community" },
                  { Icon: Mail, label: "Email" },
                ].map(({ Icon, label }) => (
                  <button
                    key={label}
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400 transition-all duration-200 hover:border-amber-500/40 hover:bg-amber-500/15"
                  >
                    <Icon size={16} strokeWidth={1.75} />
                  </button>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Services</p>
              <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                {["Plumbing", "Electrical", "Cleaning", "Painting", "Carpentry", "Home Shifting"].map((s) => (
                  <li key={s}>
                    <Link href="/providers" className="text-sm text-slate-400 no-underline transition-colors duration-200 hover:text-white">
                      {s}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Platform */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Platform</p>
              <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                {[["How It Works", "#"], ["Become a Provider", "/register"], ["Safety & Verification", "#"], ["About Us", "#"]].map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-slate-400 no-underline transition-colors duration-200 hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Support</p>
              <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                {[["Help Center", "#"], ["Contact Us", "#"], ["Privacy Policy", "#"], ["Terms of Service", "#"]].map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-slate-400 no-underline transition-colors duration-200 hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/[0.05] pt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-400">© {new Date().getFullYear()} Kamdar. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs text-slate-400">Early access registration open</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
