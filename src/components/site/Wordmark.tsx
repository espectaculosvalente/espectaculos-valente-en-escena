import { cn } from "@/lib/utils";

/**
 * Marca provisional en texto. Substituír polo logotipo oficial cando chegue
 * (non se redeseña nin se inventa o logotipo).
 */
export function Wordmark({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn("flex flex-col leading-none", className)}>
      <span className={cn("kicker text-[0.6rem]", inverted ? "text-ink-muted" : "text-muted-foreground")}>
        Espectáculos
      </span>
      <span className="font-display text-2xl font-semibold italic tracking-tight">
        Valente<span className="text-primary">.</span>
      </span>
    </span>
  );
}
