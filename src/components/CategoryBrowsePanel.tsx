import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import CategoryFilteredGrid from './CategoryFilteredGrid'

interface Code {
  id: number
  code: string
  title: string
  brand: string
  applianceType: string
  shortMeaning: string
  severityLevel: number
  slug: string
  subtype: string | null
}

interface Props {
  applianceType: 'pracka' | 'mycka' | 'susicka'
  categoryLabel: string
  codes: Code[]
  subtypeOptions?: { value: string; label: string; desc?: string }[]
}

export default async function CategoryBrowsePanel({ applianceType, categoryLabel, codes, subtypeOptions }: Props) {
  let brands: { brand: string; count: number }[] = []

  try {
    const groups = await prisma.errorCode.groupBy({
      by: ['brand'],
      where: { applianceType },
      _count: { _all: true },
    })
    brands = groups
      .map((g) => ({ brand: g.brand, count: g._count._all }))
      .sort((a, b) => b.count - a.count)
  } catch { /* DB nedostupná */ }

  return (
    <section className="bg-white border border-gray-200 rounded-xl p-6 md:p-7 shadow-sm mb-6">
      {brands.length > 0 && (
        <>
          <div className="mb-5">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1 tracking-tight">
              Procházet podle značky
            </h2>
            <p className="text-sm text-gray-600">
              Vyberte konkrétní značku {categoryLabel.toLowerCase()} a podívejte se na všechny její chybové kódy.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 mb-6">
            {brands.map(({ brand, count }) => {
              const slug = brand.toLowerCase()
              const display = brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase()
              return (
                <Link
                  key={brand}
                  href={`/znacka/${slug}`}
                  className="group flex items-center justify-between gap-2 px-4 py-3 bg-gray-50/60 hover:bg-accent-50/60 border border-gray-200 hover:border-accent-300 rounded-lg transition-colors"
                >
                  <span className="text-sm font-semibold text-gray-900 group-hover:text-accent-700">
                    {display}
                  </span>
                  <span className="text-xs font-medium text-gray-500 group-hover:text-accent-700">
                    {count} {count === 1 ? 'kód' : count >= 2 && count <= 4 ? 'kódy' : 'kódů'}
                  </span>
                </Link>
              )
            })}
          </div>

          <div className="pt-6 border-t border-gray-100">
            <CategoryFilteredGrid codes={codes} subtypeOptions={subtypeOptions} embedded />
          </div>
        </>
      )}

      {brands.length === 0 && (
        <CategoryFilteredGrid codes={codes} subtypeOptions={subtypeOptions} embedded />
      )}
    </section>
  )
}
