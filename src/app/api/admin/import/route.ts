import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'change-me-secret'

interface ImportRow {
  brand: string
  applianceType: string
  code: string
  altCodes?: string[]
  title: string
  shortMeaning: string
  severityLevel?: number
  canUserTrySafeChecks?: boolean
  safeChecks?: string[]
  likelyCauses?: string[]
  whenToStopAndCallService?: string[]
  relatedSymptoms?: string[]
  relatedCodes?: string[]
  possibleParts?: string[]
  faq?: { q: string; a: string }[]
  sourceType?: string
  sourceUrl?: string
}

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-admin-secret')
  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let rows: ImportRow[]
  const contentType = request.headers.get('content-type') || ''

  try {
    if (contentType.includes('application/json')) {
      rows = await request.json()
    } else {
      // CSV import
      const text = await request.text()
      rows = parseCSV(text)
    }
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  if (!Array.isArray(rows)) {
    return NextResponse.json({ error: 'Payload must be an array' }, { status: 400 })
  }

  let created = 0
  let updated = 0
  const errors: string[] = []

  for (const row of rows) {
    if (!row.brand || !row.applianceType || !row.code || !row.title) {
      errors.push(`Skipping row with missing required fields: ${JSON.stringify(row)}`)
      continue
    }

    const slug = slugify(`${row.brand}-${row.applianceType}-${row.code}`)

    try {
      const existing = await prisma.errorCode.findUnique({ where: { slug } })
      const data = {
        brand: row.brand,
        applianceType: row.applianceType,
        code: row.code.toUpperCase(),
        altCodes: row.altCodes || [],
        title: row.title,
        slug,
        shortMeaning: row.shortMeaning || '',
        severityLevel: row.severityLevel || 2,
        canUserTrySafeChecks: row.canUserTrySafeChecks || false,
        safeChecks: row.safeChecks || [],
        likelyCauses: row.likelyCauses || [],
        whenToStopAndCallService: row.whenToStopAndCallService || [],
        relatedSymptoms: row.relatedSymptoms || [],
        relatedCodes: row.relatedCodes || [],
        possibleParts: row.possibleParts || [],
        faq: (row.faq || []) as object[],
        sourceType: row.sourceType || 'manual',
        sourceUrl: row.sourceUrl || null,
      }

      if (existing) {
        await prisma.errorCode.update({ where: { slug }, data })
        updated++
      } else {
        await prisma.errorCode.create({ data })
        created++
      }
    } catch (e) {
      errors.push(`Error importing ${row.code}: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  return NextResponse.json({ created, updated, errors })
}

function parseCSV(text: string): ImportRow[] {
  const lines = text.split('\n').filter(Boolean)
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''))
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim().replace(/"/g, ''))
    const row: Record<string, string> = {}
    headers.forEach((h, i) => { row[h] = values[i] || '' })
    return {
      brand: row.brand,
      applianceType: row.applianceType,
      code: row.code,
      title: row.title,
      shortMeaning: row.shortMeaning,
      severityLevel: row.severityLevel ? parseInt(row.severityLevel) : 2,
      canUserTrySafeChecks: row.canUserTrySafeChecks === 'true',
      likelyCauses: row.likelyCauses ? row.likelyCauses.split('|') : [],
      safeChecks: row.safeChecks ? row.safeChecks.split('|') : [],
      whenToStopAndCallService: row.whenToStopAndCallService ? row.whenToStopAndCallService.split('|') : [],
      possibleParts: row.possibleParts ? row.possibleParts.split('|') : [],
      sourceType: row.sourceType,
      sourceUrl: row.sourceUrl,
    }
  })
}
