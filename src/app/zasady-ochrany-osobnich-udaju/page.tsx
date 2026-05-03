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
      <p className="text-sm text-gray-500 mb-8">Poslední aktualizace: 2. května 2026</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
        <section>
          <p className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-900">
            <strong>Stručně:</strong> KódySpotřebičů.cz nevyžaduje registraci, nesbírá vaše jméno,
            e-mail ani jiné osobní údaje. Komentáře jsou anonymní pod libovolnou přezdívkou. Jediné
            osobní údaje, které se technicky zpracovávají, jsou IP adresa v provozních logech a
            údaje předávané službám Google (Analytics, AdSense) – ale jen pokud k tomu udělíte
            souhlas v cookie liště.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Správce</h2>
          <p>
            Provozovatelem webu <strong>KódySpotřebičů.cz</strong> a správcem případných osobních
            údajů ve smyslu nařízení GDPR (EU) 2016/679 je provozovatel webu. Kontakt:{' '}
            <a href="mailto:info@kodyspotrebicu.cz" className="text-blue-600 hover:underline font-medium">
              info@kodyspotrebicu.cz
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Co o vás zpracováváme</h2>
          <p>Reálně se na webu zpracovává jen tohle:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>
              <strong>Komentáře:</strong> dobrovolná přezdívka a obsah komentáře. Žádný e-mail ani
              registrace. Komentáře jsou veřejné a anonymní – pokud do nich sami nenapíšete osobní
              údaj, nezpracováváme ho.
            </li>
            <li>
              <strong>Provozní logy:</strong> IP adresa, typ prohlížeče a navštívená stránka –
              automaticky na úrovni serveru, jen pro provoz a ochranu před zneužitím. Logy se
              s nikým nepárují a po krátké době se rotují.
            </li>
            <li>
              <strong>Cookies a Google služby:</strong> teprve po vašem souhlasu v cookie liště
              (Google Analytics, Google AdSense). Detaily v sekci{' '}
              <Link href="/cookies" className="text-blue-600 hover:underline">
                Cookies
              </Link>
              .
            </li>
          </ul>
          <p className="mt-3 text-sm text-gray-600">
            <strong>Co nezpracováváme:</strong> jména, e-maily (kromě e-mailů, které nám sami
            pošlete), telefonní čísla, adresy, platební údaje. Web je čistě informační.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Právní základ</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Provoz webu a logy</strong> – oprávněný zájem správce (čl. 6 odst. 1 písm. f GDPR).
            </li>
            <li>
              <strong>Komentáře</strong> – souhlas udělený odesláním komentáře (čl. 6 odst. 1 písm. a GDPR).
            </li>
            <li>
              <strong>Analytické a reklamní cookies (Google)</strong> – souhlas přes cookie lištu (čl. 6 odst. 1 písm. a GDPR).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Doba uchování</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Komentáře: dokud je nesmažete vy nebo my (na žádost).</li>
            <li>Provozní logy: typicky do 30 dní.</li>
            <li>
              Cookies: dle nastavení (viz{' '}
              <Link href="/cookies" className="text-blue-600 hover:underline">
                Cookies
              </Link>
              ), maximálně 13 měsíců.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Komu se data dostanou</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Poskytovatel hostingu</strong> – kde web technicky běží.
            </li>
            <li>
              <strong>Google Ireland Limited</strong> – pouze pokud souhlasíte s analytickými/reklamními
              cookies (Analytics, AdSense). Google může údaje zpracovávat i mimo EU, na základě
              standardních smluvních doložek schválených Evropskou komisí.
            </li>
          </ul>
          <p className="mt-3">Údaje neprodáváme a nikomu jinému je nepředáváme.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Co s tím můžete dělat</h2>
          <p>V praxi znamená rozsah zpracování pár jednoduchých věcí:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>
              <strong>Smazat svůj komentář</strong> – napište nám e-mail s odkazem na komentář a my
              ho smažeme.
            </li>
            <li>
              <strong>Odvolat souhlas s cookies</strong> – kdykoli v cookie liště nebo přímo
              v nastavení prohlížeče.
            </li>
            <li>
              <strong>Vypnout personalizaci reklam Google</strong> – na{' '}
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
          <p className="mt-3">
            Nad rámec výše uvedeného máte samozřejmě plný rozsah práv dle GDPR (přístup k údajům,
            oprava, výmaz, omezení, přenositelnost, námitka). V praxi je ale zpracování natolik
            minimální, že obvykle stačí napsat e-mail na{' '}
            <a href="mailto:info@kodyspotrebicu.cz" className="text-blue-600 hover:underline font-medium">
              info@kodyspotrebicu.cz
            </a>
            . Reagujeme do 30 dní. Stížnost můžete podat u{' '}
            <a
              href="https://www.uoou.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Úřadu pro ochranu osobních údajů (uoou.cz)
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">7. Zabezpečení a změny</h2>
          <p>
            Web používá HTTPS a běžná opatření proti neoprávněnému přístupu. Tyto zásady můžeme
            časem aktualizovat – aktuální verze je vždy na této stránce s datem v záhlaví.
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
