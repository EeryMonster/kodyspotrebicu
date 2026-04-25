'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import ErrorCodeCard from '@/components/ErrorCodeCard'

interface CodeRow {
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

interface SubtypeOption {
  value: string
  label: string
  desc?: string
}

interface CategoryFilteredGridProps {
  codes: CodeRow[]
  subtypeOptions?: SubtypeOption[]
}

const SEVERITY_OPTIONS: { label: string; value: number | null }[] = [
  { label: 'Vše', value: null },
  { label: 'Nízká', value: 1 },
  { label: 'Střední', value: 2 },
  { label: 'Vysoká', value: 3 },
  { label: 'Kritická', value: 4 },
]

export default function CategoryFilteredGrid({ codes, subtypeOptions }: CategoryFilteredGridProps) {
  const [search, setSearch] = useState('')
  const [activeBrand, setActiveBrand] = useState<string | null>(null)
  const [activeSeverity, setActiveSeverity] = useState<number | null>(null)
  const [activeSubtype, setActiveSubtype] = useState<string | null>(null)

  const allBrands = useMemo(
    () => Array.from(new Set(codes.map((c) => c.brand))).sort((a, b) => a.localeCompare(b, 'cs', { sensitivity: 'base' })),
    [codes]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return codes.filter((c) => {
      if (activeBrand && c.brand.toLowerCase() !== activeBrand.toLowerCase()) return false
      if (activeSeverity !== null && c.severityLevel !== activeSeverity) return false
      if (activeSubtype && c.subtype !== activeSubtype) return false
      if (q && !c.code.toLowerCase().includes(q) && !c.title.toLowerCase().includes(q)) return false
      return true
    })
  }, [codes, search, activeBrand, activeSeverity, activeSubtype])

  const hasActiveFilter = activeBrand !== null || activeSeverity !== null || activeSubtype !== null || search.trim().length > 0

  function reset() {
    setActiveBrand(null)
    setActiveSeverity(null)
    setActiveSubtype(null)
    setSearch('')
  }

  return (
    <div>
      {/* Search within category */}
      <div className="relative mb-4">
        <label htmlFor="category-search" className="sr-only">Hledat v kategorii</label>
        <input
          id="category-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Hledat kód nebo název závady…"
          className="w-full px-4 py-2.5 pl-10 border border-brand-border rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder:text-gray-400"
        />
        <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Subtype filter */}
      {subtypeOptions && subtypeOptions.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Typ</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveSubtype(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeSubtype === null
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-brand-border hover:border-blue-400'
              }`}
            >
              Všechny typy
            </button>
            {subtypeOptions.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setActiveSubtype(activeSubtype === s.value ? null : s.value)}
                title={s.desc}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  activeSubtype === s.value
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-brand-border hover:border-blue-400'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Brand filter */}
      {allBrands.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Značka</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveBrand(null)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors ${
                activeBrand === null
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white text-gray-700 border-brand-border hover:border-gray-400'
              }`}
            >
              Všechny značky
            </button>
            {allBrands.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setActiveBrand(activeBrand === b ? null : b)}
                aria-label={b}
                className={`flex items-center justify-center bg-white border rounded-xl px-2 py-1 transition-all ${
                  activeBrand === b
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-brand-border hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                <Image src={`/brands/${b.toLowerCase()}.svg`} alt={b} width={80} height={30} className="object-contain block" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Severity filter */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Závažnost</p>
        <div className="flex flex-wrap gap-2">
          {SEVERITY_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => setActiveSeverity(opt.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeSeverity === opt.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-brand-border hover:border-blue-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active filter bar */}
      {hasActiveFilter && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            Nalezeno <strong className="text-gray-700">{filtered.length}</strong> kódů
          </p>
          <button type="button" onClick={reset} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Zrušit filtry
          </button>
        </div>
      )}

      {/* Grid or empty state */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-brand-border rounded-xl bg-brand-surface">
          <p className="text-gray-600 mb-3">Nenašli jsme žádný kód pro zvolený filtr.</p>
          <button type="button" onClick={reset} className="text-sm text-blue-600 hover:underline font-medium">
            Zrušit filtry a zobrazit vše
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <ErrorCodeCard key={c.id} {...c} />
          ))}
        </div>
      )}
    </div>
  )
}
