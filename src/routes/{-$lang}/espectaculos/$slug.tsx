import { createFileRoute, notFound } from "@tanstack/react-router";
import { pageHead } from "@/i18n";
import { findShow } from "@/content/catalog";
import { ShowDetail, ShowNotFound } from "@/components/site/ShowDetail";

export const Route = createFileRoute("/{-$lang}/espectaculos/$slug")({
  loader: ({ params }) => {
    const show = findShow("propia", params.slug);
    if (!show) throw notFound();
    return { show };
  },
  head: ({ params, loaderData }) =>
    pageHead(
      params.lang,
      "show",
      loaderData?.show.title ? { title: `${loaderData.show.title} — Espectáculos Valente`, description: loaderData.show.synopsis } : undefined,
    ),
  component: Page,
  notFoundComponent: ShowNotFound,
});

function Page() {
  const { show } = Route.useLoaderData();
  return <ShowDetail show={show} />;
}
