import Link from "next/link";
import { BrandButton } from "./ui/BrandUI";

export interface ProviderCardProps {
  id: string;
  name: string;
  profession: string;
  rating: number;
  price: number;
  location: string;
}

export default function ProviderCard({ id, name, profession, rating, price, location }: ProviderCardProps) {
  const initials = name
    .split(" ")
    .map((segment) => segment[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link href={`/providers/${id}`}>
      <article className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl shadow-slate-950/40 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-500/10">
        <div className="relative h-32 overflow-hidden border-b border-slate-800 bg-linear-to-br from-cyan-500/30 via-slate-900 to-slate-800">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.18),transparent_35%)]" />
          <div className="relative flex h-full items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/30 bg-slate-950/70 text-xl font-semibold text-white shadow-lg shadow-cyan-500/10">
              {initials}
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">{profession}</p>
            <h3 className="mt-2 text-lg font-semibold text-white transition group-hover:text-cyan-300">{name}</h3>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 font-semibold text-amber-300">
              ⭐ {rating.toFixed(1)}
            </span>
            <span className="text-slate-400">📍 {location}</span>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Starting from</p>
            <p className="mt-1 text-lg font-semibold text-cyan-300">Rs {price}/hr</p>
          </div>

          <BrandButton variant="primary" className="mt-5 w-full">
            View profile
          </BrandButton>
        </div>
      </article>
    </Link>
  );
}
