import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import SearchBox from '@/components/SearchBox'
import ProblemsGrid from '@/components/ProblemsGrid'
import ServiceCtaBox from '@/components/ServiceCtaBox'
import { WashingMachine, UtensilsCrossed, Shirt } from 'lucide-react'

type ApplianceIcon = 'pracka' | 'mycka' | 'susicka'
const APPLIANCE_ICON: Record<ApplianceIcon, React.ComponentType<{ className?: string }>> = {
  pracka: WashingMachine,
  mycka: UtensilsCrossed,
  susicka: Shirt,
}

export const metadata: Metadata = {
  title: { absolute: 'Chybové kódy spotřebičů – databáze chyb praček, myček a sušiček | KódySpotřebičů.cz' },
  description: 'Kompletní databáze chybových kódů praček, myček nádobí a sušiček. Bosch, Siemens, AEG, Electrolux, Samsung, Beko. Zjistěte příčinu chyby a jak postupovat.',
}

const applianceCards = [
  { slug: 'pracky', label: 'Pračky', img: '/categories/pracka.png', desc: 'Voda, dveře, motor, ohřev a čerpadlo' },
  { slug: 'mycky', label: 'Myčky nádobí', img: '/categories/mycka.png', desc: 'Přívod vody, odpad, ohřev a senzory' },
  { slug: 'susicky', label: 'Sušičky', img: '/categories/susicka.png', desc: 'Filtry, přehřátí, kondenzát a sušení' },
]

const quickCodes: { label: string; q: string; appliance: ApplianceIcon }[] = [
  { label: 'Bosch E15', q: 'Bosch E15', appliance: 'mycka' },
  { label: 'AEG E10', q: 'AEG E10', appliance: 'pracka' },
  { label: 'Bosch E24', q: 'Bosch E24', appliance: 'mycka' },
  { label: 'Samsung 4C', q: 'Samsung 4C', appliance: 'mycka' },
  { label: 'Whirlpool F05', q: 'Whirlpool F05', appliance: 'susicka' },
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
  { slug: 'pracka-nouzove-otevreni', img: '/symptoms/pracka-nouzove-otevreni.svg', label: 'Nouzové otevření pračky', desc: 'Dveře se zasekly nebo nejdou otevřít po praní' },
  { slug: 'pracka-zamek-dveri', img: '/symptoms/pracka-zamek-dveri.svg', label: 'Jak vypnout zámek pračky', desc: 'Zámek dveří nebo dětská pojistka nejde deaktivovat' },
  { slug: 'pracka-vypusteni-pred-stehovani', img: '/symptoms/pracka-vypusteni-pred-stehovani.svg', label: 'Vypuštění pračky před stěhováním', desc: 'Jak bezpečně vypustit vodu a odpojit pračku' },
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
    <div className="bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <section className="border-b border-brand-border bg-white">
        <div className="container-app py-10 md:py-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold text-blue-700">Diagnostika chybových kódů</p>
              <h1 className="text-3xl md:text-[2.35rem] font-bold leading-[1.08] text-gray-950 text-balance">
                Zjistěte příčinu závady a bezpečný další krok
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600">
                Zadejte kód z displeje pračky, myčky nebo sušičky. Okamžitě uvidíte význam chyby,
                závažnost, bezpečné kontroly a situace, kdy raději volat servis.
              </p>

              <div className="mt-6 max-w-3xl">
                <SearchBox variant="hero" />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600">Často hledané</span>
                {quickCodes.map((chip) => {
                  const Icon = APPLIANCE_ICON[chip.appliance]
                  return (
                    <Link
                      key={chip.label}
                      href={`/hledat?q=${encodeURIComponent(chip.q)}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-brand-border bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Icon className="w-3.5 h-3.5 text-gray-400" />
                      {chip.label}
                    </Link>
                  )
                })}
              </div>
            </div>

            <aside className="rounded-xl border border-brand-border border-t-4 border-t-blue-600 bg-brand-surface p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-700">Diagnostický výstup</p>
              <h2 className="text-base font-semibold text-gray-950">Co získáte u každého kódu</h2>
              <div className="mt-4 space-y-3">
                {[
                  ['Závažnost', 'Nízká, střední, vysoká nebo kritická'],
                  ['Bezpečné kroky', 'Kontroly, které lze zkusit doma'],
                  ['Servisní hranice', 'Kdy spotřebič vypnout a volat technika'],
                ].map(([label, value]) => (
                  <div key={label} className="border-t border-slate-200 pt-3 first:border-t-0 first:pt-0">
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-sm leading-relaxed text-gray-600">{value}</p>
                  </div>
                ))}
              </div>
              {totalCount > 0 && (
                <p className="mt-5 border-t border-slate-200 pt-4 text-sm text-gray-600">
                  <strong className="text-gray-950">{totalCount}+</strong> chybových kódů pro nejběžnější značky
                </p>
              )}
            </aside>
          </div>
        </div>
      </section>

      <section className="container-app py-8">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-950">Vyberte značku</h2>
            <p className="text-sm text-gray-600">Rychlý přehled kódů podle výrobce spotřebiče.</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
          {brands.map((b) => (
            <Link
              key={b.slug}
              href={`/znacka/${b.slug}`}
              aria-label={`Chybové kódy ${b.name}`}
              className="flex min-h-[74px] flex-col items-center justify-center gap-2 rounded-xl border border-brand-border bg-white p-3 transition-all duration-200 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <div className="relative h-8 w-20">
                <Image
                  src={`/brands/${b.slug}.svg`}
                  alt={b.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xs text-gray-600 font-medium">{b.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-app pb-8">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-950">Kategorie spotřebičů</h2>
            <p className="text-sm text-gray-600">Začněte podle typu zařízení, pokud kód ještě neznáte.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {applianceCards.map((a) => (
            <Link
              key={a.slug}
              href={`/${a.slug}`}
              className="flex items-center gap-4 rounded-xl border border-brand-border bg-white p-5 transition-all duration-200 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <div className="relative h-14 w-14 shrink-0">
                <Image src={a.img} alt={a.label} fill className="object-contain" sizes="56px" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-950">{a.label}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-app pb-10">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-950">Nejčastější problémy</h2>
            <p className="text-sm text-gray-600">Praktické průvodce pro závady, které se často nehlásí kódem.</p>
          </div>
          <Link href="/problemy" className="text-sm font-medium text-blue-600 hover:underline">
            Všechny problémy ({commonProblems.length}) →
          </Link>
        </div>
        <ProblemsGrid problems={commonProblems} />
      </section>

      <section className="container-app pb-12">
        <ServiceCtaBox context="homepage" />
      </section>
    </div>
  )
}
