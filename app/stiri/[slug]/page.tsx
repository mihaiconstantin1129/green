import Breadcrumb from '@/components/Breadcrumb'
import ProseContent from '@/components/ProseContent'
import ShareBar from '@/components/ShareBar'
import AdsenseSlot from '@/components/AdsenseSlot'
import SidebarPopular from '@/components/SidebarPopular'
import { getPostBySlug, getPosts } from '@/lib/wp'
import type { Metadata } from 'next'
import { siteUrl } from '@/lib/utils'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = await getPosts({ page: 1, perPage: 100 })
  return posts.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getPostBySlug(params.slug)
  if (!article)
    return {
      title: 'Articol',
    }
  const url = `${siteUrl}/stiri/${article.slug}`
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      images: article.image ? [{ url: article.image }] : undefined,
      url,
    },
    alternates: { canonical: url },
  }
}

export default async function ArticlePage({ params }: Props) {
  const article = await getPostBySlug(params.slug)
  if (!article) return <div>Articolul nu a fost găsit.</div>

  return (
    <div className="max-w-7xl mx-auto">
      <Breadcrumb items={[{ label: 'Acasă', href: '/' }, { label: article.title }]} />
      <div className="lg:flex lg:gap-8">
        <article className="flex-1">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight">
            {article.title}
          </h1>
          <ProseContent html={article.content} />
          <ShareBar title={article.title} />
        </article>
        <aside className="mt-8 lg:mt-0 lg:w-80 space-y-6">
          <AdsenseSlot className="w-full min-h-[600px]" />
          <SidebarPopular />
        </aside>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Acasă', item: siteUrl },
              {
                '@type': 'ListItem',
                position: 2,
                name: article.title,
                item: `${siteUrl}/stiri/${article.slug}`,
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: article.title,
            image: [article.image],
            datePublished: article.date,
            dateModified: article.modified,
            author: { '@type': 'Person', name: article.author.name },
            publisher: {
              '@type': 'Organization',
              name: 'Green News România',
              logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${siteUrl}/stiri/${article.slug}`,
            },
          }),
        }}
      />
    </div>
  )
}
