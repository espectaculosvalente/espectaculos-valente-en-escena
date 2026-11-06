import { useMemo } from "react";
import { useParams } from "@tanstack/react-router";
import { gl, type Dict } from "./gl";
import { es } from "./es";
import { en } from "./en";
import { usePublicSite } from "@/lib/site-data";

/**
 * Galego é o idioma principal e vive na raíz (/, /compania…).
 * Castelán e inglés son secundarios e levan prefixo (/es/…, /en/…).
 * Os textos poden sobrescribirse desde o panel (táboa site_texts).
 */
export const LANGS = ["gl", "es", "en"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "gl";
export const SECONDARY_LANGS = ["es", "en"] as const;

const DICTS: Record<Lang, Dict> = { gl, es, en };

export const HTML_LANG: Record<Lang, string> = { gl: "gl", es: "es", en: "en" };
export const OG_LOCALE: Record<Lang, string> = { gl: "gl_ES", es: "es_ES", en: "en_GB" };

/** Converte o parámetro opcional da URL nun idioma válido (ou null se non é válido). */
export function parseLangParam(param: string | undefined): Lang | null {
  if (param === undefined || param === "") return DEFAULT_LANG;
  if ((SECONDARY_LANGS as readonly string[]).includes(param)) return param as Lang;
  return null;
}

/** Valor do parámetro {-$lang} para un idioma: galego = sen prefixo. */
export function langParam(lang: Lang): string | undefined {
  return lang === DEFAULT_LANG ? undefined : lang;
}

export function getDict(lang: Lang): Dict {
  return DICTS[lang];
}

type TextRow = { key: string; lang: string; value: string };

/** Aplica os textos editados no panel sobre os textos por defecto. */
export function applyOverrides(lang: Lang, rows: TextRow[] | undefined): Dict {
  const base = DICTS[lang];
  const mine = (rows ?? []).filter((r) => r.lang === lang && r.value.trim() !== "");
  if (mine.length === 0) return base;
  const out = structuredClone(base) as unknown as Record<string, unknown>;
  for (const r of mine) {
    const parts = r.key.split(".");
    let node = out as Record<string, unknown>;
    for (let i = 0; i < parts.length - 1; i++) {
      const next = node[parts[i]!];
      if (!next || typeof next !== "object" || Array.isArray(next)) {
        node = {};
        break;
      }
      node = next as Record<string, unknown>;
    }
    const last = parts[parts.length - 1]!;
    const current = node[last];
    if (Array.isArray(current)) node[last] = r.value.split("\n").map((s) => s.trim()).filter(Boolean);
    else if (typeof current === "string") node[last] = r.value;
  }
  return out as unknown as Dict;
}

/** Lista plana de todos os textos editables: clave → valor (as listas únense por liñas). */
export function flattenDict(d: unknown, prefix = ""): { key: string; value: string; multiline: boolean }[] {
  const out: { key: string; value: string; multiline: boolean }[] = [];
  for (const [k, v] of Object.entries(d as Record<string, unknown>)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") out.push({ key, value: v, multiline: v.length > 70 });
    else if (Array.isArray(v)) out.push({ key, value: v.join("\n"), multiline: true });
    else if (v && typeof v === "object") out.push(...flattenDict(v, key));
  }
  return out;
}

export function useLang(): Lang {
  const params = useParams({ strict: false }) as { lang?: string };
  return parseLangParam(params.lang) ?? DEFAULT_LANG;
}

export function useT(): Dict {
  const lang = useLang();
  const site = usePublicSite();
  return useMemo(() => applyOverrides(lang, site.texts), [lang, site.texts]);
}

/** Params listos para pasar a <Link params>. */
export function useLangParams(): { lang: string | undefined } {
  return { lang: langParam(useLang()) };
}

/** Cambia o prefixo de idioma dun pathname. */
export function switchLangPath(pathname: string, target: Lang): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length && (SECONDARY_LANGS as readonly string[]).includes(parts[0] ?? "")) parts.shift();
  const rest = parts.join("/");
  if (target === DEFAULT_LANG) return "/" + rest;
  return `/${target}${rest ? "/" + rest : ""}`;
}

type MetaKey = keyof Dict["meta"];
type HeadCtx = {
  params: { lang?: string | undefined };
  matches?: ReadonlyArray<{ routeId: string; loaderData?: unknown }>;
};

/** Metadatos traducidos (con textos editados) para o head() de cada páxina. */
export function pageHead(
  ctx: HeadCtx,
  key: MetaKey,
  override?: { title?: string | undefined; description?: string | undefined },
) {
  const lang = parseLangParam(ctx.params.lang) ?? DEFAULT_LANG;
  const site = ctx.matches?.find((m) => m.routeId === "/{-$lang}")?.loaderData as { texts?: TextRow[] } | undefined;
  const m = applyOverrides(lang, site?.texts).meta[key];
  const title = override?.title ?? m.title;
  const description = override?.description ?? m.description;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: OG_LOCALE[lang] },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
  };
}
