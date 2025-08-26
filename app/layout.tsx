import './globals.css'
import Link from 'next/link'
import { ReactNode } from 'react'
import type { Metadata } from 'next'
import { siteUrl } from '@/lib/utils'
import AdsenseSlot from '@/components/AdsenseSlot'
import { Inter, Playfair_Display } from 'next/font/google'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({
  subsets: ['latin'],
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ro" className={`${inter.variable} ${playfair.variable}`}>
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
              <Link href="/categorie/mediu" className="hover:text-accent">
                Mediu
              </Link>
              <Link href="/categorie/energie-verde" className="hover:text-accent">
                Energie Verde
              </Link>
              <Link href="/categorie/inovatie" className="hover:text-accent">
                Inovație
              </Link>
              <Link href="/categorie/politici-economie" className="hover:text-accent">
                Politici & Economie
              </Link>
              <Link href="/categorie/lifestyle-sustenabil" className="hover:text-accent">
                Lifestyle Sustenabil
              </Link>
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
                <li>
                  <Link
                    href="/categorie/mediu"
                    className="hover:text-accent"
                  >
                    Mediu
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categorie/energie-verde"
                    className="hover:text-accent"
                  >
                    Energie Verde
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categorie/inovatie"
                    className="hover:text-accent"
                  >
                    Inovație
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categorie/politici-economie"
                    className="hover:text-accent"
                  >
                    Politici & Economie
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categorie/lifestyle-sustenabil"
                    className="hover:text-accent"
                  >
                    Lifestyle Sustenabil
                  </Link>
                </li>
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
