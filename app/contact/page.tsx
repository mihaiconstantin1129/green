import ProseContent from '@/components/ProseContent'
import { getPageBySlug } from '@/lib/wp'
import SeoHead from '@/components/SeoHead'
import { normalizeSeo } from '@/lib/seo'
import { siteUrl } from '@/lib/utils'

export default async function ContactPage() {
  const page = await getPageBySlug('contact').catch(() => undefined)
  const seoData = normalizeSeo({
    seo: page?.seo,
    wpTitle: page?.title || 'Contact',
    wpExcerpt: page?.excerpt || 'Contact',
    url: page?.uri || '/contact',
    siteName: 'Green News România',
    siteUrl,
  })
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
      <SeoHead seo={seoData} jsonLd={jsonLd} />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{page?.title || 'Contact'}</h1>
        <ProseContent html={page?.content || "<p>Ne poți scrie la <a href='mailto:contact@example.com'>contact@example.com</a>.</p>"} />
      </div>
    </>
  )
}
