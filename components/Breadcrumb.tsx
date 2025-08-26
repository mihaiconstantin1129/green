import Link from 'next/link'

export interface Crumb {
  label: string
  href?: string
}

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="text-sm mb-4">
      <ol className="flex flex-wrap gap-1 text-gray-600">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center">
            {item.href ? (
              <Link href={item.href} className="hover:underline">
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
            {idx < items.length - 1 && <span className="px-1">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
