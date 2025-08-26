import ArticleCard from '@/components/ArticleCard'
import Breadcrumb from '@/components/Breadcrumb'
import { tags, getArticlesByTag } from '@/data/mock'

export function generateStaticParams() {
  return tags.map((t) => ({ slug: t.slug }))
}

export default function TagPage({ params }: { params: { slug: string } }) {
  const items = getArticlesByTag(params.slug)
  const tag = tags.find((t) => t.slug === params.slug)
  if (!tag) return <div>Eticheta nu există.</div>

  return (
    <div>
      <Breadcrumb items={[{ label: 'Acasă', href: '/' }, { label: `Etichetă: ${tag.name}` }]} />
      <h1 className="text-3xl font-bold mb-6">Etichetă: {tag.name}</h1>
      <div className="space-y-8">
        {items.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </div>
  )
}
