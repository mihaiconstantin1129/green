import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/lib/wp'

export default function ArticleCard({ article }: { article: Post }) {
  return (
    <div className="space-y-2">
      <Link href={`/stiri/${article.slug}`}>
        <Image
          src={article.image}
          alt={article.title}
          width={800}
          height={450}
          className="w-full h-auto rounded-md"
        />
      </Link>
      <h3 className="text-xl font-semibold">
        <Link href={`/stiri/${article.slug}`} className="hover:underline">
          {article.title}
        </Link>
      </h3>
      <p className="text-gray-600">{article.excerpt}</p>
    </div>
  )
}
