import { createFileRoute } from "@tanstack/react-router";
import { pageHead, useT } from "@/i18n";
import { showsByKind } from "@/content/catalog";
import { PageHero } from "@/components/site/PageHero";
import { ShowCard } from "@/components/site/ShowCard";
import { Ph } from "@/components/site/Placeholder";
import musicImg from "@/assets/musica-valente.jpg";

export const Route = createFileRoute("/{-$lang}/musica-valente/")({
  head: ({ params }) => pageHead(params.lang, "music"),
  component: Music,
});

function Music() {
  const t = useT();
  const items = showsByKind("musica");
  return (
    <div className="bg-ink text-ink-foreground">
      <PageHero kicker={t.music.kicker} title={t.music.title} lead={t.music.lead} image={musicImg} />
      <div className="bunting" aria-hidden />
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <p className="mb-14 max-w-3xl font-display text-2xl italic leading-snug md:text-3xl">
          <Ph className="not-italic">{t.ph.music}</Ph>
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
