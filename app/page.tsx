import ArticleCard from '@/components/ArticleCard'
import SidebarPopular from '@/components/SidebarPopular'
import AdsenseSlot from '@/components/AdsenseSlot'
import { articles } from '@/data/mock'

export default function HomePage() {
  return (
    <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
      <div className="space-y-8">
        {articles.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
      <div className="space-y-8">
        <AdsenseSlot />
        <SidebarPopular />
      </div>
    </div>
  )
}
