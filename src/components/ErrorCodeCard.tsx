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
      className="card block p-4 hover:border-blue-300 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="code-badge">{code}</span>
          <span className="text-xs text-gray-500">{brand.charAt(0).toUpperCase() + brand.slice(1)} · {APPLIANCE_LABELS[applianceType] || applianceType}</span>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {subtype && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-50 text-purple-700 border border-purple-100">
              {SUBTYPE_LABELS[subtype] || subtype}
            </span>
          )}
          <SeverityBadge level={severityLevel} size="sm" />
        </div>
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-xs text-gray-600 line-clamp-2">{shortMeaning}</p>
    </Link>
  )
}
