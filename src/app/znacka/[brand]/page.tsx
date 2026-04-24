import { prisma } from '@/lib/prisma'
import ErrorCodeCard from '@/components/ErrorCodeCard'
import Breadcrumbs from '@/components/Breadcrumbs'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'

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
  const countText = count > 0 ? `Databáze ${count} chybových kódů spotřebičů ${brandName}.` : `Databáze chybových kódů spotřebičů ${brandName}.`
  const canonical = `https://www.kodyspotrebicu.cz/znacka/${params.brand.toLowerCase()}`
  return {
    title: `Chybové kódy ${brandName}`,
    description: `${countText} Pračky, myčky, sušičky – zjistěte příčinu chyby a jak postupovat.`,
    alternates: { canonical },
    openGraph: {
      title: `Chybové kódy ${brandName}`,
      description: `${countText} Pračky, myčky, sušičky – zjistěte příčinu chyby a jak postupovat.`,
      url: canonical,
    },
  }
}

export default async function BrandPage({ params }: Props) {
  const brandSlug = params.brand
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
  const applianceTypes = [...new Set(codes.map((c) => c.applianceType))].sort()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: brandName }]} />
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        Chybové kódy {brandName}
      </h1>
      <p className="text-gray-600 mb-3">
        Přehled {codes.length} chybových kódů spotřebičů {brandName}.
      </p>
      {BRAND_INTROS[brandSlug.toLowerCase()] && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 space-y-2 text-sm text-gray-700 leading-relaxed">
          {BRAND_INTROS[brandSlug.toLowerCase()].paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      {applianceTypes.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {applianceTypes.map((type) => (
            <Link
              key={type}
              href={`#${type}`}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-colors"
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
                href={`/${APPLIANCE_PATHS[type] || type}`}
                className="text-sm text-blue-600 hover:underline"
              >
                Všechny {APPLIANCE_LABELS[type]?.toLowerCase() || type}
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
