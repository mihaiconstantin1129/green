import ProseContent from '@/components/ProseContent'
import SeoHead from '@/components/SeoHead'
import { getPageBySlug } from '@/lib/wp'
import { normalizeSeo, seoToMetadata, jsonLdScript } from '@/lib/seo'
import { siteUrl } from '@/lib/utils'

export default async function PrivacyPage() {
  const page = await getPageBySlug('confidentialitate').catch(() => undefined)
  const title =
    page?.seo?.title ?? page?.title ?? 'Politica de confidențialitate'
  const description =
    page?.seo?.metaDesc ??
    page?.excerpt?.replace(/<[^>]*>?/gm, '') ??
    'Politica de confidențialitate'
  const ogImage = page?.seo?.opengraphImage?.sourceUrl || undefined
  const jsonLd =
    page?.seo?.schema?.raw ?? {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page?.title || 'Politica de confidențialitate',
      description:
        page?.excerpt?.replace(/<[^>]*>?/gm, '') || 'Politica de confidențialitate',
      url: `${siteUrl}/confidentialitate`,
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
        <h1 className="text-3xl font-bold mb-4">{page?.title || 'Politica de confidențialitate'}</h1>
        <ProseContent html={page?.content || '<p>Aceasta este politica noastră de confidențialitate.</p>'} />
      </div>
    </>
  )
}

export async function generateMetadata() {
  const page = await getPageBySlug('confidentialitate').catch(() => undefined)
  const seoData = normalizeSeo({
    seo: page?.seo,
    wpTitle: page?.title || 'Politica de confidențialitate',
    wpExcerpt: page?.excerpt || 'Politica de confidențialitate',
    url: page?.uri || '/confidentialitate',
    siteName: 'Green News România',
    siteUrl,
  })
  return seoToMetadata(seoData)
}
