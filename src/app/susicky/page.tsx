import { prisma } from '@/lib/prisma'
import Breadcrumbs from '@/components/Breadcrumbs'
import CategoryFilteredGrid from '@/components/CategoryFilteredGrid'
import { SUSICKA_SUBTYPES } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chybové kódy sušiček',
  description: 'Databáze chybových kódů sušiček – odtahová, kondenzační, tepelné čerpadlo. Bosch, Siemens, AEG, Electrolux, Samsung, Beko.',
  alternates: { canonical: 'https://www.kodyspotrebicu.cz/susicky' },
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

      <CategoryFilteredGrid codes={codes} subtypeOptions={SUSICKA_SUBTYPES} />
    </div>
  )
}
