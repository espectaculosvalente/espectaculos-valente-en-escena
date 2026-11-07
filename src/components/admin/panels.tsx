import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LANGS, flattenDict, getDict, type Lang } from "@/i18n";
import { IMAGE_SLOTS, SETTING_FIELDS } from "@/content/image-slots";

type Row = Record<string, any>;

const inputCls =
  "w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary";
const labelCls = "mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground";
const btnPrimary =
  "inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep disabled:opacity-60";
const btnGhost =
  "inline-flex items-center justify-center rounded-full border-2 border-foreground px-4 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background";
const btnDanger =
  "inline-flex items-center justify-center rounded-full border-2 border-primary px-4 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground";

async function uploadToMedia(file: File, prefix: string): Promise<string> {
  const ext = (file.name.split(".").pop() ?? "bin").toLowerCase();
  const path = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { upsert: true });
  if (error) throw new Error(error.message);
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

function Note({ text }: { text: string | null }) {
  if (!text) return null;
  return <p className="rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-primary">{text}</p>;
}

export function TextsPanel() {
  const [lang, setLang] = useState<Lang>("gl");
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("site_texts").select("key, lang, value");
    setLoading(false);
    if (error) {
      setMsg(error.message);
      return;
    }
    const map: Record<string, string> = {};
    for (const r of (data ?? []) as Row[]) map[`${String(r["lang"])}|${String(r["key"])}`] = String(r["value"]);
    setOverrides(map);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const entries = useMemo(() => flattenDict(getDict(lang)), [lang]);

  async function save(key: string, value: string) {
    setMsg(null);
    const { error } =
      value.trim() === ""
        ? await supabase.from("site_texts").delete().eq("key", key).eq("lang", lang)
        : await supabase.from("site_texts").upsert({ key, lang, value }, { onConflict: "key,lang" });
    if (error) setMsg(error.message);
    await load();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {LANGS.map((l) => (
          <button key={l} type="button" onClick={() => setLang(l)} className={l === lang ? btnPrimary : btnGhost}>
            {l.toUpperCase()}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">
          {loading ? "Cargando…" : `${entries.length} textos`} · deixa baleiro para usar o texto orixinal
        </span>
      </div>

      <Note text={msg} />

      <div className="space-y-5">
        {entries.map((entry) => (
          <TextEditRow
            key={entry.key}
            label={entry.key}
            placeholder={entry.value}
            multiline={entry.multiline}
            value={overrides[`${lang}|${entry.key}`] ?? ""}
            onSave={(v) => save(entry.key, v)}
          />
        ))}
      </div>
    </div>
  );
}

function TextEditRow({
  label,
  placeholder,
  value,
  multiline,
  onSave,
}: {
  label: string;
  placeholder: string;
  value: string;
  multiline: boolean;
  onSave: (v: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState(value);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const dirty = draft !== value;

  return (
    <div className="rounded-lg border-2 border-foreground/10 p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <code className="text-[0.7rem] text-muted-foreground">{label}</code>
        {dirty ? (
          <button
            type="button"
            className={btnPrimary}
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              await onSave(draft);
              setBusy(false);
            }}
          >
            {busy ? "Gardando…" : "Gardar"}
          </button>
        ) : null}
      </div>
      {multiline ? (
        <textarea
          className={inputCls}
          rows={3}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
        />
      ) : (
        <input
          className={inputCls}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
        />
      )}
    </div>
  );
}

export function ImagesPanel() {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("site_images").select("key, url");
    if (error) {
      setMsg(error.message);
      return;
    }
    const map: Record<string, string> = {};
    for (const r of (data ?? []) as Row[]) map[String(r["key"])] = String(r["url"]);
    setUrls(map);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(key: string, url: string) {
    setMsg(null);
    const { error } = url.trim()
      ? await supabase.from("site_images").upsert({ key, url: url.trim() }, { onConflict: "key" })
      : await supabase.from("site_images").delete().eq("key", key);
    if (error) setMsg(error.message);
    await load();
  }

  return (
    <div className="space-y-4">
      <Note text={msg} />
      <div className="grid gap-4 md:grid-cols-2">
        {IMAGE_SLOTS.map((slot) => {
          const value = urls[slot.key] ?? "";
          const shown = value || slot.fallback || "";
          return (
            <div key={slot.key} className="rounded-lg border-2 border-foreground/10 p-4">
              <p className="mb-2 text-sm font-semibold">{slot.label}</p>
              {shown ? (
                <img src={shown} alt={slot.label} className="mb-3 h-32 w-full rounded-md object-cover" />
              ) : (
                <div className="mb-3 flex h-32 items-center justify-center rounded-md bg-foreground/5 text-xs text-muted-foreground">
                  Sen foto
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <label className={btnGhost}>
                  Subir foto
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setBusy(slot.key);
                      try {
                        const url = await uploadToMedia(file, "slots");
                        await save(slot.key, url);
                      } catch (err) {
                        setMsg(err instanceof Error ? err.message : "Non se puido subir a imaxe.");
                      }
                      setBusy(null);
                    }}
                  />
                </label>
                {busy === slot.key ? <span className="text-xs text-muted-foreground">Subindo…</span> : null}
                {value ? (
                  <button type="button" className={btnDanger} onClick={() => save(slot.key, "")}>
                    Quitar
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SettingsPanel() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("site_settings").select("key, value");
    if (error) {
      setMsg(error.message);
      return;
    }
    const map: Record<string, string> = {};
    for (const r of (data ?? []) as Row[]) map[String(r["key"])] = String(r["value"]);
    setValues(map);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveAll() {
    setBusy(true);
    setMsg(null);
    const rows = SETTING_FIELDS.map((f) => ({ key: f.key, value: values[f.key] ?? "" }));
    const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
    setBusy(false);
    if (error) {
      setMsg(error.message);
      return;
    }
    setMsg("Gardado. Xa se ve na web.");
    await load();
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Note text={msg} />
      {SETTING_FIELDS.map((f) => (
        <div key={f.key} className="mb-4">
          <label className={labelCls}>{f.label}</label>
          <input
            className={inputCls}
            placeholder={f.placeholder}
            value={values[f.key] ?? ""}
            onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
          />
        </div>
      ))}
      <button type="button" className={btnPrimary} onClick={saveAll} disabled={busy}>
        {busy ? "Gardando…" : "Gardar datos de contacto"}
      </button>
    </div>
  );
}

export function MessagesPanel() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) setMsg(error.message);
    else setRows((data ?? []) as Row[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-4">
      <Note text={msg} />
      {loading ? <p className="text-sm text-muted-foreground">Cargando…</p> : null}
      {!loading && rows.length === 0 ? <p className="text-sm text-muted-foreground">Non hai consultas aínda.</p> : null}
      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={String(row["id"])}
            className={`rounded-lg border-2 p-4 ${row["is_read"] ? "border-foreground/10" : "border-primary/50"}`}
          >
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">
                {String(row["name"])} {row["entity"] ? `· ${String(row["entity"])}` : ""}
              </p>
              <p className="text-xs text-muted-foreground">
                {row["created_at"] ? new Date(String(row["created_at"])).toLocaleString("gl-ES") : ""}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {String(row["email"])}
              {row["phone"] ? ` · ${String(row["phone"])}` : ""}
              {row["show_name"] ? ` · ${String(row["show_name"])}` : ""}
            </p>
            <p className="mt-3 whitespace-pre-line text-sm">{String(row["message"])}</p>
            {!row["is_read"] ? (
              <button
                type="button"
                className={`${btnGhost} mt-3`}
                onClick={async () => {
                  const { error } = await supabase
                    .from("contact_messages")
                    .update({ is_read: true })
                    .eq("id", row["id"] as string);
                  if (error) setMsg(error.message);
                  else await load();
                }}
              >
                Marcar como lida
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
