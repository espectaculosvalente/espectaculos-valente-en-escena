import { cn } from "@/lib/utils";
import logo from "@/assets/logo-valente.png.asset.json";
import logoNegativo from "@/assets/logo-valente-negativo.png.asset.json";

/** Logotipo oficial de Espectáculos Valente (versión para fondo claro ou escuro). */
export function Wordmark({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <img
      src={inverted ? logoNegativo.url : logo.url}
      alt="Espectáculos Valente"
      width={573}
      height={229}
      className={cn("h-11 w-auto", className)}
    />
  );
}
