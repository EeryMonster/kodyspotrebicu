import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const BASE_URL = 'https://kodyspotrebicu.cz'

const APPLIANCE_PATH: Record<string, string> = {
  pracka: 'pracky',
  mycka: 'mycky',
  susicka: 'susicky',
}

export async function GET() {
  type SitemapPage = { url: string; changefreq: string; priority: string; lastmod?: string }
  const staticPages: SitemapPage[] = [
    { url: BASE_URL, changefreq: 'weekly', priority: '1.0' },
    { url: `${BASE_URL}/pracky`, changefreq: 'daily', priority: '0.9' },
    { url: `${BASE_URL}/mycky`, changefreq: 'daily', priority: '0.9' },
    { url: `${BASE_URL}/susicky`, changefreq: 'daily', priority: '0.9' },
    { url: `${BASE_URL}/problemy`, changefreq: 'weekly', priority: '0.8' },
    ...['bosch', 'siemens', 'aeg', 'electrolux', 'samsung', 'beko', 'whirlpool', 'lg'].map((b) => ({
      url: `${BASE_URL}/znacka/${b}`,
      changefreq: 'weekly',
      priority: '0.8',
    })),
  ]

  let codes: { brand: string; applianceType: string; slug: string; updatedAt: Date }[] = []
  let symptoms: { slug: string; updatedAt: Date }[] = []
  try {
    codes = await prisma.errorCode.findMany({
      select: { brand: true, applianceType: true, slug: true, updatedAt: true },
    })
    symptoms = await prisma.symptom.findMany({
      select: { slug: true, updatedAt: true },
    })
  } catch { /* ignore */ }

  const codePages = codes.map((c) => ({
    url: `${BASE_URL}/${c.brand.toLowerCase()}/${APPLIANCE_PATH[c.applianceType] || c.applianceType}/${c.slug}`,
    changefreq: 'monthly',
    priority: '0.7',
    lastmod: c.updatedAt.toISOString().split('T')[0],
  }))

  const symptomPages = symptoms.map((s) => ({
    url: `${BASE_URL}/symptom/${s.slug}`,
    changefreq: 'monthly',
    priority: '0.6',
    lastmod: s.updatedAt.toISOString().split('T')[0],
  }))

  const allPages = [...staticPages, ...codePages, ...symptomPages]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (p) => `  <url>
    <loc>${p.url}</loc>
    ${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ''}
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
