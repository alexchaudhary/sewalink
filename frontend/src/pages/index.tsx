import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import HomeLayout from "@/components/HomeLayout";

// ── Data ──────────────────────────────────────────────────────────────────────
const categories = [
  { icon: "🔧", label: "Plumbing", desc: "Pipes, leaks & fixtures" },
  { icon: "⚡", label: "Electrical", desc: "Wiring & installations" },
  { icon: "🧱", label: "Construction", desc: "Site workers & builders" },
  { icon: "🎨", label: "Painting", desc: "Interior & exterior" },
  { icon: "🪚", label: "Carpentry", desc: "Furniture & woodwork" },
  { icon: "🔩", label: "Appliance Repair", desc: "AC, fridge & more" },
  { icon: "⚡", label: "Welding Work", desc: "Iron gates & grills" },
  { icon: "📐", label: "Tiles & Marble", desc: "Masonry & flooring" },
];

const features = [
  { icon: "🛡️", title: "Verified Providers", desc: "Every professional goes through identity and background verification before joining the platform." },
  { icon: "📅", title: "Easy Booking", desc: "Browse availability, pick a time slot, and confirm your booking in a few taps." },
  { icon: "🔒", title: "Secure Platform", desc: "Your data and payments are protected with industry-standard encryption." },
  { icon: "💰", title: "Transparent Pricing", desc: "See clear pricing upfront. No hidden fees, no surprises at checkout." },
  { icon: "💬", title: "Fast Support", desc: "Our team is here to help you every step of the way during our early launch phase." },
  { icon: "✨", title: "Modern Experience", desc: "A clean, fast interface designed to make hiring local professionals effortless." },
];

const steps = [
  { num: "01", icon: "🔍", title: "Search Services", desc: "Browse service categories and find exactly what you need for your home." },
  { num: "02", icon: "👤", title: "Choose a Provider", desc: "Review verified provider profiles, skills, and availability." },
  { num: "03", icon: "✅", title: "Book Your Service", desc: "Confirm your booking, get a notification, and relax while it's handled." },
];

const serviceCards = [
  { icon: "🔧", title: "Plumbing Services", tags: ["Pipe Repair", "Leak Fix", "Installation"], color: "from-blue-500/20 to-blue-600/5" },
  { icon: "⚡", title: "Electrical Work", tags: ["Wiring", "Switchboard", "Lighting"], color: "from-yellow-500/20 to-yellow-600/5" },
  { icon: "🧱", title: "Construction & Labor", tags: ["Site Work", "Brick Laying", "Foundation"], color: "from-amber-500/20 to-amber-600/5" },
  { icon: "🎨", title: "Painting & Finishing", tags: ["Interior", "Exterior", "Waterproofing"], color: "from-pink-500/20 to-pink-600/5" },
  { icon: "🪚", title: "Carpentry", tags: ["Furniture", "Doors", "Custom Woodwork"], color: "from-orange-500/20 to-orange-600/5" },
  { icon: "⚡", title: "Welding & Iron Work", tags: ["Grill", "Gate", "Metal Repair"], color: "from-red-500/20 to-red-600/5" },
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

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedService, setSelectedService] = useState("Plumbing");
  const [bookingType, setBookingType] = useState<"urgent" | "schedule">("urgent");

  return (
    <HomeLayout>
      <Head>
        <title>Kamdar Nepal — Home & Construction Services Marketplace</title>
        <meta name="description" content="Kamdar Nepal connects homeowners and businesses with verified local workers and construction professionals." />
      </Head>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-amber-500/6 blur-[140px]" />
          <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-orange-600/5 blur-[120px]" />
          <div className="dot-grid absolute inset-0 opacity-40" />
        </div>

        <div className="mx-auto max-w-7xl px-6 w-full py-20 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT SIDE */}
            <div>
              <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-8">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                🚀 Platform Under Active Development
              </div>

              <h1 className="animate-fade-in-up delay-100 text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white">
                Find trusted local{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 animate-shimmer">
                  Kamdars
                </span>{" "}
                for home & site services.
              </h1>

              <p className="animate-fade-in-up delay-200 text-lg text-slate-400 max-w-lg mb-10 leading-relaxed">
                Kamdar Nepal is building a smarter way to connect homes and construction sites with skilled local professionals. Join early and shape the future of on-demand work.
              </p>

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
                  Become a Kamdar
                </Link>
              </div>

              <div className="animate-fade-in-up delay-400 flex flex-wrap gap-3">
                {["✓ Verified Kamdars", "✓ Cash or Online", "✓ Fixed & Package Rates", "✓ Urgent 1-Hr Service"].map((b) => (
                  <span key={b} className="rounded-full border border-slate-800 bg-white/[0.03] px-3 py-1 text-xs text-slate-400">
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE — GLASS DASHBOARD MOCKUP */}
            <div className="animate-fade-in-up delay-300 relative hidden lg:flex items-center justify-center">
              <div className="absolute inset-0 rounded-3xl bg-amber-500/5 blur-[60px]" />

              <div className="relative border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl w-full max-w-md shadow-2xl shadow-black/40">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Kamdar Nepal</p>
                    <h3 className="text-lg font-bold text-white">Book a Professional</h3>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-orange-500 text-white font-black shadow-lg shadow-blue-500/30">
                    KN
                  </span>
                </div>

                {/* Service Chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {["Plumbing", "Electrical", "Construction", "Painting", "Carpentry", "Welding"].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setSelectedService(chip)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 ${
                        selectedService === chip
                          ? "border-orange-500 text-orange-400 bg-orange-500/10"
                          : "border-slate-800 bg-slate-950/80 text-slate-400 hover:border-amber-500/50 hover:text-slate-200"
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Urgent vs Scheduled Toggles */}
                <div className="p-1 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-2 gap-2 mb-5">
                  <button
                    type="button"
                    onClick={() => setBookingType("urgent")}
                    className={`py-2.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                      bookingType === "urgent"
                        ? "bg-orange-600 text-white shadow-lg"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    🚨 Urgent (Within 1 hr)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingType("schedule")}
                    className={`py-2.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                      bookingType === "schedule"
                        ? "bg-orange-600 text-white shadow-lg"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    📅 Schedule Later
                  </button>
                </div>

                {/* Live Worker Status */}
                <div className="space-y-3">
                  {[
                    { icon: "🔧", title: "Plumber Near You", sub: "Verified · 2km away", badge: "Ready" },
                    { icon: "🧱", title: "Construction Hand", sub: "Verified · 4km away", badge: "Ready" },
                  ].map((n, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/40">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{n.icon}</span>
                        <div>
                          <p className="text-xs font-semibold text-white">{n.title}</p>
                          <p className="text-[10px] text-slate-500">{n.sub}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        {n.badge}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
                  <p className="text-xs text-amber-400/90 font-medium">Launching Soon in Nepal 🇳🇵</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="py-24 relative bg-slate-950/50 border-t border-slate-800/50">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            label="Explore Work"
            title="Popular Service"
            highlight="Categories"
            sub="Find skilled technicians and laborers tailored for residential and commercial site requirements."
          />

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((c, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-amber-500/40 hover:bg-slate-900/80 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-3xl mb-4 bg-slate-950/60 w-12 h-12 rounded-xl flex items-center justify-center border border-slate-800 group-hover:border-amber-500/30 transition-colors">
                  {c.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">{c.label}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="py-24 relative border-t border-slate-800/50">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            label="Workflow"
            title="How Kamdar Nepal"
            highlight="Works"
            sub="Get your repairs, maintenance, or construction site work handled in three straightforward steps."
          />

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="relative p-8 rounded-2xl border border-slate-800 bg-slate-900/30">
                <span className="text-4xl font-black text-slate-800 absolute top-6 right-6">{s.num}</span>
                <div className="text-3xl mb-6">{s.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED SERVICES SECTION */}
      <section className="py-24 relative bg-slate-950/50 border-t border-slate-800/50">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            label="Services"
            title="Solutions for Home &"
            highlight="Construction Sites"
            sub="Comprehensive trade skills matched to project requirements."
          />

          <div className="grid md:grid-cols-3 gap-6">
            {serviceCards.map((sc, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border border-slate-800 bg-gradient-to-b ${sc.color} hover:border-amber-500/40 transition-all duration-300`}
              >
                <div className="text-3xl mb-4">{sc.icon}</div>
                <h3 className="text-lg font-bold text-white mb-3">{sc.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {sc.tags.map((t) => (
                    <span key={t} className="text-xs bg-slate-900/80 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-md">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURES / WHY CHOOSE US */}
      <section className="py-24 relative border-t border-slate-800/50">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            label="Why Us"
            title="Built for Reliability &"
            highlight="Transparency"
            sub="A standard for hiring manual labor and home repair professionals."
          />

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/20">
                <div className="text-2xl mb-4">{f.icon}</div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. EARLY ACCESS CTA */}
      <section className="py-20 relative border-t border-slate-800/50 overflow-hidden">
        <div className="mx-auto max-w-5xl px-6 text-center relative z-10">
          <div className="p-12 rounded-3xl border border-amber-500/20 bg-gradient-to-b from-amber-500/10 via-slate-900/60 to-slate-950 backdrop-blur-xl">
            <SectionLabel text="Early Access" />
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Ready to hire verified local professionals?
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm sm:text-base mb-8">
              Join Kamdar Nepal during our early access release. Connect directly with tradespeople across your city.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/providers"
                className="inline-flex items-center justify-center gap-2 rounded-2xl btn-amber px-8 py-4 text-sm font-semibold text-white shadow-lg"
              >
                Browse Marketplace
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-8 py-4 text-sm font-semibold text-slate-200 hover:border-amber-500/50 hover:text-amber-400 transition-all"
              >
                Join as a Service Provider
              </Link>
            </div>
          </div>
        </div>
      </section>
    </HomeLayout>
  );
}