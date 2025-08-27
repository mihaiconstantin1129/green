import ArticleCard from '@/components/ArticleCard'
import SidebarPopular from '@/components/SidebarPopular'
import AdsenseSlot from '@/components/AdsenseSlot'
import FeaturedArticle from '@/components/FeaturedArticle'
import { getPosts, getFeaturedPost, getPageBySlug } from '@/lib/wp'
import Seo, { normalizeSeo, seoToMetadata } from '@/components/Seo'
import { siteUrl } from '@/lib/utils'

export async function generateMetadata() {
  const homepage = await getPageBySlug('acasa').catch(() => undefined)
  const seoData = normalizeSeo({
    seo: homepage?.seo,
    wpTitle: homepage?.title,
    wpExcerpt: homepage?.excerpt ?? '',
    url: '/',
    siteName: 'Green News România',
    siteUrl,
  })
  return seoToMetadata(seoData)
}

export default async function HomePage() {
  const page = 1
  try {
    const [featured, articles, homepage] = await Promise.all([
      getFeaturedPost().catch(() => undefined),
      getPosts({ page, perPage: 9 }),
      getPageBySlug('acasa').catch(() => undefined),
    ])
    const list = featured
      ? articles.filter((a) => a.slug !== featured.slug)
      : articles
    const jsonLd =
      homepage?.seo?.schema?.raw ??
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: homepage?.title ?? 'Green News România',
        description:
          homepage?.excerpt?.replace(/<[^>]*>?/gm, '') ??
          'Portal de știri din România',
        url: `${siteUrl}/`,
      }

    return (
      <>
        <Seo jsonLd={jsonLd} />
        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-8">
          {featured && <FeaturedArticle article={featured} />}
          {list.length === 0 ? (
            <p className="text-gray-500">Nu există articole.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {list.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          )}
        </div>
        <aside className="space-y-8">
          <AdsenseSlot />
          <SidebarPopular />
          <AdsenseSlot />
        </aside>
        </div>
      </>
    )
  } catch (e) {
    console.error(e)
    return (
      <p className="text-red-500">Eroare la încărcarea articolelor.</p>
    )
  }
}
