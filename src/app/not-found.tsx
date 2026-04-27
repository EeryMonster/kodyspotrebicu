import Link from 'next/link'
import { Search, Home } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stránka nenalezena',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <div className="container-app py-16 md:py-24">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-primary-dark mb-3">
          Chyba 404
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
          Tuto stránku jsme nenašli
        </h1>
        <p className="text-gray-600 leading-relaxed mb-8">
          Odkaz mohl být přesunut, nebo jste zadali kód, který v databázi
          ještě nemáme. Zkuste vyhledat jiný kód nebo se vraťte na úvodní stránku.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/hledat" className="btn-primary-lg">
            <Search className="w-5 h-5" />
            Hledat kód chyby
          </Link>
          <Link href="/" className="btn-outline">
            <Home className="w-4 h-4" />
            Zpět na úvod
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-brand-border">
          <p className="text-sm text-gray-600 mb-3">Nebo procházejte podle kategorie:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/pracky"
              className="px-4 py-2 bg-white border border-brand-border rounded-full text-sm font-medium text-gray-700 hover:border-blue-300 hover:text-blue-700 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
            >
              Pračky
            </Link>
            <Link
              href="/mycky"
              className="px-4 py-2 bg-white border border-brand-border rounded-full text-sm font-medium text-gray-700 hover:border-blue-300 hover:text-blue-700 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
            >
              Myčky
            </Link>
            <Link
              href="/susicky"
              className="px-4 py-2 bg-white border border-brand-border rounded-full text-sm font-medium text-gray-700 hover:border-blue-300 hover:text-blue-700 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
            >
              Sušičky
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
