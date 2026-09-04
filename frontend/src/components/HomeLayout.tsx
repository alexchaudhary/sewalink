"use client";

import Link from "next/link";
import type { ReactNode, SVGProps } from "react";
import { useEffect, useState } from "react";
import { Search, Menu, X } from "lucide-react";

const TOKEN_KEY = "kamdarnepal_token";

type CustomIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

const TwitterIcon = ({ size = 15, ...props }: CustomIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = ({ size = 15, ...props }: CustomIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle
      cx="17.5"
      cy="6.5"
      r="0.5"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

const LinkedinIcon = ({ size = 15, ...props }: CustomIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/providers" },
  { label: "Providers", href: "/providers" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
];

function Logo() {
  return (
    <Link
      href="/"
      className="group flex flex-shrink-0 items-center gap-2.5 no-underline"
      aria-label="Kamdar Nepal home"
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        className="flex-shrink-0"
        aria-hidden="true"
      >
        <rect width="36" height="36" rx="9" fill="url(#lg)" />
        <rect
          x="6"
          y="13"
          width="14"
          height="7"
          rx="3.5"
          stroke="#0a0c14"
          strokeWidth="2.5"
          fill="none"
        />
        <rect
          x="16"
          y="16"
          width="14"
          height="7"
          rx="3.5"
          stroke="#0a0c14"
          strokeWidth="2.5"
          fill="none"
        />
        <rect x="16" y="15" width="4" height="9" fill="url(#lg)" />
        <defs>
          <linearGradient
            id="lg"
            x1="0"
            y1="0"
            x2="36"
            y2="36"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#f59e0b" />
            <stop offset="1" stopColor="#d97706" />
          </linearGradient>
        </defs>
      </svg>

      <span
        className="text-[19px] font-extrabold leading-none tracking-[-0.03em]"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <span className="text-xl font-black tracking-tight">
          Kamdar<span className="text-orange-500">Nepal</span>
        </span>
      </span>
    </Link>
  );
}

export default function HomeLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [authed, setAuthed] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem(TOKEN_KEY);
    setAuthed(Boolean(token));

    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleSignOut = () => {
    window.localStorage.removeItem(TOKEN_KEY);
    setAuthed(false);
    setOpen(false);
    window.location.href = "/";
  };

  return (
    <div
      className="min-h-screen bg-[#060810] text-white"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/[0.08] bg-[#060810]/85 backdrop-blur-xl"
            : "border-b border-white/[0.04] bg-[#060810]/35 backdrop-blur-xl"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-lg px-4 py-2 text-sm text-white/55 no-underline transition-all duration-200 hover:bg-white/[0.05] hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              aria-label="Search"
              className="rounded-lg p-2 text-white/40 transition-all duration-200 hover:bg-white/[0.05] hover:text-white"
            >
              <Search size={16} aria-hidden="true" />
            </button>

            {authed ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="btn-ghost px-4 py-2 text-sm font-semibold"
              >
                Sign out
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-2 text-sm font-medium text-white/70 no-underline transition-colors duration-200 hover:text-white"
                >
                  Sign In
                </Link>

                <Link
                  href="/register"
                  className="btn-amber inline-flex items-center px-4 py-2 text-sm no-underline"
                  style={{
                    boxShadow: "0 2px 14px rgba(245,158,11,0.25)",
                  }}
                >
                  Create Account
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="rounded-lg p-2 text-white/60 transition-all duration-200 hover:bg-white/[0.05] hover:text-white lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>
        </div>

        {open && (
          <div className="flex flex-col gap-1 border-t border-white/[0.06] bg-[#060810]/97 px-6 pb-5 pt-3 backdrop-blur-xl lg:hidden">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-white/55 no-underline transition-all duration-200 hover:bg-white/[0.05] hover:text-white"
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-3 flex gap-2 border-t border-white/[0.06] pt-3">
              {authed ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex-1 rounded-xl border border-white/[0.08] py-2.5 text-sm font-medium text-white/70 transition-all duration-200 hover:border-white/20 hover:text-white"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-xl border border-white/[0.08] py-2.5 text-center text-sm font-medium text-white/70 no-underline transition-all duration-200 hover:border-white/20 hover:text-white"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="btn-amber flex-1 rounded-xl py-2.5 text-center text-sm no-underline"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="border-t border-white/[0.06] bg-[#040610] py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Logo />

              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/35">
                Kamdar Nepal is a home services marketplace connecting
                homeowners with verified local professionals. Currently in
                active development.
              </p>

              <div className="mt-5 flex gap-2">
                {[
                  { Icon: TwitterIcon, label: "Twitter" },
                  { Icon: InstagramIcon, label: "Instagram" },
                  { Icon: LinkedinIcon, label: "LinkedIn" },
                ].map(({ Icon, label }) => (
                  <button
                    key={label}
                    type="button"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/35 transition-all duration-200 hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-white"
                  >
                    <Icon size={15} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
                Services
              </p>

              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                {[
                  "Plumbing",
                  "Electrical",
                  "Cleaning",
                  "Painting",
                  "Carpentry",
                  "Home Shifting",
                ].map((service) => (
                  <li key={service}>
                    <Link
                      href="/providers"
                      className="text-sm text-white/35 no-underline transition-colors duration-200 hover:text-white/70"
                    >
                      {service}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
                Platform
              </p>

              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                {[
                  ["How It Works", "#"],
                  ["Become a Provider", "/register"],
                  ["Pricing", "#"],
                  ["About Us", "#"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-white/35 no-underline transition-colors duration-200 hover:text-white/70"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
                Support
              </p>

              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                {[
                  ["Help Center", "#"],
                  ["Contact Us", "#"],
                  ["Privacy Policy", "#"],
                  ["Terms of Service", "#"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-white/35 no-underline transition-colors duration-200 hover:text-white/70"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.05] pt-6">
            <p className="text-xs text-white/20">
              © {new Date().getFullYear()} Kamdar Nepal. All rights reserved.
            </p>

            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
              <span className="text-xs text-white/20">
                Platform in active development
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}