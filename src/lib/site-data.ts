import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { Tables } from "@/integrations/supabase/types";
import type { Lang } from "@/i18n";
import { getPublicSite } from "./public-site.functions";
import type { Material, Person, Show, Video } from "@/content/catalog";

export const publicSiteQuery = queryOptions({
  queryKey: ["public-site"],
  queryFn: () => getPublicSite(),
  staleTime: 30_000,
});

export type PublicSite = Awaited<ReturnType<typeof getPublicSite>>;

export function usePublicSite(): PublicSite {
  return useSuspenseQuery(publicSiteQuery).data;
}

type Content = Record<string, Record<string, string | undefined> | undefined>;

/** Campo traducido; se falta no idioma pedido úsase o galego. */
export function pick(content: unknown, lang: Lang, field: string): string | undefined {
  const c = (content ?? {}) as Content;
  const v = c[lang]?.[field]?.trim() || c["gl"]?.[field]?.trim();
  return v || undefined;
}

export const SHOW_FIELDS = [
  "title",
  "subtitle",
  "synopsis",
  "description",
  "genre",
  "audience",
  "duration",
  "performers",
  "credits",
  "technical",
] as const;

export function toShow(row: Tables<"shows">, lang: Lang, index: number): Show {
  const f = (k: string) => pick(row.content, lang, k);
  return {
    id: row.id,
    slug: row.slug,
    kind: row.kind as Show["kind"],
    number: String(index + 1).padStart(2, "0"),
    category: (row.category || undefined) as Show["category"],
    featured: row.featured,
    placeholder: false,
    title: f("title"),
    subtitle: f("subtitle"),
    synopsis: f("synopsis"),
    description: f("description"),
    genre: f("genre"),
    audience: f("audience"),
    duration: f("duration"),
    performers: f("performers"),
    credits: f("credits"),
    technical: f("technical"),
    artist: row.artist || undefined,
    image: row.image_url || undefined,
    gallery: row.gallery ?? [],
    videoUrl: row.video_url || undefined,
    dossierUrl: row.dossier_url || undefined,
    pressUrl: row.press_url || undefined,
  };
}

export function toPerson(row: Tables<"people">, lang: Lang, index: number): Person {
  const f = (k: string) => pick(row.content, lang, k);
  return {
    slug: row.slug,
    number: String(index + 1).padStart(2, "0"),
    placeholder: false,
    name: row.name || undefined,
    photo: row.photo_url || undefined,
    links: row.links || undefined,
    role: f("role"),
    bio: f("bio"),
    training: f("training"),
    experience: f("experience"),
    works: f("works"),
  };
}

export function toVideo(row: Tables<"videos">, lang: Lang): Video {
  return {
    id: row.id,
    category: row.category as Video["category"],
    placeholder: false,
    title: pick(row.content, lang, "title"),
    description: pick(row.content, lang, "description"),
    url: row.url || undefined,
    cover: row.cover_url || undefined,
  };
}

export function toMaterial(row: Tables<"materials">, lang: Lang): Material {
  return {
    id: row.id,
    type: row.type as Material["type"],
    section: row.section as Material["section"],
    placeholder: false,
    title: pick(row.content, lang, "title"),
    description: pick(row.content, lang, "description"),
    fileUrl: row.file_url || undefined,
    cover: row.cover_url || undefined,
  };
}

/** Lista de settings como obxecto. */
export function settingsMap(site: PublicSite): Record<string, string> {
  return Object.fromEntries(site.settings.map((s) => [s.key, s.value]));
}

export function imageMap(site: PublicSite): Record<string, string> {
  return Object.fromEntries(site.images.map((s) => [s.key, s.url]));
}
