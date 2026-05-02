import { prisma } from '@/lib/prisma'
import { notFound, permanentRedirect } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { APPLIANCE_LABELS, SUBTYPE_LABELS, normalizeListItem, normalizeBodyText, SERVICE_CTA_URL, slugify } from '@/lib/utils'
import SeverityBadge from '@/components/SeverityBadge'
import CommentsSection from '@/components/CommentsSection'
import CopyCodeButton from '@/components/CopyCodeButton'
import ShareButtons from '@/components/ShareButtons'
import HelpfulRating from '@/components/HelpfulRating'
import { AlertCircle, AlertTriangle, CheckCircle2, ChevronRight, FileText, LayoutList, PhoneCall, Settings, Wrench, Calendar } from 'lucide-react'

interface Props {
  params: { brand: string; applianceType: string; code: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const entry = await prisma.errorCode.findUnique({
      where: { slug: params.code },
      select: { title: true, shortMeaning: true, code: true, brand: true, applianceType: true, slug: true },
    })
    if (!entry) return { title: 'Kód nenalezen' }
    const appliancePath = { pracka: 'pracky', mycka: 'mycky', susicka: 'susicky' }[entry.applianceType] || entry.applianceType
    const canonical = `https://www.kodyspotrebicu.cz/${entry.brand.toLowerCase()}/${appliancePath}/${entry.slug}`
    return {
      title: `Chyba ${entry.code} ${entry.brand}: ${entry.title} (Jak opravit)`,
      description: entry.shortMeaning,
      alternates: { canonical },
      openGraph: {
        title: `Chyba ${entry.code} ${entry.brand}: ${entry.title} (Jak opravit)`,
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

  // Redirect to canonical URL if path doesn't match (case mismatch, wrong brand path, etc.)
  const canonicalBrand = entry.brand.toLowerCase()
  const canonicalCode = entry.slug
  if (params.brand !== canonicalBrand || params.applianceType !== appliancePath || params.code !== canonicalCode) {
    permanentRedirect(`/${canonicalBrand}/${appliancePath}/${canonicalCode}`)
  }

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
    <div className="w-full max-w-[1000px] mx-auto px-4 py-8 md:py-12 flex flex-col gap-10">
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

      {/* Header Section */}
      <header className="flex flex-col gap-4">
        <Breadcrumbs items={[
          { label: entry.brand.charAt(0).toUpperCase() + entry.brand.slice(1), href: `/znacka/${entry.brand.toLowerCase()}` },
          { label: appliancePathLabel, href: `/${appliancePath}` },
          { label: entry.code },
        ]} />
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="flex flex-col gap-3 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Chybový kód</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
              <span className="font-mono text-brand-primary-dark">{entry.code}</span>
              <span className="ml-3">{entry.title}</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              {entry.shortMeaning}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 font-medium mt-2">
              <CopyCodeButton
                code={entry.code}
                brand={entry.brand.charAt(0).toUpperCase() + entry.brand.slice(1)}
                applianceLabel={appliancePathLabel}
                url={`https://www.kodyspotrebicu.cz/${entry.brand.toLowerCase()}/${appliancePath}/${params.code}`}
              />
              {entry.sourceUrl && (
                <>
                  <span className="text-gray-300">•</span>
                  <a href={entry.sourceUrl} target="_blank" rel="nofollow noopener" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    <FileText className="w-4 h-4" /> Oficiální zdroj
                  </a>
                </>
              )}
            </div>
          </div>
          
          <div className="flex gap-3 flex-wrap md:flex-col lg:flex-row shrink-0 mt-2 md:mt-0 items-start">
             <SeverityBadge level={entry.severityLevel} size="lg" className="shadow-sm" />
             {entry.subtype && (
               <div className="bg-white text-gray-700 border border-gray-200/60 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm shadow-sm">
                 <Settings className="w-4 h-4 text-gray-400" />
                 Model: {SUBTYPE_LABELS[entry.subtype] || entry.subtype}
               </div>
             )}
          </div>
        </div>
      </header>

      {/* Actionable Highlights (Bento Grid) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Safe to try at home (Green themed) */}
        {entry.canUserTrySafeChecks && entry.safeChecks.length > 0 ? (
          <div className="bg-white border border-green-700/20 rounded-xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-800 text-white p-2 rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-green-800 tracking-tight">Lze bezpečně zkusit doma</h2>
            </div>
            <ul className="flex flex-col gap-4 text-gray-700">
              {entry.safeChecks.map((check, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-bold text-xs mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{normalizeListItem(check)}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-white border border-yellow-500/20 rounded-xl p-6 md:p-8 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-yellow-600 text-white p-2 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-yellow-800 tracking-tight">Nedoporučujeme domácí opravu</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">Tento typ závady vyžaduje zásah odborného technika. Je lepší neriskovat další poškození nebo úraz elektrickým proudem.</p>
          </div>
        )}

        {/* Call service (Red themed) */}
        {entry.whenToStopAndCallService.length > 0 ? (
          <div className="bg-white border border-red-700/20 rounded-xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-600 text-white p-2 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-red-600 tracking-tight">Kdy okamžitě volat servis</h2>
            </div>
            <ul className="flex flex-col gap-4 text-gray-700">
              {entry.whenToStopAndCallService.map((w, i) => (
                <li key={i} className="flex items-start gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5 w-5 h-5" />
                  <span className="leading-relaxed">{normalizeListItem(w)}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
           <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm flex flex-col justify-center items-center text-center">
             <CheckCircle2 className="w-10 h-10 text-gray-300 mb-3" />
             <p className="text-gray-500 font-medium">Nejsou známa žádná specifická varování pro tento kód.</p>
           </div>
        )}
      </section>

      {/* Detailní postup řešení */}
      {entry.content?.length > 0 && (
        <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 md:p-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Detailní postup řešení</h2>
            <p className="text-gray-600">Následujte tyto kroky k izolaci a potenciálnímu vyřešení problému.</p>
          </div>
          <div className="p-6 md:p-8 flex flex-col gap-6">
            <div className="prose prose-blue max-w-none text-gray-700">
              {(entry.content as { type: string; value?: string; src?: string; alt?: string; tag?: string }[]).map((block, i) => {
                if (block.type === 'image' && block.src) {
                  return (
                    <div key={i} className="my-8 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 p-4 flex flex-col items-center">
                      <Image
                        src={block.src}
                        alt={block.alt || `${entry!.title} – obrázek`}
                        width={800}
                        height={500}
                        className="w-full object-contain max-h-96"
                      />
                      {block.alt && <p className="text-sm text-gray-600 mt-4 text-center">{block.alt}</p>}
                    </div>
                  )
                }
                if (block.type === 'text' && block.value) {
                  const Tag = (['h2','h3','h4'].includes(block.tag ?? '') ? block.tag : 'p') as 'p'|'h2'|'h3'|'h4'
                  return (
                    <Tag key={i} className={Tag === 'p' ? 'text-base leading-relaxed my-4' : 'text-xl font-bold text-gray-900 mt-8 mb-4'}>
                      {Tag === 'p' ? normalizeBodyText(block.value) : block.value}
                    </Tag>
                  )
                }
                return null
              })}
            </div>
          </div>
        </section>
      )}

      {/* Další informace (Příčiny a Součástky) */}
      {(entry.likelyCauses.length > 0 || entry.possibleParts.length > 0 || howToFaqItem) && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(entry.likelyCauses.length > 0 || howToFaqItem) && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              {entry.likelyCauses.length > 0 ? (
                <>
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 tracking-tight">
                    <LayoutList className="w-5 h-5 text-gray-500" /> Pravděpodobné příčiny
                  </h2>
                  <ul className="flex flex-col gap-3">
                    {entry.likelyCauses.map((cause, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></span>
                        <span className="text-gray-700 leading-relaxed text-sm">{normalizeListItem(cause)}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : howToFaqItem && (
                <>
                   <h2 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">Jak opravit chybu {entry.code}</h2>
                   <p className="text-sm leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">{howToFaqItem.a}</p>
                </>
              )}
            </div>
          )}
          
          {entry.possibleParts.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 tracking-tight">
                <Settings className="w-5 h-5 text-gray-500" /> Možné vadné díly
              </h2>
              <div className="flex flex-wrap gap-2">
                {entry.possibleParts.map((part, i) => (
                  <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200/60">{part}</span>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Service Call-to-Action */}
      <section className="bg-brand-primary-dark text-white rounded-xl p-8 md:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 mt-4">
        <div className="flex flex-col gap-3 max-w-xl text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center justify-center md:justify-start gap-3 tracking-tight">
            <PhoneCall className="w-7 h-7 opacity-90" />
            Potřebujete odbornou pomoc?
          </h2>
          <p className="text-blue-100 text-base md:text-lg">Pokud chyba {entry.code} přetrvává, může být nutná výměna vadného dílu. Kontaktujte autorizovaný servis.</p>
        </div>

        <a
          href={SERVICE_CTA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-white text-brand-primary-dark font-semibold px-6 py-3.5 rounded-lg hover:bg-gray-50 transition-colors min-h-[48px] min-w-[200px] shrink-0"
        >
          <Calendar className="w-5 h-5" />
          Objednat technika
        </a>
      </section>

      {/* Podobné chybové kódy a problémy */}
      {(relatedEntries.length > 0 || relatedSymptomEntries.length > 0) && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {relatedEntries.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Podobné chybové kódy</h2>
              <div className="flex flex-col gap-3">
                {relatedEntries.slice(0, 4).map((c) => (
                  <Link
                    key={c.id}
                    href={`/${c.brand.toLowerCase()}/${c.applianceType === 'pracka' ? 'pracky' : c.applianceType === 'mycka' ? 'mycky' : 'susicky'}/${c.slug}`}
                    className="group/card flex flex-col gap-1.5 p-3.5 bg-gray-50/50 border border-gray-200/60 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                       <span className="text-sm font-semibold text-gray-900 group-hover/card:text-blue-700 transition-colors leading-tight">{c.code.length > 8 ? c.code.charAt(0).toUpperCase() + c.code.slice(1).toLowerCase() : c.code}</span>
                       <SeverityBadge level={c.severityLevel} size="sm" />
                    </div>
                    <span className="text-xs text-gray-600 line-clamp-1">{c.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {relatedSymptomEntries.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Časté problémy</h2>
              <div className="flex flex-col gap-2">
                {relatedSymptomEntries.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/symptom/${slugify(s.slug)}`}
                    className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-200 group"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-400 mt-0.5 group-hover:text-blue-500 transition-colors shrink-0" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 leading-tight">{s.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Hodnocení + sdílení */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-t border-gray-200 mt-4">
        <HelpfulRating errorCodeId={entry.id} initialYes={entry.helpfulYes ?? 0} initialNo={entry.helpfulNo ?? 0} />
        <ShareButtons code={entry.code} title={entry.title} />
      </div>

      {/* Komentáře */}
      {entry && (
        <div className="mt-4">
          <CommentsSection
            errorCodeId={entry.id}
            initialComments={(entry.comments || []).map(c => ({
              ...c,
              createdAt: c.createdAt.toISOString()
            }))}
          />
        </div>
      )}
    </div>
  )
}
