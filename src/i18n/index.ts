import { useParams } from "@tanstack/react-router";
import { gl, type Dict } from "./gl";
import { es } from "./es";
import { en } from "./en";

/**
 * Galego é o idioma principal e vive na raíz (/, /compania…).
 * Castelán e inglés son secundarios e levan prefixo (/es/…, /en/…).
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

export function useLang(): Lang {
  const params = useParams({ strict: false }) as { lang?: string };
  return parseLangParam(params.lang) ?? DEFAULT_LANG;
}

export function useT(): Dict {
  return getDict(useLang());
}

/** Params listos para pasar a <Link params>. */
export function useLangParams(): { lang: string | undefined } {
  return { lang: langParam(useLang()) };
}

/** Cambia o prefixo de idioma dun pathname. */
export function switchLangPath(pathname: string, target: Lang): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length && (SECONDARY_LANGS as readonly string[]).includes(parts[0])) parts.shift();
  const rest = parts.join("/");
  if (target === DEFAULT_LANG) return "/" + rest;
  return `/${target}${rest ? "/" + rest : ""}`;
}

type MetaKey = keyof Dict["meta"];

/** Metadatos traducidos para o head() de cada páxina. */
export function pageHead(param: string | undefined, key: MetaKey, override?: { title?: string; description?: string }) {
  const lang = parseLangParam(param) ?? DEFAULT_LANG;
  const m = getDict(lang).meta[key];
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
