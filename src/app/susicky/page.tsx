import { prisma } from '@/lib/prisma'
import ErrorCodeCard from '@/components/ErrorCodeCard'
import Breadcrumbs from '@/components/Breadcrumbs'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { SUSICKA_SUBTYPES } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Chybové kódy sušiček',
  description: 'Databáze chybových kódů sušiček – odtahová, kondenzační, tepelné čerpadlo. Bosch, Siemens, AEG, Electrolux, Samsung, Beko.',
  alternates: { canonical: 'https://kodyspotrebicu.cz/susicky' },
}

interface Props {
  searchParams: { typ?: string; znacka?: string }
}

export default async function SusickyPage({ searchParams }: Props) {
  const activeSubtype = searchParams.typ || null
  const activeBrand = searchParams.znacka || null

  type CodeRow = {
    id: number; code: string; title: string; brand: string;
    applianceType: string; shortMeaning: string; severityLevel: number;
    slug: string; subtype: string | null
  }

  let codes: CodeRow[] = []

  try {
    codes = await prisma.errorCode.findMany({
      where: {
        applianceType: 'susicka',
        ...(activeSubtype ? { subtype: activeSubtype } : {}),
        ...(activeBrand ? { brand: { equals: activeBrand, mode: 'insensitive' } } : {}),
      },
      orderBy: [{ brand: 'asc' }, { code: 'asc' }],
      select: {
        id: true, code: true, title: true, brand: true,
        applianceType: true, shortMeaning: true, severityLevel: true,
        slug: true, subtype: true,
      },
    })
  } catch { /* DB not ready */ }

  const brands = [...new Set(codes.map((c) => c.brand))].sort()

  function buildUrl(typ: string | null, znacka: string | null) {
    const params = new URLSearchParams()
    if (typ) params.set('typ', typ)
    if (znacka) params.set('znacka', znacka)
    const qs = params.toString()
    return `/susicky${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Sušičky', href: '/susicky' }]} />
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Chybové kódy sušiček</h1>
      <p className="text-gray-600 mb-6">
        Přehled {codes.length} chybových kódů sušiček. Filtrujte podle typu technologie nebo značky.
      </p>

      {/* Filtr – typ sušičky */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Typ sušičky</p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={buildUrl(null, activeBrand)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              !activeSubtype
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400'
            }`}
          >
            Všechny typy
          </Link>
          {SUSICKA_SUBTYPES.map((s) => (
            <Link
              key={s.value}
              href={buildUrl(s.value, activeBrand)}
              title={s.desc}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                activeSubtype === s.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400'
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Filtr – značka */}
      {brands.length > 0 && (
        <div className="mb-8">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Značka</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildUrl(activeSubtype, null)}
              className={`flex items-center justify-center px-3 py-1 rounded-xl text-sm font-medium border transition-colors ${
                !activeBrand
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
              }`}
            >
              Všechny značky
            </Link>
            {brands.map((b) => (
              <Link
                key={b}
                href={buildUrl(activeSubtype, b)}
                className={`flex items-center justify-center bg-white border rounded-xl px-2 py-1 transition-all ${
                  activeBrand === b
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                <Image
                  src={`/brands/${b.toLowerCase()}.svg`}
                  alt={b}
                  width={80}
                  height={30}
                  className="object-contain block"
                />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Výsledky */}
      {codes.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">Žádné kódy pro tento filtr.</p>
          <Link href="/susicky" className="text-blue-600 hover:underline text-sm">Zobrazit všechny sušičky</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {codes.map((c) => (
            <ErrorCodeCard key={c.id} {...c} />
          ))}
        </div>
      )}
    </div>
  )
}
