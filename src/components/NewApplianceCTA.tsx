import { ShoppingBag, ArrowRight } from 'lucide-react'
import { heurekaNewApplianceUrl, heurekaLinkProps, HEUREKA_DISCLOSURE } from '@/lib/heureka'
import { APPLIANCE_LABELS } from '@/lib/utils'

interface Props {
  brand: string
  applianceType: string
  severityLevel: number
}

// Zobrazí se jen pro nejzávažnější chyby (severityLevel === 3), kde svépomocná
// oprava obvykle není rentabilní a uživatel řeší otázku „opravit, nebo koupit nové".
export default function NewApplianceCTA({ brand, applianceType, severityLevel }: Props) {
  if (severityLevel !== 3) return null

  const brandLabel = brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase()
  const applianceLabel = (APPLIANCE_LABELS[applianceType] ?? applianceType).toLowerCase()
  const heurekaProps = heurekaLinkProps()

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2 max-w-xl">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gray-500" />
            Vyplatí se ještě opravovat?
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            U závažnějších poruch může cena opravy přesáhnout polovinu hodnoty nového spotřebiče.
            Porovnejte si ceny nových {applianceLabel} značky {brandLabel} a zvažte výměnu.
          </p>
        </div>
        <a
          href={heurekaNewApplianceUrl(brand, applianceType)}
          target="_blank"
          rel="sponsored nofollow noopener"
          {...heurekaProps}
          className={`${heurekaProps.className ?? ''} inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-5 py-3 rounded-lg transition-colors min-h-[48px] shrink-0`.trim()}
        >
          Porovnat nové {applianceLabel}
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
      <p className="text-[11px] text-gray-400 leading-relaxed mt-4">
        {HEUREKA_DISCLOSURE}
      </p>
    </section>
  )
}
