import ProseContent from '@/components/ProseContent'
import { getPageBySlug } from '@/lib/wp'
import Seo, { normalizeSeo, seoToMetadata } from '@/components/Seo'
import { siteUrl } from '@/lib/utils'

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

export default async function AdsPage() {
  const page = await getPageBySlug('publicitate').catch(() => undefined)
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
      <Seo jsonLd={jsonLd} />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{page?.title || 'Publicitate'}</h1>
        <ProseContent html={page?.content || '<p>Pentru spații publicitare, contactați-ne.</p>'} />
      </div>
    </>
  )
}
