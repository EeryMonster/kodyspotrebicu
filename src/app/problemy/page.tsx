import { prisma } from '@/lib/prisma'
import Breadcrumbs from '@/components/Breadcrumbs'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nejčastější problémy spotřebičů',
  description: 'Průvodci nejčastějšími problémy praček, myček a sušiček. Zjistěte příčinu a jak postupovat.',
  alternates: { canonical: 'https://www.kodyspotrebicu.cz/problemy' },
  openGraph: {
    title: 'Nejčastější problémy spotřebičů',
    description: 'Průvodci nejčastějšími problémy praček, myček a sušiček. Zjistěte příčinu a jak postupovat.',
    url: 'https://www.kodyspotrebicu.cz/problemy',
  },
}

const SECTIONS = [
  { key: 'pracka', label: 'Pračky', icon: '🫧' },
  { key: 'mycka', label: 'Myčky nádobí', icon: '🍽️' },
  { key: 'susicka', label: 'Sušičky', icon: '♨️' },
]

export default async function ProblémyPage() {
  let symptoms: { slug: string; title: string; description: string; applianceTypes: string[] }[] = []

  try {
    symptoms = await prisma.symptom.findMany({
      select: { slug: true, title: true, description: true, applianceTypes: true },
      orderBy: { title: 'asc' },
    })
  } catch { /* DB not ready */ }

  const byType = (key: string) => symptoms.filter(s => s.applianceTypes.includes(key))

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
        <div className="space-y-10">
          {SECTIONS.map(({ key, label, icon }) => {
            const items = byType(key)
            if (items.length === 0) return null
            return (
              <section key={key}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{icon}</span>
                  <h2 className="text-xl font-bold text-gray-900">{label}</h2>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {items.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/symptom/${s.slug}`}
                      className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">{s.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2">{s.description}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
