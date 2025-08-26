import Breadcrumb from '@/components/Breadcrumb'
import ProseContent from '@/components/ProseContent'
import ShareBar from '@/components/ShareBar'
import AdsenseSlot from '@/components/AdsenseSlot'
import { getPostBySlug, getPosts } from '@/lib/wp'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = await getPosts({ page: 1, perPage: 100 })
  return posts.map((a) => ({ slug: a.slug }))
}

export default async function ArticlePage({ params }: Props) {
  const article = await getPostBySlug(params.slug)
  if (!article) return <div>Articolul nu a fost găsit.</div>

  return (
    <article className="max-w-3xl mx-auto">
      <Breadcrumb items={[{ label: 'Acasă', href: '/' }, { label: article.title }]} />
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <ProseContent html={article.content} />
      <ShareBar title={article.title} />
      <AdsenseSlot />
    </article>
  )
}
