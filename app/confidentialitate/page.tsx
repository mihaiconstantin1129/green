import ProseContent from '@/components/ProseContent'
import { getPageBySlug } from '@/lib/wp'
import Seo from '@/components/Seo'
import { normalizeSeo } from '@/lib/seo'
import { siteUrl } from '@/lib/utils'

export default async function PrivacyPage() {
  const page = await getPageBySlug('confidentialitate').catch(() => undefined)
  const seoData = normalizeSeo({
    seo: page?.seo,
    wpTitle: page?.title || 'Politica de confidențialitate',
    wpExcerpt: page?.excerpt || 'Politica de confidențialitate',
    url: page?.uri || '/confidentialitate',
    siteName: 'Green News România',
    siteUrl,
  })
  return (
    <>
      <Seo data={seoData} />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{page?.title || 'Politica de confidențialitate'}</h1>
        <ProseContent html={page?.content || '<p>Aceasta este politica noastră de confidențialitate.</p>'} />
      </div>
    </>
  )
}
