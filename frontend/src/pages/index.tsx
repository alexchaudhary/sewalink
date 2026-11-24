import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
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
  ShieldCheck,
  Sparkles,
  Truck,
  UserRoundCheck,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import HomeLayout from "@/components/HomeLayout";

// ── Data ──────────────────────────────────────────────────────────────────────

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
];

// ── Shared sub-components ─────────────────────────────────────────────────────

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
  const [city, setCity] = useState("Kathmandu");

  return (
    <HomeLayout>
      <Head>
        <title>Kamdar — Home Services Marketplace Nepal</title>
        <meta name="description" content="Kamdar connects homeowners with verified local home service professionals in Nepal." />
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
                Find trusted local{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 animate-shimmer">
                  professionals
                </span>{" "}
                for every home service.
              </h1>

              <p className="animate-fade-in-up delay-200 mb-10 max-w-lg text-lg leading-relaxed text-slate-400">
                Book trusted local professionals for the repairs, maintenance, and home services you need.
              </p>

              {/* CTAs */}
              <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/providers"
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl btn-amber px-8 py-4 text-base font-semibold text-white"
                >
                  Find Services
                  <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-white/[0.03] px-8 py-4 text-base font-semibold text-slate-200 backdrop-blur-sm hover:border-amber-500/50 hover:text-amber-400 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Become a Provider
                </Link>
              </div>

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
                </div>

                <div className="mb-5">
                  <label htmlFor="service-city" className="mb-2 block text-xs font-medium text-slate-400">
                    Service area
                  </label>
                  <select
                    id="service-city"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
                  >
                    {["Kathmandu", "Lalitpur", "Bhaktapur"].map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>

                {/* Notification cards */}
                <div className="space-y-3">
                  {[
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
            </div>
          </div>
        </div>

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
          <SectionHeading
            label="Services"
            title="Popular Service"
            highlight="Categories"
            sub="Browse trusted home services, with upfront starting prices in NPR."
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={`/services?category=${cat.slug}`}
                className="glass-card group flex min-w-0 flex-col items-center gap-3 p-4 text-center transition-all duration-300 hover:-translate-y-1 sm:p-6"
              >
                <IconBadge icon={cat.icon} className="h-12 w-12 transition-transform duration-200 group-hover:scale-110 sm:h-14 sm:w-14" />
                <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">{cat.label}</span>
                <span className="text-xs leading-snug text-slate-400">{cat.desc}</span>
                <span className="mt-1 text-xs font-semibold text-amber-400">{cat.price}</span>
              </Link>
            ))}
          </div>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
        </div>
      </section>
    </HomeLayout>
  );
}
