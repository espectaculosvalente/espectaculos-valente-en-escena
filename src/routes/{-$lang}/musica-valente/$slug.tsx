import { createFileRoute, notFound } from "@tanstack/react-router";
import { pageHead } from "@/i18n";
import { findShow } from "@/content/catalog";
import { ShowDetail, ShowNotFound } from "@/components/site/ShowDetail";

export const Route = createFileRoute("/{-$lang}/musica-valente/$slug")({
  loader: ({ params }) => {
    const show = findShow("musica", params.slug);
    if (!show) throw notFound();
    return { show };
  },
  head: ({ params, loaderData }) =>
    pageHead(
      params.lang,
      "music",
      loaderData?.show.title ? { title: `${loaderData.show.title} — Música Valente`, description: loaderData.show.synopsis } : undefined,
    ),
  component: Page,
  notFoundComponent: ShowNotFound,
});

function Page() {
  const { show } = Route.useLoaderData();
  return <ShowDetail show={show} />;
}
