import type { Dict } from "@/i18n/gl";

export const NAV_ITEMS = [
  { to: "/{-$lang}", key: "home" },
  { to: "/{-$lang}/compania", key: "company" },
  { to: "/{-$lang}/traxectorias", key: "careers" },
  { to: "/{-$lang}/espectaculos", key: "shows" },
  { to: "/{-$lang}/musica-valente", key: "music" },
  { to: "/{-$lang}/valconsa", key: "valconsa" },
  { to: "/{-$lang}/videos", key: "videos" },
  { to: "/{-$lang}/dossieres", key: "dossiers" },
  { to: "/{-$lang}/contacto", key: "contact" },
] as const satisfies readonly { to: string; key: keyof Dict["nav"] }[];
