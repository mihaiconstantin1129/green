import './globals.css'
import Link from 'next/link'
import { ReactNode } from 'react'
import type { Metadata } from 'next'
import { siteUrl } from '@/lib/utils'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Green News România',
    template: '%s | Green News România',
  },
  description: 'Portal de știri din România',
  openGraph: {
    title: 'Green News România',
    description: 'Portal de știri din România',
    url: siteUrl,
    siteName: 'Green News România',
    type: 'website',
  },
  alternates: {
    canonical: siteUrl,
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ro">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Green News România',
              url: siteUrl,
              logo: `${siteUrl}/logo.png`,
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <header className="border-b">
          <div className="container mx-auto flex items-center justify-between py-4 px-4">
            <Link href="/" className="text-2xl font-bold">
              Green News România
            </Link>
            <nav className="space-x-4 text-sm">
              <Link href="/despre" className="hover:underline">
                Despre
              </Link>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
              <Link href="/publicitate" className="hover:underline">
                Publicitate
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
        <footer className="border-t py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Green News România. Toate drepturile rezervate.
        </footer>
      </body>
    </html>
  )
}
