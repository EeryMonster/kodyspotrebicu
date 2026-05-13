import type { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import ServiceLeadForm from '@/components/ServiceLeadForm'
import { ShieldCheck, Clock, MapPin, AlertCircle } from 'lucide-react'

interface Props {
  searchParams: Record<string, string | string[] | undefined>
}

function param(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0]
  return value
}

export const metadata: Metadata = {
  title: 'Objednat opravu domácího spotřebiče — Servis pračky, myčky, sušičky',
  description: 'Pošlete poptávku na opravu domácího spotřebiče v ČR. Pračky, myčky, sušičky všech značek. Doporučíme nejvhodnější způsob opravy do 3 pracovních dnů.',
  alternates: { canonical: 'https://www.kodyspotrebicu.cz/servis' },
  openGraph: {
    title: 'Objednat opravu domácího spotřebiče',
    description: 'Pračky, myčky, sušičky. Doporučíme nejvhodnější způsob opravy do 3 pracovních dnů.',
    url: 'https://www.kodyspotrebicu.cz/servis',
    type: 'website',
  },
}

export default function ServisPage({ searchParams }: Props) {
  const prefillBrand = param(searchParams.znacka) || param(searchParams.brand)
  const prefillApplianceType = param(searchParams.typ) || param(searchParams.applianceType)
  const prefillErrorCode = param(searchParams.kod) || param(searchParams.code)

  const faqItems = [
    {
      q: 'Kolik stojí výjezd technika k pračce nebo myčce?',
      a: 'V ČR se ceny výjezdu pohybují obvykle mezi 600–1 200 Kč. Diagnostika je často součástí ceny, hodinová sazba techniků bývá 350–550 Kč. Celková cena opravy s dílem se nejčastěji pohybuje do 1 500 Kč. U závažných závad (řídicí deska, motor, ložiska bubnu) cena přesahuje 2 000 Kč.',
    },
    {
      q: 'Jak dlouho trvá, než dostanu odpověď a než přijede technik?',
      a: 'Na vaši poptávku se ozveme do 3 pracovních dnů s doporučením postupu – obvykle s konkrétními kontakty na značkový servis nebo lokálního partnera. Termín návštěvy si pak domluvíte přímo s technikem: v Praze a větších městech zpravidla 1–3 pracovní dny, v menších městech a vesnicích 3–7 dní podle dostupnosti.',
    },
    {
      q: 'Vyplatí se opravit starší pračku, nebo koupit novou?',
      a: 'Obecné pravidlo: pokud cena opravy přesahuje 50 % hodnoty nového srovnatelného spotřebiče, vyplatí se výměna. U prémiových značek (Miele, Bosch s EcoSilence Drive, Siemens iQ700+) má smysl opravovat i nákladnější závady díky delší zbývající životnosti a 10leté motorové záruce.',
    },
    {
      q: 'Co znamená „autorizovaný servis"?',
      a: 'Autorizovaný servis je smluvní partner výrobce – jeho technici prošli školením od značky, používají originální náhradní díly a mají přístup k oficiální dokumentaci. Záruční opravy musí provádět autorizovaný servis, jinak může výrobce odmítnout uplatnění záruky.',
    },
    {
      q: 'Jaké údaje o spotřebiči budu potřebovat?',
      a: 'Pro rychlou diagnostiku se hodí: typové označení (najdete na štítku uvnitř dvířek nebo na zadní straně), výrobní číslo, datum koupě (pro určení záruky) a popis problému – co se děje, kdy se chyba objevila, jaký kód zobrazuje displej. Tyto údaje urychlí proces a snižují cenu.',
    },
  ]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Objednávka opravy domácího spotřebiče',
    description: 'Zprostředkování autorizovaného servisu pro pračky, myčky a sušičky v ČR.',
    areaServed: { '@type': 'Country', name: 'Česká republika' },
    provider: {
      '@type': 'Organization',
      name: 'KódySpotřebičů.cz',
      url: 'https://www.kodyspotrebicu.cz',
    },
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <Breadcrumbs items={[{ label: 'Objednat servis' }]} />

      <header className="flex flex-col gap-3 mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-700">
          Servis spotřebičů v ČR
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
          Objednejte opravu pračky, myčky nebo sušičky
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
          Pošlete poptávku a my vám do 3 pracovních dnů doporučíme nejvhodnější způsob opravy –
          značkový servis nebo lokálního partnera ve vašem okolí. Bez závazku, bez registrace.
        </p>
      </header>

      {/* Beta disclaimer — služba je nová, sběr leadů přes značkové servisní linky */}
      <section className="bg-accent-50/60 border border-accent-300/60 rounded-xl p-5 mb-8 flex gap-3 items-start">
        <AlertCircle className="w-5 h-5 text-accent-700 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-1">Služba v beta verzi</p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Síť autorizovaných servisních partnerů aktuálně budujeme. Do té doby vám na základě
            poptávky doporučíme nejlepší cestu – obvykle značkový servis výrobce, případně
            ověřeného lokálního partnera, pokud jej v daném regionu známe.
          </p>
        </div>
      </section>

      {/* Tři klíčové benefity */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <ShieldCheck className="w-7 h-7 text-accent-600 mb-3" />
          <h2 className="text-sm font-bold text-gray-900 mb-1">Doporučení od experta</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Konkrétní rada k vaší závadě – značkový servis nebo lokální partner.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <Clock className="w-7 h-7 text-accent-600 mb-3" />
          <h2 className="text-sm font-bold text-gray-900 mb-1">Odezva do 3 pracovních dnů</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Posoudíme popis problému a doporučíme nejvhodnější cestu opravy.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <MapPin className="w-7 h-7 text-accent-600 mb-3" />
          <h2 className="text-sm font-bold text-gray-900 mb-1">Po celé ČR</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Praha, Brno, Plzeň, Ostrava i menší města – pomůžeme najít autorizovaný servis.
          </p>
        </div>
      </section>

      {/* Formulář */}
      <section className="mb-12">
        <ServiceLeadForm
          prefillBrand={prefillBrand}
          prefillApplianceType={prefillApplianceType}
          prefillErrorCode={prefillErrorCode}
        />
      </section>

      {/* SEO obsah */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5 tracking-tight">
          Jak objednání servisu probíhá
        </h2>
        <ol className="flex flex-col gap-4 text-sm text-gray-700 leading-relaxed">
          <li className="flex gap-3">
            <span className="shrink-0 w-7 h-7 rounded-full bg-accent-50 text-accent-700 flex items-center justify-center font-bold text-sm">1</span>
            <span>
              <strong className="block text-gray-900 mb-0.5">Vyplníte poptávku</strong>
              PSČ, telefon a krátký popis problému. Případně značku, typ spotřebiče a chybový
              kód z displeje – pokud je znáte, urychlí to diagnostiku.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-7 h-7 rounded-full bg-accent-50 text-accent-700 flex items-center justify-center font-bold text-sm">2</span>
            <span>
              <strong className="block text-gray-900 mb-0.5">Najdeme servis ve vašem okolí</strong>
              Vybereme autorizovaného partnera podle značky spotřebiče a regionu. Vyhneme se
              dlouhým čekacím dobám i přemrštěným cenám.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-7 h-7 rounded-full bg-accent-50 text-accent-700 flex items-center justify-center font-bold text-sm">3</span>
            <span>
              <strong className="block text-gray-900 mb-0.5">Ozveme se do 3 pracovních dnů</strong>
              E-mailem nebo telefonem vám doporučíme konkrétní postup – značkový servis se zárukou,
              ověřený lokální partner, nebo svépomocnou opravu pokud je to bezpečné. Vy se
              rozhodnete, kterou cestou se vydat.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-7 h-7 rounded-full bg-accent-50 text-accent-700 flex items-center justify-center font-bold text-sm">4</span>
            <span>
              <strong className="block text-gray-900 mb-0.5">Technik přijede a opraví</strong>
              Po volbě servisu si domluvíte termín přímo s technikem. Většina běžných oprav je
              hotová u vás doma během jedné návštěvy. U závažnějších závad technik objedná díly.
            </span>
          </li>
        </ol>
      </section>

      {/* Orientační ceny */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 tracking-tight">
          Orientační ceny oprav v ČR
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-5">
          Reálné ceny vychází z aktuálních cen autorizovaných i nezávislých servisů v Praze
          a větších městech. Konkrétní cenu nabídneme po obdržení vaší poptávky.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2.5 px-3 font-semibold text-gray-700">Typ opravy</th>
                <th className="text-right py-2.5 px-3 font-semibold text-gray-700">Cena včetně DPH</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-b border-gray-100">
                <td className="py-2.5 px-3">Výjezd technika (Praha a okolí)</td>
                <td className="text-right py-2.5 px-3 font-mono">600–1 200 Kč</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 px-3">Diagnostika závady</td>
                <td className="text-right py-2.5 px-3 font-mono">od 600 Kč</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 px-3">Hodinová sazba technika</td>
                <td className="text-right py-2.5 px-3 font-mono">350–550 Kč</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 px-3">Výměna čerpadla / topného tělesa</td>
                <td className="text-right py-2.5 px-3 font-mono">1 200–2 500 Kč</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 px-3">Výměna ložisek bubnu (s prací)</td>
                <td className="text-right py-2.5 px-3 font-mono">3 500–6 000 Kč</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3">Výměna řídicí desky / motoru</td>
                <td className="text-right py-2.5 px-3 font-mono">3 000–8 000 Kč</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed mt-4">
          Ceny jsou orientační, vychází z reálných tržních dat (PM Servis, ALPHA Servis, AP Servis,
          Servis Lavamax, opravy-praha.eu, opravyspotrebicu24.cz). U starších spotřebičů
          se vyplatí porovnat cenu opravy s cenou nového modelu – obecné pravidlo říká, že
          oprava nad 50 % hodnoty nového srovnatelného spotřebiče se nevyplatí.
        </p>
      </section>

      {/* Záruční servis upozornění */}
      <section className="bg-accent-50/60 border border-accent-300/60 rounded-xl p-6 mb-8 flex gap-4 items-start">
        <AlertCircle className="w-6 h-6 text-accent-700 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-1.5">Je spotřebič ještě v záruce?</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Pokud ano (běžně 2 roky od koupě, prodloužené záruky až 5–20 let podle značky a
            modelu), kontaktujte autorizovaný servis přímo přes výrobce – záruční oprava je
            zdarma a vaše práva by tím neměla utrpět. Doporučujeme začít infolinkou:
            Bosch <strong>+420 251 095 043</strong>, Siemens <strong>+420 251 095 042</strong>,
            AEG/Electrolux <strong>261 302 261</strong>, Samsung <strong>800 726 786</strong>,
            Beko <strong>222 525 222</strong>, Miele <strong>800 643 531</strong>,
            LG <strong>228 887 050</strong>, Whirlpool <strong>251 001 001</strong>.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5 tracking-tight">
          Časté otázky o servisu spotřebičů
        </h2>
        <dl className="flex flex-col gap-5">
          {faqItems.map((f, i) => (
            <div key={i} className="pl-4 border-l-2 border-accent-300/50">
              <dt className="text-sm font-semibold text-gray-900 mb-1.5 leading-snug">{f.q}</dt>
              <dd className="text-sm text-gray-700 leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
