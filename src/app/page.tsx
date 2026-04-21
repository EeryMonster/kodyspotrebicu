import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import SearchBox from '@/components/SearchBox'
import ProblemsGrid from '@/components/ProblemsGrid'

export const metadata: Metadata = {
  title: { absolute: 'Chybové kódy spotřebičů – databáze chyb praček, myček a sušiček | KódySpotřebičů.cz' },
  description: 'Kompletní databáze chybových kódů praček, myček nádobí a sušiček. Bosch, Siemens, AEG, Electrolux, Samsung, Beko. Zjistěte příčinu chyby a jak postupovat.',
}

const applianceCards = [
  { slug: 'pracky', label: 'Pračky', icon: '🫧', desc: 'Chybové kódy praček všech značek' },
  { slug: 'mycky', label: 'Myčky nádobí', icon: '🍽️', desc: 'Chybové kódy myček všech značek' },
  { slug: 'susicky', label: 'Sušičky', icon: '♨️', desc: 'Chybové kódy sušiček všech značek' },
]

const brands = [
  { name: 'AEG', slug: 'aeg' },
  { name: 'Beko', slug: 'beko' },
  { name: 'Bosch', slug: 'bosch' },
  { name: 'Electrolux', slug: 'electrolux' },
  { name: 'LG', slug: 'lg' },
  { name: 'Miele', slug: 'miele' },
  { name: 'Samsung', slug: 'samsung' },
  { name: 'Siemens', slug: 'siemens' },
  { name: 'Whirlpool', slug: 'whirlpool' },
]

const commonProblems = [
  { slug: 'pracka-zapacha', img: '/symptoms/pracka-zapacha.png', label: 'Pračka zapáchá', desc: 'Nepříjemný zápach z pračky nebo prádla' },
  { slug: 'pracka-nevypousti', img: '/symptoms/pracka-nevypousti.png', label: 'Pračka nevypouští vodu', desc: 'Po praní zůstane voda v bubnu' },
  { slug: 'pracka-se-neplni', img: '/symptoms/pracka-se-neplni.png', label: 'Pračka se neplní', desc: 'Pračka nezačne nabírat vodu' },
  { slug: 'pracka-trese', img: '/symptoms/pracka-trese.png', label: 'Pračka se třese a hlučí', desc: 'Silné vibrace nebo hluk při odstřeďování' },
  { slug: 'pracka-tece', img: '/symptoms/pracka-tece.png', label: 'Voda vytéká z pračky', desc: 'Voda pod pračkou nebo kolem ní' },
  { slug: 'buben-se-neotaci', img: '/symptoms/buben-se-neotaci.png', label: 'Buben se neotáčí', desc: 'Buben stojí nebo se otáčí nepravidelně' },
  { slug: 'mycka-neumyva', img: '/symptoms/mycka-neumyva.png', label: 'Myčka neumývá nádobí', desc: 'Nádobí vychází špinavé nebo mokré' },
  { slug: 'mycka-nevypousti', img: '/symptoms/mycka-nevypousti.png', label: 'Myčka nevypouští vodu', desc: 'Po mytí zůstane voda na dně myčky' },
  { slug: 'mycka-zapacha', img: '/symptoms/mycka-zapacha.png', label: 'Myčka zapáchá', desc: 'Zápach z myčky nebo z nádobí' },
  { slug: 'voda-pod-myckou', img: '/symptoms/voda-pod-myckou.png', label: 'Voda pod myčkou', desc: 'Únik vody pod nebo za myčkou' },
  { slug: 'mycka-nenabira-vodu', img: '/symptoms/mycka-nenapousti-vodu.svg', label: 'Myčka nenapouští vodu', desc: 'Myčka se nespustí nebo nenapustí vodu' },
  { slug: 'mycka-hluci', img: '/symptoms/mycka-bzuci.svg', label: 'Myčka hlučí', desc: 'Klepání, bzučení nebo hlasité zvuky při mytí' },
  { slug: 'nadobi-zustava-mokre', img: '/symptoms/nadobi-zustava-mokre.png', label: 'Nádobí zůstává mokré', desc: 'Nádobí je mokré i po skončení programu' },
  { slug: 'mycka-nedokonci-program', img: '/symptoms/mycka-nedokonci-program.png', label: 'Myčka nedokončí program', desc: 'Myčka se zastaví uprostřed mytí' },
  { slug: 'susicka-nesusi', img: '/symptoms/susicka-nesusi.png', label: 'Sušička nesuší', desc: 'Prádlo zůstává mokré po celém cyklu' },
  { slug: 'susicka-se-prehriva', img: '/symptoms/susicka-se-prehriva.png', label: 'Sušička se přehřívá', desc: 'Sušička se vypíná nebo vydává zápach' },
  { slug: 'susicka-hluci', img: '/symptoms/susicka-hluci.png', label: 'Sušička hlučí', desc: 'Rány, vrzání nebo silné vibrace sušičky' },
  { slug: 'susicka-se-nezapne', img: '/symptoms/susicka-se-nezapne.png', label: 'Sušička se nezapne', desc: 'Sušička nereaguje nebo se nespustí' },
  { slug: 'susicka-trva-dlouho', img: '/symptoms/susicka-trva-dlouho.png', label: 'Sušení trvá příliš dlouho', desc: 'Program sušení trvá výrazně déle než obvykle' },
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
    url: 'https://www.kodyspotrebicu.cz',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: 'https://www.kodyspotrebicu.cz/hledat?q={search_term_string}' },
      'query-input': 'required name=search_term_string',
    },
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'KódySpotřebičů.cz',
    url: 'https://www.kodyspotrebicu.cz',
    description: 'Databáze chybových kódů domácích spotřebičů – pračky, myčky, sušičky.',
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Databáze chybových kódů spotřebičů
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto mb-6">
          Spotřebič hlásí chybu? Zadejte kód níže — zjistěte příčinu, závažnost a co dělat dál.
        </p>

        {/* Hero search */}
        <div className="max-w-xl mx-auto mb-4">
          <SearchBox />
        </div>
        {totalCount > 0 && (
          <p className="text-sm text-gray-600 mb-8">
            Databáze obsahuje <strong className="text-gray-600">{totalCount}+</strong> kódů pro nejoblíbenější značky
          </p>
        )}
      </section>

      {/* Brands */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Vyberte značku</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
          {brands.map((b) => (
            <Link
              key={b.slug}
              href={`/znacka/${b.slug}`}
              aria-label={`Chybové kódy ${b.name}`}
              className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="h-10 flex items-center justify-center">
                <Image
                  src={`/brands/${b.slug}.svg`}
                  alt={b.name}
                  width={80}
                  height={32}
                  className="object-contain max-h-8"
                />
              </div>
              <span className="text-xs text-gray-500 font-medium">{b.name}</span>
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
        <ProblemsGrid problems={commonProblems} />
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
          href="https://www.firmy.cz/?q=servis+dom%C3%A1c%C3%ADch+spot%C5%99ebi%C4%8D%C5%AF"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Najít servis v okolí →
        </a>
      </section>
    </div>
  )
}
