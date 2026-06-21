"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Clock,
  IndianRupee,
  LayoutDashboard,
  ShieldCheck,
  UserCog,
  Users,
  Wrench,
} from "lucide-react";

const METRICS = [
  { Icon: Users, label: "Total users", value: "0", note: "No public users yet" },
  { Icon: UserCog, label: "Service partners", value: "0", note: "Verification flow pending" },
  { Icon: CalendarClock, label: "Bookings", value: "0", note: "Booking module in development" },
  { Icon: IndianRupee, label: "Revenue", value: "Rs 0", note: "Payments not connected" },
];

const LAUNCH_TASKS = [
  { title: "Connect real admin API", text: "Replace demo values with backend analytics.", done: false },
  { title: "Provider verification", text: "Add approval, rejection, and document review states.", done: false },
  { title: "Booking monitoring", text: "Track pending, accepted, completed, and cancelled jobs.", done: false },
  { title: "Payment reporting", text: "Show revenue only after payments are live.", done: false },
];

function BrandLogo() {
  return (
    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 11, textDecoration: "none" }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        background: "linear-gradient(135deg,#f59e0b,#ea580c)",
        color: "#111827",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 10px 30px rgba(245,158,11,0.28)",
      }}>
        <Wrench size={20} strokeWidth={2.5} />
      </div>
      <div>
        <div style={{ fontSize: 19, fontWeight: 900, lineHeight: 1, color: "#fff" }}>sewalink</div>
        <div style={{ marginTop: 4, fontSize: 11, color: "rgba(255,255,255,0.38)" }}>Admin workspace</div>
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#060810",
      color: "#fff",
      fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
    }}>
      <div style={{ height: 2, background: "linear-gradient(90deg,transparent,#f59e0b,transparent)" }} />

      <header style={{
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(6,8,16,0.92)",
        backdropFilter: "blur(16px)",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}>
        <div className="admin-shell" style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "18px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 18,
        }}>
          <BrandLogo />
          <nav className="admin-nav" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {[
              { href: "/providers", label: "Providers" },
              { href: "/dashboard", label: "Dashboard" },
              { href: "/provider-dashboard", label: "Provider" },
              { href: "/login", label: "Sign in" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  borderRadius: 8,
                  color: "rgba(255,255,255,0.62)",
                  fontSize: 13,
                  fontWeight: 700,
                  padding: "9px 11px",
                  textDecoration: "none",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <section className="admin-shell" style={{ maxWidth: 1180, margin: "0 auto", padding: "44px 28px 60px" }}>
        <div className="admin-hero" style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) auto",
          gap: 24,
          alignItems: "end",
          marginBottom: 26,
        }}>
          <div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: "1px solid rgba(245,158,11,0.24)",
              borderRadius: 999,
              background: "rgba(245,158,11,0.09)",
              color: "#fbbf24",
              fontSize: 11,
              fontWeight: 800,
              padding: "6px 13px",
              textTransform: "uppercase",
            }}>
              <LayoutDashboard size={13} />
              Development admin
            </div>
            <h1 style={{ margin: "18px 0 0", fontSize: 46, lineHeight: 1.05, fontWeight: 900 }}>
              Admin dashboard
            </h1>
            <p style={{ maxWidth: 560, margin: "14px 0 0", color: "rgba(255,255,255,0.56)", fontSize: 15, lineHeight: 1.7 }}>
              Track the platform setup without showing fake growth numbers. These cards are ready for real API data when your backend is connected.
            </p>
          </div>

          <Link href="/dashboard" style={{
            minHeight: 44,
            borderRadius: 10,
            background: "linear-gradient(135deg,#f59e0b,#ea580c)",
            color: "#111827",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "0 16px",
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 900,
          }}>
            Open dashboard <ArrowRight size={15} />
          </Link>
        </div>

        <section className="metric-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 14 }}>
          {METRICS.map(({ Icon, label, value, note }) => (
            <article key={label} style={{
              minHeight: 156,
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 8,
              background: "linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.035))",
              padding: 18,
              boxShadow: "0 18px 42px rgba(0,0,0,0.18)",
            }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "rgba(245,158,11,0.12)",
                border: "1px solid rgba(245,158,11,0.22)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Icon size={17} color="#f59e0b" />
              </div>
              <p style={{ margin: "18px 0 0", color: "rgba(255,255,255,0.46)", fontSize: 11, fontWeight: 800, textTransform: "uppercase" }}>
                {label}
              </p>
              <p style={{ margin: "8px 0 0", color: "#fff", fontSize: 34, fontWeight: 900, lineHeight: 1 }}>{value}</p>
              <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,0.42)", fontSize: 12, lineHeight: 1.45 }}>{note}</p>
            </article>
          ))}
        </section>

        <section className="content-grid" style={{ display: "grid", gridTemplateColumns: "1.25fr 0.75fr", gap: 16, marginTop: 16 }}>
          <article style={{
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 8,
            background: "rgba(255,255,255,0.04)",
            padding: 22,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>Launch checklist</h2>
                <p style={{ margin: "7px 0 0", color: "rgba(255,255,255,0.45)", fontSize: 13 }}>
                  Keep admin work clear while the product is still in development.
                </p>
              </div>
              <BarChart3 size={22} color="#f59e0b" />
            </div>

            <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
              {LAUNCH_TASKS.map((task) => (
                <div key={task.title} style={{
                  display: "grid",
                  gridTemplateColumns: "34px 1fr",
                  gap: 12,
                  alignItems: "start",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8,
                  background: "rgba(6,8,16,0.5)",
                  padding: 14,
                }}>
                  <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: task.done ? "rgba(34,197,94,0.12)" : "rgba(245,158,11,0.1)",
                    border: `1px solid ${task.done ? "rgba(34,197,94,0.24)" : "rgba(245,158,11,0.2)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    {task.done ? <CheckCircle2 size={16} color="#22c55e" /> : <Clock size={16} color="#f59e0b" />}
                  </div>
                  <div>
                    <p style={{ margin: 0, color: "#fff", fontSize: 14, fontWeight: 800 }}>{task.title}</p>
                    <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.43)", fontSize: 13, lineHeight: 1.5 }}>{task.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <aside style={{
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 8,
            background: "rgba(255,255,255,0.04)",
            padding: 22,
          }}>
            <ShieldCheck size={24} color="#f59e0b" />
            <h2 style={{ margin: "16px 0 0", fontSize: 20, fontWeight: 900 }}>Recent activity</h2>
            <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.48)", fontSize: 13, lineHeight: 1.65 }}>
              No live admin activity yet. Once real data is connected, this area can show signups, provider approvals, bookings, and payment events.
            </p>

            <div style={{
              marginTop: 22,
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 18,
              display: "grid",
              gap: 12,
            }}>
              {["API integration pending", "No providers approved", "No payments recorded"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.55)", fontSize: 13 }}>
                  <span style={{ width: 7, height: 7, borderRadius: 999, background: "#f59e0b" }} />
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </section>
      </section>

      <style>{`
        * { box-sizing: border-box; }
        @media (max-width: 980px) {
          .admin-hero,
          .content-grid {
            grid-template-columns: 1fr !important;
          }
          .metric-grid {
            grid-template-columns: repeat(2,minmax(0,1fr)) !important;
          }
          .admin-nav {
            display: none !important;
          }
        }
        @media (max-width: 560px) {
          .admin-shell {
            padding-left: 18px !important;
            padding-right: 18px !important;
          }
          .metric-grid {
            grid-template-columns: 1fr !important;
          }
          h1 {
            font-size: 34px !important;
          }
        }
      `}</style>
    </main>
  );
}
