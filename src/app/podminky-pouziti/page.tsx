import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Podmínky použití',
  description:
    'Podmínky používání webu KódySpotřebičů.cz – informativní charakter obsahu, autorská práva, omezení odpovědnosti a pravidla pro uživatele.',
  alternates: { canonical: 'https://www.kodyspotrebicu.cz/podminky-pouziti' },
  robots: { index: true, follow: true },
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Podmínky použití</h1>
      <p className="text-sm text-gray-500 mb-8">Poslední aktualizace: 2. května 2026</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Úvodní ustanovení</h2>
          <p>
            Tyto podmínky upravují používání webu <strong>KódySpotřebičů.cz</strong> (dále jen
            „web“). Návštěvou a používáním webu s těmito podmínkami souhlasíte. Pokud s nimi
            nesouhlasíte, web prosím nepoužívejte.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Účel a charakter obsahu</h2>
          <p>
            Web slouží jako <strong>informativní databáze chybových kódů</strong> domácích
            spotřebičů (pračky, myčky nádobí, sušičky). Obsah je sestavován z veřejně dostupných
            servisních manuálů, technické dokumentace výrobců a praktických zkušeností.
          </p>
          <p>
            Obsah <strong>nenahrazuje konzultaci</strong> s autorizovaným servisním technikem ani
            oficiální servisní dokumentaci výrobce. Veškeré údaje jsou pouze informativní.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Omezení odpovědnosti</h2>
          <p>
            Provozovatel webu vynakládá přiměřené úsilí, aby informace byly přesné a aktuální,
            avšak neposkytuje žádnou výslovnou ani konkludentní záruku jejich úplnosti, přesnosti či
            použitelnosti pro konkrétní účel. <strong>Provozovatel nenese odpovědnost</strong> za:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>jakékoli škody vzniklé v souvislosti s pokusem o vlastní opravu spotřebiče,</li>
            <li>úraz elektrickým proudem nebo jiné zranění,</li>
            <li>poškození spotřebiče či dalšího majetku,</li>
            <li>nepřímé, následné nebo nahodilé škody,</li>
            <li>dočasnou nedostupnost webu nebo chyby v obsahu.</li>
          </ul>
          <p className="mt-3">
            <strong>Bezpečnostní upozornění:</strong> oprava elektrických spotřebičů může být
            nebezpečná. V případě jakýchkoli pochybností vždy spotřebič odpojte od elektrické sítě a
            kontaktujte certifikovaného servisního technika výrobce.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Autorská práva</h2>
          <p>
            Veškerý obsah webu (texty, struktura databáze, grafika) je chráněn autorským právem.
            Pro nekomerční osobní použití můžete obsah volně číst, sdílet odkazy a citovat krátké
            úryvky s uvedením zdroje. <strong>Hromadné kopírování</strong>, scrapování nebo
            přepublikování obsahu na jiných webech bez výslovného písemného souhlasu provozovatele
            není povoleno.
          </p>
          <p>
            Názvy značek (Bosch, Siemens, AEG, Electrolux, Samsung, Beko, Whirlpool, LG a další)
            jsou registrovanými ochrannými známkami příslušných vlastníků a jsou na webu používány
            pouze k identifikaci spotřebičů. Web není spojen s žádným z výrobců a není jejich
            oficiální podporou.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Uživatelské komentáře</h2>
          <p>
            Návštěvníci mohou přidávat komentáře u jednotlivých chybových kódů. Zveřejněním
            komentáře potvrzujete, že:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>obsah komentáře je pravdivý a vychází z vlastních zkušeností,</li>
            <li>komentář neporušuje autorská práva ani jiná práva třetích osob,</li>
            <li>komentář neobsahuje urážky, vulgarismy, spam nebo komerční sdělení,</li>
            <li>
              souhlasíte s jeho zveřejněním a uchováním na webu pod uvedenou přezdívkou.
            </li>
          </ul>
          <p className="mt-3">
            Provozovatel si vyhrazuje právo komentáře porušující tyto pravidla bez upozornění
            smazat.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Reklama</h2>
          <p>
            Web může obsahovat reklamní sdělení třetích stran (zejména Google AdSense). Za obsah
            zobrazovaných reklam neneseme odpovědnost. Bližší informace o cookies používaných
            reklamními systémy naleznete v sekci{' '}
            <Link href="/cookies" className="text-blue-600 hover:underline">
              Cookies
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">7. Změny podmínek</h2>
          <p>
            Provozovatel si vyhrazuje právo tyto podmínky kdykoli upravit. Aktuální verze je vždy
            dostupná na této stránce. Pokračováním v používání webu po zveřejnění změn vyjadřujete
            souhlas s novou verzí.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">8. Závěrečná ustanovení</h2>
          <p>
            Vztahy neupravené těmito podmínkami se řídí právem České republiky. Případné spory budou
            řešeny příslušnými soudy ČR.
          </p>
          <p>
            Kontaktovat nás můžete na{' '}
            <a href="mailto:info@kodyspotrebicu.cz" className="text-blue-600 hover:underline font-medium">
              info@kodyspotrebicu.cz
            </a>{' '}
            nebo přes{' '}
            <Link href="/kontakt" className="text-blue-600 hover:underline">
              kontaktní stránku
            </Link>
            .
          </p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-200 flex flex-wrap gap-4 text-sm">
        <Link href="/zasady-ochrany-osobnich-udaju" className="text-blue-600 hover:underline">
          Zásady ochrany osobních údajů →
        </Link>
        <Link href="/cookies" className="text-blue-600 hover:underline">
          Cookies →
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
