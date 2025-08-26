import ArticleCard from '@/components/ArticleCard'
import Breadcrumb from '@/components/Breadcrumb'
import { getCategoryBySlug, fixtures } from '@/lib/wp'

export function generateStaticParams() {
  return fixtures.categories.map((c) => ({ slug: c.slug }))
}

interface Props {
  params: { slug: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const page = parseInt((searchParams?.pagina as string) || '1')
  const { category, posts } = await getCategoryBySlug(params.slug, { page, perPage: 10 })
  if (!category) return <div>Categorie necunoscută.</div>

  return (
    <div>
      <Breadcrumb items={[{ label: 'Acasă', href: '/' }, { label: category.name }]} />
      <h1 className="text-3xl font-bold mb-6">{category.name}</h1>
      <div className="space-y-8">
        {posts.length === 0 ? (
          <p className="text-gray-500">Nu există articole în această categorie.</p>
        ) : (
          posts.map((a) => <ArticleCard key={a.slug} article={a} />)
        )}
      </div>
    </div>
  )
}
