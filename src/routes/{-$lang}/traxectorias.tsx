import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { pageHead, useT } from "@/i18n";
import type { Person } from "@/content/catalog";
import { usePeople } from "@/lib/use-content";
import { PageHero } from "@/components/site/PageHero";
import { Ph, PhImage, ProvisionalBadge } from "@/components/site/Placeholder";

export const Route = createFileRoute("/{-$lang}/traxectorias")({
  head: (ctx) => pageHead(ctx, "careers"),
  component: Careers,
});

function Careers() {
  const t = useT();
  const people = usePeople();
  return (
    <>
      <PageHero kicker={t.careers.kicker} title={t.careers.title} lead={t.careers.lead} tone="red" />
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((p, i) => (
            <PersonCard key={p.slug} person={p} offset={i % 3 === 1} />
          ))}
        </div>
      </section>
    </>
  );
}

function PersonCard({ person, offset }: { person: Person; offset: boolean }) {
  const t = useT();
  const name = person.name ?? t.ph.person;
  const fields = [t.careers.bio, t.careers.training, t.careers.experience, t.careers.works, t.careers.links];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={`group text-left ${offset ? "lg:mt-16" : ""}`}
          aria-label={`${t.careers.open}: ${name}`}
        >
          <PhImage
            number={person.number}
            tone={offset ? "red" : "ink"}
            label={t.ph.photo}
            className="aspect-[3/4] rounded-lg transition-transform duration-500 group-hover:-translate-y-1.5"
          />
          <div className="mt-4 flex items-start justify-between gap-3">
            <div>
              <p className="kicker mb-1 text-muted-foreground">
                {t.careers.person} {person.number}
              </p>
              <h2 className="font-display text-2xl">{person.name ?? <Ph>{name}</Ph>}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{person.role ?? <Ph>{t.careers.role}</Ph>}</p>
            </div>
            <ArrowUpRight className="mt-6 size-5 shrink-0 transition-colors group-hover:text-primary" />
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <div className="grid gap-6 sm:grid-cols-[180px_1fr]">
          <PhImage number={person.number} tone="ink" className="aspect-[3/4] rounded-md" />
          <div>
            <ProvisionalBadge className="mb-3" />
            <DialogTitle className="font-display text-3xl">{person.name ?? <Ph>{name}</Ph>}</DialogTitle>
            <DialogDescription className="mt-1">{person.role ?? t.careers.role}</DialogDescription>
          </div>
        </div>
        <dl className="mt-4 space-y-5">
          {fields.map((f) => (
            <div key={f}>
              <dt className="kicker mb-1.5 text-primary">{f}</dt>
              <dd className="text-sm text-muted-foreground">
                <Ph>{f === t.careers.bio ? t.ph.bio : t.ph.field}</Ph>
              </dd>
            </div>
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  );
}
