import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/lib/wp'

export default function ArticleCard({ article }: { article: Post }) {
  return (
    <article className="overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/stiri/${article.slug}`}>
        <Image
          src={article.image}
          alt={article.title}
          width={800}
          height={450}
          className="h-48 w-full object-cover"
        />
      </Link>
      <div className="space-y-2 p-4">
        <h3 className="text-xl font-serif font-semibold leading-snug">
          <Link
            href={`/stiri/${article.slug}`}
            className="hover:text-accent"
          >
            {article.title}
          </Link>
        </h3>
        <p className="text-sm text-gray-600">{article.excerpt.replace(/<[^>]+>/g, '')}</p>
      </div>
    </article>
  )
}
