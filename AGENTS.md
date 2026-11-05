<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Project rules
- i18n: all pages live under `src/routes/{-$lang}/`; Galician has no prefix, secondary languages use `/es` and `/en`. The layout route rejects any other prefix with notFound. Why: primary language at clean URLs, crawlable per-language pages.
- UI strings live in `src/i18n/{gl,es,en}.ts` (gl is the source `Dict` type); never hardcode user-facing text in components. Why: no mixed languages on a page.
- Each page's `head()` uses `pageHead(params.lang, key)` from `src/i18n`. Why: translated, unique metadata per language.
- Links pass `params={useLangParams()}` to keep the current language.
- Provisional content in `src/content/catalog.ts` is placeholder-only (`placeholder: true`, rendered via `<Ph>`); it will be replaced by the database-backed CMS. Why: the brief forbids invented company data.
