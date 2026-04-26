import { SERVICE_CTA_URL } from '@/lib/utils'
import { Wrench, PhoneCall, AlertTriangle, ChevronRight } from 'lucide-react'

interface Variant {
  heading: string
  body: string
  cta: string
  wrapperClass: string
  icon: React.ElementType
}

const VARIANTS: Record<number, Variant> = {
  1: {
    heading: 'Potřebujete technika?',
    body: 'Závada je pravděpodobně drobná, ale pokud si nejste jisti, raději se poraďte s odborníkem.',
    cta: 'Najít servis v okolí',
    wrapperClass: 'bg-white border border-gray-200/60 shadow-sm',
    icon: Wrench,
  },
  2: {
    heading: 'Doporučujeme servis',
    body: 'Tento typ závady obvykle vyžaduje odborný zásah. Najděte ověřený servis.',
    cta: 'Najít servis v okolí',
    wrapperClass: 'bg-white border border-gray-200/60 shadow-sm',
    icon: PhoneCall,
  },
  3: {
    heading: 'Kontaktujte servis co nejdříve',
    body: 'Závada je závažná a další provoz může spotřebič poškodit.',
    cta: 'Najít servis v okolí',
    wrapperClass: 'bg-orange-50/50 border border-orange-200/60 shadow-sm',
    icon: AlertTriangle,
  },
  4: {
    heading: 'Okamžitě volejte servis',
    body: 'Kritická závada — okamžitě přestaňte spotřebič používat a přivolejte technika.',
    cta: 'Najít servis ihned',
    wrapperClass: 'bg-red-50/50 border border-red-200/60 shadow-sm',
    icon: AlertTriangle,
  },
}

const HOMEPAGE_VARIANT: Variant = {
  heading: 'Potřebujete servisního technika?',
  body: 'Pokud si s opravou nevíte rady, najděte ověřený servis ve vašem okolí.',
  cta: 'Najít servis',
  wrapperClass: 'bg-blue-50/50 border border-blue-200/60 shadow-sm',
  icon: Wrench,
}

interface ServiceCtaBoxProps {
  severity?: number
  context?: 'error-detail' | 'homepage' | 'sidebar'
  className?: string
}

export default function ServiceCtaBox({ severity, context = 'error-detail', className = '' }: ServiceCtaBoxProps) {
  const variant = context === 'homepage'
    ? HOMEPAGE_VARIANT
    : (severity != null ? VARIANTS[severity] : null) ?? VARIANTS[2]
  
  const Icon = variant.icon

  if (context === 'homepage') {
    return (
      <section className={`${variant.wrapperClass} rounded-2xl p-6 md:p-8 text-center transition-all duration-300 hover:shadow-md ${className}`}>
        <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{variant.heading}</h2>
        <p className="text-gray-600 text-sm md:text-base mb-6 max-w-lg mx-auto">{variant.body}</p>
        <a
          href={SERVICE_CTA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary-lg shadow-sm"
          data-cta="service"
          data-context="homepage"
        >
          {variant.cta}
          <ChevronRight className="w-4 h-4" />
        </a>
      </section>
    )
  }

  if (context === 'sidebar') {
    return (
      <div className={`${variant.wrapperClass} rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden group transition-all duration-300 hover:shadow-md ${className}`}>
        {/* Decorative background element */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="flex items-start gap-3 relative z-10">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100">
            <Icon className={`w-5 h-5 ${severity === 4 ? 'text-red-500' : severity === 3 ? 'text-orange-500' : 'text-blue-500'}`} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-base">{variant.heading}</h2>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">{variant.body}</p>
          </div>
        </div>
        
        <a
          href={SERVICE_CTA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          data-cta="service"
          data-context="sidebar"
          data-severity={severity ?? ''}
        >
          {variant.cta}
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>
    )
  }

  return (
    <div className={`${variant.wrapperClass} rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 hover:shadow-md ${className}`}>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100">
           <Icon className={`w-5 h-5 ${severity === 4 ? 'text-red-500' : severity === 3 ? 'text-orange-500' : 'text-blue-500'}`} />
        </div>
        <div>
          <h2 className="font-semibold text-gray-900 text-base">{variant.heading}</h2>
          <p className="text-sm text-gray-600 mt-0.5">{variant.body}</p>
        </div>
      </div>
      <a
        href={SERVICE_CTA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-900 text-sm font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
        data-cta="service"
        data-context="error-detail"
        data-severity={severity ?? ''}
      >
        {variant.cta}
      </a>
    </div>
  )
}
