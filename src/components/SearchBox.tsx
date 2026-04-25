'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface SearchResult {
  id: number
  code: string
  title: string
  brand: string
  applianceType: string
  slug: string
}

interface SearchBoxProps {
  variant?: 'compact' | 'hero'
}

export default function SearchBox({ variant = 'compact' }: SearchBoxProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setOpen(false)
      return
    }
    const t = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.results || [])
        setOpen(true)
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  const applianceLabel: Record<string, string> = {
    pracka: 'Pračka',
    mycka: 'Myčka',
    susicka: 'Sušička',
  }

  const appliancePath: Record<string, string> = {
    pracka: 'pracky',
    mycka: 'mycky',
    susicka: 'susicky',
  }

  function handleSubmit() {
    if (query.trim()) {
      setOpen(false)
      router.push(`/hledat?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const isHero = variant === 'hero'

  return (
    <div ref={ref} className="relative w-full">
      <div className={isHero ? 'flex flex-col sm:flex-row gap-2' : 'relative'}>
        <div className="relative flex-1">
          <label htmlFor={isHero ? 'hero-search-input' : 'search-input'} className="sr-only">
            Vyhledat chybový kód spotřebiče
          </label>
          <input
            id={isHero ? 'hero-search-input' : 'search-input'}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) handleSubmit()
            }}
            placeholder={isHero ? 'Zadejte kód, např. E15, E10, F11…' : 'Hledat kód chyby, značku...'}
            className={isHero
              ? 'w-full px-4 py-3.5 pl-12 border border-brand-border rounded-lg text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder:text-gray-400 shadow-sm'
              : 'w-full px-4 py-2 pl-10 border border-brand-border rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder:text-gray-500'
            }
          />
          <svg
            className={isHero ? 'absolute left-4 top-[1.05rem] w-5 h-5 text-gray-400 pointer-events-none' : 'absolute left-3 top-2.5 w-4 h-4 text-gray-500 pointer-events-none'}
            fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {loading && (
            <div className={isHero ? 'absolute right-4 top-[1.05rem] w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin' : 'absolute right-3 top-2.5 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin'} />
          )}
        </div>
        {isHero && (
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white rounded-lg px-6 py-3.5 text-base font-medium hover:bg-brand-primary-dark transition-colors w-full sm:w-auto shrink-0"
          >
            Vyhledat kód
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {results.map((r) => (
            <Link
              key={r.id}
              href={`/${r.brand.toLowerCase()}/${appliancePath[r.applianceType] || r.applianceType}/${r.slug}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
              onClick={() => { setOpen(false); setQuery('') }}
            >
              <span className="font-mono text-sm font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{r.code}</span>
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{r.title}</div>
                <div className="text-xs text-gray-600">{r.brand} · {applianceLabel[r.applianceType] || r.applianceType}</div>
              </div>
            </Link>
          ))}
          <Link
            href={`/hledat?q=${encodeURIComponent(query)}`}
            className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-50 text-center"
            onClick={() => setOpen(false)}
          >
            Zobrazit všechny výsledky
          </Link>
        </div>
      )}

      {open && results.length === 0 && !loading && query.length >= 2 && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-sm text-gray-500">
          Žádné výsledky pro &bdquo;{query}&ldquo;
        </div>
      )}
    </div>
  )
}
