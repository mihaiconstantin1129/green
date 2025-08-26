import Link from 'next/link'
import { getPopular } from '@/data/mock'

export default function SidebarPopular() {
  const popular = getPopular()
  return (
    <aside className="space-y-2">
      <h3 className="font-semibold">Populare</h3>
      <ul className="space-y-1">
        {popular.map((article) => (
          <li key={article.slug}>
            <Link href={`/stiri/${article.slug}`} className="hover:underline">
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
