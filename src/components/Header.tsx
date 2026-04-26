'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import SearchBox from './SearchBox'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolledPastHero, setScrolledPastHero] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    if (!isHome) return
    const onScroll = () => setScrolledPastHero(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const showSearch = !isHome || scrolledPastHero

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-700 shrink-0 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            <Image src="/logo.png" alt="KódySpotřebičů.cz logo" width={32} height={32} priority sizes="32px" className="rounded-full" />
            KódySpotřebičů.cz
          </Link>

          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-lg transition-opacity duration-200">
              <SearchBox />
            </div>
          )}

          <nav aria-label="Hlavní navigace" className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700 shrink-0">
            <Link href="/pracky" className="hover:text-blue-600 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Pračky</Link>
            <Link href="/mycky" className="hover:text-blue-600 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Myčky</Link>
            <Link href="/susicky" className="hover:text-blue-600 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Sušičky</Link>
          </nav>

          {showSearch && (
            <div className="md:hidden flex flex-1 max-w-xs transition-opacity duration-200">
              <SearchBox />
            </div>
          )}

          <button
            className="md:hidden p-2 text-gray-600 shrink-0 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-3 pb-2 border-t border-gray-100 pt-3 space-y-3">
            <nav aria-label="Mobilní navigace" className="flex flex-col gap-2 text-sm font-medium text-gray-700">
              <Link href="/pracky" className="hover:text-blue-600 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" onClick={() => setMenuOpen(false)}>Pračky</Link>
              <Link href="/mycky" className="hover:text-blue-600 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" onClick={() => setMenuOpen(false)}>Myčky</Link>
              <Link href="/susicky" className="hover:text-blue-600 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" onClick={() => setMenuOpen(false)}>Sušičky</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
