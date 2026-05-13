import { prisma } from '@/lib/prisma'
import Breadcrumbs from '@/components/Breadcrumbs'
import CategoryRichContent from '@/components/CategoryRichContent'
import CategoryBrowsePanel from '@/components/CategoryBrowsePanel'
import { SUSICKA_SUBTYPES } from '@/lib/utils'
import type { Metadata } from 'next'

interface Props {
  searchParams: Record<string, string | string[] | undefined>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const hasFilters = Object.keys(searchParams || {}).length > 0
  const canonical = 'https://www.kodyspotrebicu.cz/susicky'
  const year = new Date().getFullYear()
  let count = 0
  try {
    count = await prisma.errorCode.count({ where: { applianceType: 'susicka' } })
  } catch { /* DB not ready */ }
  const countLabel = count > 0 ? `${count}+` : 'Stovky'
  const title = `Chybové kódy sušiček: ${countLabel} kódů Bosch, Siemens, AEG, Whirlpool (${year})`
  const description = `${countLabel} chybových kódů sušiček (kondenzační, odtahová, tepelné čerpadlo). ✓ Vysvětlení kódů E60, E63, E01, F01 ✓ Cena opravy ✓ Návod krok za krokem.`
  return {
    title,
    description,
    alternates: { canonical },
    robots: hasFilters ? { index: false, follow: true } : undefined,
    openGraph: { title, description, url: canonical, type: 'website' },
  }
}

export default async function SusickyPage() {
  type CodeRow = {
    id: number; code: string; title: string; brand: string;
    applianceType: string; shortMeaning: string; severityLevel: number;
    slug: string; subtype: string | null
  }

  let codes: CodeRow[] = []

  try {
    codes = await prisma.errorCode.findMany({
      where: { applianceType: 'susicka' },
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
      <Breadcrumbs items={[{ label: 'Sušičky', href: '/susicky' }]} />
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Chybové kódy sušiček</h1>
      <p className="text-gray-600 mb-3">
        Přehled {codes.length} chybových kódů sušiček. Filtrujte podle typu, značky a závažnosti.
      </p>
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 space-y-2 text-sm text-gray-700 leading-relaxed">
        <p>Sušičky hlásí chyby kódem na displeji. Typ závady se liší podle technologie – <strong>odtahová sušička</strong> nejčastěji trpí ucpaným filtrem nebo hadicí, <strong>kondenzační</strong> má problémy s nádobou na vodu nebo výměníkem tepla a <strong>sušička s tepelným čerpadlem</strong> může hlásit závady kompresoru nebo chladicího okruhu.</p>
        <p>Mezi nejčastější příčiny chybových kódů patří: <strong>ucpaný prachový nebo kondenzační filtr</strong>, <strong>přehřátí</strong>, <strong>závada na teplotním čidle nebo termostatu</strong> a <strong>problém s odvodem kondenzátu</strong>. Pravidelné čištění filtrů předchází většině chyb.</p>
        <p>Databáze pokrývá sušičky <strong>Bosch, Siemens, AEG, Electrolux, Samsung a Beko</strong>. Ke každému kódu najdete závažnost, pravděpodobné příčiny a doporučený postup.</p>
      </div>

      <CategoryRichContent applianceType="susicka" categoryLabel="sušiček" />

      <CategoryBrowsePanel applianceType="susicka" categoryLabel="Sušičky" codes={codes} subtypeOptions={SUSICKA_SUBTYPES} />
    </div>
  )
}
