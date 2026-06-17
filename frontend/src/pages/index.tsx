import Link from "next/link";
import MainLayout from "../components/MainLayout";

export default function Home() {
  return (
    <MainLayout title="Welcome to SewaLink">
      <section className="grid gap-10 lg:grid-cols-[1.4fr,0.8fr]">
        <div className="rounded-3xl bg-slate-900/90 p-10 shadow-2xl shadow-slate-950/40">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Trusted local professionals</p>
          <h1 className="mt-6 text-5xl font-semibold text-white sm:text-6xl">Book skilled professionals instantly.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Search, compare, chat, and hire plumbers, electricians, tutors, and more from your neighborhood.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link className="rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-400" href="/providers">
              Browse providers
            </Link>
            <Link className="rounded-full border border-slate-700 px-6 py-3 text-sm text-slate-100 transition hover:border-cyan-400" href="/login">
              Sign in
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-8 text-slate-200 shadow-xl shadow-slate-950/20">
          <h2 className="text-2xl font-semibold">Features</h2>
          <ul className="mt-8 grid gap-3 text-slate-300">
            <li className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-4">Smart provider recommendations</li>
            <li className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-4">Instant booking & online payment</li>
            <li className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-4">Verified service providers</li>
            <li className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-4">Admin analytics and provider management</li>
          </ul>
        </div>
      </section>
    </MainLayout>
  );
}
