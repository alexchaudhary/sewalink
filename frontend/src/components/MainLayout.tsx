import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { BrandBadge, BrandButton, BrandCard } from "./ui/BrandUI";

export default function MainLayout({ children, title = "SewaLink" }: { children: ReactNode; title?: string }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsAuthenticated(Boolean(window.localStorage.getItem("sewalink_token")));
  }, []);

  const isActive = (href: string) => mounted && router.pathname === href;

  const navLinkClass = (href: string) =>
    `rounded-full border px-3 py-2 text-sm font-medium transition ${
      isActive(href)
        ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-300"
        : "border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-900/70 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/95 py-4 shadow-sm shadow-slate-950/30 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-2 text-white shadow-sm shadow-slate-950/20 transition hover:border-cyan-400/40 hover:text-cyan-300">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/15 text-sm font-semibold text-cyan-300">
              S
            </span>
            <span className="text-lg font-semibold tracking-tight">SewaLink</span>
          </Link>

          <nav className="flex flex-wrap items-center gap-2 text-sm">
            <Link href="/providers" className={navLinkClass("/providers")}>
              Providers
            </Link>
            <Link href="/dashboard" className={navLinkClass("/dashboard")}>
              Dashboard
            </Link>
            <Link href="/provider-dashboard" className={navLinkClass("/provider-dashboard")}>
              Provider
            </Link>
            <Link href="/admin-dashboard" className={navLinkClass("/admin-dashboard")}>
              Admin
            </Link>

            {mounted && (
              <>
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      window.localStorage.removeItem("sewalink_token");
                      window.location.href = "/";
                    }}
                    className="ml-2 rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 font-semibold text-white transition hover:border-cyan-400 hover:bg-slate-900"
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="ml-2 rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 font-semibold text-white transition hover:border-cyan-400 hover:bg-slate-900"
                  >
                    Sign In
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <BrandCard className="p-8 shadow-2xl shadow-slate-950/40">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <BrandBadge className="bg-cyan-500/10">SewaLink</BrandBadge>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">{title}</h1>
            </div>
            <div className="rounded-full border border-slate-800 bg-slate-950/70 px-4 py-2 text-sm text-slate-300 shadow-sm shadow-slate-950/10">
              Trusted local service marketplace
            </div>
          </div>
        </BrandCard>

        <div className="mt-8">{children}</div>

        <BrandCard className="mt-10 p-8 shadow-2xl shadow-slate-950/40">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <BrandBadge className="bg-cyan-500/10">SewaLink</BrandBadge>
              <p className="mt-2 text-sm text-slate-400">Premium local services for bookings, support, and trusted provider discovery.</p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-400">
              <span className="rounded-full border border-slate-800 bg-slate-950/70 px-3 py-2">Verified providers</span>
              <span className="rounded-full border border-slate-800 bg-slate-950/70 px-3 py-2">Transparent pricing</span>
              <span className="rounded-full border border-slate-800 bg-slate-950/70 px-3 py-2">Fast local support</span>
            </div>
          </div>
        </BrandCard>
      </main>
    </div>
  );
}
