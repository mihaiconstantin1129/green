import Breadcrumb from '@/components/Breadcrumb'
import ProseContent from '@/components/ProseContent'
import ShareBar from '@/components/ShareBar'
import AdsenseSlot from '@/components/AdsenseSlot'
import { articles, getArticle } from '@/data/mock'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

export default function ArticlePage({ params }: Props) {
  const article = getArticle(params.slug)
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
