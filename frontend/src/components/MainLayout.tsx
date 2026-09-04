'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Wrench } from "lucide-react";

export interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // 1. Safe Client-Side State Synchronizer Pipeline
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("kamdarnepal_token");
      const rawUser = window.localStorage.getItem("user");
      
      setIsAuthenticated(Boolean(token));
      
      if (rawUser) {
        try {
          const parsed = JSON.parse(rawUser);
          setUserRole(parsed?.role || null);
        } catch (e) {
          console.error("Failed to parse local layout state mapping:", e);
        }
      }
    }
  }, [pathname]);

  // 2. Safe Logout Flush Session Command
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("kamdarnepal_token");
      window.localStorage.removeItem("user");
      setIsAuthenticated(false);
      setUserRole(null);
      window.location.href = "/login";
    }
  };

  const navLinks = [
    { name: 'Bajar / Marketplace', href: '/providers' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-blue-500/30">
      {/* Universal Luxury Corporate Top Navigation Bar Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Brand Corporate Uniform Logo & Main Nav Items Integration */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="group focus:outline-none select-none">
              <div className="flex items-center gap-2.5">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl flex items-center shadow-lg shadow-blue-500/10 transition-transform duration-300 group-hover:rotate-12">
                  <Wrench size={18} className="text-white" strokeWidth={2.5} />
                </div>
                <span className="text-xl font-black tracking-tight text-white transition-colors duration-200">
                  Kamdar<span className="text-orange-500 transition-colors duration-200 group-hover:text-orange-400">Nepal</span>
                </span>
              </div>
            </Link>

            {/* Dynamic Navbar Navigation Links Controller */}
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs font-black uppercase tracking-widest transition-all duration-300 inline-block drop-shadow-[0_2px_10px_rgba(249,115,22,0.15)] ${
                      isActive 
                        ? 'bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent font-black scale-[1.05]' 
                        : 'text-slate-400/80 hover:text-white font-semibold'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Dynamic Core Authentication CTA Buttons Handler */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  href={userRole === 'PROVIDER' ? '/dashboard/worker' : '/dashboard/customer'}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:bg-blue-500 hover:scale-[1.02] focus:outline-none"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white focus:outline-none"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-xs font-bold text-white/60 hover:text-white uppercase tracking-wider transition-colors px-3 py-2"
                >
                  Sign In
                </Link>

                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:bg-blue-500 hover:scale-[1.02] focus:outline-none"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Framework Mesh Stream */}
      <main className="flex-1 w-full">{children}</main>

      {/* Global Luxury Footer Segment */}
      <footer className="border-t border-white/5 bg-slate-950/40 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-xs tracking-wider font-mono text-white/20 uppercase">
          © {new Date().getFullYear()} Kamdar Nepal Infrastructure Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;