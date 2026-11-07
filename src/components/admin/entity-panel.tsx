import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LANGS, flattenDict, getDict, type Lang } from "@/i18n";
import { IMAGE_SLOTS, SETTING_FIELDS } from "@/content/image-slots";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel de xestión — Espectáculos Valente" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

type Row = Record<string, any>;
type Content = Record<string, Record<string, string>>;

const inputCls =
  "w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary";
const labelCls = "mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground";
const btnPrimary =
  "inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep disabled:opacity-60";
const btnGhost =
  "inline-flex items-center justify-center rounded-full border-2 border-foreground px-4 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background";
const btnDanger =
  "inline-flex items-center justify-center rounded-full border-2 border-primary px-4 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground";

function emptyContent(): Content {
  const out: Content = {};
  for (const l of LANGS) out[l] = {};
  return out;
}

function normalizeContent(value: unknown): Content {
  const base = emptyContent();
  if (!value || typeof value !== "object") return base;
  for (const l of LANGS) {
    const part = (value as Record<string, unknown>)[l];
    if (part && typeof part === "object") {
      for (const [k, v] of Object.entries(part as Record<string, unknown>)) {
        if (typeof v === "string") base[l]![k] = v;
      }
    }
  }
  return base;
}

async function uploadToMedia(file: File, prefix: string): Promise<string> {
  const ext = (file.name.split(".").pop() ?? "bin").toLowerCase();
  const path = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { upsert: true });
  if (error) throw new Error(error.message);
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

function TextField({
  label,
  value,
  onChange,
  multiline,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <div className="mb-4">
      <label className={labelCls}>{label}</label>
      {multiline ? (
        <textarea className={inputCls} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function I18nField({
  label,
  field,
  content,
  onChange,
  multiline,
}: {
  label: string;
  field: string;
  content: Content;
  onChange: (lang: Lang, field: string, value: string) => void;
  multiline?: boolean;
}) {
  return (
    <div className="mb-4">
      <p className={labelCls}>{label}</p>
      <div className="space-y-2">
        {LANGS.map((l) => (
          <div key={l} className="flex items-start gap-2">
            <span className="mt-2 w-5 text-[0.65rem] font-bold uppercase text-primary">{l}</span>
            {multiline ? (
              <textarea
                className={inputCls}
                rows={2}
                value={content[l]?.[field] ?? ""}
                onChange={(e) => onChange(l, field, e.target.value)}
              />
            ) : (
              <input
                className={inputCls}
                value={content[l]?.[field] ?? ""}
                onChange={(e) => onChange(l, field, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

type FieldSpec =
  | { kind: "text"; name: string; label: string }
  | { kind: "textarea"; name: string; label: string }
  | { kind: "bool"; name: string; label: string }
  | { kind: "number"; name: string; label: string }
  | { kind: "select"; name: string; label: string; options: string[] }
  | { kind: "lines"; name: string; label: string }
  | { kind: "i18n"; name: string; label: string; multiline?: boolean };

function EntityPanel({
  table,
  singular,
  fields,
  titleOf,
}: {
  table: string;
  singular: string;
  fields: FieldSpec[];
  titleOf: (row: Row) => string;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [form, setForm] = useState<Row | null>(null);
  const [content, setContent] = useState<Content>(emptyContent());
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from(table).select("*").order("sort_order", { ascending: true });
    setLoading(false);
    if (error) setMsg(error.message);
    else setRows((data ?? []) as Row[]);
  }, [table]);

  useEffect(() => {
    void load();
  }, [load]);

  function startNew() {
    const base: Row = { status: "draft", sort_order: 0 };
    for (const f of fields) {
      if (f.kind === "bool") base[f.name] = false;
      else if (f.kind === "number") base[f.name] = 0;
      else if (f.kind === "select") base[f.name] = f.options[0] ?? "";
      else if (f.kind !== "i18n") base[f.name] = "";
    }
    setContent(emptyContent());
    setForm(base);
    setMsg(null);
  }

  function startEdit(row: Row) {
    const copy: Row = { ...row };
    for (const f of fields) {
      if (f.kind === "lines") copy[f.name] = Array.isArray(row[f.name]) ? (row[f.name] as string[]).join("\n") : "";
    }
    setContent(normalizeContent(row["content"]));
    setForm(copy);
    setMsg(null);
  }

  function setField(name: string, value: unknown) {
    setForm((prev) => (prev ? { ...prev, [name]: value } : prev));
  }

  function setI18n(lang: Lang, field: string, value: string) {
    setContent((prev) => ({ ...prev, [lang]: { ...(prev[lang] ?? {}), [field]: value } }));
  }

  async function save() {
    if (!form) return;
    setBusy(true);
    setMsg(null);
    const payload: Row = {};
    for (const f of fields) {
      if (f.kind === "i18n") continue;
      const raw = form[f.name];
      if (f.kind === "bool") payload[f.name] = Boolean(raw);
      else if (f.kind === "number") payload[f.name] = Number(raw) || 0;
      else if (f.kind === "lines")
        payload[f.name] = String(raw ?? "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      else payload[f.name] = raw === "" || raw === undefined ? null : raw;
    }
    payload["content"] = content;

    const res = form["id"]
      ? await supabase.from(table).update(payload).eq("id", form["id"] as string)
      : await supabase.from(table).insert(payload);
    setBusy(false);
    if (res.error) {
      setMsg(res.error.message);
      return;
    }
    setForm(null);
    await load();
  }

  async function remove(row: Row) {
    if (!window.confirm(`Borrar «${titleOf(row)}»? Esta acción non se pode desfacer.`)) return;
    const { error } = await supabase.from(table).delete().eq("id", row["id"] as string);
    if (error) setMsg(error.message);
    else await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {loading ? "Cargando…" : `${rows.length} ${rows.length === 1 ? "rexistro" : "rexistros"}`}
        </p>
        <button type="button" className={btnPrimary} onClick={startNew}>
          + Engadir {singular}
        </button>
      </div>

      {msg ? <p className="rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-primary">{msg}</p> : null}

      {form ? (
        <div className="rounded-lg border-2 border-foreground/15 p-5">
          <h3 className="mb-4 font-display text-2xl">{form["id"] ? `Editar ${singular}` : `Novo ${singular}`}</h3>
          <div className="grid gap-x-6 md:grid-cols-2">
            {fields.map((f) =>
              f.kind === "i18n" ? (
                <div key={f.name} className="md:col-span-2">
                  <I18nField label={f.label} field={f.name} content={content} onChange={setI18n} multiline={f.multiline} />
                </div>
              ) : f.kind === "bool" ? (
                <label key={f.name} className="mb-4 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(form[f.name])}
                    onChange={(e) => setField(f.name, e.target.checked)}
                  />
                  {f.label}
                </label>
              ) : f.kind === "select" ? (
                <div key={f.name} className="mb-4">
                  <label className={labelCls}>{f.label}</label>
                  <select
                    className={inputCls}
                    value={String(form[f.name] ?? "")}
                    onChange={(e) => setField(f.name, e.target.value)}
                  >
                    {f.options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              ) : f.kind === "textarea" ? (
                <div key={f.name} className="md:col-span-2">
                  <TextField
                    label={f.label}
                    value={String(form[f.name] ?? "")}
                    onChange={(v) => setField(f.name, v)}
                    multiline
                    rows={4}
                  />
                </div>
              ) : f.kind === "lines" ? (
                <div key={f.name} className="md:col-span-2">
                  <TextField
                    label={`${f.label} (unha por liña)`}
                    value={String(form[f.name] ?? "")}
                    onChange={(v) => setField(f.name, v)}
                    multiline
                    rows={4}
                  />
                </div>
              ) : (
                <div key={f.name}>
                  <TextField label={f.label} value={String(form[f.name] ?? "")} onChange={(v) => setField(f.name, v)} />
                </div>
              ),
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-3">
            <button type="button" className={btnPrimary} onClick={save} disabled={busy}>
              {busy ? "Gardando…" : "Gardar"}
            </button>
            <button type="button" className={btnGhost} onClick={() => setForm(null)}>
              Cancelar
            </button>
          </div>
        </div>
      ) : null}

      <div className="divide-y divide-foreground/10 rounded-lg border-2 border-foreground/15">
        {rows.map((row) => (
          <div key={String(row["id"])} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate font-semibold">{titleOf(row)}</p>
              <p className="text-xs text-muted-foreground">
                {String(row["slug"] ?? "")} · {String(row["status"] ?? "")}
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" className={btnGhost} onClick={() => startEdit(row)}>
                Editar
              </button>
              <button type="button" className={btnDanger} onClick={() => remove(row)}>
                Borrar
              </button>
            </div>
          </div>
        ))}
        {!loading && rows.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">Aínda non hai nada. Empeza con «Engadir».</p>
        ) : null}
      </div>
    </div>
  );
}
