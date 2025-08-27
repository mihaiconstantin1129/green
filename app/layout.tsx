import './globals.css'
import Link from 'next/link'
import { ReactNode } from 'react'
import { getCategories } from '@/lib/wp'
import type { Metadata } from 'next'
import { siteUrl } from '@/lib/utils'
import AdsenseSlot from '@/components/AdsenseSlot'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-playfair',
})


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

export default async function RootLayout({ children }: { children: ReactNode }) {
  let categories: { slug: string; name: string }[] = []
  let catError = false
  try {
    categories = await getCategories()
  } catch (e) {
    console.error(e)
    catError = true
  }
  return (
    <html lang="ro" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <meta name="google-adsense-account" content="ca-pub-9593023557482879" />
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
      <body className="flex min-h-screen flex-col bg-white text-black">
        <header className="sticky top-0 z-50 border-b bg-white">
          <AdsenseSlot className="w-full min-h-[90px] border-b" />
          <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
            <Link
              href="/"
              className="text-3xl font-serif font-bold text-accent"
            >
              Green News România
            </Link>
            <nav className="hidden flex-1 justify-center gap-6 text-sm md:flex">
              {catError ? (
                <span className="text-red-500">Eroare la categoriile</span>
              ) : (
                categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/categorie/${c.slug}`}
                    className="hover:text-accent"
                  >
                    {c.name}
                  </Link>
                ))
              )}
            </nav>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cautare" aria-label="Căutare">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </header>
        <main className="container mx-auto flex-1 px-4 py-8">{children}</main>
        <footer className="mt-12 bg-gray-50">
          <AdsenseSlot className="w-full min-h-[90px] border-b" />
          <div className="container mx-auto grid gap-8 px-4 py-12 text-sm md:grid-cols-3">
            <div>
              <h3 className="mb-2 font-serif font-semibold">Despre</h3>
              <p className="text-gray-600">
                Green News România este o publicație dedicată știrilor despre
                mediu și sustenabilitate.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-serif font-semibold">Link-uri rapide</h3>
              <ul className="space-y-2">
                {catError ? (
                  <li className="text-red-500">Eroare la categoriile</li>
                ) : (
                  categories.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/categorie/${c.slug}`}
                        className="hover:text-accent"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))
                )}
                <li>
                  <Link href="/contact" className="hover:text-accent">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/publicitate" className="hover:text-accent">
                    Publicitate
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-serif font-semibold">Social</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-accent">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent">
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t py-4 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Green News România. Toate drepturile
            rezervate.
          </div>
        </footer>
      </body>
    </html>
  )
}
