import { prisma } from '@/lib/prisma'
import { notFound, permanentRedirect } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import ErrorCodeCard from '@/components/ErrorCodeCard'
import Link from 'next/link'
import type { Metadata } from 'next'
import { slugify } from '@/lib/utils'

const APPLIANCE_LINKS: Record<string, { href: string; label: string }> = {
  pracka: { href: '/pracky', label: 'Chybové kódy praček' },
  mycka: { href: '/mycky', label: 'Chybové kódy myček' },
  susicka: { href: '/susicky', label: 'Chybové kódy sušiček' },
}

interface Section {
  q: string
  answer: string
  tips?: string[]
  steps?: string[]
}

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const decoded = decodeURIComponent(params.slug)
    const symptom = await prisma.symptom.findFirst({
      where: { OR: [{ slug: decoded }, { slug: slugify(decoded) }] },
      select: { title: true, description: true, slug: true },
    })
    if (!symptom) return { title: 'Symptom nenalezen' }
    const canonical = `https://www.kodyspotrebicu.cz/symptom/${slugify(symptom.slug)}`
    return {
      title: symptom.title,
      description: symptom.description,
      alternates: { canonical },
      openGraph: {
        title: symptom.title,
        description: symptom.description,
        url: canonical,
      },
    }
  } catch {
    return { title: 'Symptom' }
  }
}

export default async function SymptomPage({ params }: Props) {
  let symptom: {
    id: number; slug: string; title: string; description: string
    intro: string | null; sections: Section[]
    relatedCodes: string[]; applianceTypes: string[]
  } | null = null

  try {
    const decoded = decodeURIComponent(params.slug)
    const cleanSlug = slugify(decoded)
    if (decoded !== cleanSlug) permanentRedirect(`/symptom/${cleanSlug}`)

    const raw = await prisma.symptom.findFirst({
      where: { OR: [{ slug: decoded }, { slug: cleanSlug }] },
    })
    if (raw) {
      symptom = { ...raw, sections: (raw.sections as unknown as Section[]) ?? [] }
      // Redirect if DB slug differs from clean slug
      if (slugify(raw.slug) !== decoded) permanentRedirect(`/symptom/${slugify(raw.slug)}`)
    }
  } catch { /* ignore */ }

  if (!symptom) notFound()

  let relatedEntries: {
    id: number; code: string; title: string; brand: string
    applianceType: string; shortMeaning: string; severityLevel: number; slug: string
  }[] = []
  if (symptom.relatedCodes.length > 0) {
    try {
      relatedEntries = await prisma.errorCode.findMany({
        where: { slug: { in: symptom.relatedCodes } },
        select: { id: true, code: true, title: true, brand: true, applianceType: true, shortMeaning: true, severityLevel: true, slug: true },
      })
    } catch { /* ignore */ }
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: symptom.title,
    description: symptom.description,
    url: `https://www.kodyspotrebicu.cz/symptom/${slugify(symptom.slug)}`,
    publisher: {
      '@type': 'Organization',
      name: 'KódySpotřebičů.cz',
      url: 'https://www.kodyspotrebicu.cz',
    },
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Breadcrumbs items={[{ label: 'Problémy', href: '/problemy' }, { label: symptom.title }]} />
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{symptom.title}</h1>

      {symptom.intro && (
        <p className="text-gray-600 text-base mb-8 leading-relaxed">{symptom.intro}</p>
      )}

      {/* Sekce průvodce */}
      {symptom.sections.length > 0 && (
        <div className="space-y-8 mb-12">
          {symptom.sections.map((s, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                <span className="text-blue-600 mr-2">{i + 1}.</span>{s.q}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">{s.answer}</p>

              {s.steps && s.steps.length > 0 && (
                <ol className="space-y-2 mb-4">
                  {s.steps.map((step, si) => (
                    <li key={si} className="flex gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">
                        {si + 1}
                      </span>
                      <span className="text-gray-700 text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              )}

              {s.tips && s.tips.length > 0 && (
                <ul className="space-y-1.5">
                  {s.tips.map((tip, ti) => (
                    <li key={ti} className="flex gap-2 text-sm text-gray-600">
                      <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Související chybové kódy */}
      {relatedEntries.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Související chybové kódy</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {relatedEntries.map((c) => (
              <ErrorCodeCard key={c.id} {...c} />
            ))}
          </div>
        </section>
      )}

      {/* Odkazy na kategorie */}
      {symptom.applianceTypes.length > 0 && (
        <section className="border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500 mb-3">Databáze kódů pro tento spotřebič:</p>
          <div className="flex flex-wrap gap-2">
            {symptom.applianceTypes.map((type) => {
              const link = APPLIANCE_LINKS[type]
              if (!link) return null
              return (
                <Link
                  key={type}
                  href={link.href}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-blue-600 hover:border-blue-400 transition-colors"
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
