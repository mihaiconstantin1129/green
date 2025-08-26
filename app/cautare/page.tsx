'use client'

import { useState } from 'react'
import ArticleCard from '@/components/ArticleCard'
import { articles } from '@/data/mock'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const results = articles.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Căutare</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Caută..."
        className="border p-2 w-full mb-4"
      />
      <div className="space-y-8">
        {results.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </div>
  )
}
