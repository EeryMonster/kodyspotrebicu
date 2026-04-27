import Link from 'next/link'
import { Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://www.kodyspotrebicu.cz' },
      ...items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: item.label,
        ...(item.href ? { item: `https://www.kodyspotrebicu.cz${item.href}` } : {}),
      })),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-gray-600 mb-4">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" aria-label="Domů" className="inline-flex items-center hover:text-blue-600 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              <Home className="w-4 h-4" />
            </Link>
          </li>
          {items.map((item, i) => {
            const isLast = i === items.length - 1
            return (
              <li key={i} className="flex items-center gap-1">
                <span aria-hidden="true" className="text-gray-400">/</span>
                {item.href && !isLast ? (
                  <Link href={item.href} className="hover:text-blue-600">{item.label}</Link>
                ) : (
                  <span aria-current={isLast ? 'page' : undefined} className="text-gray-700 font-medium">{item.label}</span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
