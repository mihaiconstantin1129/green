import Breadcrumb from '@/components/Breadcrumb'
import ProseContent from '@/components/ProseContent'
import ShareBar from '@/components/ShareBar'
import AdsenseSlot from '@/components/AdsenseSlot'
import SidebarPopular from '@/components/SidebarPopular'
import ArticleCard from '@/components/ArticleCard'
import Image from 'next/image'
import { getPostBySlug, getPosts } from '@/lib/wp'
import { normalizeSeo, seoToMetadata, jsonLdScript } from '@/lib/seo'
import { siteUrl } from '@/lib/utils'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = await getPosts({ page: 1, perPage: 100 })
  return posts.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props) {
  const article = await getPostBySlug(params.slug).catch(() => undefined)
  if (!article) return {}
  const seoData = normalizeSeo({
    seo: article.seo,
    wpTitle: article.title,
    wpExcerpt: article.excerpt,
    url: article.uri || `/stiri/${article.slug}`,
    siteName: 'Green News România',
    siteUrl,
  })
  return seoToMetadata(seoData)
}

export default async function ArticlePage({ params }: Props) {
  try {
    const article = await getPostBySlug(params.slug)
    if (!article) return <div>Articolul nu a fost găsit.</div>
    const recommended = (await getPosts({ page: 1, perPage: 3 })).filter(
      (p) => p.slug !== article.slug
    )
    const seoData = normalizeSeo({
      seo: article.seo,
      wpTitle: article.title,
      wpExcerpt: article.excerpt,
      url: article.uri || `/stiri/${article.slug}`,
      siteName: 'Green News România',
      siteUrl,
    })
    const jsonLd =
      article.seo?.schema?.raw ?? {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: article.title,
        image: article.image ? [article.image] : undefined,
        datePublished: article.date,
        dateModified: article.modified,
        author: {
          '@type': 'Person',
          name: article.author.name,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Green News România',
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/logo.webp`,
          },
        },
        mainEntityOfPage: seoData.canonical,
      }

      const jsonLdStr = jsonLdScript(jsonLd);

    return (
      <>
         {jsonLdStr && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLdStr }}
          />
        )}
        <div className="mx-auto max-w-7xl">
          <Breadcrumb items={[{ label: 'Acasă', href: '/' }, { label: article.title }]} />
        <div className="lg:flex lg:gap-8">
          <article className="flex-1">
            <h1 className="mb-4 text-4xl font-serif font-bold leading-tight">
              {article.title}
            </h1>
            {article.image && (
              <Image
                src={article.image}
                alt={article.title}
                width={1200}
                height={600}
                className="mb-6 w-full rounded-xl object-cover"
              />
            )}
            <ProseContent html={article.content} />
            <ShareBar title={article.title} />
            <AdsenseSlot className="my-8 w-full min-h-[250px]" />
            {recommended.length > 0 && (
              <div className="mt-12 space-y-6">
                <h2 className="text-2xl font-serif font-bold">
                  Articole recomandate
                </h2>
                <div className="grid gap-6 md:grid-cols-3">
                  {recommended.map((a) => (
                    <ArticleCard key={a.slug} article={a} />
                  ))}
                </div>
              </div>
            )}
          </article>
          <aside className="mt-8 space-y-6 lg:mt-0 lg:w-80">
            <AdsenseSlot className="w-full min-h-[600px]" />
            <SidebarPopular />
          </aside>
        </div>
        </div>
      </>
    )
  } catch (e) {
    console.error(e)
    return (
      <p className="text-red-500">Eroare la încărcarea articolului.</p>
    )
  }
}
