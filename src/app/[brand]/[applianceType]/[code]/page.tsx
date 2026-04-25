import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import ErrorCodeCard from '@/components/ErrorCodeCard'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { APPLIANCE_LABELS, SUBTYPE_LABELS, normalizeListItem, normalizeBodyText } from '@/lib/utils'
import SeverityBadge from '@/components/SeverityBadge'
import CommentsSection from '@/components/CommentsSection'
import CopyCodeButton from '@/components/CopyCodeButton'
import ShareButtons from '@/components/ShareButtons'
import HelpfulRating from '@/components/HelpfulRating'
import ServiceCtaBox from '@/components/ServiceCtaBox'

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
    const canonical = `https://www.kodyspotrebicu.cz/${entry.brand.toLowerCase()}/${appliancePath}/${params.code}`
    return {
      title: `${entry.code} – ${entry.title} (${entry.brand})`,
      description: entry.shortMeaning,
      alternates: { canonical },
      openGraph: {
        title: `${entry.code} – ${entry.title} (${entry.brand})`,
        description: entry.shortMeaning,
        url: canonical,
      },
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
    images: string[];
    content: unknown[];
    helpfulYes: number;
    helpfulNo: number;
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
  const HOW_TO_RE = /jak\s+(opravit|resetovat|odstranit|vyřešit|vyčistit|vypnout|zbavit|deaktivovat)/i
  const howToFaqItem = faqItems.find(f => HOW_TO_RE.test(f.q)) ?? null
  const otherFaqItems = faqItems.filter(f => !HOW_TO_RE.test(f.q))

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

  const CARD_SEVERITY_STYLE: Record<number, string> = {
    1: 'border-l-green-400 bg-green-50',
    2: 'border-l-yellow-400 bg-yellow-50',
    3: 'border-l-orange-400 bg-orange-50',
    4: 'border-l-red-400 bg-red-50',
  }
  const cardSeverityStyle = CARD_SEVERITY_STYLE[entry.severityLevel] ?? 'border-l-gray-300 bg-gray-50'

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
        { label: entry.brand.charAt(0).toUpperCase() + entry.brand.slice(1), href: `/znacka/${entry.brand.toLowerCase()}` },
        { label: appliancePathLabel, href: `/${appliancePath}` },
        { label: entry.code },
      ]} />

      {/* Diagnostická karta */}
      <div className={`mb-6 rounded-xl border-l-4 p-5 md:p-6 ${cardSeverityStyle}`}>
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="font-mono text-3xl font-bold text-blue-700 bg-white px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm">
            {entry.code}
          </span>
          <SeverityBadge level={entry.severityLevel} size="md" />
          <CopyCodeButton
            code={entry.code}
            brand={entry.brand.charAt(0).toUpperCase() + entry.brand.slice(1)}
            applianceLabel={appliancePathLabel}
            url={`https://www.kodyspotrebicu.cz/${entry.brand.toLowerCase()}/${appliancePath}/${params.code}`}
          />
          {entry.altCodes.map((alt) => (
            <span key={alt} className="font-mono text-sm text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
              {alt}
            </span>
          ))}
          {entry.subtype && (
            <span className="text-sm px-3 py-1 rounded-full font-medium bg-purple-50 text-purple-700 border border-purple-100">
              {SUBTYPE_LABELS[entry.subtype] || entry.subtype}
            </span>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{entry.title}</h1>
        <p className="text-base text-gray-700 mb-3">{entry.shortMeaning}</p>

        <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-4">
          <Link href={`/znacka/${entry.brand.toLowerCase()}`} className="hover:text-blue-600">
            {entry.brand.charAt(0).toUpperCase() + entry.brand.slice(1)}
          </Link>
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

        <div className="flex flex-wrap gap-3 mb-5">
          {entry.canUserTrySafeChecks && entry.safeChecks.length > 0 && (
            <a href="#bezpecne-kroky" className="btn-primary">
              ✅ Zkusit bezpečně doma
            </a>
          )}
          <a
            href="https://www.firmy.cz/?q=servis+dom%C3%A1c%C3%ADch+spot%C5%99ebi%C4%8D%C5%AF"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            🔧 Najít servis
          </a>
        </div>

      </div>

      {/* 3+4: Bezpečné kroky + servisní CTA */}
      <div id="bezpecne-kroky" className="space-y-4 mb-6">
        {entry.canUserTrySafeChecks && entry.safeChecks.length > 0 ? (
          <section className="bg-green-50 border border-green-200 rounded-xl p-5">
            <h2 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
              <span>✅</span> Lze bezpečně zkusit doma
            </h2>
            {entry.severityLevel === 4 && (
              <p className="text-sm text-orange-800 bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                ⚠️ Jde o kritickou závadu — postupujte opatrně a při jakékoliv pochybnosti ihned volejte servis.
              </p>
            )}
            <ol className="space-y-3">
              {entry.safeChecks.map((check, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-green-900">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-200 text-green-900 text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  {normalizeListItem(check)}
                </li>
              ))}
            </ol>
          </section>
        ) : (
          <section className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
            <h2 className="font-semibold text-yellow-900 mb-1">⚠️ Nedoporučuje se domácí oprava</h2>
            <p className="text-sm text-yellow-800">Tento typ závady vyžaduje zásah odborného technika.</p>
          </section>
        )}

        {entry.whenToStopAndCallService.length > 0 && (
          <section className="bg-red-50 border border-red-200 rounded-xl p-5">
            <h2 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
              <span>🔴</span> Kdy okamžitě volat servis
            </h2>
            <ul className="space-y-1.5">
              {entry.whenToStopAndCallService.map((w, i) => (
                <li key={i} className="text-sm leading-relaxed text-red-800 flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 font-bold">!</span>
                  {normalizeListItem(w)}
                </li>
              ))}
            </ul>
          </section>
        )}

        <ServiceCtaBox severity={entry.severityLevel} context="error-detail" />
      </div>

      {/* 5: Detailní vysvětlení */}
      <div className="space-y-6 mb-6">
        {entry.content?.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Postup řešení</h2>
            {(entry.content as { type: string; value?: string; src?: string; alt?: string; tag?: string }[]).map((block, i) => {
              if (block.type === 'image' && block.src) {
                return (
                  <a key={i} href={block.src} target="_blank" rel="noopener noreferrer" className="block">
                    <Image
                      src={block.src}
                      alt={block.alt || `${entry!.title} – obrázek`}
                      width={700}
                      height={400}
                      className="rounded-lg w-full object-contain max-h-72 border border-gray-100 hover:opacity-90 transition-opacity"
                    />
                  </a>
                )
              }
              if (block.type === 'text' && block.value) {
                const Tag = (['h2','h3','h4'].includes(block.tag ?? '') ? block.tag : 'p') as 'p'|'h2'|'h3'|'h4'
                return (
                  <Tag key={i} className={Tag === 'p' ? 'text-sm leading-relaxed text-gray-700' : 'text-base font-semibold text-gray-800 mt-2 mb-1'}>
                    {Tag === 'p' ? normalizeBodyText(block.value) : block.value}
                  </Tag>
                )
              }
              return null
            })}
          </section>
        )}

        {/* 6: Příčiny */}
        {entry.likelyCauses.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Pravděpodobné příčiny</h2>
            <ul className="space-y-2">
              {entry.likelyCauses.map((cause, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-gray-700">
                  <span className="text-blue-500 mt-1 shrink-0">•</span>
                  {normalizeListItem(cause)}
                </li>
              ))}
            </ul>
          </section>
        )}

        {howToFaqItem && !(entry.canUserTrySafeChecks && entry.safeChecks.length > 0) && (
          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Jak opravit chybu {entry.code}</h2>
            <p className="text-sm text-gray-700">{howToFaqItem.a}</p>
          </section>
        )}

        {/* 7: Možné součástky */}
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

        {/* 8: Podobné kódy */}
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

        {/* 9: Související problémy */}
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

        {/* 10: FAQ */}
        {otherFaqItems.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Časté dotazy</h2>
            <div className="space-y-4">
              {otherFaqItems.map((f, i) => (
                <div key={i}>
                  <h3 className="font-medium text-gray-900 mb-1">{normalizeBodyText(f.q)}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{normalizeBodyText(f.a)}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 11+12: Hodnocení + sdílení */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-gray-200 mb-6">
        <HelpfulRating errorCodeId={entry.id} initialYes={entry.helpfulYes ?? 0} initialNo={entry.helpfulNo ?? 0} />
        <ShareButtons code={entry.code} title={entry.title} />
      </div>

      {/* 13: Komentáře */}
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
