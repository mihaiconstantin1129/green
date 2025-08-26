import ArticleCard from '@/components/ArticleCard'
import Breadcrumb from '@/components/Breadcrumb'
import { categories, getArticlesByCategory } from '@/data/mock'

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }))
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const items = getArticlesByCategory(params.slug)
  const cat = categories.find((c) => c.slug === params.slug)
  if (!cat) return <div>Categorie necunoscută.</div>

  return (
    <div>
      <Breadcrumb items={[{ label: 'Acasă', href: '/' }, { label: cat.name }]} />
      <h1 className="text-3xl font-bold mb-6">{cat.name}</h1>
      <div className="space-y-8">
        {items.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </div>
  )
}
