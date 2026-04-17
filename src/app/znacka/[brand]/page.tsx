import { prisma } from '@/lib/prisma'
import ErrorCodeCard from '@/components/ErrorCodeCard'
import Breadcrumbs from '@/components/Breadcrumbs'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'

interface Props {
  params: { brand: string }
}

const APPLIANCE_LABELS: Record<string, string> = {
  pracka: 'Pračky',
  mycka: 'Myčky',
  susicka: 'Sušičky',
}

const APPLIANCE_PATHS: Record<string, string> = {
  pracka: 'pracky',
  mycka: 'mycky',
  susicka: 'susicky',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const brandName = params.brand.charAt(0).toUpperCase() + params.brand.slice(1)
  return {
    title: `Chybové kódy ${brandName}`,
    description: `Databáze chybových kódů spotřebičů ${brandName}. Pračky, myčky, sušičky – zjistěte příčinu chyby a jak postupovat.`,
    alternates: { canonical: `https://kodyspotrebicu.cz/znacka/${params.brand.toLowerCase()}` },
  }
}

export default async function BrandPage({ params }: Props) {
  const brandSlug = params.brand
  let codes: {
    id: number; code: string; title: string; brand: string;
    applianceType: string; shortMeaning: string; severityLevel: number; slug: string;
  }[] = []

  try {
    codes = await prisma.errorCode.findMany({
      where: { brand: { equals: brandSlug, mode: 'insensitive' } },
      orderBy: [{ applianceType: 'asc' }, { code: 'asc' }],
      select: {
        id: true, code: true, title: true, brand: true,
        applianceType: true, shortMeaning: true, severityLevel: true, slug: true,
      },
    })
  } catch { /* DB not ready */ }

  if (codes.length === 0) {
    const count = await prisma.errorCode.count({
      where: { brand: { equals: brandSlug, mode: 'insensitive' } },
    }).catch(() => 0)
    if (count === 0) notFound()
  }

  const brandName = codes[0]?.brand || (brandSlug.charAt(0).toUpperCase() + brandSlug.slice(1))
  const applianceTypes = [...new Set(codes.map((c) => c.applianceType))].sort()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: brandName }]} />
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        Chybové kódy {brandName}
      </h1>
      <p className="text-gray-600 mb-6">
        Přehled {codes.length} chybových kódů spotřebičů {brandName}.
      </p>

      {applianceTypes.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {applianceTypes.map((type) => (
            <Link
              key={type}
              href={`#${type}`}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              {APPLIANCE_LABELS[type] || type}
            </Link>
          ))}
        </div>
      )}

      {applianceTypes.map((type) => {
        const typeCodes = codes.filter((c) => c.applianceType === type)
        return (
          <section key={type} id={type} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {APPLIANCE_LABELS[type] || type} ({typeCodes.length})
              </h2>
              <Link
                href={`/${APPLIANCE_PATHS[type] || type}`}
                className="text-sm text-blue-600 hover:underline"
              >
                Všechny {APPLIANCE_LABELS[type]?.toLowerCase() || type}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {typeCodes.map((c) => (
                <ErrorCodeCard key={c.id} {...c} />
              ))}
            </div>
          </section>
        )
      })}

      {codes.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">Zatím žádné kódy pro tuto značku.</p>
          <p className="text-sm">Spusťte seed skript pro naplnění databáze.</p>
        </div>
      )}
    </div>
  )
}
