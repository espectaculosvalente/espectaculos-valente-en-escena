import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useLangParams, useT } from "@/i18n";
import { LangSwitcher } from "./LangSwitcher";
import { Wordmark } from "./Wordmark";
import { NAV_ITEMS } from "./nav";

export function SiteHeader() {
  const t = useT();
  const lp = useLangParams();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-4 md:px-8">
        <Link to="/{-$lang}" params={lp} className="shrink-0" aria-label="Espectáculos Valente — Inicio">
          <Wordmark />
        </Link>

        <nav aria-label="Principal" className="ml-6 hidden flex-1 items-center gap-0.5 xl:flex">
          {NAV_ITEMS.slice(1, 8).map((item) => (
            <Link
              key={item.key}
              to={item.to}
              params={lp}
              className="rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {t.nav[item.key]}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <LangSwitcher className="hidden sm:flex" />
          <Button asChild variant="stage" className="px-5">
            <Link to="/{-$lang}/contacto" params={lp}>
              {t.nav.booking}
            </Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="xl:hidden" aria-label={t.nav.menu}>
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-full flex-col bg-ink text-ink-foreground sm:max-w-sm">
              <SheetHeader>
                <SheetTitle className="text-left text-ink-foreground">
                  <Wordmark inverted />
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Móbil" className="flex flex-col gap-1 px-4">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.key}
                    to={item.to}
                    params={lp}
                    onClick={() => setOpen(false)}
                    activeOptions={{ exact: item.key === "home" }}
                    className="border-b border-ink-border py-3 font-display text-2xl transition-colors hover:text-primary"
                    activeProps={{ className: "text-primary" }}
                  >
                    {t.nav[item.key]}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto p-4">
                <LangSwitcher inverted />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
