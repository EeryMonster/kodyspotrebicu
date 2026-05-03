import { prisma } from '@/lib/prisma'
import ErrorCodeCard from '@/components/ErrorCodeCard'
import type { Metadata } from 'next'
import Link from 'next/link'

interface Props {
  searchParams: { q?: string }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = (searchParams.q || '').trim()
  if (!q) {
    return {
      title: 'Vyhledávání chybových kódů',
      alternates: { canonical: 'https://www.kodyspotrebicu.cz/hledat' },
      robots: { index: false },
    }
  }
  return {
    title: `Výsledky vyhledávání pro „${q}"`,
    description: `Chybové kódy spotřebičů odpovídající hledanému výrazu „${q}". Databáze praček, myček a sušiček.`,
    alternates: { canonical: 'https://www.kodyspotrebicu.cz/hledat' },
    robots: { index: false },
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const q = (searchParams.q || '').trim()
  let results: { id: number; code: string; title: string; brand: string; applianceType: string; shortMeaning: string; severityLevel: number; slug: string }[] = []
  let symptoms: { id: number; slug: string; title: string; description: string }[] = []

  if (q.length >= 2) {
    const words = q.split(/\s+/).filter((w) => w.length >= 2)
    const codeConditions = words.map((word) => ({
      OR: [
        { code: { contains: word, mode: 'insensitive' as const } },
        { altCodes: { has: word.toUpperCase() } },
        { title: { contains: word, mode: 'insensitive' as const } },
        { brand: { contains: word, mode: 'insensitive' as const } },
        { shortMeaning: { contains: word, mode: 'insensitive' as const } },
      ],
    }))
    const symptomConditions = words.map((word) => ({
      OR: [
        { title: { contains: word, mode: 'insensitive' as const } },
        { description: { contains: word, mode: 'insensitive' as const } },
        { intro: { contains: word, mode: 'insensitive' as const } },
        { slug: { contains: word, mode: 'insensitive' as const } },
      ],
    }))
    try {
      const [codeResults, symptomResults] = await Promise.all([
        prisma.errorCode.findMany({
          where: { AND: codeConditions },
          select: { id: true, code: true, title: true, brand: true, applianceType: true, shortMeaning: true, severityLevel: true, slug: true },
          take: 50,
          orderBy: [{ brand: 'asc' }, { code: 'asc' }],
        }),
        prisma.symptom.findMany({
          where: { AND: symptomConditions },
          select: { id: true, slug: true, title: true, description: true },
          take: 10,
          orderBy: { title: 'asc' },
        }),
      ])
      results = codeResults
      symptoms = symptomResults
    } catch { /* ignore */ }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Search input directly on page */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {q ? `Výsledky pro „${q}"` : 'Vyhledávání'}
        </h1>
        <form action="/hledat" method="get" className="flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              name="q"
              defaultValue={q}
              autoFocus={!q}
              placeholder="Hledat kód chyby, značku, popis..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="btn-primary">
            Hledat
          </button>
        </form>
      </div>

      {q.length >= 2 ? (
        <>
          {(results.length > 0 || symptoms.length > 0) ? (
            <>
              <p className="text-gray-600 mb-6">
                Nalezeno <strong>{results.length}</strong> chybových kódů
                {symptoms.length > 0 ? <> a <strong>{symptoms.length}</strong> souvisejících závad</> : null}.
              </p>

              {symptoms.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Související závady a postupy</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {symptoms.map((s) => (
                      <Link
                        key={s.id}
                        href={`/symptom/${s.slug}`}
                        className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                      >
                        <div className="font-semibold text-gray-900 mb-1">{s.title}</div>
                        <div className="text-sm text-gray-600 line-clamp-2">{s.description}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {results.length > 0 && (
                <div>
                  {symptoms.length > 0 && (
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Chybové kódy</h2>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.map((c) => (
                      <ErrorCodeCard key={c.id} {...c} />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Nic nenalezeno pro &bdquo;{q}&ldquo;
              </h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Zkuste zadat jen samotný kód chyby (např. <strong>E15</strong> místo &bdquo;E15 Bosch pračka&ldquo;),
                nebo zkontrolujte pravopis.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/pracky"
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
                >
                  🫧 Procházet kódy praček
                </Link>
                <Link
                  href="/mycky"
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
                >
                  🍽️ Procházet kódy myček
                </Link>
                <Link
                  href="/susicky"
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
                >
                  ♨️ Procházet kódy sušiček
                </Link>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-2">Zadejte alespoň 2 znaky pro vyhledávání.</p>
          <p className="text-sm">Tip: Hledejte přímo kód chyby (E15), název závady nebo značku spotřebiče.</p>
        </div>
      )}
    </div>
  )
}
