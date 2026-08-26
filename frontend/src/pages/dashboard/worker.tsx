import MainLayout from "../../components/MainLayout";


export default function ProviderDashboard() {
  return (
    <MainLayout title="Provider dashboard">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-slate-900/90 p-6 shadow-xl shadow-slate-950/40">
          <h2 className="text-xl font-semibold">Booking requests</h2>
          <p className="mt-3 text-slate-400">Review pending work requests and accept or reject bookings in one place.</p>
        </div>
        <div className="rounded-3xl bg-slate-900/90 p-6 shadow-xl shadow-slate-950/40">
          <h2 className="text-xl font-semibold">Earnings</h2>
          <p className="mt-3 text-slate-400">Track earnings, commission, and payout status for your completed jobs.</p>
        </div>
        <div className="rounded-3xl bg-slate-900/90 p-6 shadow-xl shadow-slate-950/40">
          <h2 className="text-xl font-semibold">Availability</h2>
          <p className="mt-3 text-slate-400">Manage when you are available and when customers can book your services.</p>
        </div>
      </div>
      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-slate-900/90 p-6 shadow-xl shadow-slate-950/40">
          <h3 className="text-lg font-semibold text-white">Upcoming bookings</h3>
          <ul className="mt-4 space-y-3 text-slate-300">
            <li className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">Nagaraj - AC repair on 2026-06-29</li>
            <li className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">Ramesh - Home wiring on 2026-07-01</li>
          </ul>
        </div>
        <div className="rounded-3xl bg-slate-900/90 p-6 shadow-xl shadow-slate-950/40">
          <h3 className="text-lg font-semibold text-white">Performance metrics</h3>
          <div className="mt-4 grid gap-3">
            <div className="rounded-3xl bg-slate-950/80 p-4">Rating: 4.9</div>
            <div className="rounded-3xl bg-slate-950/80 p-4">Bookings this month: 18</div>
            <div className="rounded-3xl bg-slate-950/80 p-4">Earnings this month: Rs 76,500</div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
