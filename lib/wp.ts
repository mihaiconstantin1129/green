import postsFixture from './fixtures/posts.json'
import categoriesFixture from './fixtures/categories.json'
import tagsFixture from './fixtures/tags.json'
import authorsFixture from './fixtures/authors.json'

export interface Term { slug: string; name: string }
export interface Author { slug: string; name: string }
export interface Post {
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  categories: Term[]
  tags: Term[]
  author: Author
}

const endpoint = process.env.WP_GRAPHQL_ENDPOINT

async function fetchGraphQL<T>(query: string, variables: any): Promise<T> {
  if (!endpoint) throw new Error('Endpoint missing')
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error('Fetch error')
  const json = await res.json()
  if (json.errors) throw new Error('GraphQL error')
  return json.data
}

function mapPost(node: any): Post {
  return {
    slug: node.slug,
    title: node.title,
    excerpt: node.excerpt,
    content: node.content,
    image: node.featuredImage?.node?.sourceUrl || '',
    categories: node.categories?.nodes?.map((c: any) => ({ slug: c.slug, name: c.name })) || [],
    tags: node.tags?.nodes?.map((t: any) => ({ slug: t.slug, name: t.name })) || [],
    author: {
      slug: node.author?.node?.slug || '',
      name: node.author?.node?.name || '',
    },
  }
}

export async function getPosts({ page = 1, perPage = 10 }: { page?: number; perPage?: number }) {
  const query = `query Posts($offset: Int!, $size: Int!){\n    posts(where:{offsetPagination:{offset:$offset, size:$size}}){\n      nodes{\n        slug title excerpt content\n        categories{nodes{slug name}}\n        tags{nodes{slug name}}\n        author{node{slug name}}\n        featuredImage{node{sourceUrl}}\n      }\n    }\n  }`
  const variables = { offset: (page - 1) * perPage, size: perPage }
  try {
    const data = await fetchGraphQL<any>(query, variables)
    return data.posts.nodes.map(mapPost) as Post[]
  } catch {
    return postsFixture.slice((page - 1) * perPage, page * perPage) as Post[]
  }
}

export async function getFeaturedPost(): Promise<Post | undefined> {
  const query = `query Featured{\n    posts(where:{sticky:true}, first:1){nodes{slug title excerpt content categories{nodes{slug name}} tags{nodes{slug name}} author{node{slug name}} featuredImage{node{sourceUrl}}}}\n  }`
  try {
    const data = await fetchGraphQL<any>(query, {})
    const node = data.posts.nodes[0]
    return node ? mapPost(node) : undefined
  } catch {
    return postsFixture[0] as Post | undefined
  }
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const query = `query PostBySlug($slug: ID!){\n    post(id:$slug, idType:SLUG){\n      slug title excerpt content\n      categories{nodes{slug name}}\n      tags{nodes{slug name}}\n      author{node{slug name}}\n      featuredImage{node{sourceUrl}}\n    }\n  }`
  try {
    const data = await fetchGraphQL<any>(query, { slug })
    return data.post ? mapPost(data.post) : undefined
  } catch {
    return (postsFixture as Post[]).find((p) => p.slug === slug)
  }
}

export async function getCategoryBySlug(slug: string, { page = 1, perPage = 10 }: { page?: number; perPage?: number }) {
  const query = `query Category($slug: ID!, $offset: Int!, $size: Int!){\n    category(id:$slug, idType:SLUG){\n      slug name\n      posts(where:{offsetPagination:{offset:$offset, size:$size}}){nodes{slug title excerpt content categories{nodes{slug name}} tags{nodes{slug name}} author{node{slug name}} featuredImage{node{sourceUrl}}}}\n    }\n  }`
  const variables = { slug, offset: (page - 1) * perPage, size: perPage }
  try {
    const data = await fetchGraphQL<any>(query, variables)
    return {
      category: data.category ? { slug: data.category.slug, name: data.category.name } : undefined,
      posts: data.category ? data.category.posts.nodes.map(mapPost) : [],
    }
  } catch {
    const category = (categoriesFixture as Term[]).find((c) => c.slug === slug)
    const posts = (postsFixture as Post[]).filter((p) => p.categories.some((c) => c.slug === slug))
    return {
      category,
      posts: posts.slice((page - 1) * perPage, page * perPage),
    }
  }
}

export async function getTagBySlug(slug: string, { page = 1, perPage = 10 }: { page?: number; perPage?: number }) {
  const query = `query Tag($slug: ID!, $offset: Int!, $size: Int!){\n    tag(id:$slug, idType:SLUG){\n      slug name\n      posts(where:{offsetPagination:{offset:$offset, size:$size}}){nodes{slug title excerpt content categories{nodes{slug name}} tags{nodes{slug name}} author{node{slug name}} featuredImage{node{sourceUrl}}}}\n    }\n  }`
  const variables = { slug, offset: (page - 1) * perPage, size: perPage }
  try {
    const data = await fetchGraphQL<any>(query, variables)
    return {
      tag: data.tag ? { slug: data.tag.slug, name: data.tag.name } : undefined,
      posts: data.tag ? data.tag.posts.nodes.map(mapPost) : [],
    }
  } catch {
    const tag = (tagsFixture as Term[]).find((t) => t.slug === slug)
    const posts = (postsFixture as Post[]).filter((p) => p.tags.some((t) => t.slug === slug))
    return {
      tag,
      posts: posts.slice((page - 1) * perPage, page * perPage),
    }
  }
}

export async function getAuthorBySlug(slug: string, { page = 1, perPage = 10 }: { page?: number; perPage?: number }) {
  const query = `query Author($slug: ID!, $offset: Int!, $size: Int!){\n    user(id:$slug, idType:SLUG){\n      slug name\n      posts(where:{offsetPagination:{offset:$offset, size:$size}}){nodes{slug title excerpt content categories{nodes{slug name}} tags{nodes{slug name}} featuredImage{node{sourceUrl}} author{node{slug name}}}}\n    }\n  }`
  const variables = { slug, offset: (page - 1) * perPage, size: perPage }
  try {
    const data = await fetchGraphQL<any>(query, variables)
    return {
      author: data.user ? { slug: data.user.slug, name: data.user.name } : undefined,
      posts: data.user ? data.user.posts.nodes.map(mapPost) : [],
    }
  } catch {
    const author = (authorsFixture as Author[]).find((a) => a.slug === slug)
    const posts = (postsFixture as Post[]).filter((p) => p.author.slug === slug)
    return {
      author,
      posts: posts.slice((page - 1) * perPage, page * perPage),
    }
  }
}

export async function searchPosts(term: string, { page = 1, perPage = 10 }: { page?: number; perPage?: number }) {
  const query = `query Search($term: String!, $offset: Int!, $size: Int!){\n    posts(where:{search:$term, offsetPagination:{offset:$offset, size:$size}}){\n      nodes{slug title excerpt content categories{nodes{slug name}} tags{nodes{slug name}} author{node{slug name}} featuredImage{node{sourceUrl}}}\n    }\n  }`
  const variables = { term, offset: (page - 1) * perPage, size: perPage }
  try {
    const data = await fetchGraphQL<any>(query, variables)
    return data.posts.nodes.map(mapPost) as Post[]
  } catch {
    const results = (postsFixture as Post[]).filter((p) =>
      p.title.toLowerCase().includes(term.toLowerCase())
    )
    return results.slice((page - 1) * perPage, page * perPage)
  }
}

export const fixtures = {
  posts: postsFixture as Post[],
  categories: categoriesFixture as Term[],
  tags: tagsFixture as Term[],
  authors: authorsFixture as Author[],
}
