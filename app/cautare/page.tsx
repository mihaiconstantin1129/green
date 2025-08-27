import ArticleCard from '@/components/ArticleCard'
import { searchPosts } from '@/lib/wp'
import Seo, { normalizeSeo, seoToMetadata } from '@/components/Seo'
import { siteUrl } from '@/lib/utils'

export async function generateMetadata() {
  const seoData = normalizeSeo({
    wpTitle: 'Căutare',
    wpExcerpt: 'Caută articole',
    url: '/cautare',
    siteName: 'Green News România',
    siteUrl,
  })
  return seoToMetadata(seoData)
}

export default async function SearchPage() {
  const term = ''
  const page = 1
  try {
    const results = term ? await searchPosts(term, { page, perPage: 10 }) : []
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Căutare',
      url: `${siteUrl}/cautare`,
    }

    return (
      <>
        <Seo jsonLd={jsonLd} />
        <div>
          <h1 className="text-3xl font-bold mb-4">Căutare</h1>
          <form className="mb-4">
            <input
              type="text"
              name="q"
              defaultValue={term}
              placeholder="Caută..."
              className="border p-2 w-full"
            />
          </form>
          {term && results.length === 0 && (
            <p className="text-gray-500">Nu am găsit articole.</p>
          )}
          <div className="space-y-8">
            {results.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>
      </>
    )
  } catch (e) {
    console.error(e)
    return (
      <p className="text-red-500">Eroare la căutare.</p>
    )
  }
}
