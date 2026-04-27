import { prisma } from '@/lib/prisma'
import Breadcrumbs from '@/components/Breadcrumbs'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nejčastější problémy spotřebičů',
  description: 'Symptomový rozcestník pro situace bez chybového kódu. Vyberte příznak závady pračky, myčky nebo sušičky a zjistěte bezpečný postup.',
  alternates: { canonical: 'https://www.kodyspotrebicu.cz/problemy' },
  openGraph: {
    title: 'Nejčastější problémy spotřebičů',
    description: 'Symptomový rozcestník pro situace bez chybového kódu. Vyberte příznak závady pračky, myčky nebo sušičky a zjistěte bezpečný postup.',
    url: 'https://www.kodyspotrebicu.cz/problemy',
  },
}

const SECTIONS = [
  { key: 'pracka', label: 'Pračky', icon: 'P', accent: 'border-l-blue-500', iconClass: 'bg-blue-50 text-blue-700' },
  { key: 'mycka', label: 'Myčky nádobí', icon: 'M', accent: 'border-l-cyan-500', iconClass: 'bg-cyan-50 text-cyan-700' },
  { key: 'susicka', label: 'Sušičky', icon: 'S', accent: 'border-l-sky-500', iconClass: 'bg-sky-50 text-sky-700' },
]

const GUIDE_ACCENT = 'border-l-slate-500'

const PRACTICAL_GUIDE_RE = /(^jak-|^nouzove-|zamek|vypusteni|stehovani|vypnout|otevreni|reset|cisteni)/i

type SymptomRow = {
  slug: string
  title: string
  description: string
  applianceTypes: string[]
  relatedCodes: string[]
  sections: unknown[]
}

function isPracticalGuide(symptom: Pick<SymptomRow, 'slug' | 'title'>) {
  return PRACTICAL_GUIDE_RE.test(symptom.slug) || /^(jak|nouzové|vypuštění|reset|čištění)/i.test(symptom.title)
}

function getCardMeta(symptom: SymptomRow) {
  const sectionCount = symptom.sections.length
  const meta = [isPracticalGuide(symptom) ? 'Návod krok za krokem' : 'Domácí kontrola']
  if (sectionCount > 0) meta.push(`${sectionCount} části`)
  if (symptom.relatedCodes.length > 0) meta.push(`${symptom.relatedCodes.length} kódy`)
  return meta
}

function SymptomCard({ symptom, accentClass }: { symptom: SymptomRow; accentClass: string }) {
  const meta = getCardMeta(symptom)

  return (
    <Link
      href={`/symptom/${symptom.slug}`}
      className={`group relative flex min-h-[124px] flex-col rounded-xl border border-gray-200 border-l-4 ${accentClass} bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold leading-snug text-gray-950 group-hover:text-blue-700">{symptom.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 line-clamp-2">{symptom.description}</p>
        </div>
        <span className="mt-0.5 shrink-0 text-lg font-medium text-gray-300 transition-colors group-hover:text-blue-600">→</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {meta.map((item, index) => (
          <span
            key={item}
            className={index === 0
              ? 'rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700'
              : 'rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-gray-600'
            }
          >
            {item}
          </span>
        ))}
      </div>
    </Link>
  )
}

export default async function ProblémyPage() {
  let symptoms: SymptomRow[] = []

  try {
    symptoms = await prisma.symptom.findMany({
      select: { slug: true, title: true, description: true, applianceTypes: true, relatedCodes: true, sections: true },
      orderBy: { title: 'asc' },
    })
  } catch { /* DB not ready */ }

  const practicalGuides = symptoms.filter(isPracticalGuide)
  const symptomProblems = symptoms.filter(s => !isPracticalGuide(s))
  const byType = (key: string) => symptomProblems.filter(s => s.applianceTypes.includes(key))
  const navItems = [
    ...SECTIONS.map((section) => ({
      href: `#${section.key}`,
      label: section.label,
      count: byType(section.key).length,
    })),
    {
      href: '#prakticke-navody',
      label: 'Praktické návody',
      count: practicalGuides.length,
    },
  ].filter(item => item.count > 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Problémy', href: '/problemy' }]} />
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Nejčastější problémy spotřebičů</h1>
      <p className="max-w-3xl text-gray-600 mb-5 leading-relaxed">
        Pokud spotřebič nezobrazuje chybový kód, vyberte příznak problému. Ukážeme vám nejčastější
        příčiny, co lze bezpečně zkontrolovat doma a kdy raději volat servis.
      </p>

      {symptoms.length === 0 ? (
        <p className="text-gray-500">Žádné symptomy v databázi.</p>
      ) : (
        <div className="space-y-10">
          <nav aria-label="Kategorie problémů" className="flex flex-wrap gap-2 border-b border-gray-200 pb-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-brand-border bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                {item.label} <span className="text-gray-400">({item.count})</span>
              </Link>
            ))}
          </nav>

          {SECTIONS.map(({ key, label, icon, accent, iconClass }) => {
            const items = byType(key)
            if (items.length === 0) return null
            return (
              <section key={key} id={key} className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${iconClass}`}>{icon}</span>
                  <h2 className="text-xl font-bold text-gray-900">{label}</h2>
                  <span className="text-sm text-gray-600">{items.length} průvodců</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {items.map((s) => (
                    <SymptomCard key={s.slug} symptom={s} accentClass={accent} />
                  ))}
                </div>
              </section>
            )
          })}

          {practicalGuides.length > 0 && (
            <section id="prakticke-navody" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">N</span>
                <h2 className="text-xl font-bold text-gray-900">Praktické návody</h2>
                <span className="text-sm text-gray-600">{practicalGuides.length} návodů</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {practicalGuides.map((s) => (
                  <SymptomCard key={s.slug} symptom={s} accentClass={GUIDE_ACCENT} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
