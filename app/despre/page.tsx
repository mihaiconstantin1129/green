import ProseContent from '@/components/ProseContent'
import { getPageBySlug } from '@/lib/wp'
import Seo from '@/components/Seo'
import { normalizeSeo } from '@/lib/seo'
import { siteUrl } from '@/lib/utils'

export default async function AboutPage() {
  const page = await getPageBySlug('despre').catch(() => undefined)
  const seoData = normalizeSeo({
    seo: page?.seo,
    wpTitle: page?.title || 'Despre noi',
    wpExcerpt: page?.excerpt || 'Despre noi',
    url: page?.uri || '/despre',
    siteName: 'Green News România',
    siteUrl,
  })
  return (
    <>
      <Seo data={seoData} />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{page?.title || 'Despre noi'}</h1>
        <ProseContent html={page?.content || '<p>Suntem un site de știri fictiv.</p>'} />
      </div>
    </>
  )
}
