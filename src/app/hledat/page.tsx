import { prisma } from '@/lib/prisma'
import ErrorCodeCard from '@/components/ErrorCodeCard'
import type { Metadata } from 'next'

interface Props {
  searchParams: { q?: string }
}

export const metadata: Metadata = {
  title: 'Vyhledávání chybových kódů',
}

export default async function SearchPage({ searchParams }: Props) {
  const q = (searchParams.q || '').trim()
  let results: { id: number; code: string; title: string; brand: string; applianceType: string; shortMeaning: string; severityLevel: number; slug: string }[] = []

  if (q.length >= 2) {
    const words = q.split(/\s+/).filter((w) => w.length >= 2)
    const wordConditions = words.map((word) => ({
      OR: [
        { code: { contains: word, mode: 'insensitive' as const } },
        { title: { contains: word, mode: 'insensitive' as const } },
        { brand: { contains: word, mode: 'insensitive' as const } },
        { shortMeaning: { contains: word, mode: 'insensitive' as const } },
      ],
    }))
    try {
      results = await prisma.errorCode.findMany({
        where: { AND: wordConditions },
        select: { id: true, code: true, title: true, brand: true, applianceType: true, shortMeaning: true, severityLevel: true, slug: true },
        take: 50,
        orderBy: [{ brand: 'asc' }, { code: 'asc' }],
      })
    } catch { /* ignore */ }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {q ? `Výsledky vyhledávání pro „${q}"` : 'Vyhledávání'}
      </h1>

      {q.length >= 2 ? (
        <>
          <p className="text-gray-600 mb-6">Nalezeno {results.length} výsledků.</p>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((c) => (
                <ErrorCodeCard key={c.id} {...c} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg mb-2">Nic nebylo nalezeno pro &bdquo;{q}&ldquo;</p>
              <p className="text-sm">Zkuste zkrátit vyhledávaný výraz nebo použijte jiné klíčové slovo.</p>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-500">Zadejte alespoň 2 znaky pro vyhledávání.</p>
      )}
    </div>
  )
}
