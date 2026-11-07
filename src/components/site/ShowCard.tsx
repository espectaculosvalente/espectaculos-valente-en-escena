import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Show } from "@/content/catalog";
import { useLangParams, useT } from "@/i18n";
import { cn } from "@/lib/utils";
import { Ph, Photo, ProvisionalBadge } from "./Placeholder";

export function ShowCard({ show, className }: { show: Show; className?: string }) {
  const t = useT();
  const lp = useLangParams();
  const params = { ...lp, slug: show.slug };

  const title = show.title ?? (show.kind === "musica" ? t.ph.musicName : t.ph.showName);
  const cta = show.kind === "musica" ? t.music.view : show.kind === "valconsa" ? t.valconsa.view : t.shows.view;
  const tone = show.kind === "musica" ? "ink" : show.kind === "valconsa" ? "paper" : "red";

  const linkProps =
    show.kind === "musica"
      ? ({ to: "/{-$lang}/musica-valente/$slug", params } as const)
      : show.kind === "valconsa"
        ? ({ to: "/{-$lang}/valconsa/$slug", params } as const)
        : ({ to: "/{-$lang}/espectaculos/$slug", params } as const);

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-stage transition-transform duration-500 hover:-translate-y-1.5",
        show.kind === "valconsa" && "border-2 border-foreground",
        className,
      )}
    >
      <Link {...linkProps} className="relative block" tabIndex={-1} aria-hidden>
        <Photo src={show.image} alt={show.title ?? ""} number={show.number} tone={tone} className="aspect-[4/3] w-full transition-transform duration-700 group-hover:scale-[1.03]" />
        <div className="absolute left-3 top-3 flex gap-2">
          {show.featured && (
            <span className="kicker rounded-full bg-ink px-2.5 py-1 text-[0.62rem] text-ink-foreground">
              {t.shows.featured}
            </span>
          )}
          {show.kind === "valconsa" && (
            <span className="kicker rounded-full bg-foreground px-2.5 py-1 text-[0.62rem] text-background">
              VALCONSA
            </span>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center justify-between gap-2">
          {show.category ? (
            <span className="kicker text-primary">{t.shows.categories[show.category]}</span>
          ) : (
            <span />
          )}
          {show.placeholder && <ProvisionalBadge />}
        </div>
        {show.kind === "valconsa" && (
          <p className="text-xs text-muted-foreground">
            {t.detail.by} {show.artist ?? <Ph>{t.ph.artist}</Ph>}
          </p>
        )}
        <h3 className="font-display text-2xl leading-tight">{show.title ? title : <Ph>{title}</Ph>}</h3>
        <p className="text-sm text-muted-foreground">{show.synopsis ?? <Ph>{t.ph.synopsis}</Ph>}</p>
        <Link
          {...linkProps}
          className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary"
        >
          {cta}
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
