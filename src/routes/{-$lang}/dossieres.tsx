import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pageHead, useT } from "@/i18n";
import { MATERIALS, type ShowKind } from "@/content/catalog";
import { FilterChips, PageHero } from "@/components/site/PageHero";
import { Ph, ProvisionalBadge } from "@/components/site/Placeholder";

export const Route = createFileRoute("/{-$lang}/dossieres")({
  head: ({ params }) => pageHead(params.lang, "dossiers"),
  component: Dossiers,
});

function Dossiers() {
  const t = useT();
  const [section, setSection] = useState<ShowKind | "all">("all");
  const sectionLabel: Record<ShowKind, string> = {
    propia: t.nav.shows,
    musica: t.nav.music,
    valconsa: t.nav.valconsa,
  };
  const list = section === "all" ? MATERIALS : MATERIALS.filter((m) => m.section === section);

  return (
    <>
      <PageHero kicker={t.dossiers.kicker} title={t.dossiers.title} lead={t.dossiers.lead} tone="red" />
      <section className="mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-24">
        <FilterChips
          label={t.dossiers.kicker}
          value={section}
          onChange={setSection}
          options={[
            { value: "all", label: t.dossiers.all },
            { value: "propia", label: sectionLabel.propia },
            { value: "musica", label: sectionLabel.musica },
            { value: "valconsa", label: sectionLabel.valconsa },
          ]}
        />
        <ul className="divide-y-2 divide-foreground/10 border-y-2 border-foreground">
          {list.map((m) => (
            <li key={m.id} className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-md bg-ink text-ink-foreground">
                <FileText className="size-6" aria-hidden />
              </span>
              <div className="flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="kicker text-primary">{t.dossiers.types[m.type]}</span>
                  <span className="kicker text-muted-foreground">· {sectionLabel[m.section]}</span>
                  {m.placeholder && <ProvisionalBadge />}
                </div>
                <h2 className="font-display text-xl">{m.title ?? <Ph>{t.ph.dossier}</Ph>}</h2>
              </div>
              {m.fileUrl ? (
                <Button asChild variant="stage">
                  <a href={m.fileUrl} download target="_blank" rel="noopener">
                    <Download /> {t.dossiers.download}
                  </a>
                </Button>
              ) : (
                <Button variant="outlineInk" disabled>
                  <Download /> {t.dossiers.pending}
                </Button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
