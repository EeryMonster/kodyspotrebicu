import { ShoppingCart, Settings } from 'lucide-react'
import { heurekaPartUrl, HEUREKA_DISCLOSURE } from '@/lib/heureka'

interface Props {
  brand: string
  parts: string[]
}

export default function RelatedParts({ brand, parts }: Props) {
  if (parts.length === 0) return null

  const brandLabel = brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase()

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2 tracking-tight">
        <Settings className="w-5 h-5 text-gray-500" /> Možné vadné díly
      </h2>
      <p className="text-sm text-gray-500 leading-relaxed mb-5">
        Najít náhradní díl pro {brandLabel}:
      </p>
      <ul className="flex flex-col gap-2">
        {parts.map((part, i) => (
          <li key={i}>
            <a
              href={heurekaPartUrl(brand, part)}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="group flex items-center justify-between gap-3 px-4 py-3 bg-gray-50/60 hover:bg-blue-50/60 border border-gray-200/60 hover:border-blue-200 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium text-gray-800 group-hover:text-blue-800 leading-tight">
                {part}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 group-hover:text-blue-700 shrink-0">
                <ShoppingCart className="w-4 h-4" />
                Heureka
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="text-[11px] text-gray-400 leading-relaxed mt-4">
        {HEUREKA_DISCLOSURE}
      </p>
    </div>
  )
}
