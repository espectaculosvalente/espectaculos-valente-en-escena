import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { pageHead, useT } from "@/i18n";
import type { VideoCategory } from "@/content/catalog";
import { useVideos } from "@/lib/use-content";
import { FilterChips, PageHero } from "@/components/site/PageHero";
import { VideoCard } from "@/components/site/VideoCard";

export const Route = createFileRoute("/{-$lang}/videos")({
  head: (ctx) => pageHead(ctx, "videos"),
  component: Videos,
});

function Videos() {
  const t = useT();
  const VIDEOS = useVideos();
  const [cat, setCat] = useState<VideoCategory | "all">("all");
  const cats = Array.from(new Set(VIDEOS.map((v) => v.category)));
  const list = cat === "all" ? VIDEOS : VIDEOS.filter((v) => v.category === cat);

  return (
    <>
      <PageHero kicker={t.videos.kicker} title={t.videos.title} lead={t.videos.lead} />
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <FilterChips
          label={t.videos.kicker}
          value={cat}
          onChange={setCat}
          options={[{ value: "all", label: t.videos.all }, ...cats.map((c) => ({ value: c, label: t.videos.categories[c] }))]}
        />
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </section>
    </>
  );
}
