import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { useLangParams, useT } from "@/i18n";
import { useSettings } from "@/lib/use-content";
import { SOCIAL_KEYS, SOCIAL_LABELS } from "@/content/image-slots";
import { Ph } from "./Placeholder";
import { Wordmark } from "./Wordmark";
import { LangSwitcher } from "./LangSwitcher";
import { NAV_ITEMS } from "./nav";

export function SiteFooter() {
  const t = useT();
  const lp = useLangParams();
  const s = useSettings();
  const year = new Date().getFullYear();
  const socials = SOCIAL_KEYS.filter((k) => s[k]);

  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="bunting" aria-hidden />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div className="space-y-5">
          <Wordmark inverted className="h-20" />
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
          <p className="flex items-center gap-2">
            <Mail className="size-4 text-primary" />
            {s["email"] ? <a href={`mailto:${s["email"]}`} className="hover:text-primary">{s["email"]}</a> : <Ph>{t.ph.email}</Ph>}
          </p>
          <p className="flex items-center gap-2">
            <Phone className="size-4 text-primary" />
            {s["phone"] ? <a href={`tel:${s["phone"].replace(/\s/g, "")}`} className="hover:text-primary">{s["phone"]}</a> : <Ph>{t.ph.phone}</Ph>}
          </p>
          {s["location"] && (
            <p className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" /> {s["location"]}
            </p>
          )}
          {socials.length > 0 ? (
            <ul className="flex flex-wrap gap-2 pt-2">
              {socials.map((k) => (
                <li key={k}>
                  <a href={s[k]} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full border border-ink-border px-3 py-1 text-xs hover:border-primary hover:text-primary">
                    {SOCIAL_LABELS[k]}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p><Ph>{t.ph.social}</Ph></p>
          )}
        </div>
      </div>
      <div className="border-t border-ink-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-ink-muted md:flex-row md:items-center md:justify-between md:px-8">
          <span>© {year} Espectáculos Valente. {t.footer.rights}</span>
          <div className="flex gap-5">
            <Link to="/{-$lang}/aviso-legal" params={lp} className="hover:text-ink-foreground">
              {t.footer.legal}
            </Link>
            <Link to="/auth" className="hover:text-ink-foreground">
              {t.footer.team}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
