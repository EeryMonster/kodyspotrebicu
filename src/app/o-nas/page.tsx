import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Wrench, ShieldCheck, Mail, FileText, RefreshCw } from 'lucide-react'

export const metadata: Metadata = {
  title: 'O webu',
  description:
    'KódySpotřebičů.cz je bezplatná informační databáze chybových kódů domácích spotřebičů. Zjistěte, kdo za webem stojí, jak data vznikla a jak je využíváme.',
  alternates: { canonical: 'https://www.kodyspotrebicu.cz/o-nas' },
}

export default function OWasPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">O webu KódySpotřebičů.cz</h1>
      <p className="text-lg text-gray-600 mb-10">
        Bezplatná česká databáze chybových kódů praček, myček a sušiček – psaná tak, aby vám
        v krizové situaci řekla, co dělat dál.
      </p>

      <div className="space-y-10 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Proč tento web vznikl</h2>
          <p>
            Když se na displeji pračky objeví záhadný kód jako <strong>F05</strong>, <strong>E18</strong>{' '}
            nebo <strong>iE</strong>, většina návodů k použití uvádí jen strohou poznámku „kontaktujte
            servis“. To ale neřeší to nejdůležitější: <em>můžu to zkusit doma? Je to nebezpečné? Co to
            vlastně znamená?</em>
          </p>
          <p className="mt-3">
            KódySpotřebičů.cz vznikl jako odpověď na tuhle mezeru. U každého kódu najdete jasné
            shrnutí, hodnocení závažnosti, konkrétní bezpečné kroky pro domácí kontrolu i jednoznačné
            varování, kdy přestat a zavolat servis. Cílem je pomoci uživateli rozhodnout se za 30
            sekund.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Kdo za obsahem stojí</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <p>
              Web provozuje a obsah rediguje <strong>Ondřej Tichý</strong> – nezávislý autor se
              zájmem o domácí spotřebiče, jejich diagnostiku a údržbu. Texty vznikají na základě:
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>oficiálních servisních manuálů</strong> výrobců (Bosch, Siemens, AEG,
                  Electrolux, Samsung, Beko, Whirlpool, LG a další),
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Wrench className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>konzultací s autorizovanými servisními techniky</strong> a ověřených
                  postupů z praxe,
                </span>
              </li>
              <li className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>veřejně dostupné technické dokumentace</strong> a uživatelských zkušeností
                  ze servisních fór.
                </span>
              </li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              Web je <strong>nezávislý informační projekt</strong> – nejsme propojeni s žádným
              výrobcem ani autorizovaným servisem a za zveřejnění obsahu nedostáváme zaplaceno.
              Připomínky a opravy vítáme na{' '}
              <a href="mailto:info@kodyspotrebicu.cz" className="text-blue-600 hover:underline">
                info@kodyspotrebicu.cz
              </a>
              .
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Jak texty vznikají</h2>
          <p>
            Každý záznam v databázi prochází stejnou strukturou: krátké srozumitelné shrnutí, výčet
            nejpravděpodobnějších příčin, krok-za-krokem postup pro bezpečnou domácí kontrolu, jasné
            varování kdy zavolat servis a často kladené dotazy. Tento jednotný formát uživateli
            umožňuje rychle se zorientovat napříč značkami i typy spotřebičů.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <RefreshCw className="w-5 h-5 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Pravidelná aktualizace</h3>
              <p className="text-sm text-gray-600">
                Záznamy procházíme a opravujeme dle uživatelské zpětné vazby a nových manuálů.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <ShieldCheck className="w-5 h-5 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Bezpečnost na prvním místě</h3>
              <p className="text-sm text-gray-600">
                U každého kódu jasně oddělujeme „lze zkusit doma“ od „kontaktujte servis“.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <FileText className="w-5 h-5 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Uvádění zdrojů</h3>
              <p className="text-sm text-gray-600">
                U záznamů, kde je to možné, odkazujeme na oficiální servisní dokumentaci.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Bezpečnostní upozornění</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <p>
              Veškeré informace na tomto webu jsou <strong>pouze informativní</strong> a nenahrazují
              konzultaci s autorizovaným servisním technikem. Oprava elektrických spotřebičů může
              být nebezpečná – v případě jakýchkoli pochybností vždy spotřebič odpojte od sítě a
              kontaktujte certifikovaný servis. Provozovatel webu nenese odpovědnost za škody
              vzniklé v souvislosti s využitím zde uvedených informací (viz{' '}
              <Link href="/podminky-pouziti" className="text-amber-900 underline hover:no-underline">
                podmínky použití
              </Link>
              ).
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ozvěte se</h2>
          <p>
            Máte připomínku, narazili jste na chybu v databázi nebo chcete navrhnout nový kód?
            Napište nám:
          </p>
          <a
            href="mailto:info@kodyspotrebicu.cz"
            className="inline-flex items-center gap-2 mt-4 px-5 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primary-dark transition-colors"
          >
            <Mail className="w-5 h-5" />
            info@kodyspotrebicu.cz
          </a>
          <p className="text-sm text-gray-500 mt-3">
            Více možností kontaktu na{' '}
            <Link href="/kontakt" className="text-blue-600 hover:underline">
              kontaktní stránce
            </Link>
            .
          </p>
        </section>

        <section className="pt-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Právní informace</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/zasady-ochrany-osobnich-udaju" className="text-blue-600 hover:underline">
                Zásady ochrany osobních údajů (GDPR)
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="text-blue-600 hover:underline">
                Zásady používání cookies
              </Link>
            </li>
            <li>
              <Link href="/podminky-pouziti" className="text-blue-600 hover:underline">
                Podmínky použití webu
              </Link>
            </li>
          </ul>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-gray-200">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Zpět na hlavní stránku
        </Link>
      </div>
    </div>
  )
}
