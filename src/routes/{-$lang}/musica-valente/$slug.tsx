import { createFileRoute, notFound } from "@tanstack/react-router";
import { pageHead } from "@/i18n";
import { placeholderShows } from "@/content/catalog";
import { publicSiteQuery } from "@/lib/site-data";
import { useShows } from "@/lib/use-content";
import { ShowDetail, ShowNotFound } from "@/components/site/ShowDetail";

export const Route = createFileRoute("/{-$lang}/musica-valente/$slug")({
  loader: async ({ context, params }) => {
    const site = await context.queryClient.ensureQueryData(publicSiteQuery);
    const rows = site.shows.filter((s) => s.kind === "musica");
    const exists = rows.length
      ? rows.some((s) => s.slug === params.slug)
      : placeholderShows("musica").some((s) => s.slug === params.slug);
    if (!exists) throw notFound();
    return null;
  },
  head: (ctx) => pageHead(ctx, "show"),
  component: Page,
  notFoundComponent: ShowNotFound,
});

function Page() {
  const { slug } = Route.useParams();
  const show = useShows("musica").find((s) => s.slug === slug);
  if (!show) return <ShowNotFound />;
  return <ShowDetail show={show} />;
}
