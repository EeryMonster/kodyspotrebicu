import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookies',
  description:
    'Informace o cookies používaných na webu KódySpotřebičů.cz – jaké cookies využíváme, k čemu slouží a jak jejich nastavení můžete kdykoli změnit.',
  alternates: { canonical: 'https://www.kodyspotrebicu.cz/cookies' },
  robots: { index: true, follow: true },
}

export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Zásady používání cookies</h1>
      <p className="text-sm text-gray-500 mb-8">Poslední aktualizace: 2. května 2026</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Co jsou cookies?</h2>
          <p>
            Cookies jsou malé textové soubory, které web ukládá ve vašem prohlížeči. Slouží k tomu,
            aby si web pamatoval vaše nastavení, měřil návštěvnost nebo zobrazoval relevantní
            reklamy. Některé cookies jsou pro fungování webu nezbytné, jiné jsou volitelné a
            můžete je odmítnout.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Jaké cookies používáme</h2>

          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">1. Nezbytné (technické) cookies</h3>
          <p>
            Zajišťují základní funkčnost webu (zapamatování souhlasu s cookies, ochrana před spamem
            v komentářích). Bez nich web nemůže správně fungovat. Nevyžadují souhlas.
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2 text-sm">
            <li><strong>cookie_consent</strong> – uložení vašeho rozhodnutí o cookies (12 měsíců)</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">2. Analytické cookies</h3>
          <p>
            Pomáhají nám rozumět tomu, jak návštěvníci web používají, které stránky jsou
            nejnavštěvovanější a kde uživatelé narážejí na problémy. Na základě těchto dat web
            postupně zlepšujeme.
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2 text-sm">
            <li>
              <strong>Google Analytics</strong> (poskytovatel: Google Ireland Ltd.) – cookies <code>_ga</code>,{' '}
              <code>_ga_*</code>, doba uchování až 13 měsíců.
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">3. Reklamní cookies</h3>
          <p>
            Slouží k personalizaci reklam zobrazovaných v reklamní síti Google AdSense. Bez vašeho
            souhlasu zobrazujeme pouze nepersonalizované reklamy.
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2 text-sm">
            <li>
              <strong>Google AdSense</strong> (poskytovatel: Google Ireland Ltd.) – cookies <code>__gads</code>,{' '}
              <code>__gpi</code>, <code>IDE</code> a další; doba uchování až 13 měsíců.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Jak svůj souhlas spravovat</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Cookie lišta</strong> na webu – při první návštěvě si zvolíte preference; svou
              volbu můžete kdykoli změnit kliknutím na odkaz „Nastavení cookies“ v patičce.
            </li>
            <li>
              <strong>Nastavení prohlížeče</strong> – cookies můžete zakázat, smazat nebo blokovat
              přímo v prohlížeči (Chrome, Firefox, Safari, Edge atd.). Pokud cookies zakážete,
              některé funkce webu nemusí fungovat.
            </li>
            <li>
              <strong>Google opt-out</strong> – personalizaci reklam Google můžete vypnout na{' '}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                adssettings.google.com
              </a>
              .
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Předávání údajů mimo EU</h2>
          <p>
            Společnost Google může údaje získané prostřednictvím cookies zpracovávat i mimo Evropský
            hospodářský prostor. K předávání dochází na základě standardních smluvních doložek
            schválených Evropskou komisí, případně jiných záruk dle GDPR.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Více informací</h2>
          <p>
            Detailní informace o zpracování osobních údajů naleznete v{' '}
            <Link href="/zasady-ochrany-osobnich-udaju" className="text-blue-600 hover:underline">
              zásadách ochrany osobních údajů
            </Link>
            . Případné dotazy posílejte na{' '}
            <a href="mailto:info@kodyspotrebicu.cz" className="text-blue-600 hover:underline font-medium">
              info@kodyspotrebicu.cz
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-200 flex flex-wrap gap-4 text-sm">
        <Link href="/zasady-ochrany-osobnich-udaju" className="text-blue-600 hover:underline">
          Zásady ochrany osobních údajů →
        </Link>
        <Link href="/podminky-pouziti" className="text-blue-600 hover:underline">
          Podmínky použití →
        </Link>
        <Link href="/kontakt" className="text-blue-600 hover:underline">
          Kontakt →
        </Link>
        <Link href="/" className="text-blue-600 hover:underline ml-auto">
          ← Zpět na hlavní stránku
        </Link>
      </div>
    </div>
  )
}
