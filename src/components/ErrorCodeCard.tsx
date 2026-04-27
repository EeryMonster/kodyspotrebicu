import Link from 'next/link'
import { APPLIANCE_LABELS, SUBTYPE_LABELS } from '@/lib/utils'
import SeverityBadge from '@/components/SeverityBadge'

interface ErrorCodeCardProps {
  code: string
  title: string
  brand: string
  applianceType: string
  shortMeaning: string
  severityLevel: number
  slug: string
  subtype?: string | null
}

const appliancePath: Record<string, string> = {
  pracka: 'pracky',
  mycka: 'mycky',
  susicka: 'susicky',
}

export default function ErrorCodeCard({
  code, title, brand, applianceType, shortMeaning, severityLevel, slug, subtype
}: ErrorCodeCardProps) {
  return (
    <Link
      href={`/${brand.toLowerCase()}/${appliancePath[applianceType] || applianceType}/${slug}`}
      className="card group flex flex-col p-4 duration-200 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="code-badge">{code}</span>
        <SeverityBadge level={severityLevel} size="sm" />
      </div>

      <p className="text-xs text-gray-600 mb-1.5">
        {brand.charAt(0).toUpperCase() + brand.slice(1)} · {APPLIANCE_LABELS[applianceType] || applianceType}
        {subtype && <> · <span className="text-purple-600">{SUBTYPE_LABELS[subtype] || subtype}</span></>}
      </p>

      <h3 className="text-sm font-semibold text-gray-900 mb-1.5 leading-snug">{title}</h3>

      <p className="text-xs text-gray-600 line-clamp-2 flex-1 mb-3">{shortMeaning}</p>

      <div className="text-xs font-medium text-blue-600 group-hover:text-blue-800 transition-colors">
        Zobrazit řešení →
      </div>
    </Link>
  )
}
