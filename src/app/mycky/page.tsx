import { prisma } from '@/lib/prisma'
import ErrorCodeCard from '@/components/ErrorCodeCard'
import Breadcrumbs from '@/components/Breadcrumbs'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { SUBTYPE_SECTION_LABELS } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Chybové kódy myček nádobí',
  description: 'Databáze chybových kódů myček nádobí. Bosch, Siemens, AEG, Electrolux, Samsung, Beko. Zjistěte příčinu chyby myčky a jak postupovat.',
  alternates: { canonical: 'https://kodyspotrebicu.cz/mycky' },
}

interface Props {
  searchParams: { znacka?: string }
}

export default async function MyckyPage({ searchParams }: Props) {
  const activeBrand = searchParams.znacka || null

  type CodeRow = {
    id: number; code: string; title: string; brand: string;
    applianceType: string; shortMeaning: string; severityLevel: number; slug: string;
    subtype: string | null
  }

  let codes: CodeRow[] = []
  let allBrands: string[] = []

  try {
    codes = await prisma.errorCode.findMany({
      where: {
        applianceType: 'mycka',
        ...(activeBrand ? { brand: { equals: activeBrand, mode: 'insensitive' } } : {}),
      },
      orderBy: [{ brand: 'asc' }, { code: 'asc' }],
      select: {
        id: true, code: true, title: true, brand: true,
        applianceType: true, shortMeaning: true, severityLevel: true, slug: true,
        subtype: true,
      },
    })

    const all = await prisma.errorCode.findMany({
      where: { applianceType: 'mycka' },
      select: { brand: true },
      distinct: ['brand'],
      orderBy: { brand: 'asc' },
    })
    allBrands = all.map((c) => c.brand)
  } catch { /* DB not ready */ }

  function buildUrl(znacka: string | null) {
    if (!znacka) return '/mycky'
    return `/mycky?znacka=${encodeURIComponent(znacka)}`
  }

  // Sekce podle subtypu jen pokud je vybraná konkrétní značka A má více subtypů
  const subtypes = [...new Set(codes.map((c) => c.subtype).filter(Boolean))] as string[]
  const useSubtypeSections = !!activeBrand && subtypes.length > 1

  // Skupiny: pokud se mají zobrazovat sekce, seskup podle subtypu; jinak jeden celek
  const groups: { subtype: string | null; label: string | null; items: CodeRow[] }[] = useSubtypeSections
    ? subtypes.map((st) => ({
        subtype: st,
        label: SUBTYPE_SECTION_LABELS[st] ?? st,
        items: codes.filter((c) => c.subtype === st),
      }))
    : [{ subtype: null, label: null, items: codes }]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Myčky', href: '/mycky' }]} />
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Chybové kódy myček nádobí</h1>
      <p className="text-gray-600 mb-6">
        Přehled {codes.length} chybových kódů myček nádobí. Filtrujte podle značky.
      </p>

      {allBrands.length > 0 && (
        <div className="mb-8">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Značka</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/mycky"
              className={`flex items-center justify-center px-3 py-1 rounded-xl text-sm font-medium border transition-colors ${
                !activeBrand
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
              }`}
            >
              Všechny značky
            </Link>
            {allBrands.map((b) => (
              <Link
                key={b}
                href={buildUrl(b)}
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

      {codes.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">Žádné kódy pro tento filtr.</p>
          <Link href="/mycky" className="text-blue-600 hover:underline text-sm">Zobrazit všechny myčky</Link>
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map((group) => (
            <div key={group.subtype ?? 'all'}>
              {group.label && (
                <div className="mb-4 pb-2 border-b border-gray-200">
                  <h2 className="text-base font-semibold text-gray-700">{group.label}</h2>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.items.map((c) => (
                  <ErrorCodeCard key={c.id} {...c} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
