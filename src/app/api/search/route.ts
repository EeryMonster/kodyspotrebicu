import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get('q') || '').trim()

  if (q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  // Rozděl dotaz na jednotlivá slova, filtruj prázdné
  const words = q.split(/\s+/).filter((w) => w.length >= 2)

  // Každé slovo musí matchovat alespoň v jednom poli (AND mezi slovy)
  const wordConditions = words.map((word) => ({
    OR: [
      { code: { contains: word, mode: 'insensitive' as const } },
      { title: { contains: word, mode: 'insensitive' as const } },
      { brand: { contains: word, mode: 'insensitive' as const } },
      { shortMeaning: { contains: word, mode: 'insensitive' as const } },
    ],
  }))

  try {
    const results = await prisma.errorCode.findMany({
      where: { AND: wordConditions },
      select: { id: true, code: true, title: true, brand: true, applianceType: true, slug: true },
      take: 10,
      orderBy: [{ brand: 'asc' }, { code: 'asc' }],
    })
    return NextResponse.json({ results })
  } catch {
    return NextResponse.json({ results: [] })
  }
}
