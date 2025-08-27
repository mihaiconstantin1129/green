import { getPosts } from '@/lib/wp'
import { siteUrl } from '@/lib/utils'

export const dynamic = 'force-static'

export async function GET() {
  try {
    const posts = await getPosts({ page: 1, perPage: 100 })
    const recent = posts.filter(
      (p) => Date.now() - new Date(p.date).getTime() <= 48 * 60 * 60 * 1000
    )
    const items = recent
      .map(
        (p) =>
          `<url><loc>${siteUrl}/stiri/${p.slug}</loc><news:news><news:publication><news:name>Green News România</news:name><news:language>ro</news:language></news:publication><news:publication_date>${p.date}</news:publication_date><news:title>${p.title}</news:title></news:news></url>`
      )
      .join('')
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n${items}\n</urlset>`
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  } catch (e) {
    console.error(e)
    return new Response('Error generating news sitemap', { status: 500 })
  }
}
