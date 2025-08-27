import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/lib/wp'

export default function FeaturedArticle({ article }: { article: Post }) {
  return (
    <article className="space-y-4">
      <Link href={`/stiri/${article.slug}`}>
        <Image
          src={article.image}
          alt={article.title}
          width={1200}
          height={600}
          className="w-full rounded-xl object-cover shadow"
        />
      </Link>
      <h2 className="text-4xl font-serif font-bold leading-tight">
        <Link href={`/stiri/${article.slug}`} className="hover:text-accent">
          {article.title}
        </Link>
      </h2>
      <p className="text-gray-700">{article.excerpt.replace(/<[^>]+>/g, '')}</p>
    </article>
  )
}
