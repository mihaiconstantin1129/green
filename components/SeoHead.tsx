'use client'

import Head from 'next/head'

interface SeoHeadProps {
  title?: string
  description?: string
  ogImage?: string
}

export default function SeoHead({ title, description, ogImage }: SeoHeadProps) {
  return (
    <Head>
      <title>{title ?? 'Default Title'}</title>
      <meta name="description" content={description ?? ''} />
      {ogImage && <meta property="og:image" content={ogImage} />}
    </Head>
  )
}

