import { prisma } from '@/lib/prisma'
import { notFound, permanentRedirect } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import Link from 'next/link'
import type { Metadata } from 'next'
import { APPLIANCE_LABELS, APPLIANCE_FROM_SLUG, APPLIANCE_SLUGS, BRANDS, SEVERITY_LABELS, SEVERITY_COLORS } from '@/lib/utils'
import SeverityBadge from '@/components/SeverityBadge'
import { ChevronRight } from 'lucide-react'

interface Props {
  params: { brand: string; applianceType: string }
}

const VALID_BRANDS = new Set(BRANDS.map((b) => b.toLowerCase()))

function buildIntro(brand: string, applianceLabel: string, count: number): string {
  return `Na této stránce najdete přehled ${count} chybových kódů pro ${applianceLabel.toLowerCase()} značky ${brand}. U každého kódu najdete vysvětlení, doporučené kroky a orientační cenu opravy.`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const brandSlug = params.brand.toLowerCase()
  const appliancePathSlug = params.applianceType.toLowerCase()
  const applianceType = APPLIANCE_FROM_SLUG[appliancePathSlug]
  if (!applianceType || !VALID_BRANDS.has(brandSlug)) return { title: 'Stránka nenalezena' }

  const brandName = brandSlug.charAt(0).toUpperCase() + brandSlug.slice(1)
  const applianceLabel = APPLIANCE_LABELS[applianceType] || applianceType
  let count = 0
  try {
    count = await prisma.errorCode.count({
      where: { brand: { equals: brandSlug, mode: 'insensitive' }, applianceType },
    })
  } catch { /* ignore */ }

  const year = new Date().getFullYear()
  const canonical = `https://www.kodyspotrebicu.cz/${brandSlug}/${appliancePathSlug}`
  const title = `Chybové kódy ${applianceLabel.toLowerCase()} ${brandName}: kompletní přehled (${year})`
  const description = `${count > 0 ? `${count} chybových kódů` : 'Přehled chybových kódů'} ${applianceLabel.toLowerCase()} ${brandName} ✓ Vysvětlení každého kódu ✓ Cena opravy ✓ Návod krok za krokem.`
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: 'website' },
  }
}

export default async function BrandAppliancePage({ params }: Props) {
  const brandSlug = params.brand.toLowerCase()
  const appliancePathSlug = params.applianceType.toLowerCase()

  if (params.brand !== brandSlug || params.applianceType !== appliancePathSlug) {
    permanentRedirect(`/${brandSlug}/${appliancePathSlug}`)
  }

  const applianceType = APPLIANCE_FROM_SLUG[appliancePathSlug]
  if (!applianceType || !VALID_BRANDS.has(brandSlug)) notFound()

  let codes: {
    id: number; code: string; title: string; brand: string;
    applianceType: string; shortMeaning: string; severityLevel: number; slug: string;
  }[] = []
  try {
    codes = await prisma.errorCode.findMany({
      where: { brand: { equals: brandSlug, mode: 'insensitive' }, applianceType },
      orderBy: [{ code: 'asc' }],
      select: {
        id: true, code: true, title: true, brand: true,
        applianceType: true, shortMeaning: true, severityLevel: true, slug: true,
      },
    })
  } catch { /* DB not ready */ }

  if (codes.length === 0) notFound()

  const brandName = (codes[0]?.brand || brandSlug).charAt(0).toUpperCase() + (codes[0]?.brand || brandSlug).slice(1)
  const applianceLabel = APPLIANCE_LABELS[applianceType] || applianceType

  const canonicalUrl = `https://www.kodyspotrebicu.cz/${brandSlug}/${appliancePathSlug}`
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Chybové kódy ${applianceLabel.toLowerCase()} ${brandName}`,
    numberOfItems: codes.length,
    itemListElement: codes.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://www.kodyspotrebicu.cz/${brandSlug}/${appliancePathSlug}/${c.slug}`,
      name: `${c.code} – ${c.title}`,
    })),
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Úvod', item: 'https://www.kodyspotrebicu.cz' },
      { '@type': 'ListItem', position: 2, name: brandName, item: `https://www.kodyspotrebicu.cz/znacka/${brandSlug}` },
      { '@type': 'ListItem', position: 3, name: applianceLabel, item: canonicalUrl },
    ],
  }

  // Group codes by severity for quick scanning
  const grouped = {
    1: codes.filter((c) => c.severityLevel === 1),
    2: codes.filter((c) => c.severityLevel === 2),
    3: codes.filter((c) => c.severityLevel === 3),
    4: codes.filter((c) => c.severityLevel === 4),
  }
  const severityOrder = [1, 2, 3, 4] as const

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Breadcrumbs items={[
        { label: brandName, href: `/znacka/${brandSlug}` },
        { label: applianceLabel },
      ]} />

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
        Chybové kódy {applianceLabel.toLowerCase()} {brandName}
      </h1>
      <p className="text-gray-700 leading-relaxed mb-6 max-w-3xl">
        {buildIntro(brandName, applianceLabel, codes.length)}
      </p>

      {/* Quick reference table — high SEO value, captures featured snippet */}
      <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-10">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Rychlý přehled chybových kódů</h2>
          <p className="text-sm text-gray-600 mt-1">Klikněte na kód pro detailní návod a cenu opravy.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="text-left py-3 px-4 font-semibold">Kód</th>
                <th className="text-left py-3 px-4 font-semibold">Význam</th>
                <th className="text-left py-3 px-4 font-semibold hidden md:table-cell">Závažnost</th>
                <th className="text-right py-3 px-4 font-semibold">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {codes.map((c) => (
                <tr key={c.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-gray-900">{c.code}</td>
                  <td className="py-3 px-4 text-gray-700">{c.title}</td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className={`inline-block text-xs px-2 py-0.5 rounded ${SEVERITY_COLORS[c.severityLevel] || ''}`}>
                      {SEVERITY_LABELS[c.severityLevel] || ''}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/${brandSlug}/${appliancePathSlug}/${c.slug}`}
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline font-medium"
                    >
                      Návod <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Severity-grouped sections for deeper scan + internal linking */}
      {severityOrder.map((sev) => {
        const items = grouped[sev]
        if (items.length === 0) return null
        return (
          <section key={sev} className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              {SEVERITY_LABELS[sev]} závažnost ({items.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items.map((c) => (
                <Link
                  key={c.id}
                  href={`/${brandSlug}/${appliancePathSlug}/${c.slug}`}
                  className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-mono font-bold text-gray-900">{c.code}</span>
                    <SeverityBadge level={c.severityLevel} />
                  </div>
                  <div className="text-sm font-semibold text-gray-800 mb-1">{c.title}</div>
                  <div className="text-sm text-gray-600 line-clamp-2">{c.shortMeaning}</div>
                </Link>
              ))}
            </div>
          </section>
        )
      })}

      {/* Cross-link to other appliance types of same brand */}
      <section className="border-t border-gray-200 pt-6 mt-8">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Další spotřebiče {brandName}</h2>
        <div className="flex flex-wrap gap-2">
          {(['pracka', 'mycka', 'susicka'] as const)
            .filter((t) => t !== applianceType)
            .map((t) => (
              <Link
                key={t}
                href={`/${brandSlug}/${APPLIANCE_SLUGS[t]}`}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-blue-600 hover:border-blue-400 transition-colors"
              >
                Chybové kódy {APPLIANCE_LABELS[t].toLowerCase()} {brandName}
              </Link>
          ))}
          <Link
            href={`/znacka/${brandSlug}`}
            className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-blue-600 hover:border-blue-400 transition-colors"
          >
            Všechny kódy {brandName}
          </Link>
        </div>
      </section>
    </div>
  )
}
