export const dynamic = 'force-static'

export async function GET() {
  const backend =
    process.env.WP_GRAPHQL_ENDPOINT
      ? new URL(process.env.WP_GRAPHQL_ENDPOINT).origin
      : 'https://cms.green-news.ro'
  const content = `User-agent: *\nAllow: /\nSitemap: ${backend}/sitemap.xml\nSitemap: ${backend}/news-sitemap.xml`
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
