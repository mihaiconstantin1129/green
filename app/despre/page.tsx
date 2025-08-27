import ProseContent from '@/components/ProseContent'
import SeoHead from '@/components/SeoHead'
import { getPageBySlug } from '@/lib/wp'
import { normalizeSeo, seoToMetadata, jsonLdScript } from '@/lib/seo'
import { siteUrl } from '@/lib/utils'

export default async function AboutPage() {
  const page = await getPageBySlug('despre').catch(() => undefined)
  const title = page?.seo?.title ?? page?.title ?? 'Despre noi'
  const description =
    page?.seo?.metaDesc ??
    page?.excerpt?.replace(/<[^>]*>?/gm, '') ??
    'Despre noi'
  const ogImage = page?.seo?.opengraphImage?.sourceUrl ?? undefined
  const jsonLd =
    page?.seo?.schema?.raw ?? {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page?.title || 'Despre noi',
      description: page?.excerpt?.replace(/<[^>]*>?/gm, '') || 'Despre noi',
      url: `${siteUrl}/despre`,
    }
  return (
    <>
      <SeoHead title={title} description={description} ogImage={ogImage} />
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) ?? '' }}
        />
      )}
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{page?.title || 'Despre noi'}</h1>
        <ProseContent html={page?.content || '<p>Suntem un site de știri fictiv.</p>'} />
      </div>
    </>
  )
}

export async function generateMetadata() {
  const page = await getPageBySlug('despre').catch(() => undefined)
  const seoData = normalizeSeo({
    seo: page?.seo,
    wpTitle: page?.title || 'Despre noi',
    wpExcerpt: page?.excerpt || 'Despre noi',
    url: page?.uri || '/despre',
    siteName: 'Green News România',
    siteUrl,
  })
  return seoToMetadata(seoData)
}
