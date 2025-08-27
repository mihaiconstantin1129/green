import Head from 'next/head';

export default function SeoHead({ data }: { data: ReturnType<typeof import('../lib/seo').normalizeSeo> }) {
  return (
    <Head>
      {data.title && <title>{data.title}</title>}
      {data.description && <meta name="description" content={data.description} />}
      {data.canonical && <link rel="canonical" href={data.canonical} />}
      {data.robots && <meta name="robots" content={data.robots} />}

      {data.og?.title && <meta property="og:title" content={data.og.title} />}
      {data.og?.description && <meta property="og:description" content={data.og.description} />}
      {data.og?.type && <meta property="og:type" content={data.og.type} />}
      {data.og?.url && <meta property="og:url" content={data.og.url} />}
      {data.og?.siteName && <meta property="og:site_name" content={data.og.siteName} />}
      {data.og?.image && <meta property="og:image" content={data.og.image} />}

      <meta name="twitter:card" content={data.twitter?.card ?? 'summary_large_image'} />
      {data.twitter?.title && <meta name="twitter:title" content={data.twitter.title} />}
      {data.twitter?.description && <meta name="twitter:description" content={data.twitter.description} />}
      {data.twitter?.image && <meta name="twitter:image" content={data.twitter.image} />}

      {data.schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: data.schema }} />}
    </Head>
  );
}
