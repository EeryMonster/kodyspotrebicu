import { prisma } from '@/lib/prisma'
import Breadcrumbs from '@/components/Breadcrumbs'
import CategoryFilteredGrid from '@/components/CategoryFilteredGrid'
import type { Metadata } from 'next'

interface Props {
  searchParams: Record<string, string | string[] | undefined>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const hasFilters = Object.keys(searchParams || {}).length > 0
  const canonical = 'https://www.kodyspotrebicu.cz/mycky'
  return {
    title: 'Chybové kódy myček nádobí',
    description: 'Databáze chybových kódů myček nádobí. Bosch, Siemens, AEG, Electrolux, Samsung, Beko. Zjistěte příčinu chyby myčky a jak postupovat.',
    alternates: { canonical },
    robots: hasFilters ? { index: false, follow: true } : undefined,
    openGraph: {
      title: 'Chybové kódy myček nádobí | KódySpotřebičů.cz',
      description: 'Databáze chybových kódů myček nádobí. Bosch, Siemens, AEG, Electrolux, Samsung, Beko. Zjistěte příčinu chyby myčky a jak postupovat.',
      url: canonical,
    },
  }
}

export default async function MyckyPage() {
  type CodeRow = {
    id: number; code: string; title: string; brand: string;
    applianceType: string; shortMeaning: string; severityLevel: number; slug: string;
    subtype: string | null
  }

  let codes: CodeRow[] = []

  try {
    codes = await prisma.errorCode.findMany({
      where: { applianceType: 'mycka' },
      orderBy: [{ brand: 'asc' }, { code: 'asc' }],
      select: {
        id: true, code: true, title: true, brand: true,
        applianceType: true, shortMeaning: true, severityLevel: true, slug: true,
        subtype: true,
      },
    })
  } catch { /* DB not ready */ }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Myčky', href: '/mycky' }]} />
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Chybové kódy myček nádobí</h1>
      <p className="text-gray-600 mb-3">
        Přehled {codes.length} chybových kódů myček nádobí. Filtrujte podle značky a závažnosti.
      </p>
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 space-y-2 text-sm text-gray-700 leading-relaxed">
        <p>Myčky nádobí zobrazují chybové kódy na displeji nebo blikáním kontrolky. Každý kód odkazuje na konkrétní podsystém – přívod vody, odčerpávání, ohřev nebo dávkovač prostředků. Rychlá identifikace kódu vám pomůže rozhodnout, zda závadu zvládnete sami nebo potřebujete technika.</p>
        <p>Nejčastější příčiny chyb myček jsou: <strong>ucpaný filtr nebo odpadní hadice</strong>, <strong>závada na průtokovém ohřívači (bojleru)</strong>, <strong>problém s dávkovačem soli nebo leštidla</strong> a <strong>porucha snímače hladiny vody</strong>. Mnoho chyb způsobuje jen zanedbaná pravidelná údržba.</p>
        <p>V databázi jsou kódy myček <strong>Bosch, Siemens, AEG, Electrolux, Samsung a Beko</strong>. Starší modely Siemens (řada SE/SF) hlásí chyby blikáním – i ty jsou v databázi popsány.</p>
      </div>

      <CategoryFilteredGrid codes={codes} />
    </div>
  )
}
