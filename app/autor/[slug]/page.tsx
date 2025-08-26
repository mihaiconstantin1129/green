import ArticleCard from '@/components/ArticleCard'
import Breadcrumb from '@/components/Breadcrumb'
import { authors, getArticlesByAuthor } from '@/data/mock'

export function generateStaticParams() {
  return authors.map((a) => ({ slug: a.slug }))
}

export default function AuthorPage({ params }: { params: { slug: string } }) {
  const items = getArticlesByAuthor(params.slug)
  const author = authors.find((a) => a.slug === params.slug)
  if (!author) return <div>Autor necunoscut.</div>

  return (
    <div>
      <Breadcrumb items={[{ label: 'Acasă', href: '/' }, { label: `Autor: ${author.name}` }]} />
      <h1 className="text-3xl font-bold mb-6">Autor: {author.name}</h1>
      <div className="space-y-8">
        {items.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </div>
  )
}
