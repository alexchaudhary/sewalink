import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

export default function MainLayout({ children, title = "SewaLink" }: { children: ReactNode; title?: string }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(Boolean(window.localStorage.getItem("sewalink_token")));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/95 py-4 shadow-sm shadow-slate-950/30 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-semibold text-white">
            SewaLink
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
            <Link href="/providers" className="transition hover:text-white">
              Providers
            </Link>
            <Link href="/dashboard" className="transition hover:text-white">
              Dashboard
            </Link>
            <Link href="/provider-dashboard" className="transition hover:text-white">
              Provider
            </Link>
            <Link href="/admin-dashboard" className="transition hover:text-white">
              Admin
            </Link>
            {isAuthenticated ? (
              <button
                onClick={() => {
                  window.localStorage.removeItem("sewalink_token");
                  window.location.href = "/";
                }}
                className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-white transition hover:border-cyan-400"
              >
                Sign out
              </button>
            ) : (
              <Link href="/login" className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-white transition hover:border-cyan-400">
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10"> 
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/40">
          <h1 className="text-3xl font-semibold text-white">{title}</h1>
        </div>
        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}
