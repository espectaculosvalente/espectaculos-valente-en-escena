import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pageHead, useLangParams, useT } from "@/i18n";
import { PageHero } from "@/components/site/PageHero";
import { Photo, Txt } from "@/components/site/Placeholder";
import { useSiteImage } from "@/lib/use-content";

export const Route = createFileRoute("/{-$lang}/compania")({
  head: (ctx) => pageHead(ctx, "company"),
  component: Company,
});

function Company() {
  const t = useT();
  const lp = useLangParams();
  const backstageImg = useSiteImage("company_hero");
  const photos = [
    useSiteImage("company_photo_1"),
    useSiteImage("company_photo_2"),
    useSiteImage("company_photo_3"),
    useSiteImage("company_photo_4"),
    useSiteImage("company_photo_5"),
  ];
  const s = t.company.sections;
  const tx = t.company.texts;
  const blocks = [
    { title: s.history, text: tx.history },
    { title: s.philosophy, text: tx.philosophy },
    { title: s.territory, text: tx.territory },
    { title: s.universal, text: tx.universal },
    { title: s.social, text: tx.social },
    { title: s.extra, text: tx.extra },
  ];
  const tones = ["red", "ink", "paper", "paper", "ink"] as const;

  return (
    <>
      <PageHero kicker={t.company.kicker} title={t.company.title} lead={t.company.lead} image={backstageImg} />

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="grid gap-x-16 gap-y-14 md:grid-cols-2">
          {blocks.map((b, i) => (
            <article key={b.title} className="border-t-2 border-foreground pt-6">
              <div className="mb-4 flex items-baseline gap-4">
                <span className="font-display text-2xl italic text-primary">0{i + 1}</span>
                <h2 className="font-display text-3xl">{b.title}</h2>
              </div>
              <p className="leading-relaxed text-muted-foreground">
                <Txt value={b.text} fallback={t.ph.text} />
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-24">
          <h2 className="display-lg mb-10">{s.team}</h2>
          <p className="mb-10 max-w-2xl text-ink-foreground/80">
            <Txt value={tx.team} fallback={t.ph.text} />
          </p>
          <Button asChild variant="stage" size="xl">
            <Link to="/{-$lang}/traxectorias" params={lp}>
              {t.home.careersCta} <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <h2 className="kicker mb-6 font-sans text-primary">{t.company.photos}</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {photos.map((src, i) => (
            <Photo
              key={i}
              src={src}
              alt={`${t.company.photos} ${i + 1}`}
              tone={tones[i]}
              className={i === 0 ? "col-span-2 row-span-2 aspect-square w-full rounded-lg" : "aspect-square w-full rounded-lg"}
            />
          ))}
        </div>
      </section>
    </>
  );
}
