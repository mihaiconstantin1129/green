import ArticleCard from '@/components/ArticleCard'
import SidebarPopular from '@/components/SidebarPopular'
import AdsenseSlot from '@/components/AdsenseSlot'
import FeaturedArticle from '@/components/FeaturedArticle'
import { getPosts, getFeaturedPost } from '@/lib/wp'

interface Props {
  searchParams?: { [key: string]: string | string[] | undefined }
}

export const dynamic = 'force-dynamic'

export default async function HomePage({ searchParams }: Props) {
  const page = parseInt((searchParams?.pagina as string) || '1')
  const [featured, articles] = await Promise.all([
    getFeaturedPost(),
    getPosts({ page, perPage: 9 }),
  ])
  const list = featured
    ? articles.filter((a) => a.slug !== featured.slug)
    : articles
  return (
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
  )
}
