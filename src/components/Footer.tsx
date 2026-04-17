import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h3 className="font-bold text-gray-900 mb-3">KódySpotřebičů.cz</h3>
            <p className="text-sm text-gray-600">
              Databáze chybových kódů domácích spotřebičů. Zjistěte příčinu, závažnost a postup opravy.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Spotřebiče</h3>
            <ul className="space-y-1 text-sm">
              <li><Link href="/pracky" className="text-gray-600 hover:text-blue-600">Pračky</Link></li>
              <li><Link href="/mycky" className="text-gray-600 hover:text-blue-600">Myčky nádobí</Link></li>
              <li><Link href="/susicky" className="text-gray-600 hover:text-blue-600">Sušičky</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Značky</h3>
            <ul className="space-y-1 text-sm">
              {['Bosch', 'Siemens', 'AEG', 'Electrolux', 'Samsung', 'Beko'].map((b) => (
                <li key={b}>
                  <Link href={`/znacka/${b.toLowerCase()}`} className="text-gray-600 hover:text-blue-600">{b}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Nástroje</h3>
            <ul className="space-y-1 text-sm">
              <li><Link href="/hledat" className="text-gray-600 hover:text-blue-600">Vyhledávání</Link></li>
              <li><Link href="/sitemap.xml" className="text-gray-600 hover:text-blue-600">Sitemap</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-100 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} KódySpotřebičů.cz – Informativní databáze chybových kódů spotřebičů
        </div>
      </div>
    </footer>
  )
}
