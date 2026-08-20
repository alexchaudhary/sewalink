import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import HomeLayout from "@/components/HomeLayout";

// ── Data ──────────────────────────────────────────────────────────────────────

const categories = [
  { icon: "🔧", label: "Plumbing",        desc: "Pipes, leaks & fixtures"   },
  { icon: "⚡", label: "Electrical",      desc: "Wiring & installations"    },
  { icon: "🧹", label: "Cleaning",        desc: "Home & office cleaning"    },
  { icon: "🎨", label: "Painting",        desc: "Interior & exterior"       },
  { icon: "🪚", label: "Carpentry",       desc: "Furniture & woodwork"      },
  { icon: "🔩", label: "Appliance Repair",desc: "AC, fridge & more"         },
  { icon: "🚛", label: "Home Shifting",   desc: "Packing & moving"          },
  { icon: "➕", label: "More Services",   desc: "Coming soon"               },
];

const features = [
  { icon: "🛡️", title: "Verified Providers",    desc: "Every professional goes through identity and background verification before joining the platform." },
  { icon: "📅", title: "Easy Booking",           desc: "Browse availability, pick a time slot, and confirm your booking in a few taps." },
  { icon: "🔒", title: "Secure Platform",        desc: "Your data and payments are protected with industry-standard encryption." },
  { icon: "💰", title: "Transparent Pricing",    desc: "See clear pricing upfront. No hidden fees, no surprises at checkout." },
  { icon: "💬", title: "Fast Support",           desc: "Our team is here to help you every step of the way during our early launch phase." },
  { icon: "✨", title: "Modern Experience",      desc: "A clean, fast interface designed to make hiring local professionals effortless." },
];

const steps = [
  { num: "01", icon: "🔍", title: "Search Services",       desc: "Browse service categories and find exactly what you need for your home." },
  { num: "02", icon: "👤", title: "Choose a Provider",     desc: "Review verified provider profiles, skills, and availability." },
  { num: "03", icon: "✅", title: "Book Your Service",     desc: "Confirm your booking, get a notification, and relax while it's handled." },
];

const serviceCards = [
  { icon: "🔧", title: "Plumbing Services",    tags: ["Pipe Repair", "Leak Fix", "Installation"],   color: "from-blue-500/20 to-blue-600/5"   },
  { icon: "⚡", title: "Electrical Work",      tags: ["Wiring", "Switchboard", "Lighting"],         color: "from-yellow-500/20 to-yellow-600/5"},
  { icon: "🧹", title: "Deep Cleaning",        tags: ["Home", "Office", "Post-Construction"],       color: "from-green-500/20 to-green-600/5"  },
  { icon: "🎨", title: "Painting & Finishing", tags: ["Interior", "Exterior", "Waterproofing"],     color: "from-pink-500/20 to-pink-600/5"    },
  { icon: "🪚", title: "Carpentry",            tags: ["Furniture", "Doors", "Custom Woodwork"],     color: "from-orange-500/20 to-orange-600/5"},
  { icon: "🔩", title: "Appliance Repair",     tags: ["AC", "Refrigerator", "Washing Machine"],    color: "from-purple-500/20 to-purple-600/5"},
];

// ── Shared sub-components ─────────────────────────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-4">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      {text}
    </span>
  );
}

function SectionHeading({ label, title, highlight, sub }: { label: string; title: string; highlight?: string; sub: string }) {
  return (
    <div className="text-center mb-16">
      <SectionLabel text={label} />
      <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
        {title}{" "}
        {highlight && (
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
            {highlight}
          </span>
        )}
      </h2>
      <p className="mt-4 text-slate-400 max-w-xl mx-auto text-base leading-relaxed">{sub}</p>
      <div className="mt-5 mx-auto h-px w-16 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const [query, setQuery] = useState("");

  return (
    <HomeLayout>
      <Head>
        <title>SewaLink — Home Services Marketplace Nepal</title>
        <meta name="description" content="SewaLink connects homeowners with verified local professionals. Launching soon in Nepal." />
      </Head>

      {/* ════════════════════════════════════════════════════════════════════
          1. HERO
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">

        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-amber-500/6 blur-[140px]" />
          <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-orange-600/5 blur-[120px]" />
          <div className="dot-grid absolute inset-0 opacity-40" />
        </div>

        <div className="mx-auto max-w-7xl px-6 w-full py-20 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT */}
            <div>
              {/* Dev badge */}
              <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-8">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                🚀 Platform Under Active Development
              </div>

              {/* Headline */}
              <h1 className="animate-fade-in-up delay-100 text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white">
                Find trusted local{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 animate-shimmer">
                  professionals
                </span>{" "}
                for every home service.
              </h1>

              <p className="animate-fade-in-up delay-200 text-lg text-slate-400 max-w-lg mb-10 leading-relaxed">
                SewaLink is building a smarter way to connect homeowners with skilled local professionals. Join early and help shape the future of home services in Nepal.
              </p>

              {/* CTAs */}
              <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/providers"
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl btn-amber px-8 py-4 text-base font-semibold text-white"
                >
                  Find Services
                  <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-white/[0.03] px-8 py-4 text-base font-semibold text-slate-200 backdrop-blur-sm hover:border-amber-500/50 hover:text-amber-400 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Become a Provider
                </Link>
              </div>

              {/* Trust row */}
              <div className="animate-fade-in-up delay-400 flex flex-wrap gap-3">
                {["✓ Verified Providers", "✓ Secure Payments", "✓ Easy Booking", "✓ Free to Join"].map((b) => (
                  <span key={b} className="rounded-full border border-slate-800 bg-white/[0.03] px-3 py-1 text-xs text-slate-400">
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT — glass dashboard mockup */}
            <div className="animate-fade-in-up delay-300 relative hidden lg:flex items-center justify-center">
              {/* Glow */}
              <div className="absolute inset-0 rounded-3xl bg-amber-500/5 blur-[60px]" />

              {/* Main card */}
              <div className="relative glass-card p-8 w-full max-w-md shadow-2xl shadow-black/40">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">SewaLink</p>
                    <h3 className="text-lg font-bold text-white">Book a Service</h3>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-black shadow-lg shadow-amber-500/30">S</span>
                </div>

                {/* Service chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {["Plumbing", "Electrical", "Cleaning", "Painting", "Carpentry", "Mechanic"].map((chip, i) => (
                    <span
                      key={chip}
                      className="animate-float-chip rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-300 hover:border-amber-500/50 hover:text-amber-400 transition-all duration-200 cursor-default"
                      style={{ animationDelay: `${i * 0.4}s` }}
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                {/* Fake search bar */}
                <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 mb-4">
                  <span className="text-slate-500">🔍</span>
                  <span className="text-sm text-slate-500">Search for a service…</span>
                </div>

                {/* Notification cards */}
                <div className="space-y-3">
                  {[
                    { icon: "🔧", title: "Plumber Available",   sub: "Verified · Kathmandu",  badge: "Available" },
                    { icon: "⚡", title: "Electrician Ready",   sub: "Verified · Lalitpur",   badge: "Available" },
                  ].map((n) => (
                    <div key={n.title} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 hover:border-amber-500/30 transition-all duration-200">
                      <span className="text-xl">{n.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{n.title}</p>
                        <p className="text-xs text-slate-500">{n.sub}</p>
                      </div>
                      <span className="rounded-full bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-xs text-green-400 whitespace-nowrap">{n.badge}</span>
                    </div>
                  ))}
                </div>

                {/* CTA inside card */}
                <div className="mt-5 rounded-xl btn-amber px-4 py-3 text-center text-sm font-semibold text-white cursor-default">
                  Launching Soon in Nepal 🇳🇵
                </div>
              </div>

              {/* Floating chips outside card */}
              <div className="absolute -top-4 -right-4 animate-float rounded-2xl border border-amber-500/20 bg-slate-900/90 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-amber-400 shadow-lg">
                Early Access Open ✨
              </div>
              <div className="absolute -bottom-4 -left-4 animate-float delay-300 rounded-2xl border border-slate-700 bg-slate-900/90 backdrop-blur-sm px-4 py-2 text-xs text-slate-300 shadow-lg">
                🛡️ Verified Providers
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-600 animate-float">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <span className="text-lg">↓</span>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          2. SEARCH BAR
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 border-y border-slate-800/60 bg-white/[0.02]">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-amber-400 mb-5">
            What do you need help with?
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Plumber, Electrician, Cleaner…"
                className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 pl-11 pr-4 py-4 text-white placeholder-slate-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200"
              />
            </div>
            <Link
              href={`/providers${query ? `?q=${encodeURIComponent(query)}` : ""}`}
              className="rounded-2xl btn-amber px-8 py-4 font-semibold text-white text-center whitespace-nowrap"
            >
              Search
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {["Plumber", "Electrician", "Cleaner", "Painter", "Carpenter"].map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-xs text-slate-400 hover:border-amber-500/50 hover:text-amber-400 transition-all duration-200"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          3. POPULAR CATEGORIES
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            label="Services"
            title="Popular Service"
            highlight="Categories"
            sub="From home repairs to deep cleaning — browse the services we're building for you."
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href="/providers"
                className="glass-card group flex flex-col items-center gap-3 p-6 text-center hover:-translate-y-1 transition-all duration-300"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
                <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">{cat.label}</span>
                <span className="text-xs text-slate-500 leading-snug">{cat.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          4. WHY CHOOSE SEWALINK
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 border-y border-slate-800/60 bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            label="Why SewaLink"
            title="Built for"
            highlight="Trust & Simplicity"
            sub="We're designing every feature to make hiring local professionals safe, fast, and transparent."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="glass-card group flex gap-5 p-6 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex-shrink-0 h-12 w-12 rounded-2xl border border-amber-500/20 bg-amber-500/10 flex items-center justify-center text-2xl group-hover:bg-amber-500 group-hover:border-amber-500 transition-all duration-300">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          5. HOW IT WORKS
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <SectionHeading
            label="Process"
            title="How SewaLink"
            highlight="Works"
            sub="Three simple steps to get any home service done."
          />
          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Connector */}
            <div className="hidden sm:block absolute top-10 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
            {steps.map((s, i) => (
              <div
                key={s.num}
                className="glass-card group relative flex flex-col items-center text-center p-8 hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {/* Step number */}
                <span className="absolute top-4 right-5 text-5xl font-black text-slate-800 group-hover:text-amber-500/15 transition-colors duration-300 select-none">
                  {s.num}
                </span>
                <div className="mb-5 h-16 w-16 rounded-2xl border border-amber-500/20 bg-amber-500/10 flex items-center justify-center text-3xl group-hover:bg-amber-500 group-hover:border-amber-500 transition-all duration-300">
                  {s.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          6. FEATURED SERVICES
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 border-y border-slate-800/60 bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            label="Services"
            title="What We're"
            highlight="Building For You"
            sub="A growing catalogue of home services — more categories launching soon."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {serviceCards.map((s) => (
              <div
                key={s.title}
                className="glass-card group relative overflow-hidden p-6 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Gradient tint */}
                <div className={`pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="relative">
                  <div className="mb-4 h-14 w-14 rounded-2xl border border-slate-700 bg-slate-900/80 flex items-center justify-center text-3xl group-hover:border-amber-500/40 transition-all duration-300">
                    {s.icon}
                  </div>
                  <h3 className="text-base font-bold text-white mb-3">{s.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {s.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-slate-700 bg-slate-900/60 px-2.5 py-0.5 text-xs text-slate-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Providers joining soon</span>
                    <span className="text-amber-400 text-sm group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/providers"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-white/[0.03] px-8 py-3 text-sm font-semibold text-slate-200 hover:border-amber-500/50 hover:text-amber-400 transition-all duration-200"
            >
              Browse All Services →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          7. EARLY ACCESS CTA
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 md:py-36 relative overflow-hidden">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/6 via-transparent to-orange-600/6" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-amber-500/5 blur-[120px] animate-glow-pulse" />
          <div className="dot-grid absolute inset-0 opacity-30" />
        </div>

        <div className="mx-auto max-w-3xl px-6 text-center">
          <SectionLabel text="Early Access" />

          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Be Among the First to{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
              Experience SewaLink
            </span>
          </h2>

          <p className="text-lg text-slate-400 mb-4 max-w-xl mx-auto leading-relaxed">
            We're actively building the platform and welcoming early users and service providers to join our journey.
          </p>
          <p className="text-sm text-slate-500 mb-10">
            Help us shape the future of home services in Nepal. Your feedback matters.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl btn-amber px-10 py-4 text-base font-semibold text-white"
            >
              Create Account
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-white/[0.03] px-10 py-4 text-base font-semibold text-slate-200 backdrop-blur-sm hover:border-amber-500/50 hover:text-amber-400 hover:-translate-y-0.5 transition-all duration-200"
            >
              Become a Provider
            </Link>
          </div>

          <p className="text-xs text-slate-600">
            Free to join · No credit card required · Early access perks for founding members
          </p>
        </div>
      </section>
    </HomeLayout>
  );
}
