import { SEVERITY_COLORS, SEVERITY_DESCRIPTIONS, SEVERITY_LABELS } from '@/lib/utils'

interface Props {
  level: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const FALLBACK_CLASSES = 'bg-gray-100 text-gray-500 border border-gray-200'
const FALLBACK_LABEL = 'Neznámá'
const FALLBACK_DESCRIPTION = 'Závažnost není k dispozici'

function SeverityIcon({ level }: { level: number }) {
  if (level === 1) {
    return (
      <span aria-hidden="true" className="inline-flex h-3.5 w-3.5 items-center justify-center">
        <span className="block h-2 w-1.5 rotate-45 border-b-2 border-r-2 border-current" />
      </span>
    )
  }

  return <span aria-hidden="true" className="font-bold leading-none">!</span>
}

export default function SeverityBadge({ level, size = 'sm', className }: Props) {
  const label = SEVERITY_LABELS[level] ?? FALLBACK_LABEL
  const classes = SEVERITY_COLORS[level] ?? FALLBACK_CLASSES
  const description = SEVERITY_DESCRIPTIONS[level] ?? FALLBACK_DESCRIPTION

  if (size === 'lg') {
    return (
      <div
        className={`group/badge relative inline-flex items-center gap-3 rounded-xl px-4 py-2.5 font-medium cursor-help ${classes}${className ? ` ${className}` : ''}`}
        title={description}
        aria-label={`Závažnost ${level} ze 4 — ${label}. ${description}`}
        tabIndex={0}
      >
        <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/70 text-lg font-bold">
          {level}
        </span>
        <span className="flex flex-col items-start leading-tight">
          <span className="text-base font-semibold">{label} závažnost</span>
          <span className="text-xs opacity-80">úroveň {level} ze 4</span>
        </span>
        <span
          role="tooltip"
          className="pointer-events-none absolute right-0 top-full z-30 mt-2 hidden w-64 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-normal leading-relaxed text-gray-700 shadow-lg group-hover/badge:block group-focus/badge:block"
        >
          {description}
        </span>
      </div>
    )
  }

  const sizeClasses = size === 'md' ? 'text-sm px-3 py-1' : 'text-xs px-2 py-0.5'
  const visibleLabel = size === 'md' ? `${label} závažnost` : label

  return (
    <span
      className={`group/badge relative inline-flex items-center gap-1.5 rounded-lg font-medium cursor-help ${sizeClasses} ${classes}${className ? ` ${className}` : ''}`}
      title={description}
      aria-label={`${visibleLabel}. ${description}`}
      tabIndex={0}
    >
      <SeverityIcon level={level} />
      {visibleLabel}
      <span
        role="tooltip"
        className="pointer-events-none absolute left-0 top-full z-30 mt-2 hidden w-64 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-normal leading-relaxed text-gray-700 shadow-lg group-hover/badge:block group-focus/badge:block"
      >
        {description}
      </span>
    </span>
  )
}
