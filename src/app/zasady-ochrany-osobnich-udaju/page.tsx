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
            <strong>Stručně:</strong> KódySpotřebičů.cz je primárně informační databáze. Osobní údaje
            zpracováváme jen ve třech případech: (1) když napíšete komentář pod chybový kód
            (uvedete vámi zvolenou přezdívku), (2) když nám pošlete poptávku na opravu přes
            formulář <Link href="/servis" className="text-blue-700 underline">/servis</Link>{' '}
            (telefon, e-mail, PSČ, popis problému – jen za účelem doporučení servisu),
            (3) automaticky technické údaje pro provoz webu (IP adresa, cookies podle vašeho souhlasu).
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
              <strong>Komentáře:</strong> vámi zvolená přezdívka a obsah komentáře. Bez e-mailu ani
              registrace. Komentáře jsou veřejné a anonymní – pokud do nich sami nenapíšete osobní
              údaj, nezpracováváme jej.
            </li>
            <li>
              <strong>Servisní poptávky (formulář na /servis):</strong> PSČ, telefonní číslo,
              e-mailová adresa (volitelně), značka spotřebiče, typ spotřebiče, chybový kód a popis
              problému. Tyto údaje slouží výhradně k tomu, abychom vám mohli doporučit vhodný
              postup opravy (značkový servis výrobce, ověřený lokální partner, případně bezpečné
              kroky doma). IP adresu z formuláře ukládáme krátkodobě jako ochranu proti zneužití
              (spam).
            </li>
            <li>
              <strong>Provozní logy:</strong> IP adresa, typ prohlížeče a navštívená stránka –
              automaticky na úrovni serveru, jen pro provoz a ochranu před zneužitím. Logy se s
              komentáři ani poptávkami nepárují a po krátké době se rotují.
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
            <strong>Co nezpracováváme:</strong> jména (kromě případů, kdy je sami uvedete ve volném
            textu poptávky nebo komentáře), trvalou bytovou adresu, rodná čísla, platební údaje,
            biometrické údaje, citlivé údaje o zdraví apod.
          </p>
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
            <li>Komentáře: dokud je nesmažete vy nebo my (na žádost).</li>
            <li>
              Servisní poptávky: maximálně 24 měsíců od poslední komunikace s vámi. Pokud nás po
              odeslání poptávky nekontaktujete a my vám doporučení pošleme, mažeme zápis nejpozději
              po 6 měsících. Na žádost vás vymažeme kdykoliv dříve.
            </li>
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
          <p>Pro provoz webu využíváme následující kategorie zpracovatelů, kteří mají k údajům přístup výhradně za účelem dílčí technické funkce:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>
              <strong>Poskytovatelé IT a hostingových služeb</strong> – provoz webu, serverové
              funkce a uložení dat (komentáře, servisní poptávky). Databáze našeho webu fyzicky
              leží v Evropské unii.
            </li>
            <li>
              <strong>Poskytovatelé e-mailové infrastruktury</strong> – odesílají e-mailové
              notifikace o nových komentářích a servisních poptávkách na náš provozní e-mail.
            </li>
            <li>
              <strong>Google Ireland Limited</strong> – pouze pokud souhlasíte s analytickými nebo
              reklamními cookies (Google Analytics, Google AdSense).
            </li>
            <li>
              <strong>Smluvní servisní partneři</strong> – pokud vám na základě poptávky doporučíme
              konkrétního servisního partnera a vy s tímto výslovně souhlasíte (typicky odpovědí na
              náš e-mail), předáme partnerovi jen údaje nezbytné pro vyřízení opravy (telefon,
              region, popis závady). Bez vašeho výslovného souhlasu nikoliv.
            </li>
          </ul>
          <p className="mt-3">
            S některými poskytovateli může docházet k předávání osobních údajů mimo EU/EHS, vždy
            však na základě standardních smluvních doložek schválených Evropskou komisí nebo
            jiných záruk dle GDPR. Údaje neprodáváme.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Vaše práva</h2>
          <p>V souladu s GDPR máte právo:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>
              <strong>Smazat svůj komentář</strong> – napište nám e-mail s odkazem na komentář a
              my ho smažeme.
            </li>
            <li>
              <strong>Smazat svou servisní poptávku</strong> – stačí poslat e-mail s telefonem
              nebo PSČ, které jste použili, a poptávku okamžitě vymažeme.
            </li>
            <li>
              <strong>Odvolat souhlas s cookies</strong> – kdykoli v cookie liště nebo přímo v
              nastavení prohlížeče.
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
            <li>
              <strong>Žádat o přístup, opravu, výmaz, omezení, přenositelnost nebo námitku</strong>{' '}
              – kdykoliv e-mailem.
            </li>
          </ul>
          <p className="mt-3">
            Žádosti vyřizujeme bezplatně do 30 dní. Pro uplatnění práva nás kontaktujte na{' '}
            <a href="mailto:info@kodyspotrebicu.cz" className="text-blue-600 hover:underline font-medium">
              info@kodyspotrebicu.cz
            </a>
            . Pokud nebudete s vyřízením spokojeni, můžete podat stížnost u{' '}
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
            Web používá HTTPS a citlivé údaje jsou uložené v zabezpečené databázi v EU. Přístupová
            hesla a API klíče jsou uchovány v zabezpečeném prostředí poskytovatele hostingu, nikoli
            ve veřejně dostupném zdrojovém kódu. Tyto zásady můžeme časem aktualizovat – aktuální
            verze je vždy na této stránce s datem v záhlaví.
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
