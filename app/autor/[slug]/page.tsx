import ArticleCard from '@/components/ArticleCard'
import Breadcrumb from '@/components/Breadcrumb'
import { getAuthorBySlug, fixtures, type Post } from '@/lib/wp'
import { normalizeSeo, seoToMetadata, jsonLdScript } from '@/lib/seo'
import { siteUrl } from '@/lib/utils'

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
    const jsonLd =
      (author as any).seo?.schema?.raw ?? {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: author.name,
        url: `${siteUrl}/autor/${author.slug}`,
      }

    return (
      <>
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
          />
        )}
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
      </>
    )
  } catch (e) {
    console.error(e)
    return (
      <p className="text-red-500">Eroare la încărcarea autorului.</p>
    )
  }
}

export async function generateMetadata({ params }: Props) {
  const { author } = await getAuthorBySlug(params.slug, { page: 1, perPage: 1 })
  if (!author) return {}
  const seoData = normalizeSeo({
    seo: (author as any).seo,
    wpTitle: author.name,
    wpExcerpt: `Articole scrise de ${author.name}`,
    url: `/autor/${author.slug}`,
    siteName: 'Green News România',
    siteUrl,
  })
  return seoToMetadata(seoData)
}
