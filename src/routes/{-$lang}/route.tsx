import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { parseLangParam, useT } from "@/i18n";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

// Galego sen prefixo; /es e /en para os idiomas secundarios.
export const Route = createFileRoute("/{-$lang}")({
  beforeLoad: ({ params }) => {
    if (parseLangParam(params.lang) === null) throw notFound();
  },
  component: LangLayout,
});

function LangLayout() {
  const t = useT();
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#contido"
        className="sr-only z-50 rounded bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {t.skip}
      </a>
      <SiteHeader />
      <main id="contido" className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
