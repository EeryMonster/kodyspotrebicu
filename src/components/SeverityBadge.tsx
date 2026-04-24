interface Props {
  level: number
  size?: 'sm' | 'md'
  className?: string
}

type SeverityConfig = {
  label: string
  classes: string
  tooltip: string
}

const SEVERITY: Record<number, SeverityConfig> = {
  1: {
    label: 'Nízká',
    classes: 'bg-green-100 text-green-800 border border-green-300',
    tooltip: 'Nízká závažnost – spotřebič funguje, ale upozorňuje na drobný problém',
  },
  2: {
    label: 'Střední',
    classes: 'bg-yellow-100 text-yellow-900 border border-yellow-300',
    tooltip: 'Střední závažnost – doporučujeme prověřit co nejdříve',
  },
  3: {
    label: 'Vysoká',
    classes: 'bg-orange-200 text-orange-900 border border-orange-400',
    tooltip: 'Vysoká závažnost – spotřebič může být nebezpečný nebo hrozí poškození',
  },
  4: {
    label: 'Kritická',
    classes: 'bg-red-100 text-red-800 border border-red-300',
    tooltip: 'Kritická závažnost – okamžitě vypněte spotřebič a zavolejte servis',
  },
}

const FALLBACK: SeverityConfig = {
  label: 'Neznámá',
  classes: 'bg-gray-100 text-gray-500 border border-gray-200',
  tooltip: 'Závažnost není k dispozici',
}

export default function SeverityBadge({ level, size = 'sm', className }: Props) {
  const config = SEVERITY[level] ?? FALLBACK

  const sizeClasses = size === 'md' ? 'text-sm px-3 py-1' : 'text-xs px-2 py-0.5'

  return (
    <span
      className={`rounded-full font-medium cursor-help ${sizeClasses} ${config.classes}${className ? ` ${className}` : ''}`}
      title={config.tooltip}
      aria-label={`Závažnost: ${config.label}`}
    >
      {size === 'md' ? `Závažnost: ${config.label}` : config.label}
    </span>
  )
}
