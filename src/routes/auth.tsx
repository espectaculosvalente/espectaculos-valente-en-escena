import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acceso do equipo — Espectáculos Valente" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (data.session) navigate({ to: "/admin", replace: true });
      })
      .catch(() => undefined);
  }, [navigate]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (authError) {
      setError("Correo ou contrasinal incorrectos.");
      return;
    }
    navigate({ to: "/admin", replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-12 text-ink-foreground">
      <div className="w-full max-w-sm">
        <p className="kicker mb-2 text-primary">Espectáculos Valente</p>
        <h1 className="font-display text-4xl">Área do equipo</h1>
        <p className="mt-2 text-sm text-ink-foreground/70">
          Entra coa túa conta para editar o contido da web.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-semibold uppercase tracking-wide">
              Correo
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-ink-border bg-ink-foreground/5 px-3 py-2 text-sm text-ink-foreground outline-none focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-xs font-semibold uppercase tracking-wide">
              Contrasinal
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-ink-border bg-ink-foreground/5 px-3 py-2 text-sm text-ink-foreground outline-none focus:border-primary"
            />
          </div>

          {error ? (
            <p role="alert" className="rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-primary">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary-deep disabled:opacity-60"
          >
            {busy ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-ink-foreground/60">
          <Link to="/{-$lang}" params={{ lang: undefined }} className="hover:text-primary">
            ← Volver á web
          </Link>
        </p>
      </div>
    </div>
  );
}
