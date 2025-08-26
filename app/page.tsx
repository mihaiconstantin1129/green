import ArticleCard from '@/components/ArticleCard'
import SidebarPopular from '@/components/SidebarPopular'
import AdsenseSlot from '@/components/AdsenseSlot'
import { getPosts } from '@/lib/wp'

interface Props {
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default async function HomePage({ searchParams }: Props) {
  const page = parseInt((searchParams?.pagina as string) || '1')
  const articles = await getPosts({ page, perPage: 10 })
  return (
    <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
      <div className="space-y-8">
        {articles.length === 0 ? (
          <p className="text-gray-500">Nu există articole.</p>
        ) : (
          articles.map((a) => <ArticleCard key={a.slug} article={a} />)
        )}
      </div>
      <div className="space-y-8">
        <AdsenseSlot />
        <SidebarPopular />
      </div>
    </div>
  )
}
