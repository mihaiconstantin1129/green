import ProseContent from '@/components/ProseContent'
import SeoHead from '@/components/SeoHead'
import { getPageBySlug } from '@/lib/wp'
import { normalizeSeo, seoToMetadata, jsonLdScript } from '@/lib/seo'
import { siteUrl } from '@/lib/utils'

export default async function ContactPage() {
  const page = await getPageBySlug('contact').catch(() => undefined)
  const title = page?.seo?.title ?? page?.title ?? 'Contact'
  const description =
    page?.seo?.metaDesc ??
    page?.excerpt?.replace(/<[^>]*>?/gm, '') ??
    'Contact'
  const ogImage = page?.seo?.opengraphImage?.sourceUrl || undefined
  const jsonLd =
    page?.seo?.schema?.raw ?? {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page?.title || 'Contact',
      description: page?.excerpt?.replace(/<[^>]*>?/gm, '') || 'Contact',
      url: `${siteUrl}/contact`,
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
        <h1 className="text-3xl font-bold mb-4">{page?.title || 'Contact'}</h1>
        <ProseContent html={page?.content || "<p>Ne poți scrie la <a href='mailto:contact@example.com'>contact@example.com</a>.</p>"} />
      </div>
    </>
  )
}

export async function generateMetadata() {
  const page = await getPageBySlug('contact').catch(() => undefined)
  const seoData = normalizeSeo({
    seo: page?.seo,
    wpTitle: page?.title || 'Contact',
    wpExcerpt: page?.excerpt || 'Contact',
    url: page?.uri || '/contact',
    siteName: 'Green News România',
    siteUrl,
  })
  return seoToMetadata(seoData)
}
