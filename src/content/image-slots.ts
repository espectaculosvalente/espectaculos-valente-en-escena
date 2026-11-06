import heroImg from "@/assets/hero-escena.jpg";
import backstageImg from "@/assets/compania-backstage.jpg";
import musicImg from "@/assets/musica-valente.jpg";
import valconsaImg from "@/assets/valconsa-sala.jpg";

/** Espazos de foto fixos da web, editables desde o panel (Fotografías). */
export const IMAGE_SLOTS = [
  { key: "hero", label: "Portada (foto grande de inicio)", fallback: heroImg },
  { key: "home_company", label: "Inicio · bloque A compañía", fallback: backstageImg },
  { key: "home_music", label: "Inicio · tarxeta Música Valente", fallback: musicImg },
  { key: "home_valconsa", label: "Inicio · tarxeta VALCONSA", fallback: valconsaImg },
  { key: "company_hero", label: "A compañía · cabeceira", fallback: backstageImg },
  { key: "shows_hero", label: "Espectáculos · cabeceira", fallback: heroImg },
  { key: "music_hero", label: "Música Valente · cabeceira", fallback: musicImg },
  { key: "company_photo_1", label: "A compañía · foto 1 (grande)", fallback: undefined },
  { key: "company_photo_2", label: "A compañía · foto 2", fallback: undefined },
  { key: "company_photo_3", label: "A compañía · foto 3", fallback: undefined },
  { key: "company_photo_4", label: "A compañía · foto 4", fallback: undefined },
  { key: "company_photo_5", label: "A compañía · foto 5", fallback: undefined },
] as const satisfies readonly { key: string; label: string; fallback: string | undefined }[];

export type ImageSlotKey = (typeof IMAGE_SLOTS)[number]["key"];

/** Datos de contacto e redes editables desde o panel. */
export const SETTING_FIELDS = [
  { key: "email", label: "Correo electrónico", placeholder: "info@exemplo.gal" },
  { key: "phone", label: "Teléfono", placeholder: "+34 600 000 000" },
  { key: "location", label: "Localización", placeholder: "Vila, Provincia" },
  { key: "instagram", label: "Instagram (URL)", placeholder: "https://instagram.com/…" },
  { key: "facebook", label: "Facebook (URL)", placeholder: "https://facebook.com/…" },
  { key: "youtube", label: "YouTube (URL)", placeholder: "https://youtube.com/…" },
  { key: "tiktok", label: "TikTok (URL)", placeholder: "https://tiktok.com/@…" },
  { key: "x", label: "X / Twitter (URL)", placeholder: "https://x.com/…" },
] as const;

export const SOCIAL_KEYS = ["instagram", "facebook", "youtube", "tiktok", "x"] as const;
export const SOCIAL_LABELS: Record<(typeof SOCIAL_KEYS)[number], string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  tiktok: "TikTok",
  x: "X",
};
