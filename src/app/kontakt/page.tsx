import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, MessageSquare, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kontakt',
  description:
    'Kontaktujte redakci KódySpotřebičů.cz – nahlaste chybu v databázi, navrhněte nový chybový kód nebo se zeptejte na obsah webu.',
  alternates: { canonical: 'https://www.kodyspotrebicu.cz/kontakt' },
  robots: { index: true, follow: true },
}

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Kontakt</h1>
      <p className="text-lg text-gray-600 mb-10">
        Máte dotaz, připomínku nebo jste narazili na chybu v databázi? Ozvěte se nám – vážíme si
        každé zpětné vazby.
      </p>

      <div className="space-y-8">
        <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 text-blue-700 p-3 rounded-lg flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">E-mail</h2>
              <p className="text-gray-600 mb-3">
                Hlavní kontaktní kanál pro obecné dotazy, zpětnou vazbu a obchodní nabídky:
              </p>
              <a
                href="mailto:info@kodyspotrebicu.cz"
                className="inline-flex items-center gap-2 text-blue-700 font-semibold hover:underline"
              >
                info@kodyspotrebicu.cz
              </a>
              <p className="text-sm text-gray-500 mt-2">
                Reagujeme zpravidla do 2 pracovních dní.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-amber-50 text-amber-700 p-3 rounded-lg flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Nahlášení chyby v databázi</h2>
              <p className="text-gray-600 mb-3">
                Našli jste nepřesnou informaci, špatný popis chybového kódu nebo chybějící značku?
                Napište nám prosím s těmito údaji:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>URL stránky, kde se chyba vyskytuje</li>
                <li>Konkrétní chybový kód a značka spotřebiče</li>
                <li>Stručný popis nepřesnosti</li>
                <li>Pokud možno odkaz na oficiální zdroj (servisní manuál apod.)</li>
              </ul>
              <a
                href="mailto:info@kodyspotrebicu.cz?subject=Nahl%C3%A1%C5%A1en%C3%AD%20chyby%20v%20datab%C3%A1zi"
                className="inline-flex items-center gap-2 mt-4 text-amber-700 font-medium hover:underline"
              >
                Nahlásit chybu e-mailem →
              </a>
            </div>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-green-50 text-green-700 p-3 rounded-lg flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Návrh nového kódu nebo značky</h2>
              <p className="text-gray-600">
                Pokud byste rádi v databázi viděli kód nebo značku, kterou ještě nemáme, neváhejte
                napsat. Pravidelně rozšiřujeme rozsah a uživatelské tipy nám výrazně pomáhají.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Provozovatel webu</h2>
          <p className="text-gray-700">
            Provozovatelem webu KódySpotřebičů.cz je soukromá osoba. Web je nekomerční informační
            projekt. Detailní údaje provozovatele a podmínky zpracování osobních údajů najdete v{' '}
            <Link
              href="/zasady-ochrany-osobnich-udaju"
              className="text-blue-600 hover:underline font-medium"
            >
              zásadách ochrany osobních údajů
            </Link>
            .
          </p>
          <p className="text-sm text-gray-500 mt-3">
            Pro úřední komunikaci a uplatnění práv subjektu údajů dle GDPR použijte výhradně e-mail{' '}
            <a href="mailto:info@kodyspotrebicu.cz" className="text-blue-600 hover:underline">
              info@kodyspotrebicu.cz
            </a>
            .
          </p>
        </section>

        <section className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Důležité upozornění</h2>
          <p className="text-sm text-red-900">
            <strong>Neposkytujeme servisní podporu</strong> ani diagnostiku konkrétních spotřebičů.
            Pokud potřebujete opravit pračku, myčku nebo sušičku, obraťte se prosím na{' '}
            <strong>autorizovaný servis výrobce</strong> nebo certifikovaného servisního technika.
            Web slouží pouze jako informační databáze chybových kódů.
          </p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-200">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Zpět na hlavní stránku
        </Link>
      </div>
    </div>
  )
}
