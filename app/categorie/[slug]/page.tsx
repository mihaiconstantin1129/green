import ArticleCard from '@/components/ArticleCard'
import Breadcrumb from '@/components/Breadcrumb'
import { getCategoryBySlug, getCategories, type Post } from '@/lib/wp'
import type { Metadata } from 'next'
import { siteUrl } from '@/lib/utils'

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((c) => ({ slug: c.slug }))
}

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { category } = await getCategoryBySlug(params.slug, { page: 1, perPage: 1 })
    if (!category) return { title: 'Categorie' }
    const url = `${siteUrl}/categorie/${category.slug}`
    return {
      title: category.name,
      description: `Știri din categoria ${category.name}`,
      alternates: { canonical: url },
    }
  } catch {
    return { title: 'Categorie' }
  }
}

export default async function CategoryPage({ params }: Props) {
  const page = 1
  try {
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
            posts.map((a: Post) => <ArticleCard key={a.slug} article={a} />)
          )}
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Acasă', item: siteUrl },
                { '@type': 'ListItem', position: 2, name: category.name, item: `${siteUrl}/categorie/${category.slug}` },
              ],
            }),
          }}
        />
      </div>
    )
  } catch (e) {
    console.error(e)
    return (
      <p className="text-red-500">Eroare la încărcarea categoriei.</p>
    )
  }
}
