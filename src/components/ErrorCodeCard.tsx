import Link from 'next/link'
import { SEVERITY_LABELS, SEVERITY_COLORS, APPLIANCE_LABELS, SUBTYPE_LABELS } from '@/lib/utils'

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
      className="block bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
            {code}
          </span>
          <span className="text-xs text-gray-500">{brand} · {APPLIANCE_LABELS[applianceType] || applianceType}</span>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {subtype && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-50 text-purple-700 border border-purple-100">
              {SUBTYPE_LABELS[subtype] || subtype}
            </span>
          )}
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SEVERITY_COLORS[severityLevel] || SEVERITY_COLORS[2]}`}>
            {SEVERITY_LABELS[severityLevel] || 'Střední'}
          </span>
        </div>
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-xs text-gray-600 line-clamp-2">{shortMeaning}</p>
    </Link>
  )
}
