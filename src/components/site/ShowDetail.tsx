import { Link } from "@tanstack/react-router";
import { ArrowLeft, Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Show } from "@/content/catalog";
import { useLangParams, useT } from "@/i18n";
import { cn } from "@/lib/utils";
import { Ph, PhImage, Photo, ProvisionalBadge } from "./Placeholder";
import { VideoEmbed } from "./VideoCard";

/**
 * Ficha individual. Os campos sen información ocúltanse; mentres o
 * contido sexa provisional, móstranse os rótulos «[Engadir …]».
 */
export function ShowDetail({ show }: { show: Show }) {
  const t = useT();
  const lp = useLangParams();
  const ph = show.placeholder;
  const title = show.title ?? (show.kind === "musica" ? t.ph.musicName : t.ph.showName);

  const back =
    show.kind === "musica"
      ? ({ to: "/{-$lang}/musica-valente", label: t.nav.music } as const)
      : show.kind === "valconsa"
        ? ({ to: "/{-$lang}/valconsa", label: t.nav.valconsa } as const)
        : ({ to: "/{-$lang}/espectaculos", label: t.nav.shows } as const);

  const val = (v: string | undefined) => v ?? (ph ? <Ph>{t.ph.field}</Ph> : null);

  const facts = [
    { label: t.detail.genre, value: show.genre ?? (show.category ? t.shows.categories[show.category] : undefined) },
    { label: t.detail.audience, value: show.audience },
    { label: t.detail.duration, value: show.duration },
    { label: t.detail.performers, value: show.performers },
  ].filter((f) => f.value || ph);

  const tone = show.kind === "musica" ? "ink" : show.kind === "valconsa" ? "paper" : "red";

  return (
    <>
      <section className={cn("relative", show.kind === "valconsa" ? "bg-paper" : "bg-ink text-ink-foreground")}>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:px-8 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div className="flex flex-col">
            <Link
              to={back.to}
              params={lp}
              className="kicker mb-8 inline-flex items-center gap-2 opacity-80 hover:text-primary hover:opacity-100"
            >
              <ArrowLeft className="size-4" /> {back.label}
            </Link>
            {show.kind === "valconsa" && (
              <p className="kicker mb-4 inline-flex w-fit rounded-full bg-foreground px-3 py-1.5 text-background">
                {t.detail.distributed}
              </p>
            )}
            {ph && <ProvisionalBadge className="mb-4 w-fit" />}
            <h1 className="display-lg mb-5">{show.title ? title : <Ph>{title}</Ph>}</h1>
            {show.kind === "valconsa" && (
              <p className="mb-4 text-lg">
                {t.detail.by} <strong>{show.artist ?? <Ph>{t.ph.artist}</Ph>}</strong>
              </p>
            )}
            {(show.subtitle || ph) && (
              <p className="font-display text-xl italic opacity-85">{show.subtitle ?? <Ph>{t.ph.text}</Ph>}</p>
            )}
            <div className="mt-auto flex flex-wrap gap-3 pt-10">
              <Button asChild variant="stage" size="xl">
                <Link to="/{-$lang}/contacto" params={lp} search={{ espectaculo: show.title ?? show.slug }}>
                  {t.detail.bookingCta}
                </Link>
              </Button>
              {show.dossierUrl ? (
                <Button asChild variant={show.kind === "valconsa" ? "outlineInk" : "outlineLight"} size="xl">
                  <a href={show.dossierUrl} download target="_blank" rel="noopener">
                    <Download /> {t.detail.dossier}
                  </a>
                </Button>
              ) : (
                ph && (
                  <span className="inline-flex items-center gap-2 text-sm opacity-80">
                    <Download className="size-4" /> <Ph>{t.ph.dossier}</Ph>
                  </span>
                )
              )}
            </div>
          </div>
          <Photo src={show.image} alt={show.title ?? ""} number={show.number} tone={tone} className="aspect-[4/5] w-full rounded-lg lg:aspect-auto lg:min-h-[520px]" />
        </div>
      </section>

      {show.kind === "valconsa" && (
        <div className="border-y-2 border-foreground bg-background">
          <p className="mx-auto flex max-w-7xl items-start gap-3 px-4 py-4 text-sm md:px-8">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" /> {t.detail.distributedNote}
          </p>
        </div>
      )}

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        {facts.length > 0 && (
          <dl className="mb-16 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="bg-card p-5">
                <dt className="kicker mb-2 text-muted-foreground">{f.label}</dt>
                <dd className="font-display text-lg">{val(f.value)}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-10">
            {(show.synopsis || ph) && (
              <div>
                <h2 className="kicker mb-3 font-sans text-primary">{t.detail.synopsis}</h2>
                <p className="font-display text-2xl leading-snug">{show.synopsis ?? <Ph>{t.ph.synopsis}</Ph>}</p>
              </div>
            )}
            {(show.description || ph) && (
              <div>
                <h2 className="kicker mb-3 font-sans text-primary">{t.detail.description}</h2>
                <p className="leading-relaxed text-muted-foreground">{show.description ?? <Ph>{t.ph.text}</Ph>}</p>
              </div>
            )}
          </div>
          <div className="space-y-10">
            {(show.videoUrl || ph) && (
              <div>
                <h2 className="kicker mb-3 font-sans text-primary">{t.detail.video}</h2>
                <VideoEmbed url={show.videoUrl} title={title} />
              </div>
            )}
            {(show.credits || ph) && (
              <div>
                <h2 className="kicker mb-3 font-sans text-primary">{t.detail.credits}</h2>
                <p className="leading-relaxed text-muted-foreground">{show.credits ?? <Ph>{t.ph.field}</Ph>}</p>
              </div>
            )}
            {(show.technical || ph) && (
              <div>
                <h2 className="kicker mb-3 font-sans text-primary">{t.detail.technical}</h2>
                <p className="leading-relaxed text-muted-foreground">{show.technical ?? <Ph>{t.ph.field}</Ph>}</p>
              </div>
            )}
          </div>
        </div>

        {(ph || (show.gallery?.length ?? 0) > 0) && (
          <div className="mt-16">
            <h2 className="kicker mb-4 font-sans text-primary">{t.detail.gallery}</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {ph
                ? [0, 1, 2, 3].map((i) => (
                    <PhImage key={i} tone={i % 2 ? "ink" : "paper"} className="aspect-square rounded-md" />
                  ))
                : show.gallery!.map((src, i) => (
                    <a key={src} href={src} target="_blank" rel="noopener" className="block overflow-hidden rounded-md">
                      <img src={src} alt={`${title} · ${i + 1}`} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-105" />
                    </a>
                  ))}
            </div>
          </div>
        )}
        {show.pressUrl && (
          <div className="mt-8">
            <Button asChild variant="outlineInk">
              <a href={show.pressUrl} download target="_blank" rel="noopener">
                <Download /> {t.detail.press}
              </a>
            </Button>
          </div>
        )}
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <h2 className="display-lg text-4xl md:text-5xl">{t.detail.bookingTitle}</h2>
            <p className="mt-3 max-w-xl opacity-90">{t.detail.bookingText}</p>
          </div>
          <Button asChild variant="ink" size="xl" className="shrink-0">
            <Link to="/{-$lang}/contacto" params={lp} search={{ espectaculo: show.title ?? show.slug }}>
              {t.detail.bookingCta}
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}

export function ShowNotFound() {
  const t = useT();
  const lp = useLangParams();
  return (
    <div className="mx-auto max-w-3xl px-4 py-32 text-center">
      <h1 className="display-lg mb-6">{t.detail.notFound}</h1>
      <Button asChild variant="stage" size="xl">
        <Link to="/{-$lang}" params={lp}>{t.notFound.cta}</Link>
      </Button>
    </div>
  );
}
