import { getPosts } from '@/lib/wp'
import { siteUrl } from '@/lib/utils'
import { CACHE_CONTROL_HEADER } from '@/lib/cache'

export const dynamic = 'force-static'

export async function GET() {
  try {
    const posts = await getPosts({ page: 1, perPage: 100 })
    const urls = posts
      .map(
        (p) =>
          `<url><loc>${siteUrl}/stiri/${p.slug}</loc><lastmod>${p.modified}</lastmod></url>`
      )
      .join('')
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>${siteUrl}</loc></url>${urls}\n</urlset>`
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': CACHE_CONTROL_HEADER,
      },
    })
  } catch (e) {
    console.error(e)
    return new Response('Error generating sitemap', { status: 500 })
  }
}
