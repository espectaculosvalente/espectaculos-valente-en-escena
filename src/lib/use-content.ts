import { useMemo } from "react";
import { useLang } from "@/i18n";
import {
  PLACEHOLDER_MATERIALS,
  PLACEHOLDER_PEOPLE,
  PLACEHOLDER_VIDEOS,
  placeholderShows,
  type ShowKind,
} from "@/content/catalog";
import { IMAGE_SLOTS, type ImageSlotKey } from "@/content/image-slots";
import { imageMap, settingsMap, toMaterial, toPerson, toShow, toVideo, usePublicSite } from "./site-data";

/** Espectáculos publicados dun tipo; se aínda non hai ningún, marcadores provisionais. */
export function useShows(kind: ShowKind) {
  const site = usePublicSite();
  const lang = useLang();
  return useMemo(() => {
    const rows = site.shows.filter((s) => s.kind === kind);
    return rows.length ? rows.map((r, i) => toShow(r, lang, i)) : placeholderShows(kind);
  }, [site.shows, kind, lang]);
}

export function usePeople() {
  const site = usePublicSite();
  const lang = useLang();
  return useMemo(
    () => (site.people.length ? site.people.map((r, i) => toPerson(r, lang, i)) : PLACEHOLDER_PEOPLE),
    [site.people, lang],
  );
}

export function useVideos() {
  const site = usePublicSite();
  const lang = useLang();
  return useMemo(
    () => (site.videos.length ? site.videos.map((r) => toVideo(r, lang)) : PLACEHOLDER_VIDEOS),
    [site.videos, lang],
  );
}

export function useMaterials() {
  const site = usePublicSite();
  const lang = useLang();
  return useMemo(
    () => (site.materials.length ? site.materials.map((r) => toMaterial(r, lang)) : PLACEHOLDER_MATERIALS),
    [site.materials, lang],
  );
}

/** Foto dun espazo fixo da web: a subida no panel ou a de por defecto. */
export function useSiteImage(key: ImageSlotKey): string | undefined {
  const site = usePublicSite();
  return imageMap(site)[key] || IMAGE_SLOTS.find((s) => s.key === key)?.fallback;
}

export function useSettings(): Record<string, string> {
  const site = usePublicSite();
  return useMemo(() => settingsMap(site), [site]);
}
