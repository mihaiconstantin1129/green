export type WPSeo = {
  title?: string | null;
  metaDesc?: string | null;
  canonical?: string | null;
  focuskw?: string | null;
  metaRobotsNoindex?: string | null;
  metaRobotsNofollow?: string | null;
  opengraphType?: string | null;
  opengraphTitle?: string | null;
  opengraphDescription?: string | null;
  opengraphUrl?: string | null;
  opengraphSiteName?: string | null;
  opengraphImage?: {
    sourceUrl?: string | null;
    altText?: string | null;
    mediaDetails?: { width?: number | null; height?: number | null } | null;
  } | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: { sourceUrl?: string | null } | null;
  breadcrumbs?: { text: string; url: string }[] | null;
  schema?: { raw?: string | null } | null;
};

function absoluteUrl(raw?: string | null, siteUrl?: string) {
  if (!raw) return undefined;
  if (!siteUrl) return raw || undefined;
  try {
    const base = new URL(siteUrl).origin;
    const url = raw.startsWith('http') ? new URL(raw) : new URL(raw, base);
    return new URL(url.pathname + url.search + url.hash, base).toString();
  } catch {
    return raw.startsWith('/') ? `${siteUrl}${raw}` : raw;
  }
}

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
  const canonical = absoluteUrl(seo?.canonical ?? url, siteUrl);

  const robotsArr = [
    seo?.metaRobotsNoindex === 'noindex' ? 'noindex' : null,
    seo?.metaRobotsNofollow === 'nofollow' ? 'nofollow' : null,
  ].filter(Boolean);
  const robots = robotsArr.length > 0 ? robotsArr.join(', ') : undefined;

  const rawOg = seo?.opengraphImage?.sourceUrl ?? undefined;
  const ogImage = absoluteUrl(rawOg, siteUrl);
  const rawTw = seo?.twitterImage?.sourceUrl ?? rawOg;
  const twImage = absoluteUrl(rawTw, siteUrl);
  const ogUrl = absoluteUrl(seo?.opengraphUrl ?? canonical, siteUrl);

  const breadcrumbs = (seo?.breadcrumbs ?? []).map((b) => ({
    text: b.text,
    url: absoluteUrl(b.url, siteUrl) ?? '',
  }));

  return {
    title,
    description,
    canonical,
    robots,
    og: {
      title: seo?.opengraphTitle ?? title,
      description: seo?.opengraphDescription ?? description,
      type: seo?.opengraphType ?? 'article',
      url: ogUrl ?? canonical,
      siteName: seo?.opengraphSiteName ?? siteName,
      image: ogImage,
      imageWidth: seo?.opengraphImage?.mediaDetails?.width ?? undefined,
      imageHeight: seo?.opengraphImage?.mediaDetails?.height ?? undefined,
      imageAlt: seo?.opengraphImage?.altText ?? undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.twitterTitle ?? title,
      description: seo?.twitterDescription ?? description,
      image: twImage,
    },
    schema: seo?.schema?.raw ?? null,
    breadcrumbs,
  };
}

import type { Metadata } from 'next';

export function seoToMetadata(data: ReturnType<typeof normalizeSeo>): Metadata {
  const robotsArr = data.robots?.split(',').map((s) => s.trim()) ?? [];
  return {
    title: data.title,
    description: data.description,
    alternates: { canonical: data.canonical },
    robots:
      robotsArr.length > 0
        ? {
            index: !robotsArr.includes('noindex'),
            follow: !robotsArr.includes('nofollow'),
          }
        : undefined,
    openGraph: {
      title: data.og.title,
      description: data.og.description,
      type: data.og.type as any,
      url: data.og.url,
      siteName: data.og.siteName,
      images: data.og.image
        ? [
            {
              url: data.og.image,
              width: data.og.imageWidth,
              height: data.og.imageHeight,
              alt: data.og.imageAlt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: data.twitter.card,
      title: data.twitter.title,
      description: data.twitter.description,
      images: data.twitter.image ? [data.twitter.image] : undefined,
    },
  };
}

export function jsonLdScript(data: string | object | undefined) {
  if (!data) return null;
  const json = typeof data === 'string' ? data : JSON.stringify(data);
  return json;
}
