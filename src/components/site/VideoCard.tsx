import { Play } from "lucide-react";
import { toEmbedUrl, type Video } from "@/content/catalog";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";
import { Ph } from "./Placeholder";

/** Reprodutor YouTube/Vimeo adaptado a móbiles. */
export function VideoEmbed({ url, title, className }: { url?: string; title: string; className?: string }) {
  const t = useT();
  const embed = url ? toEmbedUrl(url) : null;
  if (!embed) {
    return (
      <div
        className={cn(
          "grain relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-ink text-ink-foreground",
          className,
        )}
      >
        <div className="bg-stage absolute inset-0" />
        <div className="relative flex flex-col items-center gap-3">
          <span className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-red">
            <Play className="size-6 translate-x-0.5" aria-hidden />
          </span>
          <span className="kicker text-ink-muted">{t.ph.video}</span>
        </div>
      </div>
    );
  }
  return (
    <div className={cn("aspect-video overflow-hidden rounded-lg bg-ink", className)}>
      <iframe
        src={embed}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}

export function VideoCard({ video, inverted = false }: { video: Video; inverted?: boolean }) {
  const t = useT();
  return (
    <article className="flex flex-col gap-3">
      <VideoEmbed url={video.url} title={video.title ?? t.ph.video} />
      <span className="kicker text-primary">{t.videos.categories[video.category]}</span>
      <h3 className={cn("font-display text-xl", inverted && "text-ink-foreground")}>
        {video.title ?? <Ph>{t.ph.video}</Ph>}
      </h3>
    </article>
  );
}
