import { prisma } from '@/lib/prisma'
import ErrorCodeCard from '@/components/ErrorCodeCard'
import Breadcrumbs from '@/components/Breadcrumbs'
import { notFound, permanentRedirect } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { BRAND_CONTENT } from '@/lib/brand-content'
import { Layers, Lightbulb, Clock, HelpCircle, ChevronDown } from 'lucide-react'

interface Props {
  params: { brand: string }
}

const APPLIANCE_LABELS: Record<string, string> = {
  pracka: 'Pračky',
  mycka: 'Myčky',
  susicka: 'Sušičky',
}

const BRAND_INTROS: Record<string, { paragraphs: string[] }> = {
  bosch: { paragraphs: [
    'Bosch je německá značka s dlouhou tradicí ve výrobě domácích spotřebičů. Pračky, myčky a sušičky Bosch patří v Česku k nejrozšířenějším – díky husté servisní síti a dobré dostupnosti náhradních dílů jsou oblíbeny i u techniků.',
    'Chybové kódy Bosch začínají nejčastěji písmenem E nebo F. Kódy jsou z velké části totožné se spotřebiči Siemens, protože obě značky patří do skupiny BSH a sdílí konstrukční platformy. Pokud váš spotřebič zobrazí kód, zkontrolujte nejprve filtr, přívod a odpad vody.',
  ]},
  siemens: { paragraphs: [
    'Siemens je prémiová německá značka patřící do skupiny BSH (Bosch-Siemens Hausgeräte). Spotřebiče Siemens sdílí konstrukční základ s Bosch – chybové kódy jsou proto u obou značek totožné nebo velmi podobné.',
    'Starší myčky Siemens řady SE a SF (do roku 2010) nemají displej a chyby hlásí blikáním kontrolky. Novější modely řady iQ300, iQ500 a iQ700 zobrazují kódy přímo na displeji ve formátu E + číslo.',
  ]},
  aeg: { paragraphs: [
    'AEG je prémiová značka skupiny Electrolux se silnou tradicí v Německu a Skandinávii. Pračky a sušičky AEG jsou známé kvalitním zpracováním a inovativními funkcemi jako ProSteam nebo AbsoluteCare.',
    'Chybové kódy AEG praček používají formát E + číslo (E10, E20, E30, E40...). Kódy jsou z velké části shodné se spotřebiči Electrolux, protože obě značky sdílí technické platformy. Sušičky AEG používají podobný systém s kódy E5x a E6x.',
  ]},
  electrolux: { paragraphs: [
    'Electrolux je švédský nadnárodní výrobce domácích spotřebičů s více než 100 lety tradice. Pod skupinu Electrolux patří i značky AEG, Zanussi a Frigidaire – chybové kódy jsou proto u těchto značek velmi podobné nebo totožné.',
    'Pračky Electrolux používají kódy ve formátu E + číslo, shodné s AEG. Myčky signalizují chyby kódy i01, i20, i30 apod. Sušičky Electrolux sdílí platformu se sušičkami AEG a používají kódy řady E5x a E6x.',
  ]},
  samsung: { paragraphs: [
    'Samsung patří mezi největší světové výrobce elektroniky a domácích spotřebičů. Pračky, myčky a sušičky Samsung jsou vybaveny digitálním displejem, který zobrazuje chybové kódy přímo – bez nutnosti počítat bliknutí kontrolky.',
    'Kódy Samsung mají formát písmeno + číslo (4E, 5E, E2, OE...) nebo číslice + písmeno. Novější modely jsou vybaveny funkcí Smart Control a diagnostikou přes aplikaci Samsung SmartThings – ta umí chybový kód identifikovat a navrhnout řešení automaticky.',
  ]},
  beko: { paragraphs: [
    'Beko je turecká značka patřící do skupiny Arçelik, která je jedním z největších evropských výrobců domácích spotřebičů. Spotřebiče Beko jsou oblíbeny pro příznivý poměr ceny a výkonu a dobrou dostupnost náhradních dílů.',
    'Chybové kódy Beko praček mají formát E + číslo nebo F + číslo. Kódy jsou podobné ostatním evropským výrobcům – E02 signalizuje problém s odpadem vody, E03 závadu čerpadla, E04 přetečení. Myčky Beko používají kódy E01–E08 pro různé podsystémy.',
  ]},
  whirlpool: { paragraphs: [
    'Whirlpool je americký výrobce domácích spotřebičů s evropskými výrobními závody v Polsku a Itálii. Pod skupinu Whirlpool patří i značky Indesit a Hotpoint – kódy chyb jsou proto u těchto značek velmi podobné.',
    'Chybové kódy Whirlpool praček začínají nejčastěji písmenem F (F01–F21) nebo E. Model spotřebiče najdete na štítku uvnitř dvířek – je důležitý pro přesnou identifikaci kódu, protože starší a novější modely mohou používat odlišné kódy.',
  ]},
  miele: { paragraphs: [
    'Miele je německá prémiová značka s více než 120 lety tradice, proslulá mimořádnou životností spotřebičů – pračky a myčky Miele jsou testovány na 20 let provozu. Spotřebiče Miele jsou vyráběny výhradně v Německu a Rakousku.',
    'Chybové kódy Miele praček a myček mají formát F + číslo (F10, F11, F20...) nebo technické označení jako "Chyba čerpadla" přímo na displeji. Novější modely Miele jsou vybaveny systémem Miele@home umožňujícím vzdálenou diagnostiku přes aplikaci.',
  ]},
  lg: { paragraphs: [
    'LG je jihokorejský výrobce s inovativními technologiemi v oblasti domácích spotřebičů. Pračky LG jsou proslulé technologií přímého pohonu Direct Drive – motor je přímo spojen s bubnem bez řemene, což snižuje hlučnost a zvyšuje životnost.',
    'Chybové kódy LG praček mají formát písmeno + E nebo dvoupísmenný kód (OE, IE, UE, LE, PE...). Novější modely LG jsou vybaveny funkcí ThinQ – diagnostiku lze spustit přes aplikaci LG ThinQ, která kód identifikuje a navrhne postup bez nutnosti volat servis.',
  ]},
}

const APPLIANCE_PATHS: Record<string, string> = {
  pracka: 'pracky',
  mycka: 'mycky',
  susicka: 'susicky',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const brandName = params.brand.charAt(0).toUpperCase() + params.brand.slice(1)
  let count = 0
  try {
    count = await prisma.errorCode.count({
      where: { brand: { equals: params.brand, mode: 'insensitive' } },
    })
  } catch { /* ignore */ }
  const countLabel = count > 0 ? `${count}+` : 'Kompletní přehled'
  const year = new Date().getFullYear()
  const canonical = `https://www.kodyspotrebicu.cz/znacka/${params.brand.toLowerCase()}`
  const title = `Chybové kódy ${brandName}: ${countLabel} kódů praček, myček, sušiček (${year})`
  const description = `${count > 0 ? `${count} chybových kódů` : 'Chybové kódy'} ${brandName}: vysvětlení, příčiny a oprava. ✓ Pračky ✓ Myčky ✓ Sušičky ✓ Cena opravy ✓ Návod krok za krokem.`
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: 'website' },
  }
}

export default async function BrandPage({ params }: Props) {
  // Redirect to lowercase canonical URL if path isn't already lowercase
  const lowerBrand = params.brand.toLowerCase()
  if (params.brand !== lowerBrand) {
    permanentRedirect(`/znacka/${lowerBrand}`)
  }
  const brandSlug = lowerBrand
  let codes: {
    id: number; code: string; title: string; brand: string;
    applianceType: string; shortMeaning: string; severityLevel: number; slug: string;
  }[] = []

  try {
    codes = await prisma.errorCode.findMany({
      where: { brand: { equals: brandSlug, mode: 'insensitive' } },
      orderBy: [{ applianceType: 'asc' }, { code: 'asc' }],
      select: {
        id: true, code: true, title: true, brand: true,
        applianceType: true, shortMeaning: true, severityLevel: true, slug: true,
      },
    })
  } catch { /* DB not ready */ }

  if (codes.length === 0) {
    const count = await prisma.errorCode.count({
      where: { brand: { equals: brandSlug, mode: 'insensitive' } },
    }).catch(() => 0)
    if (count === 0) notFound()
  }

  const rawBrand = codes[0]?.brand || brandSlug
  const brandName = rawBrand.charAt(0).toUpperCase() + rawBrand.slice(1)
  const applianceTypes = Array.from(new Set(codes.map((c) => c.applianceType))).sort()
  const richContent = BRAND_CONTENT[brandSlug.toLowerCase()]
  const introParagraphs = richContent?.intro ?? BRAND_INTROS[brandSlug.toLowerCase()]?.paragraphs ?? []

  // Lookup pro proklik z 'topCodes' (brand-content.ts) na konkrétní detail kódu.
  // Klíč je 'CODE_APPLIANCETYPE' (např. 'F12_mycka') aby se rozlišily kódy se
  // stejným označením napříč spotřebiči (E22 pračka × E22 myčka u některých značek).
  const codeSlugMap = new Map<string, { slug: string; applianceType: string }>(
    codes.map((c) => [`${c.code}_${c.applianceType}`, { slug: c.slug, applianceType: c.applianceType }])
  )
  function applianceTypeFromLabel(label: string): string {
    if (label === 'pračka') return 'pracka'
    if (label === 'myčka') return 'mycka'
    if (label === 'sušička') return 'susicka'
    return label
  }

  const faqSchema = richContent?.faq && richContent.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: richContent.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <Breadcrumbs items={[{ label: brandName }]} />
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        Chybové kódy {brandName}
      </h1>
      <p className="text-gray-600 mb-3">
        Přehled {codes.length} chybových kódů spotřebičů {brandName}.
      </p>
      {richContent ? (
        <details className="group bg-white border border-gray-200 border-l-4 border-l-accent-500 rounded-xl shadow-sm mb-6 [&_summary::-webkit-details-marker]:hidden">
          <summary className="cursor-pointer list-none p-5 md:p-6 flex items-center justify-between gap-4 select-none">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-700 mb-1">
                Expertní přehled
              </p>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight leading-tight">
                O značce {brandName}
              </h2>
              <p className="text-xs md:text-sm text-gray-500 mt-1.5">
                Modelové řady · Nejčastější chyby · Životnost · Časté otázky
              </p>
            </div>
            <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-50 border border-gray-200 text-gray-500 group-open:rotate-180 transition-transform">
              <ChevronDown className="w-4 h-4" />
            </span>
          </summary>

          <div className="px-5 md:px-6 pb-6 md:pb-8 pt-2">
          {introParagraphs.length > 0 && (
            <div className="space-y-3 text-[15px] text-gray-700 leading-relaxed mb-9 pt-4 border-t border-gray-100">
              {introParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}

          {richContent.modelLines && richContent.modelLines.length > 0 && (
            <div className="pt-6 mt-2 mb-8 border-t border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-accent-50 text-accent-700">
                  <Layers className="w-4 h-4" />
                </span>
                Modelové řady {brandName}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {richContent.modelLines.map((line, i) => {
                  const isTopTier = i === richContent.modelLines!.length - 1
                  return (
                    <div
                      key={i}
                      className={`relative rounded-lg p-4 transition-colors ${
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

          {richContent.topCodes && richContent.topCodes.length > 0 && (
            <div className="pt-6 mb-8 border-t border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-accent-50 text-accent-700">
                  <Lightbulb className="w-4 h-4" />
                </span>
                Nejčastější chybové kódy {brandName}
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                {richContent.topCodes.map((tc, i) => {
                  const type = applianceTypeFromLabel(tc.appliance)
                  const match = codeSlugMap.get(`${tc.code}_${type}`)
                  const codeBadge = (
                    <span className="font-mono font-bold text-brand-primary-dark bg-brand-soft border border-brand-soft-border px-2 py-0.5 rounded shrink-0 min-w-[3.75rem] text-center text-xs leading-relaxed">
                      {tc.code}
                    </span>
                  )
                  const description = (
                    <span className="text-gray-700 leading-relaxed">
                      <span className="text-gray-500 text-xs">({tc.appliance})</span> {tc.tip}
                    </span>
                  )
                  if (match) {
                    const appliancePath = APPLIANCE_PATHS[match.applianceType] ?? match.applianceType
                    return (
                      <li key={i}>
                        <Link
                          href={`/${brandSlug}/${appliancePath}/${match.slug}`}
                          className="flex items-start gap-3 text-sm -mx-2 px-2 py-1 rounded hover:bg-accent-50/40 transition-colors group"
                        >
                          {codeBadge}
                          <span className="text-gray-700 leading-relaxed group-hover:text-gray-900">
                            <span className="text-gray-500 text-xs">({tc.appliance})</span> {tc.tip}
                          </span>
                        </Link>
                      </li>
                    )
                  }
                  return (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      {codeBadge}
                      {description}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {richContent.longevity && (
            <div className="pt-6 mb-8 border-t border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-accent-50 text-accent-700">
                  <Clock className="w-4 h-4" />
                </span>
                Životnost a kdy se vyplatí opravovat
              </h3>
              <p className="text-[15px] text-gray-700 leading-relaxed">
                {richContent.longevity.split(/(10–15 let)/).map((part, i) =>
                  part === '10–15 let' ? (
                    <span key={i} className="font-bold text-accent-700 font-mono tabular-nums">{part}</span>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </p>
            </div>
          )}

          {richContent.faq && richContent.faq.length > 0 && (
            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-accent-50 text-accent-700">
                  <HelpCircle className="w-4 h-4" />
                </span>
                Časté otázky o {brandName}
              </h3>
              <dl className="flex flex-col gap-5">
                {richContent.faq.map((f, i) => (
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
      ) : (
        introParagraphs.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 space-y-2 text-sm text-gray-700 leading-relaxed">
            {introParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )
      )}

      {applianceTypes.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {applianceTypes.map((type) => (
            <Link
              key={type}
              href={`#${type}`}
              className="px-3 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-blue-400 hover:text-blue-600 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
            >
              {APPLIANCE_LABELS[type] || type}
            </Link>
          ))}
        </div>
      )}

      {applianceTypes.map((type) => {
        const typeCodes = codes.filter((c) => c.applianceType === type)
        return (
          <section key={type} id={type} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {APPLIANCE_LABELS[type] || type} ({typeCodes.length})
              </h2>
              <Link
                href={`/${brandSlug}/${APPLIANCE_PATHS[type] || type}`}
                className="text-sm text-blue-600 hover:underline"
              >
                Všechny {APPLIANCE_LABELS[type]?.toLowerCase() || type} {brandName}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {typeCodes.map((c) => (
                <ErrorCodeCard key={c.id} {...c} />
              ))}
            </div>
          </section>
        )
      })}

      {codes.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">Pro tuto značku zatím nemáme kódy v databázi.</p>
          <p className="text-sm">Zkuste vyhledat konkrétní kód nebo procházejte jiné značky.</p>
        </div>
      )}
    </div>
  )
}
