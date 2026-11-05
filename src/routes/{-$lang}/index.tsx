import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Download, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pageHead, useLangParams, useT } from "@/i18n";
import { SHOWS, VIDEOS } from "@/content/catalog";
import { ShowCard } from "@/components/site/ShowCard";
import { VideoCard } from "@/components/site/VideoCard";
import { SectionHeading } from "@/components/site/PageHero";
import { Ph } from "@/components/site/Placeholder";
import heroImg from "@/assets/hero-escena.jpg";
import backstageImg from "@/assets/compania-backstage.jpg";
import musicImg from "@/assets/musica-valente.jpg";
import valconsaImg from "@/assets/valconsa-sala.jpg";

export const Route = createFileRoute("/{-$lang}/")({
  head: ({ params }) => pageHead(params.lang, "home"),
  component: Home,
});

function Home() {
  const t = useT();
  const lp = useLangParams();
  const featured = SHOWS.filter((s) => s.kind === "propia" && s.featured).slice(0, 3);

  return (
    <>
      {/* PORTADA */}
      <section className="grain relative isolate flex min-h-[calc(100svh-4.5rem)] items-end overflow-hidden bg-ink text-ink-foreground">
        <img
          src={heroImg}
          alt=""
          aria-hidden
          width={1920}
          height={1088}
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-70"
        />
        <div className="bg-fade-ink absolute inset-0 -z-10" />
        {/* Pano que se abre */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-10 flex">
          <div className="animate-curtain-left h-full w-1/2 bg-primary-deep" />
          <div className="animate-curtain-right h-full w-1/2 bg-primary-deep" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 md:px-8 md:pb-24">
          <p className="kicker animate-rise mb-6 text-primary [animation-delay:1.1s]">{t.home.kicker}</p>
          <h1 className="display-xl animate-rise max-w-5xl [animation-delay:1.2s]">
            {t.home.titleA}{" "}
            <em className="font-normal italic text-primary">{t.home.titleB}</em>
          </h1>
          <p className="animate-rise mt-8 max-w-2xl text-lg leading-relaxed text-ink-foreground/85 [animation-delay:1.35s] md:text-xl">
            {t.home.lead}
          </p>
          <div className="animate-rise mt-10 flex flex-wrap gap-3 [animation-delay:1.5s]">
            <Button asChild variant="stage" size="xl">
              <Link to="/{-$lang}/espectaculos" params={lp}>
                {t.home.btnShows} <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outlineLight" size="xl">
              <Link to="/{-$lang}/videos" params={lp}>{t.home.btnVideos}</Link>
            </Button>
            <Button asChild variant="outlineLight" size="xl">
              <Link to="/{-$lang}/contacto" params={lp}>{t.home.btnBooking}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CINTA */}
      <div className="overflow-hidden border-y-2 border-ink bg-primary py-4 text-primary-foreground" aria-hidden>
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap font-display text-3xl italic md:text-4xl">
          {[...t.home.marquee, ...t.home.marquee].map((w, i) => (
            <span key={i} className="flex items-center gap-10">
              {w} <span className="text-ink">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* TRES LIÑAS */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <SectionHeading kicker={t.home.linesKicker} title={t.home.linesTitle} />
        <div className="grid gap-5 md:grid-cols-3">
          <Link
            to="/{-$lang}/espectaculos"
            params={lp}
            className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-lg bg-primary p-8 text-primary-foreground shadow-red"
          >
            <span className="text-outline absolute -right-4 -top-8 font-display text-[12rem] leading-none opacity-30">01</span>
            <h3 className="font-display text-4xl">{t.home.lines.shows.title}</h3>
            <p className="mt-3 max-w-xs opacity-90">{t.home.lines.shows.text}</p>
            <ArrowRight className="mt-6 size-6 transition-transform group-hover:translate-x-2" />
          </Link>
          <Link
            to="/{-$lang}/musica-valente"
            params={lp}
            className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-lg bg-ink p-8 text-ink-foreground"
          >
            <img src={musicImg} alt="" aria-hidden loading="lazy" width={1280} height={1280} className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" />
            <div className="bg-fade-ink absolute inset-0" />
            <div className="relative">
              <h3 className="font-display text-4xl italic">{t.home.lines.music.title}</h3>
              <p className="mt-3 max-w-xs text-ink-foreground/85">{t.home.lines.music.text}</p>
              <ArrowRight className="mt-6 size-6 transition-transform group-hover:translate-x-2" />
            </div>
          </Link>
          <Link
            to="/{-$lang}/valconsa"
            params={lp}
            className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-lg border-2 border-foreground bg-background p-8"
          >
            <img src={valconsaImg} alt="" aria-hidden loading="lazy" width={1280} height={1280} className="absolute inset-x-0 top-0 h-1/2 w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0" />
            <div className="relative">
              <p className="kicker mb-2 text-muted-foreground">{t.valconsa.kicker}</p>
              <h3 className="font-sans text-4xl font-bold tracking-[0.12em]">{t.home.lines.valconsa.title}</h3>
              <p className="mt-3 max-w-xs text-muted-foreground">{t.home.lines.valconsa.text}</p>
              <ArrowRight className="mt-6 size-6 transition-transform group-hover:translate-x-2" />
            </div>
          </Link>
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="bg-paper">
        <div className="bunting-ink opacity-90" aria-hidden />
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
          <SectionHeading
            kicker={t.home.featuredKicker}
            title={t.home.featuredTitle}
            action={
              <Button asChild variant="outlineInk" size="xl">
                <Link to="/{-$lang}/espectaculos" params={lp}>{t.home.seeAll}</Link>
              </Button>
            }
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => (
              <ShowCard key={s.slug} show={s} />
            ))}
          </div>
        </div>
      </section>

      {/* A COMPAÑÍA */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-2">
        <div className="relative">
          <img
            src={backstageImg}
            alt="Camerino con vestiario e máscaras teatrais"
            loading="lazy"
            width={1280}
            height={1280}
            className="aspect-[4/5] w-full rounded-lg object-cover shadow-stage"
          />
          <div className="absolute -bottom-6 -right-4 hidden rounded-lg bg-primary px-6 py-5 text-primary-foreground shadow-red md:block">
            <p className="font-display text-3xl italic leading-none">Tradición</p>
            <p className="font-display text-3xl leading-none">+ modernidade</p>
          </div>
        </div>
        <div>
          <p className="kicker mb-3 text-primary">{t.home.aboutKicker}</p>
          <h2 className="display-lg mb-8">{t.home.aboutTitle}</h2>
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
            <Ph>{t.ph.companyText}</Ph>
          </p>
          <Button asChild variant="ink" size="xl">
            <Link to="/{-$lang}/compania" params={lp}>
              {t.home.aboutCta} <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      {/* VÍDEOS */}
      <section className="grain relative bg-ink text-ink-foreground">
        <div className="bg-stage absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
          <SectionHeading
            kicker={t.home.videosKicker}
            title={t.home.videosTitle}
            action={
              <Button asChild variant="outlineLight" size="xl">
                <Link to="/{-$lang}/videos" params={lp}>{t.home.btnVideos}</Link>
              </Button>
            }
          />
          <div className="grid gap-8 md:grid-cols-3">
            {VIDEOS.slice(0, 3).map((v) => (
              <VideoCard key={v.id} video={v} inverted />
            ))}
          </div>
        </div>
      </section>

      {/* TRAXECTORIAS + DOSSIERES */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-2">
        <Link
          to="/{-$lang}/traxectorias"
          params={lp}
          className="group flex flex-col justify-between gap-10 rounded-lg border-2 border-foreground p-8 transition-colors hover:bg-foreground hover:text-background md:p-12"
        >
          <div className="flex -space-x-3" aria-hidden>
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className="flex size-14 items-center justify-center rounded-full border-2 border-background bg-primary font-display text-lg text-primary-foreground"
              >
                0{n}
              </span>
            ))}
          </div>
          <div>
            <p className="kicker mb-3 text-primary">{t.home.careersKicker}</p>
            <h2 className="display-lg mb-4 text-4xl md:text-5xl">{t.home.careersTitle}</h2>
            <p className="mb-6 max-w-md opacity-80">{t.home.careersText}</p>
            <span className="inline-flex items-center gap-2 font-semibold">
              <Users className="size-4" /> {t.home.careersCta}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
        <Link
          to="/{-$lang}/dossieres"
          params={lp}
          className="group flex flex-col justify-between gap-10 rounded-lg bg-primary p-8 text-primary-foreground shadow-red md:p-12"
        >
          <Download className="size-12" aria-hidden />
          <div>
            <p className="kicker mb-3 opacity-80">{t.home.dossiersKicker}</p>
            <h2 className="display-lg mb-4 text-4xl md:text-5xl">{t.home.dossiersTitle}</h2>
            <p className="mb-6 max-w-md opacity-90">{t.home.dossiersText}</p>
            <span className="inline-flex items-center gap-2 font-semibold">
              {t.home.dossiersCta}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </section>
    </>
  );
}
