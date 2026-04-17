import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chybové kódy spotřebičů – databáze chyb praček, myček a sušiček | KódySpotřebičů.cz',
  description: 'Kompletní databáze chybových kódů praček, myček nádobí a sušiček. Bosch, Siemens, AEG, Electrolux, Samsung, Beko. Zjistěte příčinu chyby a jak postupovat.',
}

const applianceCards = [
  { slug: 'pracky', label: 'Pračky', icon: '🫧', desc: 'Chybové kódy praček všech značek' },
  { slug: 'mycky', label: 'Myčky nádobí', icon: '🍽️', desc: 'Chybové kódy myček všech značek' },
  { slug: 'susicky', label: 'Sušičky', icon: '♨️', desc: 'Chybové kódy sušiček všech značek' },
]

const brands = [
  { name: 'Bosch', slug: 'bosch' },
  { name: 'Siemens', slug: 'siemens' },
  { name: 'AEG', slug: 'aeg' },
  { name: 'Electrolux', slug: 'electrolux' },
  { name: 'Samsung', slug: 'samsung' },
  { name: 'Beko', slug: 'beko' },
  { name: 'Whirlpool', slug: 'whirlpool' },
  { name: 'LG', slug: 'lg' },
]

const commonProblems = [
  { slug: 'pracka-zapáchá',    icon: '🤢', label: 'Pračka zapáchá',           desc: 'Nepříjemný zápach z pračky nebo prádla' },
  { slug: 'pracka-nevypousti', icon: '💧', label: 'Pračka nevypouští vodu',   desc: 'Po praní zůstane voda v bubnu' },
  { slug: 'pracka-se-neplni',  icon: '🚿', label: 'Pračka se neplní',         desc: 'Pračka nezačne nabírat vodu' },
  { slug: 'pracka-trese',      icon: '📳', label: 'Pračka se třese a hlučí',  desc: 'Silné vibrace nebo hluk při odstřeďování' },
  { slug: 'pracka-tece',       icon: '🌊', label: 'Voda vytéká z pračky',     desc: 'Voda pod pračkou nebo kolem ní' },
  { slug: 'buben-se-neotaci',  icon: '🔄', label: 'Buben se neotáčí',         desc: 'Buben stojí nebo se otáčí nepravidelně' },
  { slug: 'myčka-neumývá',     icon: '🍽️', label: 'Myčka neumývá nádobí',    desc: 'Nádobí vychází špinavé nebo mokré' },
  { slug: 'myčka-nevypousti',  icon: '🪣', label: 'Myčka nevypouští vodu',   desc: 'Po mytí zůstane voda na dně myčky' },
  { slug: 'myčka-zapáchá',     icon: '😷', label: 'Myčka zapáchá',            desc: 'Zápach z myčky nebo z nádobí' },
  { slug: 'voda-pod-myčkou',   icon: '💦', label: 'Voda pod myčkou',          desc: 'Únik vody pod nebo za myčkou' },
  { slug: 'susicka-nesuší',    icon: '👕', label: 'Sušička nesuší',           desc: 'Prádlo zůstává mokré po celém cyklu' },
  { slug: 'susicka-se-prehriva', icon: '🌡️', label: 'Sušička se přehřívá',  desc: 'Sušička se vypíná nebo vydává zápach' },
]

export default async function HomePage() {
  let totalCount = 0

  try {
    const stats = await prisma.errorCode.aggregate({ _count: { id: true } })
    totalCount = stats._count.id
  } catch {
    // DB not connected yet
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'KódySpotřebičů.cz',
    url: 'https://kodyspotrebicu.cz',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: 'https://kodyspotrebicu.cz/hledat?q={search_term_string}' },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Databáze chybových kódů spotřebičů
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          Náš spotřebič hlásí chybu? Najděte příčinu, zjistěte závažnost a naučte se, co dělat dál.
          {totalCount > 0 && (
            <> Databáze obsahuje přes <strong>{totalCount}+ kódů</strong> pro nejoblíbenější značky.</>
          )}
        </p>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mt-6">
          {brands.map((b) => (
            <Link
              key={b.slug}
              href={`/znacka/${b.slug}`}
              className="flex flex-col items-center bg-white border border-gray-200 rounded-xl p-3 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <Image
                src={`/brands/${b.slug}.svg`}
                alt={b.name}
                width={120}
                height={45}
                className="object-contain"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Appliance categories */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Kategorie spotřebičů</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {applianceCards.map((a) => (
            <Link
              key={a.slug}
              href={`/${a.slug}`}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all text-center"
            >
              <div className="text-4xl mb-3">{a.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{a.label}</h3>
              <p className="text-sm text-gray-600">{a.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Nejčastější problémy */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Nejčastější problémy</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {commonProblems.map((p) => (
            <Link
              key={p.slug}
              href={`/symptom/${p.slug}`}
              className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <span className="text-2xl shrink-0">{p.icon}</span>
              <div>
                <div className="text-sm font-semibold text-gray-900 leading-snug">{p.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{p.desc}</div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-right">
          <Link href="/problemy" className="text-sm text-blue-600 hover:underline">
            Zobrazit všechny problémy →
          </Link>
        </div>
      </section>

      {/* CTA affiliate/leadgen */}
      <section className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Potřebujete servisního technika?
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Pokud si s opravou nevíte rady, pomůže vám certifikovaný servisní partner ve vašem okolí.
        </p>
        <a
          href="#"
          className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Najít servis v okolí
        </a>
      </section>
    </div>
  )
}
