import ArticleCard from '@/components/ArticleCard'
import Breadcrumb from '@/components/Breadcrumb'
import { getTagBySlug, fixtures } from '@/lib/wp'

export function generateStaticParams() {
  return fixtures.tags.map((t) => ({ slug: t.slug }))
}

interface Props {
  params: { slug: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default async function TagPage({ params, searchParams }: Props) {
  const page = parseInt((searchParams?.pagina as string) || '1')
  const { tag, posts } = await getTagBySlug(params.slug, { page, perPage: 10 })
  if (!tag) return <div>Eticheta nu există.</div>

  return (
    <div>
      <Breadcrumb items={[{ label: 'Acasă', href: '/' }, { label: `Etichetă: ${tag.name}` }]} />
      <h1 className="text-3xl font-bold mb-6">Etichetă: {tag.name}</h1>
      <div className="space-y-8">
        {posts.length === 0 ? (
          <p className="text-gray-500">Nu există articole pentru această etichetă.</p>
        ) : (
          posts.map((a) => <ArticleCard key={a.slug} article={a} />)
        )}
      </div>
    </div>
  )
}
