import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AlertTriangle, CheckCircle2, Mail, MapPin, Phone, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/lib/use-content";
import { SOCIAL_KEYS, SOCIAL_LABELS } from "@/content/image-slots";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { pageHead, useLang, useT } from "@/i18n";
import type { Dict } from "@/i18n/gl";
import { PageHero } from "@/components/site/PageHero";
import { Ph } from "@/components/site/Placeholder";

const searchSchema = z.object({ espectaculo: z.string().max(200).optional() });

export const Route = createFileRoute("/{-$lang}/contacto")({
  validateSearch: (s) => searchSchema.parse(s),
  head: (ctx) => pageHead(ctx, "contact"),
  component: Contact,
});

function makeSchema(t: Dict) {
  return z.object({
    name: z.string().trim().min(1, t.contact.errors.name).max(120),
    entity: z.string().trim().max(160).optional(),
    email: z.string().trim().email(t.contact.errors.email).max(200),
    phone: z.string().trim().max(40).optional(),
    show: z.string().trim().max(200).optional(),
    message: z.string().trim().min(10, t.contact.errors.message).max(3000),
    privacy: z.literal(true, { errorMap: () => ({ message: t.contact.errors.privacy }) }),
  });
}

type Errors = Partial<Record<"name" | "email" | "message" | "privacy", string>>;

function Contact() {
  const t = useT();
  const { espectaculo } = Route.useSearch();
  const [errors, setErrors] = useState<Errors>({});
  const [privacy, setPrivacy] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const lang = useLang();
  const s = useSettings();
  const socials = SOCIAL_KEYS.filter((k) => s[k]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    // Antispam: campo oculto que só cobren os bots.
    if (fd.get("website")) return;
    const res = makeSchema(t).safeParse({
      name: fd.get("name"),
      entity: fd.get("entity") || undefined,
      email: fd.get("email"),
      phone: fd.get("phone") || undefined,
      show: fd.get("show") || undefined,
      message: fd.get("message"),
      privacy,
    });
    if (!res.success) {
      const next: Errors = {};
      for (const issue of res.error.issues) {
        const k = issue.path[0] as keyof Errors;
        if (!next[k]) next[k] = issue.message;
      }
      setErrors(next);
      setState("idle");
      return;
    }
    setErrors({});
    setState("sending");
    const v = res.data;
    const { error } = await supabase.from("contact_messages").insert({
      name: v.name,
      entity: v.entity ?? null,
      email: v.email,
      phone: v.phone ?? null,
      show_name: v.show ?? null,
      message: v.message,
      lang,
    });
    if (error) {
      console.error("contact insert:", error.message);
      setState("error");
      return;
    }
    form.reset();
    setPrivacy(false);
    setState("sent");
  }

  return (
    <>
      <PageHero kicker={t.contact.kicker} title={t.contact.title} lead={t.contact.lead} tone="red" />
      <section className="mx-auto grid max-w-7xl gap-14 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-[1.4fr_1fr]">
        <form noValidate onSubmit={onSubmit} className="grid gap-6 sm:grid-cols-2">
          <Field id="name" label={t.contact.name} required error={errors.name} requiredLabel={t.contact.required}>
            <Input id="name" name="name" autoComplete="name" maxLength={120} aria-invalid={!!errors.name} />
          </Field>
          <Field id="entity" label={t.contact.entity}>
            <Input id="entity" name="entity" autoComplete="organization" maxLength={160} />
          </Field>
          <Field id="email" label={t.contact.email} required error={errors.email} requiredLabel={t.contact.required}>
            <Input id="email" name="email" type="email" autoComplete="email" maxLength={200} aria-invalid={!!errors.email} />
          </Field>
          <Field id="phone" label={t.contact.phone}>
            <Input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={40} />
          </Field>
          <Field id="show" label={t.contact.show} className="sm:col-span-2">
            <Input id="show" name="show" defaultValue={espectaculo ?? ""} maxLength={200} />
          </Field>
          <Field id="message" label={t.contact.message} required error={errors.message} requiredLabel={t.contact.required} className="sm:col-span-2">
            <Textarea id="message" name="message" rows={6} maxLength={3000} aria-invalid={!!errors.message} />
          </Field>
          <div className="hidden" aria-hidden>
            <label htmlFor="website">Website</label>
            <input id="website" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <div className="sm:col-span-2">
            <div className="flex items-center gap-3">
              <Checkbox id="privacy" checked={privacy} onCheckedChange={(v) => setPrivacy(v === true)} aria-invalid={!!errors.privacy} />
              <Label htmlFor="privacy" className="text-sm font-normal">{t.contact.privacy}</Label>
            </div>
            {errors.privacy && <p className="mt-2 text-sm text-destructive">{errors.privacy}</p>}
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" variant="stage" size="xl" disabled={state === "sending"}>
              {state === "sending" ? t.contact.sending : t.contact.submit}
            </Button>
          </div>
          {state === "sent" && (
            <div role="status" className="flex gap-3 rounded-lg border-2 border-foreground bg-paper p-5 sm:col-span-2">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="font-semibold">{t.contact.sentTitle}</p>
                <p className="text-sm text-muted-foreground">{t.contact.sentText}</p>
              </div>
            </div>
          )}
          {state === "error" && (
            <div role="alert" className="flex gap-3 rounded-lg border-2 border-destructive p-5 sm:col-span-2">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
              <div>
                <p className="font-semibold">{t.contact.failTitle}</p>
                <p className="text-sm text-muted-foreground">{t.contact.failText}</p>
              </div>
            </div>
          )}
        </form>

        <aside className="h-fit space-y-6 rounded-lg bg-ink p-8 text-ink-foreground">
          <h2 className="font-display text-3xl">{t.contact.directTitle}</h2>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <Mail className="size-4 text-primary" />
              {s["email"] ? <a href={`mailto:${s["email"]}`} className="hover:text-primary">{s["email"]}</a> : <Ph>{t.ph.email}</Ph>}
            </li>
            <li className="flex items-center gap-3">
              <Phone className="size-4 text-primary" />
              {s["phone"] ? <a href={`tel:${s["phone"].replace(/\s/g, "")}`} className="hover:text-primary">{s["phone"]}</a> : <Ph>{t.ph.phone}</Ph>}
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="size-4 text-primary" /> {s["location"] ? s["location"] : <Ph>{t.ph.location}</Ph>}
            </li>
            <li className="flex items-start gap-3">
              <Share2 className="mt-0.5 size-4 text-primary" />
              {socials.length > 0 ? (
                <span className="flex flex-wrap gap-2">
                  {socials.map((k) => (
                    <a key={k} href={s[k]} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                      {SOCIAL_LABELS[k]}
                    </a>
                  ))}
                </span>
              ) : (
                <Ph>{t.ph.social}</Ph>
              )}
            </li>
          </ul>
          <div className="bunting" aria-hidden />
        </aside>
      </section>
    </>
  );
}

function Field({
  id,
  label,
  required,
  requiredLabel,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  requiredLabel?: string;
  error?: string | undefined;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-2 flex items-center gap-2 font-semibold">
        {label}
        {required && <span className="kicker text-[0.6rem] text-primary">· {requiredLabel}</span>}
      </Label>
      {children}
      {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
    </div>
  );
}
