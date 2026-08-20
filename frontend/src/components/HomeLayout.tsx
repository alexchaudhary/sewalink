"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Search, Menu, X } from "lucide-react";

const TwitterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
);
const LinkedinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

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
        <span className="text-white">Sewa</span>
        <span style={{ color: "#fbbf24" }}>Link</span>
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
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
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
              <Search size={16} />
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
                  className="btn-amber px-4 py-2 text-sm no-underline inline-flex items-center"
                  style={{ boxShadow: "0 2px 14px rgba(245,158,11,0.25)" }}
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
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-white/[0.06] bg-[#060810]/97 backdrop-blur-xl px-6 pb-5 pt-3 flex flex-col gap-1">
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
              <Link href="/register" onClick={() => setOpen(false)} className="btn-amber flex-1 text-center py-2.5 rounded-xl text-sm no-underline">
                Create Account
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── CONTENT ────────────────────────────────────────────────────── */}
      <main>{children}</main>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="bg-[#040610] border-t border-white/[0.06] py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 mb-14">

            {/* Brand — spans 2 cols */}
            <div className="lg:col-span-2">
              <Logo />
              <p className="mt-4 text-sm text-white/35 max-w-xs leading-relaxed">
                SewaLink is a home services marketplace connecting homeowners with verified local professionals. Currently in active development.
              </p>
              {/* Social icons */}
              <div className="flex gap-2 mt-5">
                {[
                  { Icon: TwitterIcon,   label: "Twitter"   },
                  { Icon: InstagramIcon, label: "Instagram" },
                  { Icon: LinkedinIcon,  label: "LinkedIn"  },
                ].map(({ Icon, label }) => (
                  <button
                    key={label}
                    aria-label={label}
                    className="w-9 h-9 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/35 hover:text-white hover:border-white/[0.16] hover:bg-white/[0.06] transition-all duration-200"
                  >
                    <Icon size={15} />
                  </button>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <p className="text-xs font-semibold text-white/50 tracking-[0.12em] uppercase mb-4">Services</p>
              <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                {["Plumbing", "Electrical", "Cleaning", "Painting", "Carpentry", "Home Shifting"].map((s) => (
                  <li key={s}>
                    <Link href="/providers" className="text-sm text-white/35 no-underline hover:text-white/70 transition-colors duration-200">
                      {s}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Platform */}
            <div>
              <p className="text-xs font-semibold text-white/50 tracking-[0.12em] uppercase mb-4">Platform</p>
              <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                {[["How It Works", "#"], ["Become a Provider", "/register"], ["Pricing", "#"], ["About Us", "#"]].map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-white/35 no-underline hover:text-white/70 transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <p className="text-xs font-semibold text-white/50 tracking-[0.12em] uppercase mb-4">Support</p>
              <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                {[["Help Center", "#"], ["Contact Us", "#"], ["Privacy Policy", "#"], ["Terms of Service", "#"]].map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-white/35 no-underline hover:text-white/70 transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/[0.05] pt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-white/20">© {new Date().getFullYear()} SewaLink. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs text-white/20">Platform in active development</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
