// Bohatý obsah pro značkové stránky /znacka/[brand].
// Cíl: ~1000 slov originálního textu per značka pro SEO + AdSense E-E-A-T.
// Začínáme Boschem jako pilotem, ostatní značky se postupně doplní (do té doby
// fallback na BRAND_INTROS v page.tsx zůstává).

export interface BrandContent {
  intro: string[]
  modelLines?: { name: string; description: string }[]
  topCodes?: { code: string; appliance: string; tip: string }[]
  longevity?: string
  faq?: { q: string; a: string }[]
}

export const BRAND_CONTENT: Record<string, BrandContent> = {
  bosch: {
    intro: [
      'Bosch je německá značka s dlouhou tradicí ve výrobě domácích spotřebičů. Pračky, myčky a sušičky Bosch patří v Česku k nejrozšířenějším – díky husté servisní síti a dobré dostupnosti náhradních dílů jsou oblíbeny i u techniků.',
      'Chybové kódy Bosch začínají nejčastěji písmenem E nebo F. Kódy jsou z velké části totožné se spotřebiči Siemens, protože obě značky patří do skupiny BSH a sdílí konstrukční platformy. Pokud váš spotřebič zobrazí kód, zkontrolujte nejprve filtr, přívod a odpad vody.',
    ],
    modelLines: [
      {
        name: 'Serie 4 (základní řada)',
        description: 'Cenově dostupné modely se základní výbavou. Pračky řady WAN, myčky s plastovou vanou a hlučností okolo 46 dB. Vyrábí se převážně v Polsku a Turecku. Displej zobrazuje zkrácené kódy ve formátu E + 2 číslice.',
      },
      {
        name: 'Serie 6 (střední řada)',
        description: 'Nejprodávanější řada v ČR. Myčky mají nerezovou vanu, nižší spotřebu vody (11–12 l) a hlučnost kolem 44 dB. Vybaveno systémem AquaStop, EcoSilence Drive a u myček sušením Zeolith.',
      },
      {
        name: 'Serie 8 (prémiová řada)',
        description: 'Top modely s funkcí Home Connect (Wi-Fi), i-DOS u praček (automatické dávkování) a VarioDrawer Pro u myček. Hlučnost myček 42 dB. Bosch poskytuje na motor Serie 8 prodlouženou 10letou záruku.',
      },
    ],
    topCodes: [
      { code: 'E16', appliance: 'pračka', tip: 'Otevřená dvířka – zkontrolujte zavření, čistotu těsnění a magnet zámku.' },
      { code: 'E17', appliance: 'pračka', tip: 'Pomalé plnění vodou – ověřte otevřený přívodní kohout a čistotu sítka v hadici.' },
      { code: 'F21', appliance: 'pračka', tip: 'Problém s pohonem motoru – typicky opotřebené motorové uhlíky, vyžaduje servisní výměnu.' },
      { code: 'E22', appliance: 'myčka', tip: 'Zanesený filtr – vyšroubujte spodní filtr, propláchněte pod tekoucí vodou.' },
      { code: 'E24', appliance: 'myčka', tip: 'Myčka nevypouští vodu – zkontrolujte čerpadlo, sifon a vypouštěcí hadici.' },
      { code: 'E15', appliance: 'myčka', tip: 'AquaStop aktivován – ve vaně myčky je voda. Vypněte přívod a vyžádejte servis.' },
      { code: 'E:02', appliance: 'sušička', tip: 'Sušení trvá příliš dlouho – obvykle zanesený výměník nebo filtr žmolků.' },
      { code: 'E:03', appliance: 'sušička', tip: 'Sušička se přehřála – zkontrolujte filtr žmolků a větrání kondenzátoru.' },
    ],
    longevity: 'Pračky a myčky Bosch obvykle slouží 10–15 let při běžném provozu (4–5 cyklů týdně). Závažnější závady přicházejí typicky kolem 7.–9. roku – nejčastěji opotřebená ložiska bubnu, vadné čerpadlo, koroze topného tělesa nebo opotřebené motorové uhlíky. Obecné pravidlo zní: pokud cena opravy přesahuje 50 % hodnoty nového spotřebiče stejné třídy, zpravidla se vyplatí výměna, obzvláště u Serie 4 starších 8 let. U Serie 8 má smysl opravovat i nákladnější závady díky vyšší pořizovací ceně a desetileté motorové záruce.',
    faq: [
      {
        q: 'Jsou chybové kódy Bosch a Siemens stejné?',
        a: 'Z velké části ano. Obě značky patří do skupiny BSH a sdílí konstrukční platformy i elektronické moduly. Drobné rozdíly jsou pouze v označení modelových řad a v zobrazení kódů na displeji.',
      },
      {
        q: 'Lze resetovat pračku Bosch bez servisu?',
        a: 'Ano. Otočte programátor na pozici „Vypnuto", vytáhněte zástrčku ze zásuvky na 60 sekund, zástrčku zasuňte zpět a vyberte program. U modelů s Home Connect lze reset spustit i přes aplikaci.',
      },
      {
        q: 'Kde najdu autorizovaný servis Bosch v ČR?',
        a: 'Bosch má v Česku oficiální servis a desítky autorizovaných partnerů. Aktuální seznam je na bosch-home.com/cz/vyhledat-prodejce-servis. Linka oprav: +420 251 095 043 (Po–Pá 8:30–17:00). Záruční oprava je u autorizovaného partnera zdarma; mimozáruční výjezd v Praze a okolí stojí orientačně 600–1 200 Kč.',
      },
      {
        q: 'Jakou má pračka Bosch životnost?',
        a: 'Průměrná životnost pračky Bosch je 10–15 let při běžném provozu (4–5 cyklů týdně). První závažnější závady přicházejí obvykle kolem 7.–9. roku – nejčastěji opotřebená ložiska bubnu, vadné čerpadlo nebo opotřebené motorové uhlíky.',
      },
      {
        q: 'Co znamená kód F + číslo na displeji Bosch?',
        a: 'F-kódy označují závažnější závady, často vyžadující odborný zásah. F21 obvykle indikuje problém s pohonem motoru (typicky opotřebené motorové uhlíky), F23 znamená aktivaci AquaStopu (může jít o skutečný únik vody i o false-positive při vlhku v podstavci), F43 chybu drive systému motoru. E-kódy bývá možné diagnostikovat doma.',
      },
    ],
  },
}
