const SERVICE_URL = 'https://www.firmy.cz/?q=servis+dom%C3%A1c%C3%ADch+spot%C5%99ebi%C4%8D%C5%AF'

interface Variant {
  heading: string
  body: string
  cta: string
  wrapperClass: string
}

const VARIANTS: Record<number, Variant> = {
  1: {
    heading: 'Potřebujete servisního technika?',
    body: 'Závada je pravděpodobně drobná, ale pokud si nejste jisti, raději se poraďte s odborníkem.',
    cta: 'Najít servis v okolí',
    wrapperClass: 'bg-white border border-brand-border',
  },
  2: {
    heading: 'Doporučujeme kontaktovat servis',
    body: 'Tento typ závady obvykle vyžaduje odborný zásah. Najděte ověřený servis ve vašem okolí.',
    cta: 'Najít servis v okolí',
    wrapperClass: 'bg-white border border-brand-border',
  },
  3: {
    heading: 'Kontaktujte servis co nejdříve',
    body: 'Závada je závažná a další provoz může spotřebič poškodit. Nechte ho co nejdříve opravit.',
    cta: 'Najít servis v okolí',
    wrapperClass: 'bg-orange-50 border border-orange-200',
  },
  4: {
    heading: 'Vypněte spotřebič a volejte servis',
    body: 'Kritická závada — okamžitě přestaňte spotřebič používat a přivolejte technika.',
    cta: 'Najít servis ihned',
    wrapperClass: 'bg-red-50 border border-red-200',
  },
}

const HOMEPAGE_VARIANT: Variant = {
  heading: 'Potřebujete servisního technika?',
  body: 'Pokud si s opravou nevíte rady, najděte ověřený servis ve vašem okolí.',
  cta: 'Najít servis v okolí →',
  wrapperClass: 'bg-blue-50 border border-blue-100',
}

interface ServiceCtaBoxProps {
  severity?: number
  context?: 'error-detail' | 'homepage'
  className?: string
}

export default function ServiceCtaBox({ severity, context = 'error-detail', className = '' }: ServiceCtaBoxProps) {
  const variant = context === 'homepage'
    ? HOMEPAGE_VARIANT
    : (severity != null ? VARIANTS[severity] : null) ?? VARIANTS[2]

  if (context === 'homepage') {
    return (
      <section className={`${variant.wrapperClass} rounded-xl p-6 text-center ${className}`}>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{variant.heading}</h2>
        <p className="text-gray-600 text-sm mb-4">{variant.body}</p>
        <a
          href={SERVICE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          data-cta="service"
          data-context="homepage"
        >
          {variant.cta}
        </a>
      </section>
    )
  }

  return (
    <div className={`${variant.wrapperClass} rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}>
      <div>
        <p className="font-medium text-gray-900 text-sm">{variant.heading}</p>
        <p className="text-xs text-gray-500 mt-0.5">{variant.body}</p>
      </div>
      <a
        href={SERVICE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary shrink-0"
        data-cta="service"
        data-context="error-detail"
        data-severity={severity ?? ''}
      >
        🔧 {variant.cta}
      </a>
    </div>
  )
}
