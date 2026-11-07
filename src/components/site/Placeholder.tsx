import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";

/** Texto provisional claramente marcado. */
export function Ph({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "rounded-sm border border-dashed border-placeholder-foreground/40 bg-placeholder px-1.5 py-0.5 text-placeholder-foreground [box-decoration-break:clone]",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Caixa de imaxe provisional con número grande de cartel. */
export function PhImage({
  label,
  number,
  tone = "ink",
  className,
}: {
  label?: string;
  number?: string;
  tone?: "ink" | "red" | "paper";
  className?: string;
}) {
  const t = useT();
  const toneCls =
    tone === "red"
      ? "bg-primary text-primary-foreground"
      : tone === "paper"
        ? "bg-paper text-foreground"
        : "bg-ink text-ink-foreground";
  return (
    <div
      role="img"
      aria-label={label ?? t.ph.photo}
      className={cn("grain relative flex overflow-hidden", toneCls, className)}
    >
      <div className="bg-stage absolute inset-0 opacity-70" />
      {number && (
        <span className="text-outline absolute -bottom-6 -right-2 font-display text-[9rem] leading-none opacity-40 md:text-[11rem]">
          {number}
        </span>
      )}
      <div className="relative m-auto flex flex-col items-center gap-2 px-4 text-center">
        <ImageIcon className="size-6 opacity-60" aria-hidden />
        <span className="kicker opacity-80">{label ?? t.ph.photo}</span>
      </div>
    </div>
  );
}

/** Texto editable desde o panel: se está baleiro móstrase o marcador provisional. */
export function Txt({ value, fallback, className }: { value: string | undefined; fallback: string; className?: string }) {
  if (value && value.trim()) return <span className={cn("whitespace-pre-line", className)}>{value}</span>;
  return <Ph className={className}>{fallback}</Ph>;
}

/** Foto real se existe; se non, caixa provisional. */
export function Photo({
  src,
  alt,
  number,
  tone,
  className,
}: {
  src?: string | undefined;
  alt: string;
  number?: string;
  tone?: "ink" | "red" | "paper";
  className?: string;
}) {
  if (src) {
    return <img src={src} alt={alt} loading="lazy" className={cn("object-cover", className)} />;
  }
  return <PhImage {...(number ? { number } : {})} {...(tone ? { tone } : {})} {...(className ? { className } : {})} />;
}

export function ProvisionalBadge({ className }: { className?: string }) {
  const t = useT();
  return (
    <span
      className={cn(
        "kicker inline-flex items-center rounded-full bg-placeholder px-2.5 py-1 text-[0.62rem] text-placeholder-foreground",
        className,
      )}
    >
      {t.provisional}
    </span>
  );
}
