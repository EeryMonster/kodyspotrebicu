import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'O webu',
  description: 'KódySpotřebičů.cz je bezplatná informační databáze chybových kódů domácích spotřebičů. Zjistěte, kdo za webem stojí a jak data využívat.',
  alternates: { canonical: 'https://kodyspotrebicu.cz/o-nas' },
}

export default function OWasPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">O webu KódySpotřebičů.cz</h1>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Co je tento web?</h2>
          <p>
            KódySpotřebičů.cz je bezplatná informační databáze chybových kódů domácích spotřebičů —
            praček, myček nádobí a sušiček. Cílem webu je pomoci uživatelům rychle pochopit, co
            zobrazená chyba znamená, jak závažná je a zda ji lze bezpečně vyřešit doma.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Jak data vznikla?</h2>
          <p>
            Informace jsou sestaveny z veřejně dostupných servisních manuálů, technické dokumentace
            výrobců a zkušeností odborných techniků. Databáze pokrývá značky Bosch, Siemens, AEG,
            Electrolux, Samsung, Beko, Whirlpool a LG a průběžně se rozrůstá.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Upozornění</h2>
          <p>
            Veškeré informace na tomto webu jsou <strong>pouze informativní</strong>. Oprava
            elektrických spotřebičů může být nebezpečná — v případě pochybností vždy kontaktujte
            certifikovaného servisního technika. Provozovatel webu nenese odpovědnost za škody
            vzniklé v souvislosti s využitím zde uvedených informací.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Zásady ochrany osobních údajů</h2>
          <p>
            Web nezpracovává osobní údaje nad rámec nutný pro provoz (komentáře jsou uloženy
            anonymně pouze s jménem, které sami uvedete). Nepoužíváme žádné sledovací cookies třetích
            stran mimo standardní analytické nástroje.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Kontakt</h2>
          <p>
            Máte připomínku, chybu v databázi nebo chcete nahlásit nesprávnou informaci?
            Napište nám na{' '}
            <a href="mailto:info@kodyspotrebicu.cz" className="text-blue-600 hover:underline font-medium">
              info@kodyspotrebicu.cz
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-200">
        <Link href="/" className="text-sm text-blue-600 hover:underline">← Zpět na hlavní stránku</Link>
      </div>
    </div>
  )
}
