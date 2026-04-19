import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import ErrorCodeCard from '@/components/ErrorCodeCard'
import Link from 'next/link'
import type { Metadata } from 'next'
import { SEVERITY_LABELS, SEVERITY_COLORS, SEVERITY_DESCRIPTIONS, APPLIANCE_LABELS, SUBTYPE_LABELS } from '@/lib/utils'
import CommentsSection from '@/components/CommentsSection'
import CopyCodeButton from '@/components/CopyCodeButton'
import ShareButtons from '@/components/ShareButtons'
import HelpfulRating from '@/components/HelpfulRating'

interface Props {
  params: { brand: string; applianceType: string; code: string }
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const entry = await prisma.errorCode.findUnique({
      where: { slug: params.code },
      select: { title: true, shortMeaning: true, code: true, brand: true, applianceType: true },
    })
    if (!entry) return { title: 'Kód nenalezen' }
    const appliancePath = { pracka: 'pracky', mycka: 'mycky', susicka: 'susicky' }[entry.applianceType] || entry.applianceType
    const canonical = `https://kodyspotrebicu.cz/${entry.brand.toLowerCase()}/${appliancePath}/${params.code}`
    return {
      title: `${entry.code} – ${entry.title} (${entry.brand})`,
      description: entry.shortMeaning,
      alternates: { canonical },
    }
  } catch {
    return { title: 'Kód chyby' }
  }
}

export default async function ErrorCodePage({ params }: Props) {
  let entry: {
    id: number; brand: string; applianceType: string; code: string; altCodes: string[];
    title: string; slug: string; shortMeaning: string; severityLevel: number;
    canUserTrySafeChecks: boolean; safeChecks: string[]; likelyCauses: string[];
    whenToStopAndCallService: string[]; relatedSymptoms: string[]; relatedCodes: string[];
    possibleParts: string[]; faq: unknown[]; sourceType: string; sourceUrl: string | null;
    subtype: string | null;
    comments?: { id: number; authorName: string; content: string; createdAt: Date }[];
  } | null = null

  try {
    entry = await prisma.errorCode.findUnique({ 
      where: { slug: params.code },
      include: {
        comments: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
          select: { id: true, authorName: true, content: true, createdAt: true }
        }
      }
    })
  } catch { /* DB not ready */ }

  if (!entry) notFound()

  const appliancePathLabel = APPLIANCE_LABELS[entry.applianceType] || entry.applianceType
  const appliancePath = { pracka: 'pracky', mycka: 'mycky', susicka: 'susicky' }[entry.applianceType] || entry.applianceType

  // Related codes
  let relatedEntries: { id: number; code: string; title: string; brand: string; applianceType: string; shortMeaning: string; severityLevel: number; slug: string }[] = []
  if (entry.relatedCodes.length > 0) {
    try {
      relatedEntries = await prisma.errorCode.findMany({
        where: { slug: { in: entry.relatedCodes } },
        select: { id: true, code: true, title: true, brand: true, applianceType: true, shortMeaning: true, severityLevel: true, slug: true },
        take: 6,
      })
    } catch { /* ignore */ }
  }

  // Related symptoms
  let relatedSymptomEntries: { slug: string; title: string; description: string }[] = []
  if (entry.relatedSymptoms.length > 0) {
    try {
      relatedSymptomEntries = await prisma.symptom.findMany({
        where: { slug: { in: entry.relatedSymptoms } },
        select: { slug: true, title: true, description: true },
        take: 6,
      })
    } catch { /* ignore */ }
  }

  const faqItems = (entry.faq || []) as { q: string; a: string }[]

  const howToSchema = entry.canUserTrySafeChecks && entry.safeChecks.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `Jak doma zkontrolovat a opravit chybu ${entry.code} – ${entry.title}`,
    description: entry.shortMeaning,
    step: entry.safeChecks.map((check, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: `Krok ${i + 1}`,
      text: check,
    })),
  } : null

  const faqSchema = faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <Breadcrumbs items={[
        { label: entry.brand, href: `/znacka/${entry.brand.toLowerCase()}` },
        { label: appliancePathLabel, href: `/${appliancePath}` },
        { label: entry.code },
      ]} />

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="font-mono text-2xl font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg">
            {entry.code}
          </span>
          <CopyCodeButton code={entry.code} />
          {entry.altCodes.map((alt) => (
            <span key={alt} className="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
              {alt}
            </span>
          ))}
          <span
            className={`text-sm px-3 py-1 rounded-full font-medium cursor-help ${SEVERITY_COLORS[entry.severityLevel] || SEVERITY_COLORS[2]}`}
            title={SEVERITY_DESCRIPTIONS[entry.severityLevel] || 'Střední závažnost – doporučujeme prověřit co nejdříve'}
          >
            Závažnost: {SEVERITY_LABELS[entry.severityLevel] || 'Střední'}
          </span>
          {entry.subtype && (
            <span className="text-sm px-3 py-1 rounded-full font-medium bg-purple-50 text-purple-700 border border-purple-100">
              {SUBTYPE_LABELS[entry.subtype] || entry.subtype}
            </span>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{entry.title}</h1>
        <p className="text-lg text-gray-600">{entry.shortMeaning}</p>
        <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-500">
          <Link href={`/znacka/${entry.brand.toLowerCase()}`} className="hover:text-blue-600">{entry.brand}</Link>
          <span>·</span>
          <Link href={`/${appliancePath}`} className="hover:text-blue-600">{appliancePathLabel}</Link>
          {entry.sourceUrl && (
            <>
              <span>·</span>
              <a href={entry.sourceUrl} target="_blank" rel="nofollow noopener" className="hover:text-blue-600">
                Oficiální zdroj
              </a>
            </>
          )}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <HelpfulRating errorCodeId={entry.id} />
          <ShareButtons code={entry.code} title={entry.title} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Likely causes */}
          {entry.likelyCauses.length > 0 && (
            <section className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Pravděpodobné příčiny</h2>
              <ul className="space-y-2">
                {entry.likelyCauses.map((cause, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-500 mt-0.5">•</span>
                    {cause}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Mobile-only CTA – sidebar není na mobilu viditelný */}
          <div className="md:hidden bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-gray-900">Potřebujete technika?</p>
            <a
              href="https://www.firmy.cz/?q=servis+dom%C3%A1c%C3%ADch+spot%C5%99ebi%C4%8D%C5%AF"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Najít servis →
            </a>
          </div>

          {/* Possible parts */}
          {entry.possibleParts.length > 0 && (
            <section className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Možné vadné součástky</h2>
              <div className="flex flex-wrap gap-2">
                {entry.possibleParts.map((part, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{part}</span>
                ))}
              </div>
            </section>
          )}

          {/* FAQ */}
          {faqItems.length > 0 && (
            <section className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Časté dotazy</h2>
              <div className="space-y-4">
                {faqItems.map((f, i) => (
                  <div key={i}>
                    <h3 className="font-medium text-gray-900 mb-1">{f.q}</h3>
                    <p className="text-sm text-gray-600">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related codes */}
          {relatedEntries.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Podobné chybové kódy</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {relatedEntries.map((c) => (
                  <ErrorCodeCard key={c.id} {...c} />
                ))}
              </div>
            </section>
          )}

          {/* Related symptoms */}
          {relatedSymptomEntries.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Související problémy</h2>
              <div className="space-y-2">
                {relatedSymptomEntries.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/symptom/${s.slug}`}
                    className="flex flex-col gap-0.5 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-900">{s.title}</span>
                    <span className="text-xs text-gray-500 line-clamp-2">{s.description}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Safe checks box */}
          {entry.canUserTrySafeChecks && entry.safeChecks.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h2 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <span>✅</span> Lze bezpečně zkusit doma
              </h2>
              <ul className="space-y-1.5">
                {entry.safeChecks.map((check, i) => (
                  <li key={i} className="text-sm text-green-800 flex items-start gap-1.5">
                    <span className="mt-0.5 shrink-0">→</span>
                    {check}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!entry.canUserTrySafeChecks && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h2 className="font-semibold text-yellow-900 mb-1">⚠️ Nedoporučuje se domácí oprava</h2>
              <p className="text-sm text-yellow-800">Tento typ závady vyžaduje zásah odborného technika.</p>
            </div>
          )}

          {/* When to call service */}
          {entry.whenToStopAndCallService.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h2 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                <span>🔴</span> Kdy okamžitě volat servis
              </h2>
              <ul className="space-y-1.5">
                {entry.whenToStopAndCallService.map((w, i) => (
                  <li key={i} className="text-sm text-red-800 flex items-start gap-1.5">
                    <span className="mt-0.5 shrink-0">!</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
            <p className="text-sm font-medium text-gray-900 mb-2">Potřebujete technika?</p>
            <a
              href="https://www.firmy.cz/?q=servis+dom%C3%A1c%C3%ADch+spot%C5%99ebi%C4%8D%C5%AF"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Najít servis v okolí →
            </a>
          </div>
        </div>
      </div>

      {entry && (
        <CommentsSection 
          errorCodeId={entry.id} 
          initialComments={(entry.comments || []).map(c => ({
            ...c,
            createdAt: c.createdAt.toISOString()
          }))} 
        />
      )}
    </div>
  )
}
