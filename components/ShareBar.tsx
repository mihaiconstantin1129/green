'use client'

import { Facebook, Twitter } from 'lucide-react'

export default function ShareBar({ title }: { title: string }) {
  const url = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <div className="flex items-center gap-4 mt-4 text-sm">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-blue-600 hover:underline"
      >
        <Facebook className="w-4 h-4" /> Distribuie
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-sky-600 hover:underline"
      >
        <Twitter className="w-4 h-4" /> Tweet
      </a>
    </div>
  )
}
