import Link from 'next/link'
import { getPosts } from '@/lib/wp'

export default async function SidebarPopular() {
  try {
    const popular = await getPosts({ page: 1, perPage: 3 })
    return (
      <aside className="space-y-4 rounded-lg bg-white p-4 shadow-sm">
        <h3 className="text-lg font-serif font-semibold">Cele mai citite</h3>
        {popular.length === 0 ? (
          <p className="text-sm text-gray-500">Nu există articole populare.</p>
        ) : (
          <ul className="space-y-2">
            {popular.map((article) => (
              <li key={article.slug}>
                <Link href={`/stiri/${article.slug}`} className="hover:text-accent">
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </aside>
    )
  } catch (e) {
    console.error(e)
    return (
      <aside className="space-y-4 rounded-lg bg-white p-4 shadow-sm">
        <h3 className="text-lg font-serif font-semibold">Cele mai citite</h3>
        <p className="text-sm text-red-500">Eroare la încărcarea articolelor.</p>
      </aside>
    )
  }
}
