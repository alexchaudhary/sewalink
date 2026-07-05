import Link from "next/link";
import MainLayout from "../components/MainLayout";

export default function AdminDashboard() {
  return (
    <MainLayout title="SewaLink Admin dashboard">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="relative overflow-hidden rounded-3xl bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(248,113,113,0.16),transparent_30%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-6">
              <span className="inline-flex rounded-full bg-orange-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-orange-300">
                SewaLink Admin
              </span>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Monitor bookings, providers, and revenue in one place
              </h1>
              <p className="max-w-xl text-slate-400">
                Manage the marketplace with the same premium visual style as the customer pages, using clean cards, crisp metrics, and fast admin insights.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Verified providers', 'Live bookings', 'Revenue growth', 'Local support'].map((label) => (
                  <span key={label} className="rounded-full border border-slate-800 bg-slate-950/70 px-4 py-2 text-sm text-slate-200 shadow-sm shadow-slate-950/10">
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/75 p-6 text-slate-200 shadow-xl shadow-slate-950/20">
              <div className="text-sm uppercase tracking-[0.3em] text-cyan-300">Admin overview</div>
              <h2 className="mt-4 text-3xl font-semibold text-white">Fast decisions with clear metrics</h2>
              <p className="mt-4 text-slate-400">Approve providers, monitor activity, and keep the platform running smoothly with visible admin controls.</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-4">
          {[
            { label: 'Total users', value: '0' },
            { label: 'Total providers', value: '0' },
            { label: 'Total bookings', value: '0' },
            { label: 'Revenue', value: 'Rs 0' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-3xl bg-slate-900/90 p-6 shadow-xl shadow-slate-950/40">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">{stat.label}</p>
              <p className="mt-4 text-4xl font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Recent activity</h2>
              <p className="mt-2 text-slate-400">Latest provider approvals, booking updates, and platform notifications.</p>
            </div>
            <Link
              href="/admin-dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm text-cyan-300 transition hover:border-cyan-400"
            >
              View all activity
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-3xl bg-slate-950/80 p-5 text-slate-200">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Provider verification</p>
              <p className="mt-3 text-white">3 pending reviews</p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 p-5 text-slate-200">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Booking updates</p>
              <p className="mt-3 text-white">0 new requests</p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 p-5 text-slate-200">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Platform health</p>
              <p className="mt-3 text-white">All systems nominal</p>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
