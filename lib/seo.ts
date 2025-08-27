export type WPSeo = {
  title?: string | null;
  metaDesc?: string | null;
  canonical?: string | null;
  robots?: string | null;
  opengraphType?: string | null;
  opengraphTitle?: string | null;
  opengraphDescription?: string | null;
  opengraphImage?: { sourceUrl?: string | null } | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: { sourceUrl?: string | null } | null;
  breadcrumbs?: { text: string; url: string }[] | null;
  schema?: { raw?: string | null } | null;
};

export function normalizeSeo(input: {
  seo?: WPSeo | null;
  wpTitle?: string;
  wpExcerpt?: string;
  url?: string;
  siteName?: string;
  siteUrl?: string;
}) {
  const { seo, wpTitle, wpExcerpt, url, siteName, siteUrl } = input;
  const title = seo?.title ?? wpTitle ?? siteName ?? '';
  const description = (seo?.metaDesc ?? wpExcerpt ?? '')
    .replace(/<[^>]*>?/gm, '')
    .slice(0, 160);
  const canonical =
    seo?.canonical ??
    (url?.startsWith('http') ? url : `${siteUrl ?? ''}${url ?? ''}`);
  const rawOg = seo?.opengraphImage?.sourceUrl ?? undefined;
  const ogImage =
    rawOg && !rawOg.startsWith('http') ? `${siteUrl ?? ''}${rawOg}` : rawOg;
  const rawTw = seo?.twitterImage?.sourceUrl ?? rawOg;
  const twImage =
    rawTw && !rawTw.startsWith('http') ? `${siteUrl ?? ''}${rawTw}` : rawTw;
  return {
    title,
    description,
    canonical,
    robots: seo?.robots ?? undefined,
    og: {
      title: seo?.opengraphTitle ?? title,
      description: seo?.opengraphDescription ?? description,
      type: seo?.opengraphType ?? 'article',
      image: ogImage,
      url: canonical,
      siteName: siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.twitterTitle ?? title,
      description: seo?.twitterDescription ?? description,
      image: twImage,
    },
    schema: seo?.schema?.raw ?? null,
  };
}
