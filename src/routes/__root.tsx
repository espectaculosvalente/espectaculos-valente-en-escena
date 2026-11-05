import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { getDict, HTML_LANG, langParam, parseLangParam, type Lang } from "../i18n";

function langFromPath(pathname: string): Lang {
  const first = pathname.split("/").filter(Boolean)[0];
  return parseLangParam(first === "es" || first === "en" ? first : undefined) ?? "gl";
}

function NotFoundComponent() {
  const { pathname } = useLocation();
  const lang = langFromPath(pathname);
  const t = getDict(lang);
  return (
    <div className="grain relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-4 text-ink-foreground">
      <div className="bg-stage absolute inset-0" />
      <div className="relative max-w-xl text-center">
        <p className="text-outline font-display text-[10rem] leading-none text-primary md:text-[14rem]">404</p>
        <h1 className="display-lg mt-2">{t.notFound.title}</h1>
        <p className="mt-4 text-ink-foreground/80">{t.notFound.text}</p>
        <div className="mt-8">
          <Link
            to="/{-$lang}"
            params={{ lang: langParam(lang) }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary-deep"
          >
            {t.notFound.cta}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl text-foreground">Algo fallou</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Non puidemos cargar esta páxina. Proba de novo ou volve ao inicio.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep"
          >
            Tentar de novo
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border-2 border-foreground px-5 py-2 text-sm font-semibold text-foreground"
          >
            Inicio
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Espectáculos Valente" },
      { name: "theme-color", content: "#141110" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..800,0..100,0..1;1,9..144,300..800,0..100,0..1&family=Instrument+Sans:wght@400..700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const lang = langFromPath(pathname);
  return (
    <html lang={HTML_LANG[lang]}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
