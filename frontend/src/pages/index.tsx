import Head from "next/head";
import Link from "next/link";
<<<<<<< HEAD
import { useState } from "react";
import { useRouter } from "next/router";
import HomeLayout from "@/components/HomeLayout";
import BrandLogo from "@/components/BrandLogo";
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
=======
import { useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CalendarCheck,
  Check,
  CircleDollarSign,
  Grid2X2,
  Hammer,
  Headset,
  LockKeyhole,
  MapPin,
  Paintbrush,
  Refrigerator,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  UserRoundCheck,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import HomeLayout from "@/components/HomeLayout";
import { fetcher } from "@/lib/api";

interface ProviderSummary {
  id: string;
  displayName: string;
  headline: string | null;
  city: string | null;
  hourlyRate: number | string | null;
}
>>>>>>> feat/homepage-ui-refactor

const LOCATIONS = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan", "Butwal"];

<<<<<<< HEAD
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
=======
const categories = [
  { icon: Wrench, label: "Plumbing",         slug: "plumbing",         desc: "Pipes, leaks & fixtures", price: "From Rs. 499" },
  { icon: Zap, label: "Electrical",          slug: "electrical",       desc: "Wiring & installations", price: "From Rs. 599" },
  { icon: Sparkles, label: "Cleaning",       slug: "cleaning",         desc: "Home & office cleaning", price: "From Rs. 799" },
  { icon: Paintbrush, label: "Painting",     slug: "painting",         desc: "Interior & exterior", price: "From Rs. 999" },
  { icon: Hammer, label: "Carpentry",        slug: "carpentry",        desc: "Furniture & woodwork", price: "From Rs. 599" },
  { icon: Refrigerator, label: "Appliance Repair", slug: "appliance-repair", desc: "AC, fridge & more", price: "From Rs. 699" },
  { icon: Truck, label: "Home Shifting",     slug: "home-shifting",    desc: "Packing & moving", price: "From Rs. 1,499" },
  { icon: Grid2X2, label: "More Services",   slug: "more-services",    desc: "Explore all services", price: "From Rs. 499" },
];

const features = [
  { icon: ShieldCheck, title: "Verified Providers", desc: "Every professional goes through identity and background verification before joining the platform." },
  { icon: CalendarCheck, title: "Easy Booking", desc: "Browse availability, pick a time slot, and confirm your booking in a few taps." },
  { icon: LockKeyhole, title: "Secure Platform", desc: "Your data and payments are protected with industry-standard encryption." },
  { icon: CircleDollarSign, title: "Transparent Pricing", desc: "See clear pricing upfront. No hidden fees, no surprises at checkout." },
  { icon: Headset, title: "Fast Support", desc: "Our team is here to help you every step of the way." },
  { icon: Sparkles, title: "Modern Experience", desc: "A clean, fast interface designed to make hiring local professionals effortless." },
];

const steps = [
  { num: "01", icon: CalendarClock, title: "Choose Service & Time", desc: "Pick the service you need and a time that works for you." },
  { num: "02", icon: UserRoundCheck, title: "Match with a Verified Pro", desc: "We connect you with a skilled, identity-verified professional." },
  { num: "03", icon: BadgeCheck, title: "Pay Safely After Completion", desc: "Pay securely once your service is complete and you're satisfied." },
>>>>>>> feat/homepage-ui-refactor
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

function IconBadge({ icon: Icon, className = "" }: { icon: LucideIcon; className?: string }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400 ${className}`}>
      <Icon aria-hidden="true" size={24} strokeWidth={1.75} />
    </span>
  );
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

<<<<<<< HEAD
=======
function formatRate(rate: ProviderSummary["hourlyRate"]) {
  if (rate === null || rate === undefined || rate === "") {
    return "Rate on request";
  }

  const numericRate = Number(rate);
  return Number.isFinite(numericRate)
    ? `Rs. ${numericRate.toLocaleString()}/hr`
    : "Rate on request";
}

// ── Page ──────────────────────────────────────────────────────────────────────

>>>>>>> feat/homepage-ui-refactor
export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
<<<<<<< HEAD
  const [selectedLocation, setSelectedLocation] = useState("Kathmandu");
  const [selectedService, setSelectedService] = useState("Plumbing");
  const [bookingType, setBookingType] = useState<"urgent" | "schedule">("urgent");

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/providers?search=${encodeURIComponent(query)}&location=${encodeURIComponent(selectedLocation)}`);
=======
  const [city, setCity] = useState("Kathmandu");
  const [activeFilters, setActiveFilters] = useState({ q: "", city: "Kathmandu" });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [providers, setProviders] = useState<ProviderSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const requestId = useRef(0);

  const searchProviders = async (searchTerm: string, selectedCity: string, categorySlug: string | null) => {
    const currentRequest = ++requestId.current;
    const normalizedQuery = searchTerm.trim();

    setQuery(searchTerm);
    setCity(selectedCity);
    setActiveFilters({ q: normalizedQuery, city: selectedCity });
    setActiveCategory(categorySlug);
    setHasSearched(true);
    setIsLoading(true);
    setError("");

    const params = new URLSearchParams({
      q: normalizedQuery,
      city: selectedCity,
      limit: "8",
    });

    try {
      const response = await fetcher(`/api/providers?${params.toString()}`);
      const matchingProviders: ProviderSummary[] = response?.data?.providers ?? [];
      const matchingTotal: number = response?.data?.pagination?.total ?? matchingProviders.length;

      if (currentRequest !== requestId.current) {
        return;
      }

      setProviders(matchingProviders);
      setTotal(matchingTotal);
    } catch (requestError) {
      if (currentRequest !== requestId.current) {
        return;
      }

      setProviders([]);
      setTotal(0);
      setError(requestError instanceof Error ? requestError.message : "Unable to load providers. Please try again.");
    } finally {
      if (currentRequest === requestId.current) {
        setIsLoading(false);
      }
    }
  };

  const clearFilters = () => {
    void searchProviders("", "", null);
>>>>>>> feat/homepage-ui-refactor
  };

  return (
    <HomeLayout>
      <Head>
<<<<<<< HEAD
        <title>Kamdar Nepal — On-Demand Home & Site Services</title>
        <meta name="description" content="Kamdar Nepal connects homeowners and businesses with verified local workers and trade professionals." />
=======
        <title>Kamdar — Home Services Marketplace Nepal</title>
        <meta name="description" content="Kamdar connects homeowners with verified local home service professionals in Nepal." />
>>>>>>> feat/homepage-ui-refactor
      </Head>

      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-28 pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[140px]" />
          <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-orange-600/10 blur-[120px]" />
        </div>

<<<<<<< HEAD
        <div className="mx-auto max-w-7xl px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* HERO LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                🚀 On-Demand Worker Marketplace
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6 text-white">
=======
        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT */}
            <div>
              {/* Dev badge */}
                <div className="animate-fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400 sm:px-4">
                  <MapPin size={14} strokeWidth={1.75} aria-hidden="true" />
                  Kathmandu Valley Home Services
              </div>

              {/* Headline */}
              <h1 className="animate-fade-in-up delay-100 mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
>>>>>>> feat/homepage-ui-refactor
                Find trusted local{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">
                  Kamdars
                </span>{" "}
                for home & site services.
              </h1>

<<<<<<< HEAD
              <p className="text-base sm:text-lg text-slate-300 max-w-lg mb-8 leading-relaxed">
                Kamdar Nepal connects homes and construction sites with verified local professionals. Book plumbers, electricians, painters, and laborers in minutes.
=======
              <p className="animate-fade-in-up delay-200 mb-10 max-w-lg text-lg leading-relaxed text-slate-400">
                Book trusted local professionals for the repairs, maintenance, and home services you need.
>>>>>>> feat/homepage-ui-refactor
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
<<<<<<< HEAD
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
=======
                  <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1" />
>>>>>>> feat/homepage-ui-refactor
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-white/[0.03] px-8 py-4 text-base font-semibold text-slate-200 backdrop-blur-sm hover:border-amber-500/50 hover:text-amber-400 transition-all duration-200"
                >
                  Become a Kamdar
                </Link>
              </div>

<<<<<<< HEAD
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
                  <BrandLogo size="sm" />
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
=======
            </div>

            {/* RIGHT — glass dashboard mockup */}
            <div className="animate-fade-in-up delay-300 relative hidden items-center justify-center pb-12 lg:flex">
              {/* Glow */}
              <div className="absolute inset-0 rounded-3xl bg-amber-500/5 blur-[60px]" />

              {/* Main card */}
              <div className="relative glass-card p-8 w-full max-w-md shadow-2xl shadow-black/40">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-widest text-slate-400">KAMDAR</p>
                    <h3 className="text-lg font-bold text-white">Book a Service</h3>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-black shadow-lg shadow-amber-500/30">K</span>
>>>>>>> feat/homepage-ui-refactor
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
<<<<<<< HEAD
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
=======
                    { icon: Wrench, title: "Plumber Available", sub: "Verified · Kathmandu", badge: "Available" },
                    { icon: Zap, title: "Electrician Ready", sub: "Verified · Lalitpur", badge: "Available" },
                  ].map((n) => (
                    <div key={n.title} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 hover:border-amber-500/30 transition-all duration-200">
                      <IconBadge icon={n.icon} className="h-10 w-10 rounded-xl" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{n.title}</p>
                        <p className="text-xs text-slate-400">{n.sub}</p>
                      </div>
                      <span className="rounded-full bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-xs text-green-400 whitespace-nowrap">{n.badge}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Floating chips outside card */}
              <div className="absolute right-0 top-0 animate-float inline-flex items-center gap-2 rounded-2xl border border-amber-500/20 bg-slate-900/90 px-3 py-2 text-xs font-semibold text-amber-400 shadow-lg backdrop-blur-sm sm:right-2">
                <IconBadge icon={MapPin} className="h-7 w-7 rounded-lg" />
                Early Access Open
              </div>
              <div className="absolute bottom-0 left-4 animate-float inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-slate-300 shadow-lg backdrop-blur-sm">
                <IconBadge icon={ShieldCheck} className="h-7 w-7 rounded-lg" />
                Verified Providers
              </div>
>>>>>>> feat/homepage-ui-refactor
            </div>

<<<<<<< HEAD
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
=======
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 animate-float flex-col items-center gap-1 text-slate-400">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ArrowDown size={18} strokeWidth={1.75} aria-hidden="true" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          2. TRUST & PAYMENT STRIP
      ════════════════════════════════════════════════════════════════════ */}
      <section className="overflow-hidden border-y border-slate-800/60 bg-white/[0.02] py-5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-3 px-4 text-center text-xs font-medium text-slate-300 sm:gap-x-8 sm:px-6 sm:text-sm">
          {[
            "NID & Skill Verified Pros",
            "Upfront NPR Pricing",
            "30-Day Service Warranty",
            "Pay via eSewa, Khalti, or Cash",
          ].map((item) => (
            <span key={item} className="inline-flex items-center gap-2">
              <IconBadge icon={Check} className="h-6 w-6 rounded-full" />
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          3. SERVICE CATEGORIES
      ════════════════════════════════════════════════════════════════════ */}
      <section className="overflow-hidden py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
>>>>>>> feat/homepage-ui-refactor
          <SectionHeading
            label="Explore Work"
            title="Popular Service"
            highlight="Categories"
<<<<<<< HEAD
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
=======
            sub="Browse trusted home services, with upfront starting prices in NPR."
          />
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void searchProviders(query, city, null);
            }}
            className="mx-auto mb-10 flex max-w-4xl flex-col gap-3 sm:flex-row"
          >
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Search services or providers</span>
              <Search size={18} strokeWidth={1.75} aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search a service or provider..."
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
              />
            </label>
            <label>
              <span className="sr-only">Filter by city</span>
              <select
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-500 sm:w-44"
              >
                <option value="">All cities</option>
                {["Kathmandu", "Lalitpur", "Bhaktapur"].map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl btn-amber px-6 py-3 text-sm font-semibold text-slate-950 disabled:cursor-wait disabled:opacity-70"
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </form>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.label}
                aria-pressed={activeCategory === cat.slug}
                onClick={() => void searchProviders(cat.label, city, cat.slug)}
                className={`glass-card group flex min-w-0 flex-col items-center gap-3 p-4 text-center transition-all duration-300 hover:-translate-y-1 sm:p-6 ${
                  activeCategory === cat.slug ? "border-amber-500/50" : ""
                }`}
              >
                <IconBadge icon={cat.icon} className="h-12 w-12 transition-transform duration-200 group-hover:scale-110 sm:h-14 sm:w-14" />
                <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">{cat.label}</span>
                <span className="text-xs leading-snug text-slate-400">{cat.desc}</span>
                <span className="mt-1 text-xs font-semibold text-amber-400">{cat.price}</span>
              </button>
            ))}
          </div>
          {hasSearched && (
            <section aria-label="Provider search results" aria-live="polite" className="mt-12">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-white">Available Providers</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {activeCategory
                      ? categories.find((category) => category.slug === activeCategory)?.label
                      : activeFilters.q || "All services"}
                    {" · "}
                    {activeFilters.city || "All cities"}
                  </p>
                </div>
                {!isLoading && !error && providers.length > 0 && (
                  <p className="text-sm text-slate-400">
                    Showing {providers.length} of {total} providers
                  </p>
                )}
              </div>

              {isLoading ? (
                <div className="rounded-2xl border border-slate-800 bg-white/[0.03] p-8 text-center text-slate-400">
                  Searching providers...
                </div>
              ) : error ? (
                <div role="alert" className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
                  <p className="text-sm text-red-300">Could not load providers: {error}</p>
                  <button
                    type="button"
                    onClick={() => void searchProviders(activeFilters.q, activeFilters.city, activeCategory)}
                    className="mt-4 rounded-lg border border-red-400/30 px-4 py-2 text-sm text-red-200 transition hover:bg-red-400/10"
                  >
                    Try again
                  </button>
                </div>
              ) : providers.length === 0 ? (
                <div className="rounded-2xl border border-slate-800 bg-white/[0.03] p-8 text-center">
                  <p className="text-sm text-slate-300">No providers found for these filters.</p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-4 rounded-lg border border-amber-500/30 px-4 py-2 text-sm font-medium text-amber-300 transition hover:bg-amber-500/10"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {providers.map((provider) => (
                    <article key={provider.id} className="glass-card flex min-w-0 flex-col p-5">
                      <h4 className="truncate text-base font-bold text-white">{provider.displayName}</h4>
                      <p className="mt-1 line-clamp-2 min-h-10 text-sm text-slate-400">
                        {provider.headline || "Verified home service provider"}
                      </p>
                      <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-400">
                        <MapPin size={14} strokeWidth={1.75} aria-hidden="true" />
                        {provider.city || "Location not listed"}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-amber-300">{formatRate(provider.hourlyRate)}</p>
                      <Link
                        href={`/providers/${provider.id}`}
                        className="mt-4 inline-flex justify-center rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-amber-500/50 hover:text-amber-300"
                      >
                        View provider
                      </Link>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          4. HOW IT WORKS
      ════════════════════════════════════════════════════════════════════ */}
      <section className="overflow-hidden border-y border-slate-800/60 bg-white/[0.015] py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionHeading
            label="Simple & Safe"
            title="How Kamdar"
            highlight="Works"
            sub="Three simple steps to get your home service done."
          />
          <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="absolute left-[16.66%] right-[16.66%] top-10 hidden h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent sm:block" />
            {steps.map((step) => (
              <div key={step.num} className="glass-card relative flex flex-col items-center p-8 text-center">
                <IconBadge icon={step.icon} className="mb-5 h-16 w-16" />
                <span className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-400">Step {Number(step.num)}</span>
                <h3 className="mb-2 text-lg font-bold text-white">{step.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          5. WHY KAMDAR
      ════════════════════════════════════════════════════════════════════ */}
      <section className="overflow-hidden py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            label="Why Kamdar"
            title="Built for"
            highlight="Trust & Simplicity"
            sub="We're designing every feature to make hiring local professionals safe, fast, and transparent."
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass-card group flex gap-5 p-6 hover:-translate-y-0.5 transition-all duration-300"
              >
                <IconBadge icon={feature.icon} className="h-12 w-12 transition-all duration-300 group-hover:border-amber-500 group-hover:bg-amber-500 group-hover:text-slate-950" />
                <div>
                  <h3 className="mb-1 font-bold text-white">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{feature.desc}</p>
>>>>>>> feat/homepage-ui-refactor
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

<<<<<<< HEAD
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
=======
      {/* ════════════════════════════════════════════════════════════════════
          6. EARLY ACCESS CTA
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-32 md:pb-20">
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
              Experience Kamdar
            </span>
          </h2>

          <p className="mx-auto mb-4 max-w-xl text-lg leading-relaxed text-slate-400">
            Create an account to find a trusted professional or offer your services to local homeowners.
          </p>
          <p className="mb-10 text-sm text-slate-400">
            Choose the service you need, or join our provider community.
          </p>

          <div className="flex flex-col justify-center gap-4 mb-8 sm:flex-row">
            <Link
              href="/providers"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl btn-amber px-10 py-4 text-base font-semibold text-white"
            >
              Find Services
              <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-white/[0.03] px-10 py-4 text-base font-semibold text-slate-200 backdrop-blur-sm hover:border-amber-500/50 hover:text-amber-400 hover:-translate-y-0.5 transition-all duration-200"
            >
              Become a Provider
            </Link>
          </div>

          <p className="text-xs text-slate-400">
            Free to join · No credit card required · Early access perks for founding members
          </p>
>>>>>>> feat/homepage-ui-refactor
        </div>
      </section>
    </HomeLayout>
  );
}