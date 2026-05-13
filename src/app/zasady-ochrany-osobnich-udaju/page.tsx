import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Zásady ochrany osobních údajů',
  description:
    'Informace o zpracování osobních údajů na webu KódySpotřebičů.cz dle GDPR – jaké údaje zpracováváme, proč, jak dlouho a jaká máte práva.',
  alternates: { canonical: 'https://www.kodyspotrebicu.cz/zasady-ochrany-osobnich-udaju' },
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Zásady ochrany osobních údajů</h1>
      <p className="text-sm text-gray-500 mb-8">Poslední aktualizace: 13. května 2026</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
        <section>
          <p className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-900">
            <strong>Stručně:</strong> Web sbírá osobní údaje pouze v komentářích (přezdívka),
            v servisních poptávkách na stránce{' '}
            <Link href="/servis" className="text-blue-700 underline">/servis</Link>{' '}
            (kontaktní údaje pro doporučení servisu) a technicky pro provoz (IP adresa, cookies
            podle vašeho souhlasu).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Správce</h2>
          <p>
            Provozovatelem webu <strong>KódySpotřebičů.cz</strong> a správcem osobních údajů
            ve smyslu nařízení GDPR (EU) 2016/679 je Ondřej Tichý. Kontakt:{' '}
            <a href="mailto:info@kodyspotrebicu.cz" className="text-blue-600 hover:underline font-medium">
              info@kodyspotrebicu.cz
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Co o vás zpracováváme</h2>
          <ul className="list-disc pl-6 space-y-3 mt-3">
            <li>
              <strong>Komentáře:</strong> vámi zvolená přezdívka a obsah komentáře.
            </li>
            <li>
              <strong>Servisní poptávky:</strong> kontaktní a popisné údaje, které ve formuláři
              vyplníte (PSČ, telefon, e-mail, popis problému a údaje o spotřebiči). Slouží výhradně
              k tomu, abychom vám doporučili vhodný postup opravy.
            </li>
            <li>
              <strong>Provozní logy:</strong> IP adresa, typ prohlížeče a navštívená stránka –
              automaticky pro provoz webu a ochranu před zneužitím.
            </li>
            <li>
              <strong>Cookies:</strong> dle vašeho souhlasu v cookie liště. Detaily v sekci{' '}
              <Link href="/cookies" className="text-blue-600 hover:underline">
                Cookies
              </Link>
              .
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Právní základ zpracování</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Komentáře</strong> – souhlas udělený odesláním komentáře (čl. 6 odst. 1
              písm. a GDPR).
            </li>
            <li>
              <strong>Servisní poptávky</strong> – plnění žádosti subjektu před uzavřením smlouvy
              (čl. 6 odst. 1 písm. b GDPR), případně souhlas udělený odesláním formuláře (čl. 6
              odst. 1 písm. a GDPR).
            </li>
            <li>
              <strong>Provoz webu a logy</strong> – oprávněný zájem správce na zajištění funkčnosti
              a bezpečnosti webu (čl. 6 odst. 1 písm. f GDPR).
            </li>
            <li>
              <strong>Analytické a reklamní cookies (Google)</strong> – souhlas přes cookie lištu
              (čl. 6 odst. 1 písm. a GDPR).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Doba uchování</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Komentáře: po dobu provozování webu, případně do žádosti o výmaz.</li>
            <li>Servisní poptávky: po nezbytně nutnou dobu pro vyřízení, nejdéle 24 měsíců.</li>
            <li>Provozní logy: typicky do 30 dní.</li>
            <li>Cookies: dle nastavení, maximálně 13 měsíců.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Komu se data dostanou</h2>
          <p>Vaše údaje můžeme předat následujícím kategoriím příjemců:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Poskytovatelé IT, hostingových a e-mailových služeb (zpracovatelé).</li>
            <li>
              Google Ireland Limited – pouze pokud souhlasíte s analytickými nebo reklamními
              cookies.
            </li>
            <li>
              Smluvní servisní partneři – pouze s vaším výslovným souhlasem, pokud vám doporučíme
              konkrétní servis.
            </li>
          </ul>
          <p className="mt-3 text-sm text-gray-600">
            Některé údaje mohou být zpracovávány mimo EU/EHS, vždy se standardními zárukami dle
            GDPR. Údaje neprodáváme.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Vaše práva</h2>
          <p>
            V souladu s GDPR máte právo na přístup k osobním údajům, jejich opravu nebo výmaz,
            omezení zpracování, přenositelnost údajů, podání námitky a odvolání souhlasu. Pro
            uplatnění práv nám napište na{' '}
            <a href="mailto:info@kodyspotrebicu.cz" className="text-blue-600 hover:underline font-medium">
              info@kodyspotrebicu.cz
            </a>
            .
          </p>
          <p className="mt-3">
            Máte také právo podat stížnost u dozorového úřadu, kterým je v ČR{' '}
            <a
              href="https://www.uoou.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Úřad pro ochranu osobních údajů (uoou.cz)
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">7. Zabezpečení a změny</h2>
          <p>
            Web používá HTTPS a běžná technická i organizační opatření na ochranu osobních údajů.
            Zásady můžeme časem aktualizovat – aktuální verze je vždy na této stránce s datem
            v záhlaví.
          </p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-200 flex flex-wrap gap-4 text-sm">
        <Link href="/cookies" className="text-blue-600 hover:underline">
          Cookies →
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
