import ArticleCard from '@/components/ArticleCard'
import Breadcrumb from '@/components/Breadcrumb'
import { getCategoryBySlug, getCategories, type Post } from '@/lib/wp'
import Seo from '@/components/Seo'
import { normalizeSeo } from '@/lib/seo'
import { siteUrl } from '@/lib/utils'

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((c) => ({ slug: c.slug }))
}

interface Props {
  params: { slug: string }
}

export default async function CategoryPage({ params }: Props) {
  const page = 1
  try {
    const { category, posts } = await getCategoryBySlug(params.slug, { page, perPage: 10 })
    if (!category) return <div>Categorie necunoscută.</div>
    const seoData = normalizeSeo({
      seo: category.seo,
      wpTitle: category.name,
      wpExcerpt: `Știri din categoria ${category.name}`,
      url: category.uri || `/categorie/${category.slug}`,
      siteName: 'Green News România',
      siteUrl,
    })

    return (
      <>
        <Seo data={seoData} />
        <div>
        <Breadcrumb items={[{ label: 'Acasă', href: '/' }, { label: category.name }]} />
        <h1 className="text-3xl font-bold mb-6">{category.name}</h1>
        <div className="space-y-8">
          {posts.length === 0 ? (
            <p className="text-gray-500">Nu există articole în această categorie.</p>
          ) : (
            posts.map((a: Post) => <ArticleCard key={a.slug} article={a} />)
          )}
        </div>
        </div>
      </>
    )
  } catch (e) {
    console.error(e)
    return (
      <p className="text-red-500">Eroare la încărcarea categoriei.</p>
    )
  }
}
