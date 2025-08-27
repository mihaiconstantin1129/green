import ProseContent from '@/components/ProseContent'
import { getPageBySlug } from '@/lib/wp'
import Seo from '@/components/Seo'
import { normalizeSeo } from '@/lib/seo'
import { siteUrl } from '@/lib/utils'

export default async function AdsPage() {
  const page = await getPageBySlug('publicitate').catch(() => undefined)
  const seoData = normalizeSeo({
    seo: page?.seo,
    wpTitle: page?.title || 'Publicitate',
    wpExcerpt: page?.excerpt || 'Publicitate',
    url: page?.uri || '/publicitate',
    siteName: 'Green News România',
    siteUrl,
  })
  return (
    <>
      <Seo data={seoData} />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{page?.title || 'Publicitate'}</h1>
        <ProseContent html={page?.content || '<p>Pentru spații publicitare, contactați-ne.</p>'} />
      </div>
    </>
  )
}
