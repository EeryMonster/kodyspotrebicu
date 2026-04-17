import { prisma } from '@/lib/prisma'
import Breadcrumbs from '@/components/Breadcrumbs'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nejčastější problémy spotřebičů',
  description: 'Průvodci nejčastějšími problémy praček, myček a sušiček. Zjistěte příčinu a jak postupovat.',
}

export default async function ProblémyPage() {
  let symptoms: { slug: string; title: string; description: string; applianceTypes: string[] }[] = []

  try {
    symptoms = await prisma.symptom.findMany({
      select: { slug: true, title: true, description: true, applianceTypes: true },
      orderBy: { title: 'asc' },
    })
  } catch { /* DB not ready */ }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Problémy', href: '/problemy' }]} />
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Nejčastější problémy spotřebičů</h1>
      <p className="text-gray-600 mb-8">
        Průvodci pro nejčastější závady praček, myček a sušiček.
      </p>

      {symptoms.length === 0 ? (
        <p className="text-gray-500">Žádné symptomy v databázi.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {symptoms.map((s) => (
            <Link
              key={s.slug}
              href={`/symptom/${s.slug}`}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <h2 className="text-sm font-semibold text-gray-900 mb-1">{s.title}</h2>
              <p className="text-xs text-gray-500 line-clamp-2">{s.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
