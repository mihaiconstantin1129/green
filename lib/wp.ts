import fs from 'fs'
import path from 'path'
import tagsFixture from './fixtures/tags.json'
import authorsFixture from './fixtures/authors.json'
import categoriesFixture from './fixtures/categories.json'
import postsFixture from './fixtures/posts.json'
import type { WPSeo } from './seo'

export interface Term { slug: string; name: string; uri?: string; seo?: WPSeo | null }
export interface Author { slug: string; name: string }
export interface Post {
  slug: string
  uri: string
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  modified: string
  categories: Term[]
  tags: Term[]
  author: Author
  seo?: WPSeo | null
}

export interface Page {
  slug: string
  uri: string
  title: string
  content: string
  excerpt?: string
  seo?: WPSeo | null
}

const endpoint = process.env.WP_GRAPHQL_ENDPOINT

async function cacheImage(url: string): Promise<string> {
  try {
    const parsed = new URL(url)
    const filename = path.basename(parsed.pathname)
    const imgDir = path.join(process.cwd(), 'public', 'img')
    await fs.promises.mkdir(imgDir, { recursive: true })
    const filePath = path.join(imgDir, filename)
    if (!fs.existsSync(filePath)) {
      const res = await fetch(url)
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer())
        await fs.promises.writeFile(filePath, buf)
      }
    }
    return `/img/${filename}`
  } catch {
    return url
  }
}

export async function rewriteCmsHost(
  input: string | null | undefined
): Promise<string> {
  if (!input) return ''
  if (input.includes('<img')) {
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi
    const matches = Array.from(input.matchAll(imgRegex))
    let html = input
    for (const m of matches) {
      const src = m[1]
      const local = await cacheImage(src)
      html = html.replace(src, local)
    }
    return html
  }
  return cacheImage(input)
}

async function rewriteSeo(seo: WPSeo | null | undefined): Promise<WPSeo | undefined> {
  if (!seo) return undefined
  return {
    ...seo,
    opengraphImage: seo.opengraphImage
      ? {
          ...seo.opengraphImage,
          sourceUrl: await rewriteCmsHost(seo.opengraphImage.sourceUrl ?? ''),
        }
      : null,
    twitterImage: seo.twitterImage
      ? {
          ...seo.twitterImage,
          sourceUrl: await rewriteCmsHost(seo.twitterImage.sourceUrl ?? ''),
        }
      : null,
  }
}

const SEO_FIELDS = `
  title
  metaDesc
  canonical
  metaRobotsNoindex
  metaRobotsNofollow
  opengraphTitle
  opengraphDescription
  opengraphUrl
  opengraphSiteName
  opengraphType
  opengraphImage {
    sourceUrl
    altText
    mediaDetails { width height }
  }
  twitterTitle
  twitterDescription
  twitterImage { sourceUrl }
  breadcrumbs { text url }
  schema { raw }
`

const SEO_POST_FRAGMENT = `fragment SeoFieldsOnPost on Post {\n  seo {\n${SEO_FIELDS}\n  }\n}`
const SEO_PAGE_FRAGMENT = `fragment SeoFieldsOnPage on Page {\n  seo {\n${SEO_FIELDS}\n  }\n}`
const SEO_CATEGORY_FRAGMENT = `fragment SeoFieldsOnCategory on Category {\n  seo {\n${SEO_FIELDS}\n  }\n}`
const SEO_TAG_FRAGMENT = `fragment SeoFieldsOnTag on Tag {\n  seo {\n${SEO_FIELDS}\n  }\n}`
const SEO_USER_FRAGMENT = `fragment SeoFieldsOnUser on User {\n  seo {\n${SEO_FIELDS}\n  }\n}`

async function fetchGraphQL<T>(query: string, variables: any): Promise<T> {
  if (!endpoint) throw new Error('Endpoint missing')
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  })
  if (!res.ok) {
    console.error('GraphQL fetch error', res.status)
    throw new Error(`Fetch error: ${res.status}`)
  }
  const json = await res.json()
  if (json.errors) {
    console.error('GraphQL error', JSON.stringify(json.errors, null, 2))
    throw new Error(`GraphQL error: ${JSON.stringify(json.errors)}`)
  }
  return json.data
}

async function mapPost(node: any): Promise<Post> {
  return {
    slug: node.slug,
    uri: node.uri ?? '',
    title: node.title,
    excerpt: node.excerpt,
    content: await rewriteCmsHost(node.content ?? ''),
    image: await rewriteCmsHost(node.featuredImage?.node?.sourceUrl ?? ''),
    date: node.date ?? '',
    modified: node.modified ?? '',
    categories:
      node.categories?.nodes?.map((c: any) => ({ slug: c.slug, name: c.name })) ?? [],
    tags: node.tags?.nodes?.map((t: any) => ({ slug: t.slug, name: t.name })) ?? [],
    author: {
      slug: node.author?.node?.slug ?? '',
      name: node.author?.node?.name ?? '',
    },
    seo: await rewriteSeo(node.seo),
  }
}

export async function getCategories(): Promise<Term[]> {
  try {
    const query = `query Categories{\n    categories(first: 100){nodes{slug name}}\n  }`
    const data = await fetchGraphQL<any>(query, {})
    return data.categories.nodes.map(
      (c: any) => ({ slug: c.slug, name: c.name })
    ) as Term[]
  } catch (e) {
    console.error(e)
    return fixtures.categories
  }
}

export async function getPosts({ page = 1, perPage = 10 }: { page?: number; perPage?: number }) {
  try {
    const query = `query Posts($first: Int!){\n    posts(first:$first){\n      nodes{\n        slug uri title excerpt content date modified\n        categories{nodes{slug name}}\n        tags{nodes{slug name}}\n        author{node{slug name}}\n        featuredImage{node{sourceUrl altText mediaDetails{width height}}}\n      }\n    }\n  }`
    const variables = { first: perPage * page }
    const data = await fetchGraphQL<any>(query, variables)
    const start = (page - 1) * perPage
    const end = start + perPage
    const nodes = data.posts.nodes.slice(start, end)
    return Promise.all(nodes.map(mapPost))
  } catch (e) {
    console.error(e)
    const start = (page - 1) * perPage
    const end = start + perPage
    return fixtures.posts.slice(start, end)
  }
}

export async function getFeaturedPost(): Promise<Post | undefined> {
  try {
    const query = `${SEO_POST_FRAGMENT}\nquery Featured{\n    posts(first:1){nodes{slug uri title excerpt content date modified categories{nodes{slug name}} tags{nodes{slug name}} author{node{slug name}} featuredImage{node{sourceUrl altText mediaDetails{width height}}} ...SeoFieldsOnPost}}\n  }`
    const data = await fetchGraphQL<any>(query, {})
    const node = data?.posts?.nodes?.[0]
    return node ? await mapPost(node) : undefined
  } catch (e) {
    console.error(e)
    return fixtures.posts[0]
  }
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  try {
    const query = `${SEO_POST_FRAGMENT}\nquery PostBySlug($slug: ID!){\n    post(id:$slug, idType:SLUG){\n      slug uri title excerpt content date modified\n      categories{nodes{slug name}}\n      tags{nodes{slug name}}\n      author{node{slug name}}\n      featuredImage{node{sourceUrl altText mediaDetails{width height}}}\n      ...SeoFieldsOnPost\n    }\n  }`
    const data = await fetchGraphQL<any>(query, { slug })
    return data?.post ? await mapPost(data.post) : undefined
  } catch (e) {
    console.error(e)
    return fixtures.posts.find((p) => p.slug === slug)
  }
}

export async function getPageBySlug(slug: string): Promise<Page | undefined> {
  try {
    const query = `${SEO_PAGE_FRAGMENT}\nquery PageBySlug($slug: ID!){\n    page(id:$slug, idType:URI){\n      slug uri title content\n      ...SeoFieldsOnPage\n    }\n  }`
    const data = await fetchGraphQL<any>(query, { slug })
    const node = data?.page
    return node
      ? {
          slug: node.slug,
          uri: node.uri ?? '',
          title: node.title,
          content: await rewriteCmsHost(node.content ?? ''),
          seo: await rewriteSeo(node.seo),
        }
      : undefined
  } catch (e) {
    console.error(e)
    return undefined
  }
}

export async function getCategoryBySlug(slug: string, { page = 1, perPage = 10 }: { page?: number; perPage?: number }) {
  try {
    const query = `${SEO_CATEGORY_FRAGMENT}\nquery Category($slug: ID!, $first: Int!){\n    category(id:$slug, idType:SLUG){\n      slug name uri\n      ...SeoFieldsOnCategory\n      posts(first:$first){nodes{slug uri title excerpt content date modified categories{nodes{slug name}} tags{nodes{slug name}} author{node{slug name}} featuredImage{node{sourceUrl altText mediaDetails{width height}}}}}\n    }\n  }`
    const variables = { slug, first: perPage * page }
    const data = await fetchGraphQL<any>(query, variables)
    const start = (page - 1) * perPage
    const end = start + perPage
    return {
      category: data.category
        ? {
            slug: data.category.slug,
            name: data.category.name,
            uri: data.category.uri ?? '',
            seo: await rewriteSeo(data.category.seo),
          }
        : undefined,
      posts: data.category
        ? await Promise.all(
            data.category.posts.nodes.slice(start, end).map(mapPost)
          )
        : [],
    }
  } catch (e) {
    console.error(e)
    const start = (page - 1) * perPage
    const end = start + perPage
    return {
      category: fixtures.categories.find((c) => c.slug === slug),
      posts: fixtures.posts
        .filter((p) => p.categories.some((c) => c.slug === slug))
        .slice(start, end),
    }
  }
}

export async function getTagBySlug(slug: string, { page = 1, perPage = 10 }: { page?: number; perPage?: number }) {
  try {
    const query = `${SEO_TAG_FRAGMENT}\nquery Tag($slug: ID!, $first: Int!){\n    tag(id:$slug, idType:SLUG){\n      slug name uri\n      ...SeoFieldsOnTag\n      posts(first:$first){nodes{slug uri title excerpt content date modified categories{nodes{slug name}} tags{nodes{slug name}} author{node{slug name}} featuredImage{node{sourceUrl altText mediaDetails{width height}}}}}\n    }\n  }`
    const variables = { slug, first: perPage * page }
    const data = await fetchGraphQL<any>(query, variables)
    const start = (page - 1) * perPage
    const end = start + perPage
    return {
      tag: data.tag
        ? {
            slug: data.tag.slug,
            name: data.tag.name,
            uri: data.tag.uri ?? '',
            seo: await rewriteSeo(data.tag.seo),
          }
        : undefined,
      posts: data.tag
        ? await Promise.all(
            data.tag.posts.nodes.slice(start, end).map(mapPost)
          )
        : [],
    }
  } catch (e) {
    console.error(e)
    const start = (page - 1) * perPage
    const end = start + perPage
    return {
      tag: fixtures.tags.find((t) => t.slug === slug),
      posts: fixtures.posts
        .filter((p) => p.tags.some((t) => t.slug === slug))
        .slice(start, end),
    }
  }
}

export async function getAuthorBySlug(slug: string, { page = 1, perPage = 10 }: { page?: number; perPage?: number }) {
  try {
    const query = `${SEO_USER_FRAGMENT}\nquery Author($slug: ID!, $first: Int!){\n    user(id:$slug, idType:SLUG){\n      slug name\n      ...SeoFieldsOnUser\n      posts(first:$first){nodes{slug title excerpt content date modified categories{nodes{slug name}} tags{nodes{slug name}} featuredImage{node{sourceUrl}} author{node{slug name}}}}\n    }\n  }`
    const variables = { slug, first: perPage * page }
    const data = await fetchGraphQL<any>(query, variables)
    const start = (page - 1) * perPage
    const end = start + perPage
    return {
      author: data.user
        ? {
            slug: data.user.slug,
            name: data.user.name,
            seo: await rewriteSeo(data.user.seo),
          }
        : undefined,
      posts: data.user
        ? await Promise.all(
            data.user.posts.nodes.slice(start, end).map(mapPost)
          )
        : [],
    }
  } catch (e) {
    console.error(e)
    const start = (page - 1) * perPage
    const end = start + perPage
    return {
      author: fixtures.authors.find((a) => a.slug === slug),
      posts: fixtures.posts
        .filter((p) => p.author.slug === slug)
        .slice(start, end),
    }
  }
}

export async function searchPosts(term: string, { page = 1, perPage = 10 }: { page?: number; perPage?: number }) {
  try {
    const query = `query Search($term: String!, $first: Int!){\n    posts(where:{search:$term}, first:$first){\n      nodes{slug title excerpt content date modified categories{nodes{slug name}} tags{nodes{slug name}} author{node{slug name}} featuredImage{node{sourceUrl}}}\n    }\n  }`
    const variables = { term, first: perPage * page }
    const data = await fetchGraphQL<any>(query, variables)
    const start = (page - 1) * perPage
    const end = start + perPage
    const nodes = data.posts.nodes.slice(start, end)
    return Promise.all(nodes.map(mapPost))
  } catch (e) {
    console.error(e)
    const start = (page - 1) * perPage
    const end = start + perPage
    return fixtures.posts
      .filter((p) =>
        p.title.toLowerCase().includes(term.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(term.toLowerCase())
      )
      .slice(start, end)
  }
}

export const fixtures = {
  tags: tagsFixture as Term[],
  authors: authorsFixture as Author[],
  categories: categoriesFixture as Term[],
  posts: postsFixture as Post[],
}
