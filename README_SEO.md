# SEO Integration

This project pulls Yoast SEO data from WordPress via WPGraphQL.

## Usage

1. Queries in `lib/wp.ts` use type‑specific fragments like `SeoFieldsOnPost`, `SeoFieldsOnPage`, `SeoFieldsOnCategory`, `SeoFieldsOnTag` and `SeoFieldsOnUser` to request SEO fields.
2. `normalizeSeo` in `lib/seo.ts` merges WordPress data with fallbacks and fixes URLs.
3. `seoToMetadata` converts the normalized object into Next.js `Metadata` used by `generateMetadata` in each route.
4. The `Seo` component renders JSON-LD and pagination `<link>` tags.

## Adding SEO to new routes

- Fetch the `seo` field using the appropriate `SeoFieldsOn*` fragment.
- In the route, call `normalizeSeo` with content title/excerpt, url and site info.
- Export `generateMetadata` returning `seoToMetadata`.
- Render `<Seo jsonLd={...} />` with the JSON‑LD for the page.

All URLs are normalized to be absolute and meta tags avoid duplicates.
