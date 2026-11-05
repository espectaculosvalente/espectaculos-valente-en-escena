import { cn } from "@/lib/utils";

type Tone = "ink" | "red" | "paper";

export function PageHero({
  kicker,
  title,
  lead,
  tone = "ink",
  image,
  children,
}: {
  kicker: string;
  title: string;
  lead?: string;
  tone?: Tone;
  image?: string;
  children?: React.ReactNode;
}) {
  const toneCls =
    tone === "red"
      ? "bg-primary text-primary-foreground"
      : tone === "paper"
        ? "bg-paper text-foreground"
        : "bg-ink text-ink-foreground";

  return (
    <section className={cn("grain relative overflow-hidden", toneCls)}>
      {image && (
        <>
          <img src={image} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-45" />
          <div className="bg-fade-ink absolute inset-0" />
        </>
      )}
      {!image && tone === "ink" && <div className="bg-stage absolute inset-0" />}
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 md:px-8 md:pb-24 md:pt-28">
        <p className={cn("kicker animate-rise mb-5", tone === "red" ? "text-primary-foreground/80" : tone === "paper" ? "text-primary" : "text-primary")}>
          {kicker}
        </p>
        <h1 className="display-xl animate-rise max-w-5xl [animation-delay:80ms]">{title}</h1>
        {lead && (
          <p className="animate-rise mt-8 max-w-2xl text-lg leading-relaxed opacity-85 [animation-delay:160ms] md:text-xl">
            {lead}
          </p>
        )}
        {children && <div className="animate-rise mt-10 [animation-delay:240ms]">{children}</div>}
      </div>
    </section>
  );
}

export function SectionHeading({
  kicker,
  title,
  className,
  action,
}: {
  kicker: string;
  title: string;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div>
        <p className="kicker mb-3 text-primary">{kicker}</p>
        <h2 className="display-lg max-w-3xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="mb-10 flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={cn(
            "rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition-colors",
            value === o.value
              ? "border-foreground bg-foreground text-background"
              : "border-border text-foreground/80 hover:border-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
