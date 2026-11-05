import { Link } from "@tanstack/react-router";
import { useLangParams, useT } from "@/i18n";
import { Ph } from "./Placeholder";
import { Wordmark } from "./Wordmark";
import { LangSwitcher } from "./LangSwitcher";
import { NAV_ITEMS } from "./nav";

export function SiteFooter() {
  const t = useT();
  const lp = useLangParams();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="bunting" aria-hidden />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div className="space-y-5">
          <Wordmark inverted className="scale-125 origin-left" />
          <p className="max-w-sm font-display text-2xl italic leading-snug text-ink-foreground/90">
            {t.footer.tagline}
          </p>
          <LangSwitcher inverted />
        </div>

        <div>
          <h2 className="kicker mb-4 font-sans text-ink-muted">{t.footer.navTitle}</h2>
          <ul className="grid grid-cols-1 gap-2 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link to={item.to} params={lp} className="text-ink-foreground/80 hover:text-primary">
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3 text-sm">
          <h2 className="kicker mb-4 font-sans text-ink-muted">{t.footer.contactTitle}</h2>
          <p><Ph>{t.ph.email}</Ph></p>
          <p><Ph>{t.ph.phone}</Ph></p>
          <p><Ph>{t.ph.social}</Ph></p>
        </div>
      </div>
      <div className="border-t border-ink-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-ink-muted md:flex-row md:items-center md:justify-between md:px-8">
          <span>© {year} Espectáculos Valente. {t.footer.rights}</span>
          <Link to="/{-$lang}/aviso-legal" params={lp} className="hover:text-ink-foreground">
            {t.footer.legal}
          </Link>
        </div>
      </div>
    </footer>
  );
}
