import Link from "next/link";
import { Wrench } from "lucide-react";

type BrandLogoProps = {
  showSubtitle?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizeStyles = {
  sm: {
    badge: "h-8 w-8",
    icon: 16,
    wordmark: "text-lg",
    subtitle: "text-[8px]",
    gap: "gap-2",
  },
  md: {
    badge: "h-10 w-10",
    icon: 18,
    wordmark: "text-xl",
    subtitle: "text-[9px]",
    gap: "gap-2.5",
  },
  lg: {
    badge: "h-12 w-12",
    icon: 22,
    wordmark: "text-2xl",
    subtitle: "text-[10px]",
    gap: "gap-3",
  },
} as const;

export default function BrandLogo({
  showSubtitle = false,
  size = "md",
}: BrandLogoProps) {
  const styles = sizeStyles[size];

  return (
    <Link
      href="/"
      aria-label="Kamdar Nepal home"
      className={`inline-flex shrink-0 items-center ${styles.gap}`}
    >
      <span
        className={`flex ${styles.badge} shrink-0 items-center justify-center rounded-full bg-blue-600 text-white`}
      >
        <Wrench size={styles.icon} strokeWidth={2.5} aria-hidden="true" />
      </span>
      <span className="flex flex-col">
        <span className={`${styles.wordmark} font-black leading-none tracking-tight`}>
          <span className="text-white">Kamdar</span>
          <span className="text-orange-500">Nepal</span>
        </span>
        {showSubtitle && (
          <span
            className={`mt-1 font-bold uppercase tracking-[0.16em] text-white/45 ${styles.subtitle}`}
          >
            HOME SERVICES MARKETPLACE
          </span>
        )}
      </span>
    </Link>
  );
}
