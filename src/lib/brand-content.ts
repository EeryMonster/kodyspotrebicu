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
  siemens: {
    intro: [
      'Siemens je prémiová německá značka patřící do skupiny BSH (Bosch-Siemens Hausgeräte). Spotřebiče Siemens sdílí konstrukční základ s Bosch – chybové kódy jsou proto u obou značek totožné nebo velmi podobné a oba výrobci sdílí Home Connect, motorové platformy i sušicí technologii Zeolith.',
      'Pračky Siemens používají primárně F-kódy (F01–F91), které značí závažnější závady vyžadující obvykle servisní zásah. Myčky a sušičky Siemens používají E-kódy. Starší myčky řady SE a SF nemají displej a chyby hlásí blikáním kontrolky – odpovídající čísla najdete v naší databázi pod kódy E1–E6.',
    ],
    modelLines: [
      {
        name: 'iQ100 / iQ300 (základní řady)',
        description: 'Cenově dostupné modely se základní výbavou. Vstupní iQ100 nabízí solidní poměr cena/výkon, iQ300 přidává u některých modelů iQdrive motor. Bez Wi-Fi a touchscreen displeje.',
      },
      {
        name: 'iQ500 (střední řada)',
        description: 'Nejprodávanější řada v ČR. Myčky 44 dB se 8 programy, pračky s Wi-Fi a Home Connect, sušičky s tepelným čerpadlem. AntiVibration design, varioSpeed pro zrychlení programů.',
      },
      {
        name: 'iQ700 / iQ800 (prémiové řady)',
        description: 'Top modely s iSensoric touchscreen, i-Dos (automatické dávkování), iQdrive motorem a u myček sušením Zeolith (42 dB). Home Connect, hlasové ovládání přes Alexa/Google Assistant. Siemens poskytuje na iQdrive motor 10letou záruku při registraci do 3 měsíců od koupě.',
      },
    ],
    topCodes: [
      { code: 'F17', appliance: 'pračka', tip: 'Chyba plnění vodou – ověřte otevřený přívodní kohout a čistotu sítka v hadici.' },
      { code: 'F18', appliance: 'pračka', tip: 'Pračka nevypouští – zkontrolujte filtr, sifon a vypouštěcí čerpadlo.' },
      { code: 'F21', appliance: 'pračka', tip: 'Chyba motoru – typicky opotřebené motorové uhlíky, vyžaduje servisní výměnu.' },
      { code: 'F23', appliance: 'pračka', tip: 'AquaStop / přeplnění – ve vaně je voda. Vypněte přívodní kohout a vyžádejte servis.' },
      { code: 'E22', appliance: 'myčka', tip: 'Zanesený filtr – vyšroubujte spodní filtr myčky a propláchněte pod tekoucí vodou.' },
      { code: 'E15', appliance: 'myčka', tip: 'AquaStop aktivován – ve vaně myčky je voda. Vypněte přívod a vyžádejte servis.' },
      { code: 'E:02', appliance: 'sušička', tip: 'Sušení trvá příliš dlouho – obvykle zanesený výměník nebo filtr žmolků.' },
      { code: 'E:03', appliance: 'sušička', tip: 'Sušička se přehřála – zkontrolujte filtr žmolků a větrání kondenzátoru.' },
    ],
    longevity: 'Pračky a myčky Siemens obvykle slouží 10–15 let při běžném provozu (4–5 cyklů týdně). Díky sdílené konstrukci s Bosch jsou typické závady stejné – kolem 7.–9. roku přicházejí opotřebené motorové uhlíky (F21), vadná ložiska bubnu nebo zanesené čerpadlo. Pravidlo pro opravu vs. výměnu: pokud cena opravy přesahuje 50 % hodnoty nového spotřebiče stejné třídy, vyplatí se výměna – obzvláště u iQ100/iQ300 starších 8 let. U iQ700 a iQ800 má smysl opravovat i nákladnější závady díky vyšší pořizovací ceně a 10leté záruce na iQdrive motor.',
    faq: [
      {
        q: 'Jsou chybové kódy Siemens a Bosch stejné?',
        a: 'Z velké části ano. Obě značky patří do skupiny BSH a sdílí konstrukční platformy i elektronické moduly. Drobné rozdíly jsou v označení modelových řad (iQ vs. Serie) a v tom, že pračky Siemens používají primárně F-kódy, zatímco Bosch má více E-kódů.',
      },
      {
        q: 'Co znamenají F-kódy na displeji pračky Siemens?',
        a: 'F-kódy označují závažnější závady, obvykle vyžadující servisní zásah. F17 = chyba plnění, F18 = chyba vypouštění, F21 = problém s motorem (typicky uhlíky), F23 = AquaStop / přeplnění, F43 = chyba topného tělesa. Plný seznam F-kódů Siemens najdete v naší databázi.',
      },
      {
        q: 'Proč moje stará myčka Siemens nemá displej a jen bliká?',
        a: 'Jde o starší modely řady SE a SF. Místo kódu blikají kontrolky – jejich kombinace odpovídá konkrétnímu chybovému kódu (E1, E2, E3...). Návod k dekódování blikání najdete u jednotlivých kódů E1–E6 v naší databázi.',
      },
      {
        q: 'Kde najdu autorizovaný servis Siemens v ČR?',
        a: 'Siemens má v Česku oficiální servis a desítky autorizovaných partnerů. Aktuální seznam je na siemens-home.bsh-group.com/cz. Linka oprav: +420 251 095 042 (Po–Pá 9:00–17:00). Záruční oprava je u autorizovaného partnera zdarma; mimozáruční výjezd v Praze a okolí stojí orientačně 600–1 200 Kč.',
      },
      {
        q: 'Lze resetovat pračku Siemens bez servisu?',
        a: 'Ano. Otočte programátor na pozici „Vypnuto", vytáhněte zástrčku ze zásuvky na 60 sekund, zástrčku zasuňte zpět a vyberte program. U modelů iQ500+ s Home Connect lze reset spustit i přes aplikaci.',
      },
    ],
  },
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
