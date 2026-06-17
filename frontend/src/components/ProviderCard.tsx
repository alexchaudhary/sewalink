import Link from "next/link";

export interface ProviderCardProps {
  id: string;
  name: string;
  profession: string;
  rating: number;
  price: number;
  location: string;
}

export default function ProviderCard({ id, name, profession, rating, price, location }: ProviderCardProps) {
  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/40">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">{name}</h2>
          <p className="text-sm text-slate-400">{profession}</p>
        </div>
        <span className="rounded-full bg-cyan-500 px-4 py-1 text-sm text-slate-950">Rs {price}/hr</span>
      </div>
      <div className="mt-6 flex items-center gap-2 text-slate-300">
        <span>⭐ {rating}</span>
        <span className="text-slate-500">|</span>
        <span>{location}</span>
      </div>
      <div className="mt-6 flex gap-3">
        <Link href={`/providers/${id}`} className="rounded-full bg-white/10 px-5 py-2 text-sm text-white transition hover:bg-white/20">
          View profile
        </Link>
        <button className="rounded-full border border-slate-700 px-5 py-2 text-sm text-slate-100 transition hover:border-cyan-400">
          Book now
        </button>
      </div>
    </article>
  );
}
