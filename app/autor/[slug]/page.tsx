import ArticleCard from '@/components/ArticleCard'
import Breadcrumb from '@/components/Breadcrumb'
import { getAuthorBySlug, fixtures, type Post } from '@/lib/wp'

export function generateStaticParams() {
  return fixtures.authors.map((a) => ({ slug: a.slug }))
}

interface Props {
  params: { slug: string }
}

export default async function AuthorPage({ params }: Props) {
  const page = 1
  try {
    const { author, posts } = await getAuthorBySlug(params.slug, { page, perPage: 10 })
    if (!author) return <div>Autor necunoscut.</div>

    return (
      <div>
        <Breadcrumb items={[{ label: 'Acasă', href: '/' }, { label: `Autor: ${author.name}` }]} />
        <h1 className="text-3xl font-bold mb-6">Autor: {author.name}</h1>
        <div className="space-y-8">
          {posts.length === 0 ? (
            <p className="text-gray-500">Nu există articole scrise de acest autor.</p>
          ) : (
            posts.map((a: Post) => <ArticleCard key={a.slug} article={a} />)
          )}
        </div>
      </div>
    )
  } catch (e) {
    console.error(e)
    return (
      <p className="text-red-500">Eroare la încărcarea autorului.</p>
    )
  }
}
