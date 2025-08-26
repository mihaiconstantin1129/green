import './globals.css'
import Link from 'next/link'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Știri',
  description: 'Site de știri static',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ro">
      <body className="min-h-screen flex flex-col">
        <header className="border-b">
          <div className="container mx-auto flex items-center justify-between py-4 px-4">
            <Link href="/" className="text-2xl font-bold">
              Știri
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
          © {new Date().getFullYear()} Știri. Toate drepturile rezervate.
        </footer>
      </body>
    </html>
  )
}
