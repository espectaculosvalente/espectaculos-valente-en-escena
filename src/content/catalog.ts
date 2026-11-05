/**
 * Contido provisional da web.
 *
 * IMPORTANTE: aquí non hai datos reais. Todos os elementos están marcados
 * con `placeholder: true` e móstranse na web como «[Engadir …]».
 * Na seguinte fase este ficheiro substitúese pola base de datos e o panel
 * de administración.
 */

export type ShowKind = "propia" | "musica" | "valconsa";
export type ShowCategory = "teatro" | "comedia" | "familiar" | "rua";

export interface Show {
  slug: string;
  kind: ShowKind;
  number: string;
  category?: ShowCategory;
  featured?: boolean;
  placeholder: true;
  // Campos reais (baleiros ata que se carguen). Os campos baleiros non se mostran.
  title?: string;
  subtitle?: string;
  artist?: string;
  synopsis?: string;
  description?: string;
  genre?: string;
  audience?: string;
  duration?: string;
  performers?: string;
  credits?: string;
  technical?: string;
  videoUrl?: string;
  dossierUrl?: string;
}

export const SHOWS: Show[] = [
  { slug: "espectaculo-1", kind: "propia", number: "01", category: "teatro", featured: true, placeholder: true },
  { slug: "espectaculo-2", kind: "propia", number: "02", category: "comedia", featured: true, placeholder: true },
  { slug: "espectaculo-3", kind: "propia", number: "03", category: "familiar", featured: true, placeholder: true },
  { slug: "espectaculo-4", kind: "propia", number: "04", category: "rua", placeholder: true },
  { slug: "proposta-musical-1", kind: "musica", number: "01", placeholder: true },
  { slug: "proposta-musical-2", kind: "musica", number: "02", placeholder: true },
  { slug: "distribucion-1", kind: "valconsa", number: "01", category: "teatro", placeholder: true },
  { slug: "distribucion-2", kind: "valconsa", number: "02", category: "comedia", placeholder: true },
  { slug: "distribucion-3", kind: "valconsa", number: "03", category: "familiar", placeholder: true },
];

export function showsByKind(kind: ShowKind) {
  return SHOWS.filter((s) => s.kind === kind);
}

export function findShow(kind: ShowKind, slug: string) {
  return SHOWS.find((s) => s.kind === kind && s.slug === slug);
}

export interface Person {
  slug: string;
  number: string;
  placeholder: true;
  name?: string;
  role?: string;
  bio?: string;
}

export const PEOPLE: Person[] = [1, 2, 3, 4, 5].map((n) => ({
  slug: `persoa-${n}`,
  number: String(n).padStart(2, "0"),
  placeholder: true,
}));

export type VideoCategory = "trailer" | "fragmento" | "promo" | "entrevista" | "musica" | "valconsa";

export interface Video {
  id: string;
  category: VideoCategory;
  placeholder: true;
  title?: string;
  url?: string; // YouTube ou Vimeo
}

export const VIDEOS: Video[] = [
  { id: "v1", category: "trailer", placeholder: true },
  { id: "v2", category: "fragmento", placeholder: true },
  { id: "v3", category: "musica", placeholder: true },
  { id: "v4", category: "entrevista", placeholder: true },
  { id: "v5", category: "valconsa", placeholder: true },
  { id: "v6", category: "promo", placeholder: true },
];

export type MaterialType = "dossier" | "ficha" | "fotos" | "cartaz" | "nota";

export interface Material {
  id: string;
  type: MaterialType;
  section: ShowKind;
  placeholder: true;
  title?: string;
  fileUrl?: string;
}

export const MATERIALS: Material[] = [
  { id: "m1", type: "dossier", section: "propia", placeholder: true },
  { id: "m2", type: "ficha", section: "propia", placeholder: true },
  { id: "m3", type: "fotos", section: "propia", placeholder: true },
  { id: "m4", type: "dossier", section: "musica", placeholder: true },
  { id: "m5", type: "cartaz", section: "musica", placeholder: true },
  { id: "m6", type: "dossier", section: "valconsa", placeholder: true },
  { id: "m7", type: "nota", section: "valconsa", placeholder: true },
];

/** Converte unha URL de YouTube/Vimeo nunha URL de inserción. */
export function toEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}
