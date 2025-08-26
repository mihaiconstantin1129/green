import ArticleCard from '@/components/ArticleCard'
import { searchPosts } from '@/lib/wp'

interface Props {
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default async function SearchPage({ searchParams }: Props) {
  const term = (searchParams?.q as string) || ''
  const page = parseInt((searchParams?.pagina as string) || '1')
  const results = term ? await searchPosts(term, { page, perPage: 10 }) : []

  return (
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
  )
}
