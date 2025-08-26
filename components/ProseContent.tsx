import React from 'react'
import AdsenseSlot from './AdsenseSlot'

export default function ProseContent({ html }: { html: string }) {
  const parts = html.split(/<\/p>/i)
  const content: React.ReactNode[] = []

  parts.forEach((part, idx) => {
    if (part.trim()) {
      content.push(
        <div
          key={`p-${idx}`}
          dangerouslySetInnerHTML={{ __html: part + '</p>' }}
        />
      )
      if (idx === 2) {
        content.push(
          <AdsenseSlot
            key="ad"
            className="my-8 w-full min-h-[250px]"
          />
        )
      }
    }
  })

  return <div className="prose prose-lg max-w-none">{content}</div>
}
