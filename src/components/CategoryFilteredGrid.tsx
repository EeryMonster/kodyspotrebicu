'use client'

import { useMemo, useState } from 'react'
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

const filterButtonBase = 'min-h-[34px] rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
const filterButtonActive = 'border-blue-600 bg-blue-600 text-white shadow-sm'
const filterButtonDefaultActive = 'border-brand-border bg-gray-50 text-gray-900'
const filterButtonInactive = 'border-transparent bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-950'

const BRAND_LABELS: Record<string, string> = {
  aeg: 'AEG',
  beko: 'Beko',
  bosch: 'Bosch',
  electrolux: 'Electrolux',
  lg: 'LG',
  miele: 'Miele',
  samsung: 'Samsung',
  siemens: 'Siemens',
  whirlpool: 'Whirlpool',
}

function filterButtonClass(isActive: boolean, isDefault = false) {
  if (!isActive) return `${filterButtonBase} ${filterButtonInactive}`
  return `${filterButtonBase} ${isDefault ? filterButtonDefaultActive : filterButtonActive}`
}

function brandLabel(brand: string) {
  return BRAND_LABELS[brand.toLowerCase()] ?? brand
}

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
      <section className="mb-5 rounded-xl border border-brand-border bg-white px-4 py-4 shadow-sm" aria-label="Filtry chybových kódů">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <label htmlFor="category-search" className="sr-only">
              Hledat v kategorii
            </label>
            <input
              id="category-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Hledat kód nebo název závady..."
              className="w-full rounded-lg border border-brand-border bg-white px-4 py-2.5 pl-10 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
            <svg className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center justify-between gap-3 lg:min-w-max">
            <p className="text-sm text-gray-500">
              <strong className="text-gray-900">{filtered.length}</strong> z {codes.length} kódů
            </p>
            {hasActiveFilter && (
              <button type="button" onClick={reset} className="text-sm font-medium text-blue-700 hover:text-blue-800">
                Zrušit filtry
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
          {subtypeOptions && subtypeOptions.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-[88px_minmax(0,1fr)] sm:items-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Typ</p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveSubtype(null)}
                  aria-pressed={activeSubtype === null}
                  className={filterButtonClass(activeSubtype === null, true)}
                >
                  Všechny
                </button>
                {subtypeOptions.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setActiveSubtype(activeSubtype === s.value ? null : s.value)}
                    aria-pressed={activeSubtype === s.value}
                    title={s.desc}
                    className={filterButtonClass(activeSubtype === s.value)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {allBrands.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-[88px_minmax(0,1fr)] sm:items-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Značka</p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveBrand(null)}
                  aria-pressed={activeBrand === null}
                  className={filterButtonClass(activeBrand === null, true)}
                >
                  Všechny
                </button>
                {allBrands.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setActiveBrand(activeBrand === b ? null : b)}
                    aria-pressed={activeBrand === b}
                    className={filterButtonClass(activeBrand === b)}
                  >
                    {brandLabel(b)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-2 sm:grid-cols-[88px_minmax(0,1fr)] sm:items-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Závažnost</p>
            <div className="flex flex-wrap gap-1.5">
              {SEVERITY_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setActiveSeverity(opt.value)}
                  aria-pressed={activeSeverity === opt.value}
                  className={filterButtonClass(activeSeverity === opt.value, opt.value === null)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {hasActiveFilter && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span>Aktivní filtr</span>
            {search.trim() && <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-700">{search.trim()}</span>}
            {activeSubtype && (
              <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-700">
                {subtypeOptions?.find((s) => s.value === activeSubtype)?.label}
              </span>
            )}
            {activeBrand && <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-700">{brandLabel(activeBrand)}</span>}
            {activeSeverity !== null && (
              <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-700">
                {SEVERITY_OPTIONS.find((s) => s.value === activeSeverity)?.label}
              </span>
            )}
          </div>
        )}
      </section>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-brand-border bg-brand-surface py-16 text-center">
          <p className="mb-3 text-gray-600">Nenašli jsme žádný kód pro zvolený filtr.</p>
          <button type="button" onClick={reset} className="text-sm font-medium text-blue-600 hover:underline">
            Zrušit filtry a zobrazit vše
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <ErrorCodeCard key={c.id} {...c} />
          ))}
        </div>
      )}
    </div>
  )
}
