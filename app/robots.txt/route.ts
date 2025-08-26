import { siteUrl } from '@/lib/utils'

export const dynamic = 'force-static'

export async function GET() {
  const content = `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\nSitemap: ${siteUrl}/news-sitemap.xml`
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
