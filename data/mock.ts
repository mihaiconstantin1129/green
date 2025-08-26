export interface Article {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author: string
  image: string
}

export const articles: Article[] = [
  {
    slug: 'prima-stire',
    title: 'Prima știre',
    excerpt: 'Rezumat scurt al primei știri.',
    content: '<p>Acesta este conținutul <strong>primei știri</strong>.</p>',
    category: 'general',
    tags: ['actualitate'],
    author: 'ion-pop',
    image: 'https://images.unsplash.com/photo-1522199710521-72d69614c702',
  },
  {
    slug: 'a-doua-stire',
    title: 'A doua știre',
    excerpt: 'Rezumat scurt al celei de-a doua știri.',
    content: '<p>Conținut pentru a doua știre.</p>',
    category: 'tehnologie',
    tags: ['tech'],
    author: 'maria-ionescu',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
  },
]

export const categories = [
  { slug: 'general', name: 'General' },
  { slug: 'tehnologie', name: 'Tehnologie' },
]

export const tags = [
  { slug: 'actualitate', name: 'Actualitate' },
  { slug: 'tech', name: 'Tech' },
]

export const authors = [
  { slug: 'ion-pop', name: 'Ion Pop' },
  { slug: 'maria-ionescu', name: 'Maria Ionescu' },
]

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug)
}

export function getArticlesByCategory(slug: string) {
  return articles.filter((a) => a.category === slug)
}

export function getArticlesByTag(slug: string) {
  return articles.filter((a) => a.tags.includes(slug))
}

export function getArticlesByAuthor(slug: string) {
  return articles.filter((a) => a.author === slug)
}

export function getPopular() {
  return articles.slice(0, 3)
}
