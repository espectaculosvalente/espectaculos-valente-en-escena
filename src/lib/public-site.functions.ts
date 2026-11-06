import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/** Lectura pública de todo o contido publicado da web (só filas publicadas, por RLS). */
export const getPublicSite = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const sb = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });

  const [texts, images, settings, shows, people, videos, materials] = await Promise.all([
    sb.from("site_texts").select("key, lang, value"),
    sb.from("site_images").select("key, url"),
    sb.from("site_settings").select("key, value"),
    sb.from("shows").select("*").eq("status", "published").order("sort_order").order("created_at"),
    sb.from("people").select("*").eq("status", "published").order("sort_order").order("created_at"),
    sb.from("videos").select("*").eq("status", "published").order("sort_order").order("created_at"),
    sb.from("materials").select("*").eq("status", "published").order("sort_order").order("created_at"),
  ]);

  for (const r of [texts, images, settings, shows, people, videos, materials]) {
    if (r.error) console.error("getPublicSite:", r.error.message);
  }

  return {
    texts: texts.data ?? [],
    images: images.data ?? [],
    settings: settings.data ?? [],
    shows: shows.data ?? [],
    people: people.data ?? [],
    videos: videos.data ?? [],
    materials: materials.data ?? [],
  };
});
