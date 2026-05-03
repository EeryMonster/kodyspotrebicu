import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get('q') || '').trim()

  if (q.length < 2) {
    return NextResponse.json({ results: [], symptoms: [] })
  }

  const words = q.split(/\s+/).filter((w) => w.length >= 2)

  const codeWordConditions = words.map((word) => ({
    OR: [
      { code: { contains: word, mode: 'insensitive' as const } },
      { altCodes: { has: word.toUpperCase() } },
      { title: { contains: word, mode: 'insensitive' as const } },
      { brand: { contains: word, mode: 'insensitive' as const } },
      { shortMeaning: { contains: word, mode: 'insensitive' as const } },
    ],
  }))

  const symptomWordConditions = words.map((word) => ({
    OR: [
      { title: { contains: word, mode: 'insensitive' as const } },
      { description: { contains: word, mode: 'insensitive' as const } },
      { intro: { contains: word, mode: 'insensitive' as const } },
      { slug: { contains: word, mode: 'insensitive' as const } },
    ],
  }))

  try {
    const [results, symptoms] = await Promise.all([
      prisma.errorCode.findMany({
        where: { AND: codeWordConditions },
        select: { id: true, code: true, title: true, brand: true, applianceType: true, slug: true },
        take: 10,
        orderBy: [{ brand: 'asc' }, { code: 'asc' }],
      }),
      prisma.symptom.findMany({
        where: { AND: symptomWordConditions },
        select: { id: true, slug: true, title: true, description: true },
        take: 5,
        orderBy: { title: 'asc' },
      }),
    ])
    return NextResponse.json({ results, symptoms })
  } catch {
    return NextResponse.json({ results: [], symptoms: [] })
  }
}
