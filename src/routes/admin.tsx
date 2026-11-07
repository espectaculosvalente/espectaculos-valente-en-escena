import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ImagesPanel, MessagesPanel, SettingsPanel, TextsPanel } from "@/components/admin/panels";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel de xestión — Espectáculos Valente" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

const btnPrimary =
  "inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep disabled:opacity-60";
const btnGhost =
  "inline-flex items-center justify-center rounded-full border-2 border-foreground px-4 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background";

const TABS = [
  { id: "texts", label: "Textos" },
  { id: "images", label: "Fotografías" },
  { id: "settings", label: "Contacto" },
  { id: "messages", label: "Consultas" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function AdminPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<"loading" | "anon" | "denied" | "ok">("loading");
  const [tab, setTab] = useState<TabId>("texts");

  useEffect(() => {
    let active = true;
    async function check() {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      if (!data.session) {
        setState("anon");
        return;
      }
      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.session.user.id);
      if (!active) return;
      if (error) {
        setState("denied");
        return;
      }
      setState((roles ?? []).length > 0 ? "ok" : "denied");
    }
    check().catch(() => {
      if (active) setState("anon");
    });
    return () => {
      active = false;
    };
  }, []);

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Cargando…</p>
      </div>
    );
  }

  if (state !== "ok") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-4 text-center text-ink-foreground">
        <div className="max-w-md">
          <h1 className="font-display text-3xl">{state === "anon" ? "Necesitas entrar" : "Sen permiso"}</h1>
          <p className="mt-3 text-sm text-ink-foreground/70">
            {state === "anon"
              ? "Esta é unha área privada do equipo."
              : "A túa conta non ten acceso ao panel. Pide que che dean de alta como membro do equipo."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {state === "anon" ? (
              <Link
                to="/auth"
                className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary-deep"
              >
                Entrar
              </Link>
            ) : null}
            <button
              type="button"
              className="rounded-full border-2 border-ink-foreground/40 px-6 py-3 font-semibold"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/auth", replace: true });
              }}
            >
              Saír
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b-2 border-foreground/15 bg-ink text-ink-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <p className="kicker text-primary">Espectáculos Valente</p>
            <h1 className="font-display text-2xl">Panel de xestión</h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/{-$lang}" params={{ lang: undefined }} className="hover:text-primary">
              Ver a web
            </Link>
            <button
              type="button"
              className="rounded-full border-2 border-ink-foreground/40 px-4 py-1.5 font-semibold"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/auth", replace: true });
              }}
            >
              Saír
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <nav className="mb-8 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={t.id === tab ? btnPrimary : btnGhost}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "texts" ? <TextsPanel /> : null}
        {tab === "images" ? <ImagesPanel /> : null}
        {tab === "settings" ? <SettingsPanel /> : null}
        {tab === "messages" ? <MessagesPanel /> : null}
      </div>
    </div>
  );
}
