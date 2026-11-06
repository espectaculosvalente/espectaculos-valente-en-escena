import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { pageHead, useT } from "@/i18n";
import type { ShowCategory } from "@/content/catalog";
import { useShows, useSiteImage } from "@/lib/use-content";
import { FilterChips, PageHero } from "@/components/site/PageHero";
import { ShowCard } from "@/components/site/ShowCard";

export const Route = createFileRoute("/{-$lang}/espectaculos/")({
  head: (ctx) => pageHead(ctx, "shows"),
  component: Shows,
});

function Shows() {
  const t = useT();
  const shows = useShows("propia");
  const heroImg = useSiteImage("shows_hero");
  const [cat, setCat] = useState<ShowCategory | "all">("all");
  const cats = Array.from(new Set(shows.map((s) => s.category).filter(Boolean))) as ShowCategory[];
  const list = cat === "all" ? shows : shows.filter((s) => s.category === cat);

  return (
    <>
      <PageHero kicker={t.shows.kicker} title={t.shows.title} lead={t.shows.lead} image={heroImg} />
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <FilterChips
          label={t.shows.kicker}
          value={cat}
          onChange={setCat}
          options={[{ value: "all", label: t.shows.all }, ...cats.map((c) => ({ value: c, label: t.shows.categories[c] }))]}
        />
        {list.length === 0 ? (
          <p className="text-muted-foreground">{t.shows.empty}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((s) => (
              <ShowCard key={s.slug} show={s} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
