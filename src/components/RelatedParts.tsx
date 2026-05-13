import { Search, ArrowUpRight, Wrench } from 'lucide-react'
import { heurekaPartUrl, heurekaLinkProps } from '@/lib/heureka'

interface Props {
  brand: string
  parts: string[]
}

export default function RelatedParts({ brand, parts }: Props) {
  if (parts.length === 0) return null

  const brandLabel = brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase()
  const heurekaProps = heurekaLinkProps()

  return (
    <div className="bg-white border border-gray-200 border-l-4 border-l-accent-500 rounded-xl p-6 md:p-7 shadow-sm">
      <div className="flex items-start gap-3 mb-5">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent-50 text-accent-700 shrink-0">
          <Wrench className="w-5 h-5" />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-700 mb-0.5">
            Náhradní díly
          </p>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">
            Najít díl pro {brandLabel} na Heurece
          </h2>
        </div>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {parts.map((part, i) => (
          <li key={i}>
            <a
              href={heurekaPartUrl(brand, part)}
              target="_blank"
              rel="sponsored nofollow noopener"
              {...heurekaProps}
              className={`${heurekaProps.className ?? ''} group flex items-center justify-between gap-3 px-4 py-3 bg-accent-50/40 hover:bg-accent-50 border border-accent-300/40 hover:border-accent-300 rounded-lg transition-all hover:shadow-sm`.trim()}
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <Search className="w-4 h-4 text-accent-600 shrink-0" />
                <span className="text-sm font-semibold text-gray-900 group-hover:text-accent-700 leading-tight truncate">
                  {part}
                </span>
              </span>
              <ArrowUpRight className="w-4 h-4 text-accent-600 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
