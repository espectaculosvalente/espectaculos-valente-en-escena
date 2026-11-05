import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { LANGS, switchLangPath, useLang, useT, getDict } from "@/i18n";

/** Galego primeiro e destacado; castelán e inglés como secundarios. */
export function LangSwitcher({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  const lang = useLang();
  const t = useT();
  const { pathname } = useLocation();

  return (
    <nav aria-label={t.nav.language} className={cn("flex items-center gap-1 text-xs font-semibold", className)}>
      {LANGS.map((l, i) => {
        const active = l === lang;
        return (
          <span key={l} className="flex items-center gap-1">
            {i > 0 && <span className={inverted ? "text-ink-muted/50" : "text-border"} aria-hidden>/</span>}
            <Link
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              to={switchLangPath(pathname, l) as any}
              hrefLang={l}
              lang={l}
              aria-current={active ? "true" : undefined}
              title={getDict(l).langName}
              className={cn(
                "rounded-full px-2 py-1 uppercase tracking-wider transition-colors",
                l === "gl" && "text-sm",
                active
                  ? "bg-primary text-primary-foreground"
                  : inverted
                    ? "text-ink-muted hover:text-ink-foreground"
                    : "text-muted-foreground hover:text-foreground",
              )}
            >
              {l}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
