import { createFileRoute, notFound } from "@tanstack/react-router";
import { pageHead } from "@/i18n";
import { findShow } from "@/content/catalog";
import { ShowDetail, ShowNotFound } from "@/components/site/ShowDetail";

export const Route = createFileRoute("/{-$lang}/valconsa/$slug")({
  loader: ({ params }) => {
    const show = findShow("valconsa", params.slug);
    if (!show) throw notFound();
    return { show };
  },
  head: ({ params, loaderData }) =>
    pageHead(
      params.lang,
      "valconsa",
      loaderData?.show.title ? { title: `${loaderData.show.title} — VALCONSA`, description: loaderData.show.synopsis } : undefined,
    ),
  component: Page,
  notFoundComponent: ShowNotFound,
});

function Page() {
  const { show } = Route.useLoaderData();
  return <ShowDetail show={show} />;
}
