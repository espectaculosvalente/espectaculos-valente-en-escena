import { createFileRoute } from "@tanstack/react-router";
import { pageHead, useT } from "@/i18n";
import { Ph } from "@/components/site/Placeholder";

export const Route = createFileRoute("/{-$lang}/aviso-legal")({
  head: (ctx) => pageHead(ctx, "legal"),
  component: Legal,
});

function Legal() {
  const t = useT();
  const [ph, rest] = t.legal.text.split("] ");
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 md:px-8 md:py-28">
      <h1 className="display-lg mb-10">{t.legal.title}</h1>
      <p className="leading-relaxed text-muted-foreground">
        <Ph>{ph}]</Ph> {rest}
      </p>
    </section>
  );
}
