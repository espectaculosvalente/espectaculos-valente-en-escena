import { createFileRoute } from "@tanstack/react-router";
import { pageHead, useT } from "@/i18n";
import { useShows, useSiteImage } from "@/lib/use-content";
import { PageHero } from "@/components/site/PageHero";
import { ShowCard } from "@/components/site/ShowCard";
import { Txt } from "@/components/site/Placeholder";

export const Route = createFileRoute("/{-$lang}/musica-valente/")({
  head: (ctx) => pageHead(ctx, "music"),
  component: Music,
});

function Music() {
  const t = useT();
  const items = useShows("musica");
  const musicImg = useSiteImage("music_hero");
  return (
    <div className="bg-ink text-ink-foreground">
      <PageHero kicker={t.music.kicker} title={t.music.title} lead={t.music.lead} image={musicImg} />
      <div className="bunting" aria-hidden />
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <p className="mb-14 max-w-3xl font-display text-2xl italic leading-snug md:text-3xl">
          <Txt value={t.music.intro} fallback={t.ph.music} />
        </p>
        <div className="grid gap-6 text-foreground sm:grid-cols-2">
          {items.map((s) => (
            <ShowCard key={s.slug} show={s} />
          ))}
        </div>
      </section>
    </div>
  );
}
