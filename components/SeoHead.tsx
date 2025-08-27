import Head from 'next/head'
import { jsonLdScript, normalizeSeo } from '@/lib/seo'

interface Props {
  seo: ReturnType<typeof normalizeSeo>
  jsonLd?: object | string | null
  prev?: string
  next?: string
}

export default function SeoHead({ seo, jsonLd, prev, next }: Props) {
  const script = jsonLdScript(jsonLd ?? seo.schema ?? undefined)
  return (
    <Head>
      {seo.title && <title>{seo.title}</title>}
      {seo.description && (
        <meta name="description" content={seo.description} />
      )}
      {seo.canonical && <link rel="canonical" href={seo.canonical} />}
      {seo.robots && <meta name="robots" content={seo.robots} />}

      {seo.og.title && <meta property="og:title" content={seo.og.title} />}
      {seo.og.description && (
        <meta property="og:description" content={seo.og.description} />
      )}
      {seo.og.type && <meta property="og:type" content={seo.og.type} />}
      {seo.og.url && <meta property="og:url" content={seo.og.url} />}
      {seo.og.siteName && (
        <meta property="og:site_name" content={seo.og.siteName} />
      )}
      {seo.og.image && <meta property="og:image" content={seo.og.image} />}
      {seo.og.imageWidth && (
        <meta
          property="og:image:width"
          content={String(seo.og.imageWidth)}
        />
      )}
      {seo.og.imageHeight && (
        <meta
          property="og:image:height"
          content={String(seo.og.imageHeight)}
        />
      )}
      {seo.og.imageAlt && (
        <meta property="og:image:alt" content={seo.og.imageAlt} />
      )}

      <meta name="twitter:card" content={seo.twitter.card} />
      {seo.twitter.title && (
        <meta name="twitter:title" content={seo.twitter.title} />
      )}
      {seo.twitter.description && (
        <meta
          name="twitter:description"
          content={seo.twitter.description}
        />
      )}
      {seo.twitter.image && (
        <meta name="twitter:image" content={seo.twitter.image} />
      )}

      {prev && <link rel="prev" href={prev} />}
      {next && <link rel="next" href={next} />}

      {script && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: script }}
        />
      )}
    </Head>
  )
}
