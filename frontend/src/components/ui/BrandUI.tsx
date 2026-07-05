import { cloneElement, Children, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactElement, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";

interface BrandButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  asChild?: boolean;
}

export function BrandButton({ className = "", variant = "primary", children, asChild = false, ...props }: BrandButtonProps) {
  const variants = {
    primary: "bg-cyan-500 text-slate-950 hover:bg-cyan-400",
    secondary: "border border-slate-700 bg-slate-950/70 text-slate-200 hover:border-cyan-400 hover:bg-slate-900",
    ghost: "border border-slate-700 bg-slate-900/70 text-slate-200 hover:border-cyan-400 hover:bg-slate-900",
  };

  const baseClassName = `inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition ${variants[variant]} ${className}`.trim();

  if (asChild && Children.count(children) === 1 && Children.only(children) && typeof Children.only(children) !== "string") {
    const child = Children.only(children) as ReactElement<{ className?: string }>;
    return cloneElement(child, {
      className: `${baseClassName} ${child.props.className || ""}`.trim(),
    });
  }

  return (
    <button {...props} className={baseClassName}>
      {children}
    </button>
  );
}

interface BrandCardProps {
  children: React.ReactNode;
  className?: string;
}

export function BrandCard({ children, className = "" }: BrandCardProps) {
  return (
    <div className={`rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40 ${className}`.trim()}>
      {children}
    </div>
  );
}

interface BrandBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function BrandBadge({ children, className = "" }: BrandBadgeProps) {
  return (
    <span className={`inline-flex rounded-full bg-cyan-500/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300 ${className}`.trim()}>
      {children}
    </span>
  );
}

interface BrandInputProps extends InputHTMLAttributes<HTMLInputElement> {}
interface BrandSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}
interface BrandTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function BrandInput(props: BrandInputProps) {
  return <input {...props} className={`w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 ${props.className || ""}`.trim()} />;
}

export function BrandSelect(props: BrandSelectProps) {
  return <select {...props} className={`w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 ${props.className || ""}`.trim()} />;
}

export function BrandTextArea(props: BrandTextAreaProps) {
  return <textarea {...props} className={`w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 ${props.className || ""}`.trim()} />;
}
