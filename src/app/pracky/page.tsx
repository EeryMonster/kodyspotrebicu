import { prisma } from '@/lib/prisma'
import Breadcrumbs from '@/components/Breadcrumbs'
import CategoryFilteredGrid from '@/components/CategoryFilteredGrid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chybové kódy praček',
  description: 'Databáze chybových kódů praček. Bosch, Siemens, AEG, Electrolux, Samsung, Beko.',
  alternates: { canonical: 'https://www.kodyspotrebicu.cz/pracky' },
  openGraph: {
    title: 'Chybové kódy praček | KódySpotřebičů.cz',
    description: 'Databáze chybových kódů praček. Bosch, Siemens, AEG, Electrolux, Samsung, Beko.',
    url: 'https://www.kodyspotrebicu.cz/pracky',
  },
}

export default async function PrackyPage() {
  type CodeRow = {
    id: number; code: string; title: string; brand: string;
    applianceType: string; shortMeaning: string; severityLevel: number;
    slug: string; subtype: string | null
  }

  let codes: CodeRow[] = []

  try {
    codes = await prisma.errorCode.findMany({
      where: { applianceType: 'pracka' },
      orderBy: [{ brand: 'asc' }, { code: 'asc' }],
      select: {
        id: true, code: true, title: true, brand: true,
        applianceType: true, shortMeaning: true, severityLevel: true,
        slug: true, subtype: true,
      },
    })
  } catch { /* DB not ready */ }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Pračky', href: '/pracky' }]} />
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Chybové kódy praček</h1>
      <p className="text-gray-600 mb-3">
        Přehled {codes.length} chybových kódů praček. Filtrujte podle značky a závažnosti.
      </p>
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 space-y-2 text-sm text-gray-700 leading-relaxed">
        <p>Pračky zobrazují chybové kódy na displeji nebo blikáním kontrolky. Každý kód signalizuje konkrétní problém – od ucpaného filtru přes závadu čerpadla až po poruchu elektroniky. Správná interpretace kódu vám ušetří zbytečný výjezd technika.</p>
        <p>Nejčastější příčiny chyb praček jsou: <strong>ucpaný filtr nebo čerpací soustava</strong>, <strong>porucha snímače teploty nebo hladiny vody</strong>, <strong>závada na dveřním zámku</strong> nebo <strong>problém s přívodem či odpadem vody</strong>. Část chyb lze bezpečně vyřešit doma, jiné vyžadují odborný servis.</p>
        <p>V databázi najdete kódy praček <strong>Bosch, Siemens, AEG, Electrolux, Samsung, Beko, Whirlpool a LG</strong>. Kliknutím na konkrétní kód zobrazíte popis závady, závažnost, doporučený postup a kdy volat servis.</p>
      </div>

      <CategoryFilteredGrid codes={codes} />
    </div>
  )
}
