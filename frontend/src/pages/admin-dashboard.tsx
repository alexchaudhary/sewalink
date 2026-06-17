import MainLayout from "../components/MainLayout";

export default function AdminDashboard() {
  return (
    <MainLayout title="Admin dashboard">
      <section className="grid gap-6 lg:grid-cols-4">
        <div className="rounded-3xl bg-slate-900/90 p-6 shadow-xl shadow-slate-950/40">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Total users</p>
          <p className="mt-4 text-4xl font-semibold text-white">0</p>
        </div>
        <div className="rounded-3xl bg-slate-900/90 p-6 shadow-xl shadow-slate-950/40">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Total providers</p>
          <p className="mt-4 text-4xl font-semibold text-white">0</p>
        </div>
        <div className="rounded-3xl bg-slate-900/90 p-6 shadow-xl shadow-slate-950/40">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Total bookings</p>
          <p className="mt-4 text-4xl font-semibold text-white">0</p>
        </div>
        <div className="rounded-3xl bg-slate-900/90 p-6 shadow-xl shadow-slate-950/40">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Revenue</p>
          <p className="mt-4 text-4xl font-semibold text-white">Rs 0</p>
        </div>
      </section>
      <section className="mt-8 rounded-3xl bg-slate-900/90 p-6 shadow-xl shadow-slate-950/40">
        <h2 className="text-xl font-semibold text-white">Recent activity</h2>
        <p className="mt-3 text-slate-400">Admin analytics, provider verifications, and payments monitoring will appear here.</p>
      </section>
    </MainLayout>
  );
}
