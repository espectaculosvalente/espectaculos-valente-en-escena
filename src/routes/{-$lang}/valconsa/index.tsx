import { createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { pageHead, useT } from "@/i18n";
import { showsByKind } from "@/content/catalog";
import { PageHero } from "@/components/site/PageHero";
import { ShowCard } from "@/components/site/ShowCard";
import { Ph } from "@/components/site/Placeholder";

export const Route = createFileRoute("/{-$lang}/valconsa/")({
  head: ({ params }) => pageHead(params.lang, "valconsa"),
  component: Valconsa,
});

function Valconsa() {
  const t = useT();
  const items = showsByKind("valconsa");
  return (
    <>
      <PageHero kicker={t.valconsa.kicker} title={t.valconsa.title} lead={t.valconsa.lead} tone="paper" />
      <section className="border-y-2 border-foreground">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-[auto_1fr] md:px-8">
          <Info className="size-8 text-primary" aria-hidden />
          <div>
            <h2 className="mb-2 font-sans text-xl font-bold">{t.valconsa.explainerTitle}</h2>
            <p className="max-w-3xl text-muted-foreground">{t.valconsa.explainer}</p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <p className="mb-10 text-muted-foreground">
          <Ph>{t.ph.valconsa}</Ph>
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <ShowCard key={s.slug} show={s} />
          ))}
        </div>
      </section>
    </>
  );
}
