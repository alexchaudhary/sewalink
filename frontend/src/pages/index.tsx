import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import HomeLayout from "@/components/HomeLayout";
import {
  Wrench,
  Zap,
  HardHat,
  Paintbrush,
  Hammer,
  Tv,
  Flame,
  Grid,
  MapPin,
  Search,
  Star,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Globe,
  ArrowRight,
  Shield,
  Calendar,
  Lock,
  DollarSign,
  MessageSquare,
  Sparkles,
  UserCheck,
} from "lucide-react";

const LOCATIONS = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan", "Butwal"];

const CATEGORIES = [
  { icon: Wrench, label: "Plumbing", desc: "Pipes, leaks & fixtures repair", startingPrice: "Rs. 500" },
  { icon: Zap, label: "Electrical", desc: "Wiring, fuses & installations", startingPrice: "Rs. 600" },
  { icon: HardHat, label: "Construction", desc: "Site workers & masons", startingPrice: "Rs. 1,000/day" },
  { icon: Paintbrush, label: "Painting", desc: "Interior & exterior painting", startingPrice: "Rs. 800" },
  { icon: Hammer, label: "Carpentry", desc: "Furniture repair & woodwork", startingPrice: "Rs. 700" },
  { icon: Tv, label: "Appliance Repair", desc: "AC, fridge & washing machines", startingPrice: "Rs. 500" },
  { icon: Flame, label: "Welding Work", desc: "Iron gates, grills & frames", startingPrice: "Rs. 900" },
  { icon: Grid, label: "Tiles & Marble", desc: "Flooring, masonry & tiling", startingPrice: "Rs. 1,200/day" },
];

const STATS = [
  { value: "500+", label: "Verified Kamdars", icon: ShieldCheck },
  { value: "1,200+", label: "Jobs Completed", icon: CheckCircle2 },
  { value: "4.8 / 5", label: "Average Rating", icon: Star },
  { value: "< 45 mins", label: "Avg. Response Time", icon: Clock },
];

const TESTIMONIALS = [
  {
    name: "Ramesh Shrestha",
    role: "Homeowner, Jhamsikhel",
    comment: "Found an emergency plumber within 30 minutes for a pipe burst. Transparent pricing and zero bargaining hassle.",
    rating: 5,
    service: "Plumbing Service",
  },
  {
    name: "Sujata Thapa",
    role: "Restaurant Manager, Thamel",
    comment: "Hired regular electrical maintenance workers for our site. Verified IDs gave us complete peace of mind.",
    rating: 5,
    service: "Electrical Work",
  },
  {
    name: "Bikash Adhikari",
    role: "Site Contractor, Baneshwor",
    comment: "Sourcing daily construction workers used to take hours. Now I can dispatch a team straight to site.",
    rating: 5,
    service: "Construction Labor",
  },
];

const FEATURES = [
  { icon: Shield, title: "Verified Providers", desc: "Every professional undergoes strict identity and background checks before joining." },
  { icon: Calendar, title: "Instant & Scheduled Booking", desc: "Browse real-time availability, select your time slot, and lock in your request." },
  { icon: Lock, title: "Secure Platform", desc: "Your personal details and transactions are protected with end-to-end encryption." },
  { icon: DollarSign, title: "Transparent Pricing", desc: "Upfront pricing guidelines without hidden fees or unexpected surge charges." },
  { icon: MessageSquare, title: "Dedicated Local Support", desc: "Our Kathmandu-based customer support team is available to assist you at every step." },
  { icon: Sparkles, title: "Seamless Experience", desc: "A fast, clean web interface optimized for modern mobile and desktop browsers." },
];

const STEPS = [
  { num: "01", icon: Search, title: "Search Services", desc: "Filter trade professionals by city, specialty, and emergency requirements." },
  { num: "02", icon: UserCheck, title: "Select a Verified Kamdar", desc: "Review transparent ratings, hourly/daily pricing rates, and verified badges." },
  { num: "03", icon: CheckCircle2, title: "Confirm & Relax", desc: "Track booking status and pay easily via eSewa, Khalti, Fonepay, or Cash." },
];

interface SectionHeadingProps {
  label: string;
  title: string;
  highlight?: string;
  sub: string;
}

function SectionLabel({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-4">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      {text}
    </span>
  );
}

function SectionHeading({ label, title, highlight, sub }: SectionHeadingProps) {
  return (
    <div className="text-center mb-16 px-4">
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
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Kathmandu");
  const [selectedService, setSelectedService] = useState("Plumbing");
  const [bookingType, setBookingType] = useState<"urgent" | "schedule">("urgent");

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/providers?search=${encodeURIComponent(query)}&location=${encodeURIComponent(selectedLocation)}`);
  };

  return (
    <HomeLayout>
      <Head>
        <title>Kamdar Nepal — On-Demand Home & Site Services</title>
        <meta name="description" content="Kamdar Nepal connects homeowners and businesses with verified local workers and trade professionals." />
      </Head>

      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-28 pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[140px]" />
          <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-orange-600/10 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* HERO LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                🚀 On-Demand Worker Marketplace
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6 text-white">
                Find trusted local{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">
                  Kamdars
                </span>{" "}
                for home & site services.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-lg mb-8 leading-relaxed">
                Kamdar Nepal connects homes and construction sites with verified local professionals. Book plumbers, electricians, painters, and laborers in minutes.
              </p>

              {/* SEARCH BAR */}
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row bg-slate-900/90 border border-slate-800 rounded-2xl p-2 mb-8 max-w-xl shadow-2xl backdrop-blur-md gap-2">
                <div className="flex items-center px-3 py-2 sm:py-0 sm:border-r border-slate-800 gap-2 shrink-0">
                  <MapPin size={18} className="text-amber-500" />
                  <select
                    value={selectedLocation}
                    aria-label="Select location"
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="bg-transparent text-sm text-white font-medium focus:outline-none cursor-pointer pr-2 [&>option]:bg-slate-900 [&>option]:text-white"
                  >
                    {LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 flex items-center px-3 py-2 sm:py-0 gap-2">
                  <Search size={18} className="text-slate-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search plumber, electrician, painter..."
                    className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-slate-500"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-xs font-bold text-slate-950 hover:brightness-110 transition-all shrink-0 shadow-lg shadow-amber-500/10"
                >
                  Search
                </button>
              </form>

              {/* ACTION CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  href="/providers"
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-base font-semibold text-slate-950 hover:brightness-110 transition-all shadow-lg shadow-amber-500/20"
                >
                  Find Services
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-white/[0.03] px-8 py-4 text-base font-semibold text-slate-200 backdrop-blur-sm hover:border-amber-500/50 hover:text-amber-400 transition-all duration-200"
                >
                  Become a Kamdar
                </Link>
              </div>

              {/* BADGES */}
              <div className="flex flex-wrap gap-2.5">
                {["✓ Verified Kamdars", "✓ Cash or eSewa/Khalti", "✓ Fixed & Package Rates", "✓ Urgent 1-Hr Service"].map((b) => (
                  <span key={b} className="rounded-full border border-slate-800 bg-white/[0.03] px-3 py-1 text-xs font-medium text-slate-300">
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* HERO RIGHT MOCK CARD */}
            <div className="relative flex items-center justify-center">
              <div className="relative border border-slate-800/80 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between mb-6 border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2 rounded-xl flex items-center">
                      <Wrench size={18} className="text-slate-950" strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-black text-white">
                      Kamdar<span className="text-orange-500">Nepal</span>
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                    Quick Booking
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {["Plumbing", "Electrical", "Construction", "Painting", "Carpentry", "Welding"].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setSelectedService(chip)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 ${
                        selectedService === chip
                          ? "border-orange-500 text-orange-400 bg-orange-500/10"
                          : "border-slate-800 bg-slate-950/80 text-slate-400 hover:border-amber-500/50"
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                <div className="p-1 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-2 gap-2 mb-5">
                  <button
                    type="button"
                    onClick={() => setBookingType("urgent")}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      bookingType === "urgent" ? "bg-orange-600 text-white shadow-md" : "text-slate-400"
                    }`}
                  >
                    🚨 Urgent (1 Hr)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingType("schedule")}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      bookingType === "schedule" ? "bg-orange-600 text-white shadow-md" : "text-slate-400"
                    }`}
                  >
                    📅 Schedule Later
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => router.push(`/providers?category=${encodeURIComponent(selectedService)}&location=${encodeURIComponent(selectedLocation)}`)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-bold text-xs transition-all mb-5 shadow-lg shadow-amber-500/10"
                >
                  Find {selectedService} in {selectedLocation} →
                </button>

                <div className="space-y-3">
                  {[
                    { icon: Wrench, title: `${selectedService} Professional`, sub: `Verified · ${selectedLocation}`, price: "Rs. 600/hr", badge: "Available" },
                    { icon: HardHat, title: "Construction Labor", sub: `Verified · ${selectedLocation}`, price: "Rs. 1,000/day", badge: "Available" },
                  ].map((n, i) => {
                    const CardIcon = n.icon;
                    return (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <CardIcon size={16} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white">{n.title}</p>
                            <p className="text-[10px] text-slate-400">{n.sub}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="block text-xs font-bold text-amber-400">{n.price}</span>
                          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block mt-0.5">
                            {n.badge}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section className="py-12 border-y border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h4 className="text-xl sm:text-2xl font-black text-white">{s.value}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 relative bg-slate-950">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            label="Explore Work"
            title="Popular Service"
            highlight="Categories"
            sub="Find skilled technicians and laborers tailored for residential and commercial site requirements."
          />

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {CATEGORIES.map((c, i) => {
              const CatIcon = c.icon;
              return (
                <Link
                  key={i}
                  href={`/providers?category=${encodeURIComponent(c.label)}`}
                  className="group p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400 mb-4 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300">
                      <CatIcon size={22} />
                    </div>
                    <h3 className="text-base font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">{c.label}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{c.desc}</p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Starting from</span>
                    <span className="text-xs font-bold text-amber-400">{c.startingPrice}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section id="workflow" className="py-20 border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            label="Workflow"
            title="How Kamdar Nepal"
            highlight="Works"
            sub="Get your repairs, maintenance, or construction site work handled in three simple steps."
          />

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s) => {
              const StepIcon = s.icon;
              return (
                <div key={s.num} className="relative p-8 rounded-2xl border border-slate-800 bg-slate-900/30">
                  <span className="text-4xl font-black text-slate-800 absolute top-6 right-6">{s.num}</span>
                  <div className="p-3 w-fit rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-6">
                    <StepIcon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 border-t border-slate-800 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            label="Reviews"
            title="Trusted by Homeowners &"
            highlight="Businesses"
            sub="Read real feedback from people who found reliable professionals through Kamdar Nepal."
          />

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="p-8 rounded-2xl border border-slate-800 bg-slate-900/50 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} size={16} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 italic mb-6 leading-relaxed">"{t.comment}"</p>
                </div>
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                    {t.service}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-20 border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            label="Why Us"
            title="Built for Reliability &"
            highlight="Transparency"
            sub="A modern platform for hiring manual labor and home repair professionals in Nepal."
          />

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => {
              const FeatIcon = f.icon;
              return (
                <div key={i} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/30">
                  <div className="p-3 w-fit rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4">
                    <FeatIcon size={22} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="py-16 px-6 sm:px-12 rounded-3xl border border-amber-500/20 bg-gradient-to-b from-amber-500/10 via-slate-900/60 to-slate-950">
            <SectionLabel text="Get Started" />
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
              Ready to hire verified local professionals?
            </h2>
            <p className="text-slate-300 max-w-lg mx-auto text-sm sm:text-base mb-8">
              Connect directly with qualified tradespeople across your city with transparent pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/providers"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-sm font-semibold text-slate-950 shadow-lg hover:brightness-110 transition-all"
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