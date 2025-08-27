import ProseContent from '@/components/ProseContent'
import SeoHead from '@/components/SeoHead'
import { getPageBySlug } from '@/lib/wp'
import { normalizeSeo, seoToMetadata, jsonLdScript } from '@/lib/seo'
import { siteUrl } from '@/lib/utils'

export default async function AdsPage() {
  const page = await getPageBySlug('publicitate').catch(() => undefined)
  const title = page?.seo?.title ?? page?.title ?? 'Publicitate'
  const description =
    page?.seo?.metaDesc ??
    page?.excerpt?.replace(/<[^>]*>?/gm, '') ??
    'Publicitate'
  const ogImage = page?.seo?.opengraphImage?.sourceUrl || undefined
  const jsonLd =
    page?.seo?.schema?.raw ?? {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page?.title || 'Publicitate',
      description: page?.excerpt?.replace(/<[^>]*>?/gm, '') || 'Publicitate',
      url: `${siteUrl}/publicitate`,
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
        <h1 className="text-3xl font-bold mb-4">{page?.title || 'Publicitate'}</h1>
        <ProseContent html={page?.content || '<p>Pentru spații publicitare, contactați-ne.</p>'} />
      </div>
    </>
  )
}

export async function generateMetadata() {
  const page = await getPageBySlug('publicitate').catch(() => undefined)
  const seoData = normalizeSeo({
    seo: page?.seo,
    wpTitle: page?.title || 'Publicitate',
    wpExcerpt: page?.excerpt || 'Publicitate',
    url: page?.uri || '/publicitate',
    siteName: 'Green News România',
    siteUrl,
  })
  return seoToMetadata(seoData)
}
