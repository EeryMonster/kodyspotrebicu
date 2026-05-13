import { CATEGORY_CONTENT } from '@/lib/category-content'
import { Layers, AlertOctagon, Wrench, Clock, HelpCircle, ChevronDown } from 'lucide-react'

interface Props {
  applianceType: 'pracka' | 'mycka' | 'susicka'
  categoryLabel: string
}

const APPLIANCE_GENITIV: Record<string, string> = {
  pracka: 'pračkách',
  mycka: 'myčkách',
  susicka: 'sušičkách',
}

export default function CategoryRichContent({ applianceType, categoryLabel }: Props) {
  const content = CATEGORY_CONTENT[applianceType]
  if (!content) return null

  const genitivPlural = APPLIANCE_GENITIV[applianceType] ?? applianceType

  const faqSchema = content.faq && content.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <details className="group bg-white border border-gray-200 border-l-4 border-l-accent-500 rounded-xl shadow-sm mb-6 [&_summary::-webkit-details-marker]:hidden">
        <summary className="cursor-pointer list-none p-5 md:p-6 flex items-center justify-between gap-4 select-none">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-700 mb-1">
              Expertní přehled
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight leading-tight">
              O {genitivPlural} a jejich chybách
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1.5">
              Generace · Nejčastější chyby napříč značkami · Údržba · Životnost · FAQ
            </p>
          </div>
          <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-50 border border-gray-200 text-gray-500 group-open:rotate-180 transition-transform">
            <ChevronDown className="w-4 h-4" />
          </span>
        </summary>

        <div className="px-5 md:px-6 pb-6 md:pb-8 pt-2">
          {content.generations && content.generations.length > 0 && (
            <div className="pt-4 mt-2 mb-8 border-t border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-accent-50 text-accent-700">
                  <Layers className="w-4 h-4" />
                </span>
                Generace {categoryLabel.toLowerCase()}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {content.generations.map((line, i) => {
                  const isTopTier = i === content.generations!.length - 1
                  return (
                    <div
                      key={i}
                      className={`rounded-lg p-4 transition-colors ${
                        isTopTier
                          ? 'bg-accent-50/60 border border-accent-300/60'
                          : 'bg-gray-50/60 border border-gray-200/60'
                      }`}
                    >
                      <h4 className={`text-sm font-semibold mb-2 ${isTopTier ? 'text-accent-700' : 'text-gray-900'}`}>
                        {line.name}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{line.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {content.commonProblems && content.commonProblems.length > 0 && (
            <div className="pt-6 mb-8 border-t border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-accent-50 text-accent-700">
                  <AlertOctagon className="w-4 h-4" />
                </span>
                Nejčastější chyby napříč značkami
              </h3>
              <ul className="flex flex-col gap-4">
                {content.commonProblems.map((problem, i) => (
                  <li key={i} className="bg-gray-50/60 border border-gray-200/60 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1.5">{problem.name}</h4>
                    <p className="text-xs font-mono text-gray-500 mb-2 leading-relaxed">{problem.codesAcrossBrands}</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{problem.tip}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {content.maintenance && (
            <div className="pt-6 mb-8 border-t border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-accent-50 text-accent-700">
                  <Wrench className="w-4 h-4" />
                </span>
                Údržba a péče
              </h3>
              <p className="text-[15px] text-gray-700 leading-relaxed">{content.maintenance}</p>
            </div>
          )}

          {content.longevity && (
            <div className="pt-6 mb-8 border-t border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-accent-50 text-accent-700">
                  <Clock className="w-4 h-4" />
                </span>
                Životnost a kdy se vyplatí opravovat
              </h3>
              <p className="text-[15px] text-gray-700 leading-relaxed">{content.longevity}</p>
            </div>
          )}

          {content.faq && content.faq.length > 0 && (
            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-accent-50 text-accent-700">
                  <HelpCircle className="w-4 h-4" />
                </span>
                Časté otázky o {genitivPlural}
              </h3>
              <dl className="flex flex-col gap-5">
                {content.faq.map((f, i) => (
                  <div key={i} className="pl-4 border-l-2 border-accent-300/50">
                    <dt className="text-sm font-semibold text-gray-900 mb-1.5 leading-snug">{f.q}</dt>
                    <dd className="text-sm text-gray-600 leading-relaxed">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </details>
    </>
  )
}
