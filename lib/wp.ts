import tagsFixture from './fixtures/tags.json'
import authorsFixture from './fixtures/authors.json'
import categoriesFixture from './fixtures/categories.json'
import postsFixture from './fixtures/posts.json'

export interface Term { slug: string; name: string }
export interface Author { slug: string; name: string }
export interface Post {
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  modified: string
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

function mapPost(node: any): Post {
  return {
    slug: node.slug,
    title: node.title,
    excerpt: node.excerpt,
    content: node.content,
    image: node.featuredImage?.node?.sourceUrl ?? '',
    date: node.date ?? '',
    modified: node.modified ?? '',
    categories: node.categories?.nodes?.map((c: any) => ({ slug: c.slug, name: c.name })) ?? [],
    tags: node.tags?.nodes?.map((t: any) => ({ slug: t.slug, name: t.name })) ?? [],
    author: {
      slug: node.author?.node?.slug ?? '',
      name: node.author?.node?.name ?? '',
    },
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
    const query = `query Posts($first: Int!){\n    posts(first:$first){\n      nodes{\n        slug title excerpt content date modified\n        categories{nodes{slug name}}\n        tags{nodes{slug name}}\n        author{node{slug name}}\n        featuredImage{node{sourceUrl}}\n      }\n    }\n  }`
    const variables = { first: perPage * page }
    const data = await fetchGraphQL<any>(query, variables)
    const start = (page - 1) * perPage
    const end = start + perPage
    return data.posts.nodes.slice(start, end).map(mapPost) as Post[]
  } catch (e) {
    console.error(e)
    const start = (page - 1) * perPage
    const end = start + perPage
    return fixtures.posts.slice(start, end)
  }
}

export async function getFeaturedPost(): Promise<Post | undefined> {
  try {
    const query = `query Featured{\n    posts(where:{onlySticky:true}, first:1){nodes{slug title excerpt content date modified categories{nodes{slug name}} tags{nodes{slug name}} author{node{slug name}} featuredImage{node{sourceUrl}}}}\n  }`
    const data = await fetchGraphQL<any>(query, {})
    const node = data?.posts?.nodes?.[0]
    return node ? mapPost(node) : undefined
  } catch (e) {
    console.error(e)
    return fixtures.posts[0]
  }
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  try {
    const query = `query PostBySlug($slug: ID!){\n    post(id:$slug, idType:SLUG){\n      slug title excerpt content date modified\n      categories{nodes{slug name}}\n      tags{nodes{slug name}}\n      author{node{slug name}}\n      featuredImage{node{sourceUrl}}\n    }\n  }`
    const data = await fetchGraphQL<any>(query, { slug })
    return data?.post ? mapPost(data.post) : undefined
  } catch (e) {
    console.error(e)
    return fixtures.posts.find((p) => p.slug === slug)
  }
}

export async function getCategoryBySlug(slug: string, { page = 1, perPage = 10 }: { page?: number; perPage?: number }) {
  try {
    const query = `query Category($slug: ID!, $first: Int!){\n    category(id:$slug, idType:SLUG){\n      slug name\n      posts(first:$first){nodes{slug title excerpt content date modified categories{nodes{slug name}} tags{nodes{slug name}} author{node{slug name}} featuredImage{node{sourceUrl}}}}\n    }\n  }`
    const variables = { slug, first: perPage * page }
    const data = await fetchGraphQL<any>(query, variables)
    const start = (page - 1) * perPage
    const end = start + perPage
    return {
      category: data.category ? { slug: data.category.slug, name: data.category.name } : undefined,
      posts: data.category ? data.category.posts.nodes.slice(start, end).map(mapPost) : [],
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
    const query = `query Tag($slug: ID!, $first: Int!){\n    tag(id:$slug, idType:SLUG){\n      slug name\n      posts(first:$first){nodes{slug title excerpt content date modified categories{nodes{slug name}} tags{nodes{slug name}} author{node{slug name}} featuredImage{node{sourceUrl}}}}\n    }\n  }`
    const variables = { slug, first: perPage * page }
    const data = await fetchGraphQL<any>(query, variables)
    const start = (page - 1) * perPage
    const end = start + perPage
    return {
      tag: data.tag ? { slug: data.tag.slug, name: data.tag.name } : undefined,
      posts: data.tag ? data.tag.posts.nodes.slice(start, end).map(mapPost) : [],
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
    const query = `query Author($slug: ID!, $first: Int!){\n    user(id:$slug, idType:SLUG){\n      slug name\n      posts(first:$first){nodes{slug title excerpt content date modified categories{nodes{slug name}} tags{nodes{slug name}} featuredImage{node{sourceUrl}} author{node{slug name}}}}\n    }\n  }`
    const variables = { slug, first: perPage * page }
    const data = await fetchGraphQL<any>(query, variables)
    const start = (page - 1) * perPage
    const end = start + perPage
    return {
      author: data.user ? { slug: data.user.slug, name: data.user.name } : undefined,
      posts: data.user ? data.user.posts.nodes.slice(start, end).map(mapPost) : [],
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
    return data.posts.nodes.slice(start, end).map(mapPost) as Post[]
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
