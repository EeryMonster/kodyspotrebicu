import { ArrowUpRight, Wrench } from 'lucide-react'
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
    <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-7 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent-50 text-accent-700 shrink-0">
          <Wrench className="w-5 h-5" />
        </span>
        <h2 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">
          Náhradní díly pro {brandLabel}
        </h2>
      </div>

      <ul className="flex flex-col gap-2">
        {parts.map((part, i) => (
          <li key={i}>
            <a
              href={heurekaPartUrl(brand, part)}
              target="_blank"
              rel="sponsored nofollow noopener"
              {...heurekaProps}
              className={`${heurekaProps.className ?? ''} group flex items-center justify-between gap-3 px-4 py-3 bg-gray-50/60 hover:bg-accent-50/60 border border-gray-200 hover:border-accent-300 rounded-lg transition-all`.trim()}
            >
              <span className="text-sm font-semibold text-gray-900 group-hover:text-accent-700 leading-tight">
                {part}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 group-hover:text-accent-700 shrink-0">
                Porovnat ceny
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
